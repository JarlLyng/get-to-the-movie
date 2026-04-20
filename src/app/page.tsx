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

  // Structured data for SEO — @graph stacking for AI engine optimization
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Get to the Movie!",
        "description": "AI-powered Arnold Schwarzenegger movie recommendation quiz. Answer personality-based questions and get matched to your perfect Arnold film.",
        "url": baseUrl,
        "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "creator": {
          "@type": "Person",
          "name": "Jarl Lyng",
          "url": "https://iamjarl.com"
        }
      },
      {
        "@type": "ItemList",
        "name": "Arnold Schwarzenegger Movie Recommendations",
        "description": "Top Arnold Schwarzenegger movies featured in the recommendation quiz",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "The Terminator (1984)",
            "description": "Time-traveling assassin sci-fi action classic"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Predator (1987)",
            "description": "Elite commandos hunted by an alien warrior in the jungle"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Total Recall (1990)",
            "description": "Mind-bending sci-fi reality thriller on Mars"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Terminator 2: Judgment Day (1991)",
            "description": "Groundbreaking sequel where Arnold protects humanity's future"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "True Lies (1994)",
            "description": "Action-comedy about a secret agent's double life"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does the Arnold movie quiz work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Answer 4 personality-based questions about your mood, energy level, brain capacity, and era preference. The quiz matches your answers to Arnold Schwarzenegger movies using TMDB data and gives you 1-3 personalized recommendations with Arnold-style commentary."
            }
          },
          {
            "@type": "Question",
            "name": "Which Arnold Schwarzenegger movie should I watch?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It depends on your mood! Action lovers should try Predator or Terminator, sci-fi fans will enjoy Total Recall, comedy fans love Kindergarten Cop, and for a mix of action and humor, True Lies is the go-to pick. Take the quiz to get a personalized recommendation."
            }
          },
          {
            "@type": "Question",
            "name": "Is the movie quiz free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Get to the Movie! is completely free. Take the quiz as many times as you want to discover different Arnold Schwarzenegger movie recommendations."
            }
          },
          {
            "@type": "Question",
            "name": "How many Arnold movies are in the quiz?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The quiz pulls from Arnold Schwarzenegger's full filmography via TMDB, covering his iconic movies from the 1980s to modern releases — action, sci-fi, comedy, and thriller."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Cinematic Deep Background */}
      <div className="absolute inset-0 bg-[#050505] pointer-events-none"></div>
      
      {/* Cyber Grid with depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--iamjarl-border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--iamjarl-border-subtle)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 pointer-events-none transform perspective-[1000px] rotateX(60deg) scale(2.5) origin-top"></div>
      
      {/* Red ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none animate-pulse-glow"></div>
      
      <div className="relative container mx-auto px-4 py-16 max-w-5xl z-10">
        {/* Hero Section */}
        <header className="text-center mb-16 space-y-6 relative">
          <div className="inline-flex items-center justify-center relative">
            <h1 className="relative text-7xl md:text-8xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-primary/80 tracking-tighter uppercase neon-text transform hover:scale-[1.02] transition-transform duration-500">
              GET TO THE MOVIE!
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed font-light">
            Arnold is your chaotic movie coach. Answer the questions and get perfect Arnold movies with over-the-top Arnold-style commentary! <br/>
            <span className="text-primary/80 font-bold uppercase tracking-widest text-sm mt-4 block">Terminator mode enganged //</span>
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
              <div className="mt-8 relative overflow-hidden glass-panel rounded-xl p-8 shadow-primary/20 shadow-2xl">
                {/* Cyberpunk scanning line */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent h-10 w-full animate-scan z-0 opacity-50 blur-sm pointer-events-none"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
                    <p className="text-primary font-mono text-sm uppercase tracking-widest">
                      Processing Neural Net Data...
                    </p>
                  </div>
                  
                  <div className="space-y-3 opacity-60">
                    <Skeleton className="h-10 w-3/4 bg-primary/20" />
                    <Skeleton className="h-5 w-full bg-border" />
                    <Skeleton className="h-5 w-5/6 bg-border" />
                  </div>
                  <div className="flex gap-6 mt-8 opacity-60">
                    <Skeleton className="h-80 w-56 rounded-lg bg-primary/10 border border-primary/20" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-8 w-2/3 bg-primary/20" />
                      <Skeleton className="h-4 w-full bg-border" />
                      <Skeleton className="h-4 w-full bg-border" />
                      <Skeleton className="h-4 w-4/5 bg-border" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center relative z-10">
                  <p className="text-2xl font-black text-white uppercase tracking-widest neon-text animate-pulse">
                    Arnold is thinking...
                  </p>
                </div>
              </div>
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

        {/* How It Works — SEO crawlable content */}
        <section className="relative z-10 container mx-auto px-4 py-16 max-w-5xl">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold text-foreground">Answer 4 Questions</h3>
              <p className="text-muted-foreground text-sm">Tell Arnold about your mood, energy level, brain capacity, and what era of movies you prefer.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold text-foreground">Get Matched</h3>
              <p className="text-muted-foreground text-sm">Our recommendation engine analyzes your answers against Arnold&apos;s full filmography from TMDB to find your perfect match.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold text-foreground">Watch the Movie!</h3>
              <p className="text-muted-foreground text-sm">Get 1-3 personalized Arnold movie recommendations with over-the-top Arnold-style commentary. GET TO THE MOVIE!</p>
            </div>
          </div>
        </section>

        {/* FAQ Section — SEO long-tail keyword targeting */}
        <section className="relative z-10 container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <details className="group border border-border rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-foreground group-open:text-primary transition-colors">
                How does the Arnold movie quiz work?
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Answer 4 personality-based questions about your mood, energy level, brain capacity, and era preference. The quiz matches your answers to Arnold Schwarzenegger movies using TMDB data and gives you 1-3 personalized recommendations with Arnold-style commentary.
              </p>
            </details>
            <details className="group border border-border rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-foreground group-open:text-primary transition-colors">
                Which Arnold Schwarzenegger movie should I watch?
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                It depends on your mood! Action lovers should try Predator or Terminator, sci-fi fans will enjoy Total Recall, comedy fans love Kindergarten Cop, and for a mix of action and humor, True Lies is the go-to pick. Take the quiz above for a personalized recommendation.
              </p>
            </details>
            <details className="group border border-border rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-foreground group-open:text-primary transition-colors">
                Is the movie quiz free?
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Yes! Get to the Movie! is completely free. Take the quiz as many times as you want to discover different Arnold Schwarzenegger movie recommendations.
              </p>
            </details>
            <details className="group border border-border rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-foreground group-open:text-primary transition-colors">
                How many Arnold movies are in the quiz?
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                The quiz pulls from Arnold Schwarzenegger&apos;s full filmography via TMDB, covering his iconic movies from the 1980s to modern releases — action, sci-fi, comedy, and thriller genres are all represented.
              </p>
            </details>
            <details className="group border border-border rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-foreground group-open:text-primary transition-colors">
                Can I retake the quiz with different answers?
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Absolutely! After seeing your results, click &ldquo;Try Again&rdquo; or &ldquo;Get More Recommendations&rdquo; to retake the quiz. Different answers lead to different Arnold movie recommendations.
              </p>
            </details>
          </div>
        </section>

        {/* Footer with TMDB attribution & cross-links */}
        <footer className="relative z-10 container mx-auto px-4 py-8 max-w-5xl border-t border-border">
          <div className="flex flex-col gap-6 text-sm text-muted-foreground">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p>
                Built by{' '}
                <a href="https://iamjarl.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Jarl Lyng
                </a>
              </p>
              <p>
                Movie data provided by{' '}
                <a href="https://www.themoviedb.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  TMDB
                </a>
                . This product uses the TMDB API but is not endorsed or certified by TMDB.
              </p>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs" aria-label="More from IAMJARL">
              <span className="w-full text-center opacity-60">More from IAMJARL</span>
              <a href="https://wodrounds.iamjarl.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                WODrounds
              </a>
              <a href="https://trimrpix.iamjarl.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                TrimrPix
              </a>
              <a href="https://emotionwave.iamjarl.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                EmotionWave
              </a>
              <a href="https://madebyhuman.iamjarl.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                Made by Human
              </a>
              <a href="https://beertuner.iamjarl.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                BeerTuner
              </a>
              <a href="https://iamjarl.com" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                All projects
              </a>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}
