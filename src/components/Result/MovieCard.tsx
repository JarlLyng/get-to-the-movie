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
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {posterUrl && (
          <div className="relative w-full md:w-48 h-64 md:h-auto flex-shrink-0">
            <Image
              src={posterUrl}
              alt={`${movie.title} poster`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 192px"
            />
          </div>
        )}
        <div className="flex-1">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{movie.title}</CardTitle>
                {movie.releaseYear && (
                  <Badge variant="secondary" className="mb-2">
                    {movie.releaseYear}
                  </Badge>
                )}
              </div>
            </div>
            <CardDescription className="text-base font-semibold text-yellow-500 dark:text-yellow-400 italic">
              "{movie.arnoldComment}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {movie.overview}
            </p>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

