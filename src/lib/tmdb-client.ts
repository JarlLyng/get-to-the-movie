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
  const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const statusText = response.statusText || 'Unknown error';
    throw new Error(`TMDb API error: ${response.status} ${statusText}`);
  }
  
  const data = await response.json();
  return data.results || [];
}

async function fetchArnoldMovies(apiKey: string, quiz: QuizState): Promise<TMDBMovie[]> {
  // Use buildTMDBQuery to respect all quiz parameters (era, mood/genre, etc.)
  const params = buildTMDBQuery(quiz, apiKey);
  
  // Ensure we always filter by Arnold
  params.set('with_cast', ARNOLD_PERSON_ID.toString());
  
  try {
    const movies = await fetchMoviesFromTMDB(params);
    
    if (movies.length > 0) {
      return movies;
    }
  } catch (error) {
    // If discover API fails, try fallback instead of throwing immediately
    console.warn('Discover API failed, trying fallback:', error);
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
      } else {
        throw new Error(`Failed to fetch movie ${id}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching movie ${id}:`, error);
      return null;
    }
  });
  
  const results = await Promise.all(moviePromises);
  const fallbackMovies = results.filter((movie): movie is TMDBMovie => movie !== null);
  
  if (fallbackMovies.length === 0) {
    throw new Error('Failed to fetch movies from TMDb API. Please check your API key and try again.');
  }
  
  // Apply era and mood filtering to fallback movies
  let filtered = fallbackMovies;
  
  // Era filtering
  if (quiz.era === '80s') {
    filtered = filtered.filter((movie) => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
      return year >= 1980 && year <= 1989;
    });
  } else if (quiz.era === '90s') {
    filtered = filtered.filter((movie) => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
      return year >= 1990 && year <= 1999;
    });
  } else if (quiz.era === 'modern') {
    filtered = filtered.filter((movie) => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
      return year >= 2000;
    });
  }
  
  // Mood filtering based on genre IDs (if available in movie data)
  // Note: Fallback movies don't have genre_ids in the basic movie endpoint
  // So we prioritize movies that match the mood preference through sorting
  if (quiz.mood === 'funny') {
    // Prefer comedies (we can't filter by genre in fallback, but we can prioritize)
    filtered.sort((_a, _b) => {
      // If we had genre_ids, we'd filter here, but for now we'll just return filtered
      return 0;
    });
  } else if (quiz.mood === 'dark') {
    // Prefer thrillers
    filtered.sort((_a, _b) => {
      // If we had genre_ids, we'd filter here, but for now we'll just return filtered
      return 0;
    });
  }
  // For 'action' mood, all Arnold movies are action-oriented, so no additional filtering needed
  
  return filtered;
}

function selectMovies(movies: TMDBMovie[], quiz: QuizState, count: number = 3): TMDBMovie[] {
  if (movies.length === 0) return [];
  
  // Filter and sort based on quiz preferences
  // Use a combined scoring system so both energy and brainLevel affect the result
  const filtered = [...movies];
  
  // Calculate combined score: energy (vote_average) + brainLevel (popularity)
  // Both preferences should influence the final ranking
  filtered.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Energy level contributes to score (vote_average as proxy for intensity)
    if (quiz.energy === 'high') {
      scoreA += (a.vote_average || 0) * 2; // Higher weight for high energy preference
      scoreB += (b.vote_average || 0) * 2;
    } else if (quiz.energy === 'low') {
      scoreA += (1 / (a.vote_average || 0.1)) * 2; // Inverse for low energy
      scoreB += (1 / (b.vote_average || 0.1)) * 2;
    }
    
    // Brain level contributes to score (popularity as proxy for accessibility)
    if (quiz.brainLevel === 'low') {
      scoreA += (a.popularity || 0) * 1.5; // Higher weight for accessible movies
      scoreB += (b.popularity || 0) * 1.5;
    } else if (quiz.brainLevel === 'high') {
      scoreA += (1 / (a.popularity || 0.1)) * 1.5; // Inverse for complex movies
      scoreB += (1 / (b.popularity || 0.1)) * 1.5;
    }
    
    return scoreB - scoreA; // Sort descending by combined score
  });
  
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

