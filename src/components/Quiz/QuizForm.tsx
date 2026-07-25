'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  QuizState,
  BrainLevel,
  EnergyLevel,
  Era,
  Mood,
  DecisionStyle,
  WorkoutVibe,
  CatchphraseEnergy,
} from '@/types/quiz';
import { QuizQuestion } from './QuizQuestion';
import { Button } from '@/components/ui/button';
import { trackEvent, UmamiEvents } from '@/lib/umami';

type QuizFormProps = {
  onSubmit: (quizState: QuizState) => void;
  isLoading?: boolean;
};

type QuestionId = Exclude<keyof QuizState, 'arnoldLevel'>;

type Question = {
  id: QuestionId;
  /** HUD-style step label shown in the progress bar. */
  hudLabel: string;
  question: string;
  options: Array<{ value: string; label: string }>;
};

const defaultState: Partial<QuizState> = {
  arnoldLevel: 'full', // Always Arnold movies
};

/** Delay before auto-advancing to the next question after picking an answer. */
const AUTO_ADVANCE_MS = 450;

const questions: Question[] = [
  {
    id: 'brainLevel',
    hudLabel: 'BRAIN SCAN',
    question: 'How much brain do you have left today?',
    options: [
      { value: 'low' satisfies BrainLevel, label: 'Max one catchphrase per scene, please' },
      { value: 'medium' satisfies BrainLevel, label: 'I can follow a decent plot thread' },
      { value: 'high' satisfies BrainLevel, label: "I'm ready for something that requires brain power" },
    ],
  },
  {
    id: 'energy',
    hudLabel: 'EXPLOSION AUDIT',
    question: 'How much explosion in your evening?',
    options: [
      { value: 'low' satisfies EnergyLevel, label: 'Slow / atmospheric' },
      { value: 'medium' satisfies EnergyLevel, label: 'Mixed tempo' },
      { value: 'high' satisfies EnergyLevel, label: 'Helicopters, explosions, screaming villains' },
    ],
  },
  {
    id: 'era',
    hudLabel: 'ERA CALIBRATION',
    question: 'Era preference',
    options: [
      { value: '80s' satisfies Era, label: 'VHS / nostalgia' },
      { value: '90s' satisfies Era, label: 'Classic blockbuster' },
      { value: 'modern' satisfies Era, label: 'Newer films' },
      { value: 'any' satisfies Era, label: "Don't care" },
    ],
  },
  {
    id: 'mood',
    hudLabel: 'MOOD ANALYSIS',
    question: 'Mood',
    options: [
      { value: 'funny' satisfies Mood, label: 'Comedy / self-aware action' },
      { value: 'action' satisfies Mood, label: 'Pure action / sci-fi' },
      { value: 'dark' satisfies Mood, label: 'A bit dark / thriller' },
    ],
  },
  {
    id: 'decisionStyle',
    hudLabel: 'DECISION MATRIX',
    question: 'How do you make decisions?',
    options: [
      { value: 'gut' satisfies DecisionStyle, label: 'From the gut — trust the vibe' },
      { value: 'analysis' satisfies DecisionStyle, label: 'Analyze every option first' },
      { value: 'vibes' satisfies DecisionStyle, label: 'Whatever feels right in the moment' },
    ],
  },
  {
    id: 'workoutVibe',
    hudLabel: 'MUSCLE PROTOCOL',
    question: 'Your ideal workout?',
    options: [
      { value: 'pumpIron' satisfies WorkoutVibe, label: "Pump iron until you can't lift a fork" },
      { value: 'cardio' satisfies WorkoutVibe, label: 'Run, swim, climb — stay moving' },
      { value: 'chill' satisfies WorkoutVibe, label: 'I prefer the couch, thanks' },
    ],
  },
  {
    id: 'catchphraseEnergy',
    hudLabel: 'CATCHPHRASE TEST',
    question: 'Your go-to line when things get intense?',
    options: [
      { value: 'oneLiner' satisfies CatchphraseEnergy, label: "Short and memorable (I'll be back)" },
      { value: 'speech' satisfies CatchphraseEnergy, label: 'A speech that moves mountains' },
      { value: 'silence' satisfies CatchphraseEnergy, label: 'Just glare. Words are for the weak' },
    ],
  },
];

function isComplete(state: Partial<QuizState>): state is QuizState {
  return (
    !!state.brainLevel &&
    !!state.energy &&
    !!state.era &&
    !!state.mood &&
    !!state.decisionStyle &&
    !!state.workoutVibe &&
    !!state.catchphraseEnergy
  );
}

export function QuizForm({ onSubmit, isLoading = false }: QuizFormProps) {
  const [quizState, setQuizState] = useState<Partial<QuizState>>(defaultState);
  const [currentStep, setCurrentStep] = useState(0);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track quiz started on mount
  useEffect(() => {
    trackEvent(UmamiEvents.QUIZ_STARTED);
  }, []);

  // Clear any pending auto-advance on unmount
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const isFirstStep = currentStep === 0;

  const cancelPendingAdvance = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };

  const handleNext = useCallback(() => {
    cancelPendingAdvance();
    setCurrentStep((step) => {
      if (step < questions.length - 1) {
        trackEvent(UmamiEvents.QUIZ_NEXT_CLICKED, {
          currentStep: (step + 1).toString(),
          totalSteps: questions.length.toString(),
        });
        return step + 1;
      }
      return step;
    });
  }, []);

  const handlePrevious = useCallback(() => {
    cancelPendingAdvance();
    setCurrentStep((step) => {
      if (step > 0) {
        trackEvent(UmamiEvents.QUIZ_PREVIOUS_CLICKED, {
          currentStep: (step + 1).toString(),
        });
        return step - 1;
      }
      return step;
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    if (isComplete(quizState)) {
      onSubmit({ ...quizState, arnoldLevel: 'full' });
    }
  };

  const handleQuestionChange = (value: string) => {
    const key = currentQuestion.id;
    setQuizState({ ...quizState, [key]: value });
    trackEvent(UmamiEvents.QUIZ_QUESTION_ANSWERED, {
      question: currentQuestion.id,
      answer: value,
      step: (currentStep + 1).toString(),
    });

    // Auto-advance to keep the flow snappy. The last step never auto-submits:
    // the big red button deserves a deliberate press.
    if (!isLastStep) {
      cancelPendingAdvance();
      advanceTimer.current = setTimeout(() => {
        advanceTimer.current = null;
        setCurrentStep((step) => Math.min(step + 1, questions.length - 1));
      }, AUTO_ADVANCE_MS);
    }
  };

  const currentAnswer = (quizState[currentQuestion.id] as string | undefined) || '';

  // Keyboard controls: 1-9 selects an option, arrows navigate.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;
      // Don't hijack keys when a modifier is held (browser shortcuts).
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const optionIndex = Number.parseInt(e.key, 10) - 1;
      if (
        !Number.isNaN(optionIndex) &&
        optionIndex >= 0 &&
        optionIndex < currentQuestion.options.length
      ) {
        e.preventDefault();
        handleQuestionChange(currentQuestion.options[optionIndex].value);
        return;
      }
      if (e.key === 'ArrowRight' && currentAnswer && !isLastStep) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        e.preventDefault();
        handlePrevious();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, currentAnswer, isLoading, isLastStep, isFirstStep, quizState]);

  return (
    <form onSubmit={handleSubmit} className="space-y-10 relative z-10" noValidate>
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm font-mono text-primary/80 uppercase tracking-wider">
          <span>
            {currentQuestion.hudLabel} — {currentStep + 1}/{questions.length}
          </span>
          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden border border-white/10">
          <div
            className="bg-primary h-full transition-all duration-300 ease-out shadow-[0_0_10px_var(--iamjarl-primary)]"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-panel p-8 md:p-10 space-y-8 min-h-[400px] flex flex-col rounded-2xl relative overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        <div className="flex-1 relative z-10">
          <QuizQuestion
            key={currentStep}
            question={currentQuestion.question}
            value={currentAnswer}
            onChange={handleQuestionChange}
            options={currentQuestion.options}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-white/10 relative z-10">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep || isLoading}
            className="px-6 py-3 font-mono text-sm tracking-widest uppercase transition-all bg-transparent border-white/20 hover:bg-white/10 text-white/70"
          >
            ← Back
          </Button>

          {isLastStep ? (
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !isComplete(quizState)}
              className="group relative overflow-hidden text-lg px-10 py-7 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,42,42,0.4)] hover:shadow-[0_0_30px_rgba(255,42,42,0.6)] transform hover:scale-[1.03] transition-all duration-300 disabled:opacity-50 border border-primary/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
              {isLoading ? 'Processing...' : 'REVEAL MY ARNOLD!'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading || !currentAnswer}
              className="px-8 py-3 bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest disabled:opacity-50 transition-all font-mono text-sm"
            >
              Next →
            </Button>
          )}
        </div>
      </div>

      {/* Keyboard hint — desktop only */}
      <p className="hidden md:block text-center font-mono text-xs text-white/30 uppercase tracking-widest">
        TIP: KEYS 1-4 TO ANSWER · ← → TO NAVIGATE
      </p>
    </form>
  );
}
