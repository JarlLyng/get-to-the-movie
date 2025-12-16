'use client';

import { useState, useEffect } from 'react';
import type { QuizState, RecommendedMovie } from '@/types/quiz';
import { QuizForm } from '@/components/Quiz/QuizForm';
import { ResultList } from '@/components/Result/ResultList';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { getRecommendations } from '@/lib/tmdb-client';
import { trackEvent, UmamiEvents } from '@/lib/umami';

export default function Home() {
  const [movies, setMovies] = useState<RecommendedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleQuizSubmit = async (quizState: QuizState) => {
    setIsLoading(true);
    setHasSubmitted(true);
    setMovies([]);

    // Track quiz completion
    trackEvent(UmamiEvents.QUIZ_COMPLETED, {
      brainLevel: quizState.brainLevel,
      energy: quizState.energy,
      era: quizState.era,
      mood: quizState.mood,
    });

    try {
      // Use NEXT_PUBLIC_ prefix for client-side access in static export
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '25403f33a1a8dab99f0a469ddc0fa699';
      
      const recommendedMovies = await getRecommendations(quizState, apiKey);
      setMovies(recommendedMovies);
      
      // Track successful recommendations
      if (recommendedMovies.length > 0) {
        trackEvent(UmamiEvents.RECOMMENDATIONS_RECEIVED, {
          count: recommendedMovies.length.toString(),
        });
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    trackEvent(UmamiEvents.QUIZ_RESET);
    setMovies([]);
    setHasSubmitted(false);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground relative overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative container mx-auto px-4 py-16 max-w-5xl z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-2xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-6xl md:text-7xl font-extrabold mb-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">
              GET TO THE MOVIE!
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Arnold is your chaotic movie coach. Answer the questions and get recommended perfect Arnold movies with over-the-top Arnold-style commentary!
          </p>
        </div>

        {/* Quiz or Results */}
        {!hasSubmitted || movies.length === 0 ? (
          <div className="space-y-8 relative z-20">
            <QuizForm onSubmit={handleQuizSubmit} isLoading={isLoading} />
            
            {isLoading && (
              <Card className="mt-8 p-8 border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-3/4 bg-slate-800" />
                    <Skeleton className="h-5 w-full bg-slate-800" />
                    <Skeleton className="h-5 w-5/6 bg-slate-800" />
                  </div>
                  <div className="flex gap-6 mt-8">
                    <Skeleton className="h-80 w-56 rounded-lg bg-slate-800" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-8 w-2/3 bg-slate-800" />
                      <Skeleton className="h-4 w-full bg-slate-800" />
                      <Skeleton className="h-4 w-full bg-slate-800" />
                      <Skeleton className="h-4 w-4/5 bg-slate-800" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                    Arnold is thinking...
                  </p>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-10 relative z-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Your Recommendations
                </h2>
                <p className="text-slate-400 mt-2">Arnold has chosen these movies for you</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  trackEvent(UmamiEvents.TRY_AGAIN_CLICKED);
                  handleReset();
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-lg transition-all text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transform hover:scale-105 cursor-pointer relative z-10"
              >
                Try Again
              </button>
            </div>
            <ResultList movies={movies} />
            {movies.length > 0 && (
              <div className="text-center pt-8 relative z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    trackEvent(UmamiEvents.GET_MORE_RECOMMENDATIONS_CLICKED);
                    handleReset();
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-black font-bold rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/50 transform hover:scale-105 cursor-pointer"
                >
                  Get More Recommendations
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
