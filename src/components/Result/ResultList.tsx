'use client';

import type { RecommendedMovie } from '@/types/quiz';
import { MovieCard } from './MovieCard';

type ResultListProps = {
  movies: RecommendedMovie[];
};

export function ResultList({ movies }: ResultListProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          Ingen film fundet. Prøv igen med andre indstillinger!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

