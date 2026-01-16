'use client';

import { useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const handleQuizSubmit = async (quizState: QuizState) => {
    setIsLoading(true);
    setHasSubmitted(true);
    setMovies([]);
    setError(null);

    // Track quiz completion
    trackEvent(UmamiEvents.QUIZ_COMPLETED, {
      brainLevel: quizState.brainLevel,
      energy: quizState.energy,
      era: quizState.era,
      mood: quizState.mood,
    });

    try {
      // Use NEXT_PUBLIC_ prefix for client-side access in static export
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      
      if (!apiKey) {
        throw new Error('TMDb API key is not configured');
      }
      
      const recommendedMovies = await getRecommendations(quizState, apiKey);
      setMovies(recommendedMovies);
      
      // Track successful recommendations
      if (recommendedMovies.length > 0) {
        trackEvent(UmamiEvents.RECOMMENDATIONS_RECEIVED, {
          count: recommendedMovies.length.toString(),
        });
      } else {
        setError('No movies found. Try different settings!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch recommendations. Please try again.';
      setError(errorMessage);
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
    setError(null);
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gettothemovie.iamjarl.com';

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Get to the Movie!",
    "description": "Arnold Schwarzenegger-inspired movie recommendation app. Answer quiz questions and get recommended perfect Arnold movies!",
    "url": baseUrl,
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "IAMJARL"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
      <div className="relative container mx-auto px-4 py-16 max-w-5xl z-10">
        {/* Hero Section */}
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-6xl md:text-7xl font-bold mb-2 text-primary tracking-tight">
              GET TO THE MOVIE!
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Arnold is your chaotic movie coach. Answer the questions and get recommended perfect Arnold movies with over-the-top Arnold-style commentary!
          </p>
        </header>

        {/* Quiz or Results */}
        {!hasSubmitted ? (
          <div className="space-y-8 relative z-20">
            <QuizForm onSubmit={handleQuizSubmit} isLoading={isLoading} />
            
            {error && !isLoading && (
              <Card className="mt-8 p-6 border-destructive/50 bg-destructive/10 backdrop-blur-sm">
                <p className="text-destructive text-center font-semibold">
                  {error}
                </p>
              </Card>
            )}
            
            {isLoading && (
              <Card className="mt-8 p-8 border-border bg-card backdrop-blur-sm shadow-2xl">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-3/4 bg-muted" />
                    <Skeleton className="h-5 w-full bg-muted" />
                    <Skeleton className="h-5 w-5/6 bg-muted" />
                  </div>
                  <div className="flex gap-6 mt-8">
                    <Skeleton className="h-80 w-56 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-8 w-2/3 bg-muted" />
                      <Skeleton className="h-4 w-full bg-muted" />
                      <Skeleton className="h-4 w-full bg-muted" />
                      <Skeleton className="h-4 w-4/5 bg-muted" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xl font-semibold text-primary animate-pulse">
                    Arnold is thinking...
                  </p>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-10 relative z-20">
            {error ? (
              <Card className="p-8 border-destructive/50 bg-destructive/10 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-destructive">Error</h2>
                  <p className="text-muted-foreground">{error}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      trackEvent(UmamiEvents.TRY_AGAIN_CLICKED);
                      handleReset();
                    }}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-all text-sm uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transform hover:scale-105 cursor-pointer mt-4"
                    aria-label="Reset quiz and try again"
                  >
                    Try Again
                  </button>
                </div>
              </Card>
            ) : movies.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-4xl font-bold text-primary">
                      Your Recommendations
                    </h2>
                    <p className="text-muted-foreground mt-2">Arnold has chosen these movies for you</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      trackEvent(UmamiEvents.TRY_AGAIN_CLICKED);
                      handleReset();
                    }}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-all text-sm uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transform hover:scale-105 cursor-pointer relative z-10"
                    aria-label="Reset quiz and try again"
                  >
                    Try Again
                  </button>
                </div>
                <ResultList movies={movies} />
                <div className="text-center pt-8 relative z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      trackEvent(UmamiEvents.GET_MORE_RECOMMENDATIONS_CLICKED);
                      handleReset();
                    }}
                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all uppercase tracking-wider shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/50 transform hover:scale-105 cursor-pointer"
                    aria-label="Get more movie recommendations"
                  >
                    Get More Recommendations
                  </button>
                </div>
              </>
            ) : (
              <Card className="p-8 border-border bg-card backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">No movies found</h2>
                  <p className="text-muted-foreground">Try adjusting your preferences and try again.</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      trackEvent(UmamiEvents.TRY_AGAIN_CLICKED);
                      handleReset();
                    }}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-all text-sm uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transform hover:scale-105 cursor-pointer mt-4"
                    aria-label="Reset quiz and try again"
                  >
                    Try Again
                  </button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
      </main>
    </>
  );
}
