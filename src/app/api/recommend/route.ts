import { NextRequest, NextResponse } from 'next/server';
import type { QuizState, RecommendResponse, RecommendedMovie } from '@/types/quiz';
import { getArnoldComment } from '@/lib/arnold-comments';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Arnold Schwarzenegger's person ID on TMDb
const ARNOLD_PERSON_ID = 1100;

// Known Arnold movie IDs (fallback if cast search fails)
const ARNOLD_MOVIE_IDS = [
  218,   // The Terminator
  280,   // Terminator 2: Judgment Day
  1571,  // Total Recall
  2185,  // Predator
  2186,  // Commando
  2187,  // The Running Man
  2188,  // True Lies
  2189,  // Kindergarten Cop
  2190,  // Last Action Hero
];

// Genre IDs from TMDb
const GENRE_IDS = {
  action: 28,
  comedy: 35,
  thriller: 53,
  sciFi: 878,
  adventure: 12,
};

function buildTMDBQuery(quiz: QuizState): URLSearchParams {
  const params = new URLSearchParams();
  params.set('api_key', TMDB_API_KEY!);
  params.set('include_adult', 'false');
  params.set('language', 'en-US');
  params.set('sort_by', 'popularity.desc');
  params.set('vote_count.gte', '100'); // Minimum votes for quality

  // Era filtering
  if (quiz.era === '80s') {
    params.set('primary_release_date.gte', '1980-01-01');
    params.set('primary_release_date.lte', '1989-12-31');
  } else if (quiz.era === '90s') {
    params.set('primary_release_date.gte', '1990-01-01');
    params.set('primary_release_date.lte', '1999-12-31');
  } else if (quiz.era === 'modern') {
    params.set('primary_release_date.gte', '2000-01-01');
  }

  // Genre filtering based on mood
  const genreIds: number[] = [];
  if (quiz.mood === 'action') {
    genreIds.push(GENRE_IDS.action, GENRE_IDS.adventure, GENRE_IDS.sciFi);
  } else if (quiz.mood === 'funny') {
    genreIds.push(GENRE_IDS.comedy);
    if (quiz.energy === 'high') {
      genreIds.push(GENRE_IDS.action); // Action-comedy
    }
  } else if (quiz.mood === 'dark') {
    genreIds.push(GENRE_IDS.thriller);
    if (quiz.energy === 'high') {
      genreIds.push(GENRE_IDS.action);
    }
  }

  if (genreIds.length > 0) {
    params.set('with_genres', genreIds.join(','));
  }

  // Arnold level filtering
  if (quiz.arnoldLevel === 'full') {
    params.set('with_cast', ARNOLD_PERSON_ID.toString());
  }

  return params;
}

async function fetchMoviesFromTMDB(params: URLSearchParams): Promise<any[]> {
  try {
    const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching from TMDb:', error);
    return [];
  }
}

async function fetchArnoldMovies(): Promise<any[]> {
  // Try cast-based search first
  const params = new URLSearchParams();
  params.set('api_key', TMDB_API_KEY!);
  params.set('with_cast', ARNOLD_PERSON_ID.toString());
  params.set('sort_by', 'popularity.desc');
  
  const movies = await fetchMoviesFromTMDB(params);
  
  if (movies.length > 0) {
    return movies.slice(0, 10); // Return top 10
  }
  
  // Fallback: fetch specific Arnold movies
  const moviePromises = ARNOLD_MOVIE_IDS.slice(0, 10).map(async (id) => {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Error fetching movie ${id}:`, error);
    }
    return null;
  });
  
  const results = await Promise.all(moviePromises);
  return results.filter((movie) => movie !== null);
}

function selectMovies(movies: any[], quiz: QuizState, count: number = 3): any[] {
  if (movies.length === 0) return [];
  
  // Filter and sort based on quiz preferences
  let filtered = [...movies];
  
  // Energy level filtering (use vote_average as proxy for intensity)
  if (quiz.energy === 'high') {
    filtered.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else if (quiz.energy === 'low') {
    filtered.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
  }
  
  // Brain level filtering (use popularity as proxy)
  if (quiz.brainLevel === 'low') {
    // Prefer more popular/accessible movies
    filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }
  
  return filtered.slice(0, count);
}

function transformToRecommendedMovie(
  movie: any,
  quiz: QuizState
): RecommendedMovie {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview || 'No description available.',
    posterPath: movie.poster_path,
    releaseYear,
    arnoldComment: getArnoldComment({
      quiz,
      movieTitle: movie.title,
      year: releaseYear || 0,
      voteAverage: movie.vote_average,
    }),
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDb API key not configured' },
        { status: 500 }
      );
    }

    const quiz: QuizState = await request.json();

    let movies: any[] = [];

    // Handle Arnold-specific requests
    if (quiz.arnoldLevel === 'full') {
      movies = await fetchArnoldMovies();
    } else {
      const params = buildTMDBQuery(quiz);
      movies = await fetchMoviesFromTMDB(params);
    }

    // Select 1-3 movies based on preferences
    const selectedMovies = selectMovies(movies, quiz, 3);
    
    if (selectedMovies.length === 0) {
      return NextResponse.json<RecommendResponse>(
        { movies: [] },
        { status: 200 }
      );
    }

    // Transform to RecommendedMovie format
    const recommendedMovies: RecommendedMovie[] = selectedMovies.map((movie) =>
      transformToRecommendedMovie(movie, quiz)
    );

    return NextResponse.json<RecommendResponse>(
      { movies: recommendedMovies },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in recommend API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

