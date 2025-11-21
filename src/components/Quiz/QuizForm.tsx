'use client';

import { useState } from 'react';
import type { QuizState, BrainLevel, EnergyLevel, Era, Mood } from '@/types/quiz';
import { QuizQuestion } from './QuizQuestion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type QuizFormProps = {
  onSubmit: (quizState: QuizState) => void;
  isLoading?: boolean;
};

const defaultState: QuizState = {
  brainLevel: 'medium',
  arnoldLevel: 'full', // Always Arnold movies
  energy: 'medium',
  era: 'any',
  mood: 'action',
};

export function QuizForm({ onSubmit, isLoading = false }: QuizFormProps) {
  const [quizState, setQuizState] = useState<QuizState>(defaultState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure arnoldLevel is always 'full'
    onSubmit({ ...quizState, arnoldLevel: 'full' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6 space-y-6">
        <QuizQuestion<BrainLevel>
          question="How much brain do you have left today?"
          value={quizState.brainLevel}
          onChange={(value) => setQuizState({ ...quizState, brainLevel: value })}
          options={[
            { value: 'low', label: 'Max one catchphrase per scene, please' },
            { value: 'medium', label: 'I can follow a decent plot thread' },
            { value: 'high', label: 'I\'m ready for something that requires brain power' },
          ]}
        />

        <QuizQuestion<EnergyLevel>
          question="How much explosion in your evening?"
          value={quizState.energy}
          onChange={(value) => setQuizState({ ...quizState, energy: value })}
          options={[
            { value: 'low', label: 'Slow / atmospheric' },
            { value: 'medium', label: 'Mixed tempo' },
            { value: 'high', label: 'Helicopters, explosions, screaming villains' },
          ]}
        />

        <QuizQuestion<Era>
          question="Era preference"
          value={quizState.era}
          onChange={(value) => setQuizState({ ...quizState, era: value })}
          options={[
            { value: '80s', label: 'VHS / nostalgia' },
            { value: '90s', label: 'Classic blockbuster' },
            { value: 'modern', label: 'Newer films' },
            { value: 'any', label: 'Don\'t care' },
          ]}
        />

        <QuizQuestion<Mood>
          question="Mood"
          value={quizState.mood}
          onChange={(value) => setQuizState({ ...quizState, mood: value })}
          options={[
            { value: 'funny', label: 'Comedy / self-aware action' },
            { value: 'action', label: 'Pure action / sci-fi' },
            { value: 'dark', label: 'A bit dark / thriller' },
          ]}
        />
      </Card>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="text-lg px-8 py-6 font-bold uppercase tracking-wider"
        >
          {isLoading ? 'Arnold is thinking...' : 'PUMP MY MOVIE!'}
        </Button>
      </div>
    </form>
  );
}

