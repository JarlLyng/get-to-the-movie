import type { QuizState, RecommendedMovie } from '@/types/quiz';
import { getArnoldComment } from './arnold-comments';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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

function buildTMDBQuery(quiz: QuizState, apiKey: string): URLSearchParams {
  const params = new URLSearchParams();
  params.set('api_key', apiKey);
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

async function fetchMoviesFromTMDB(params: URLSearchParams): Promise<TMDBMovie[]> {
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

async function fetchArnoldMovies(apiKey: string, quiz: QuizState): Promise<TMDBMovie[]> {
  // Use buildTMDBQuery to respect all quiz parameters (era, mood/genre, etc.)
  const params = buildTMDBQuery(quiz, apiKey);
  
  // Ensure we always filter by Arnold
  params.set('with_cast', ARNOLD_PERSON_ID.toString());
  
  const movies = await fetchMoviesFromTMDB(params);
  
  if (movies.length > 0) {
    return movies;
  }
  
  // Fallback: fetch specific Arnold movies and filter by quiz preferences
  const moviePromises = ARNOLD_MOVIE_IDS.map(async (id) => {
    try {
      const fallbackParams = new URLSearchParams();
      fallbackParams.set('api_key', apiKey);
      fallbackParams.set('language', 'en-US');
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?${fallbackParams.toString()}`
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
  const fallbackMovies = results.filter((movie): movie is TMDBMovie => movie !== null);
  
  // Apply era filtering to fallback movies
  let filtered = fallbackMovies;
  if (quiz.era === '80s') {
    filtered = fallbackMovies.filter((movie) => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
      return year >= 1980 && year <= 1989;
    });
  } else if (quiz.era === '90s') {
    filtered = fallbackMovies.filter((movie) => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
      return year >= 1990 && year <= 1999;
    });
  } else if (quiz.era === 'modern') {
    filtered = fallbackMovies.filter((movie) => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
      return year >= 2000;
    });
  }
  
  return filtered;
}

function selectMovies(movies: TMDBMovie[], quiz: QuizState, count: number = 3): TMDBMovie[] {
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

type TMDBMovie = {
  id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  popularity: number | null;
};

function transformToRecommendedMovie(
  movie: TMDBMovie,
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
      voteAverage: movie.vote_average ?? undefined,
    }),
  };
}

export async function getRecommendations(
  quiz: QuizState,
  apiKey: string
): Promise<RecommendedMovie[]> {
  if (!apiKey) {
    throw new Error('TMDb API key not provided');
  }

  // Fetch Arnold movies with quiz filters applied (era, mood/genre via buildTMDBQuery)
  const movies = await fetchArnoldMovies(apiKey, quiz);

  // Select 1-3 movies based on preferences (energy, brain level)
  const selectedMovies = selectMovies(movies, quiz, 3);
  
  if (selectedMovies.length === 0) {
    return [];
  }

  // Transform to RecommendedMovie format
  const recommendedMovies: RecommendedMovie[] = selectedMovies.map((movie) =>
    transformToRecommendedMovie(movie, quiz)
  );

  return recommendedMovies;
}

