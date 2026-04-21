import type { QuizState, RecommendedMovie, PersonaMatch } from '@/types/quiz';
import type { PersonaId } from '@/types/persona';
import { getArnoldComment } from './arnold-comments';
import { getPersona, matchPersona } from './personas';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

type TMDBMovie = {
  id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  popularity: number | null;
};

/**
 * Fetch a single movie by TMDB ID. Returns null on failure.
 */
async function fetchMovieById(id: number, apiKey: string): Promise<TMDBMovie | null> {
  const params = new URLSearchParams({ api_key: apiKey, language: 'en-US' });
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?${params.toString()}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Fetch all movies for a given persona in parallel.
 * Movies that fail to fetch are silently dropped.
 */
async function fetchPersonaMovies(personaId: PersonaId, apiKey: string): Promise<TMDBMovie[]> {
  const persona = getPersona(personaId);
  const results = await Promise.all(
    persona.movieIds.map((id) => fetchMovieById(id, apiKey))
  );
  return results.filter((m): m is TMDBMovie => m !== null);
}

/**
 * Select which of the persona's films to show based on quiz preferences.
 * Returns 2-3 films sorted by relevance (era match first, then rating).
 */
function selectMoviesForQuiz(movies: TMDBMovie[], quiz: QuizState, count = 3): TMDBMovie[] {
  if (movies.length === 0) return [];

  const matchesEra = (movie: TMDBMovie): boolean => {
    if (quiz.era === 'any' || !movie.release_date) return true;
    const year = new Date(movie.release_date).getFullYear();
    if (quiz.era === '80s') return year >= 1980 && year <= 1989;
    if (quiz.era === '90s') return year >= 1990 && year <= 1999;
    if (quiz.era === 'modern') return year >= 2000;
    return true;
  };

  // Score: era match (+10) + vote_average (0-10). Era-matching films win ties.
  const scored = movies.map((movie) => ({
    movie,
    score: (matchesEra(movie) ? 10 : 0) + (movie.vote_average ?? 0),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.movie);
}

function transformToRecommendedMovie(
  movie: TMDBMovie,
  quiz: QuizState,
  personaId: PersonaId
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
      persona: personaId,
      movieTitle: movie.title,
      year: releaseYear || 0,
      voteAverage: movie.vote_average ?? undefined,
    }),
  };
}

/**
 * Main entry: given quiz answers, return the matched persona + recommended Arnold films.
 */
export async function getRecommendations(
  quiz: QuizState,
  apiKey: string
): Promise<{ persona: PersonaMatch; movies: RecommendedMovie[] }> {
  if (!apiKey) {
    throw new Error('TMDb API key not provided');
  }

  // 1. Match quiz to persona (pure function, no network)
  const persona = matchPersona(quiz);

  // 2. Fetch persona's representative movies
  const movies = await fetchPersonaMovies(persona.personaId, apiKey);

  if (movies.length === 0) {
    throw new Error(
      'Failed to fetch movies from TMDb. Please check your connection and API key.'
    );
  }

  // 3. Select 2-3 movies matching quiz era preferences
  const selected = selectMoviesForQuiz(movies, quiz, 3);

  return {
    persona,
    movies: selected.map((m) => transformToRecommendedMovie(m, quiz, persona.personaId)),
  };
}
