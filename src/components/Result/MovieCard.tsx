'use client';

import Image from 'next/image';
import type { RecommendedMovie } from '@/types/quiz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="overflow-hidden border-border bg-card backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/50 group p-0 gap-0">
      <div className="flex flex-col md:flex-row">
        {posterUrl && (
          <div className="relative w-full md:w-64 h-80 md:h-auto flex-shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Image
              src={posterUrl}
              alt={`${movie.title} (${movie.releaseYear || 'Unknown year'}) movie poster`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
        )}
        <div className="flex-1 p-6 md:p-8">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <CardTitle className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                  {movie.title}
                </CardTitle>
                {movie.releaseYear && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground border-border text-sm px-3 py-1">
                    {movie.releaseYear}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 p-4 bg-primary/20 border-l-4 border-primary rounded-r-lg">
              <CardDescription className="text-lg font-bold text-primary italic leading-relaxed">
                "{movie.arnoldComment}"
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              {movie.overview}
            </p>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

