export type BrainLevel = 'low' | 'medium' | 'high';
export type ArnoldLevel = 'none' | 'medium' | 'full';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type Era = '80s' | '90s' | 'modern' | 'any';
export type Mood = 'funny' | 'action' | 'dark';

export type QuizState = {
  brainLevel: BrainLevel;
  arnoldLevel: ArnoldLevel;
  energy: EnergyLevel;
  era: Era;
  mood: Mood;
};

export type RecommendedMovie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseYear: number | null;
  arnoldComment: string;
};

export type RecommendResponse = {
  movies: RecommendedMovie[];
};

export type ArnoldCommentContext = {
  quiz: QuizState;
  movieTitle: string;
  year: number;
  voteAverage?: number;
};

