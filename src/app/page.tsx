'use client';

import { useState } from 'react';
import type { QuizState, RecommendedMovie } from '@/types/quiz';
import { QuizForm } from '@/components/Quiz/QuizForm';
import { ResultList } from '@/components/Result/ResultList';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { getRecommendations } from '@/lib/tmdb-client';

export default function Home() {
  const [movies, setMovies] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleQuizSubmit = async (quizState: QuizState) => {
    setIsLoading(true);
    setHasSubmitted(true);
    setMovies([]);

    try {
      // Use NEXT_PUBLIC_ prefix for client-side access in static export
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '25403f33a1a8dab99f0a469ddc0fa699';
      
      const recommendedMovies = await getRecommendations(quizState, apiKey);
      setMovies(recommendedMovies);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMovies([]);
    setHasSubmitted(false);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            GET TO THE MOVIE! 🎬💪
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Arnold er din kaotiske film-coach. Svar på spørgsmålene og få anbefalet perfekte film med over-the-top Arnold-kommentarer!
          </p>
        </div>

        {/* Quiz or Results */}
        {!hasSubmitted || movies.length === 0 ? (
          <div>
            <QuizForm onSubmit={handleQuizSubmit} isLoading={isLoading} />
            
            {isLoading && (
              <Card className="mt-8 p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-4 mt-6">
                    <Skeleton className="h-64 w-48" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
                <p className="text-center mt-6 text-lg font-semibold text-yellow-500">
                  Arnold tænker...
                </p>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Dine anbefalinger</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              >
                Prøv igen
              </button>
            </div>
            <ResultList movies={movies} />
            {movies.length > 0 && (
              <div className="text-center pt-8">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-lg transition-all uppercase tracking-wider"
                >
                  Få flere anbefalinger
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
