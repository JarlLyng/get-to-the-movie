import type { PersonaId } from './persona';

export type BrainLevel = 'low' | 'medium' | 'high';
export type ArnoldLevel = 'full'; // Only Arnold movies are supported
export type EnergyLevel = 'low' | 'medium' | 'high';
export type Era = '80s' | '90s' | 'modern' | 'any';
export type Mood = 'funny' | 'action' | 'dark';

// New dimensions for persona matching
export type DecisionStyle = 'gut' | 'analysis' | 'vibes';
export type WorkoutVibe = 'pumpIron' | 'cardio' | 'chill';
export type CatchphraseEnergy = 'oneLiner' | 'speech' | 'silence';

export type QuizState = {
  brainLevel: BrainLevel;
  arnoldLevel: ArnoldLevel; // Always 'full' - only Arnold movies
  energy: EnergyLevel;
  era: Era;
  mood: Mood;
  decisionStyle: DecisionStyle;
  workoutVibe: WorkoutVibe;
  catchphraseEnergy: CatchphraseEnergy;
};

export type RecommendedMovie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseYear: number | null;
  arnoldComment: string;
};

export type PersonaMatch = {
  personaId: PersonaId;
  score: number;
  /** Second-best persona — used for "you're a bit of X too" messaging. */
  runnerUp: PersonaId;
  /** Explanation of why this persona matched — used in "Why this result" UI. */
  reasons: string[];
};

export type RecommendResponse = {
  persona: PersonaMatch;
  movies: RecommendedMovie[];
};

export type ArnoldCommentContext = {
  quiz: QuizState;
  persona: PersonaId;
  movieTitle: string;
  year: number;
  voteAverage?: number;
};
