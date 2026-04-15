'use client';

import Image from 'next/image';
import type { RecommendedMovie } from '@/types/quiz';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type MovieCardProps = {
  movie: RecommendedMovie;
};

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.posterPath 
    ? `${TMDB_IMAGE_BASE_URL}${movie.posterPath}`
    : null;

  return (
    <div className="glass-panel overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,42,42,0.3)] hover:-translate-y-1 group p-0 relative rounded-2xl border-white/10">
      {/* Cinematic Edge Lighting */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row relative z-10">
        {posterUrl && (
          <div className="relative w-full md:w-72 h-[400px] md:h-auto flex-shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10 md:hidden"></div>
            <Image
              src={posterUrl}
              alt={`${movie.title} (${movie.releaseYear || 'Unknown year'}) movie poster`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 288px"
            />
            {/* Cyberpunk corner accent */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary z-20 m-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary z-20 m-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        )}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between">
          <div className="p-0 pb-4">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-3xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 uppercase tracking-tight">
                  {movie.title}
                </h3>
                {movie.releaseYear && (
                  <Badge variant="outline" className="bg-white/5 text-primary border-primary/30 text-sm px-4 py-1 font-mono tracking-widest uppercase">
                    SYS.YR: {movie.releaseYear}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary relative overflow-hidden group-hover:from-primary/20 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-6xl font-serif">&quot;</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white italic leading-relaxed relative z-10 font-heading">
                &quot;{movie.arnoldComment}&quot;
              </p>
              <div className="mt-2 text-primary/70 font-mono text-xs uppercase tracking-widest">
                {'// ARNOLD.AI ANALYSIS COMPLETE'}
              </div>
            </div>
          </div>
          <div className="p-0 pt-6">
            <p className="text-lg text-white/60 leading-relaxed font-light">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

