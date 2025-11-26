'use client';

import type { RecommendedMovie } from '@/types/quiz';
import { MovieCard } from './MovieCard';

type ResultListProps = {
  movies: RecommendedMovie[];
};

export function ResultList({ movies }: ResultListProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 border border-slate-700 mb-4">
          <span className="text-4xl">🎬</span>
        </div>
        <p className="text-xl text-slate-400 font-medium">
          No movies found. Try again with different settings!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {movies.map((movie, index) => (
        <div 
          key={movie.id} 
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}

