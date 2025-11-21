'use client';

import { useState } from 'react';
import type { QuizState, BrainLevel, ArnoldLevel, EnergyLevel, Era, Mood } from '@/types/quiz';
import { QuizQuestion } from './QuizQuestion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type QuizFormProps = {
  onSubmit: (quizState: QuizState) => void;
  isLoading?: boolean;
};

const defaultState: QuizState = {
  brainLevel: 'medium',
  arnoldLevel: 'medium',
  energy: 'medium',
  era: 'any',
  mood: 'action',
};

export function QuizForm({ onSubmit, isLoading = false }: QuizFormProps) {
  const [quizState, setQuizState] = useState<QuizState>(defaultState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(quizState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6 space-y-6">
        <QuizQuestion<BrainLevel>
          question="Hvor meget hjerne har du tilbage i dag?"
          value={quizState.brainLevel}
          onChange={(value) => setQuizState({ ...quizState, brainLevel: value })}
          options={[
            { value: 'low', label: 'Max én catchphrase per scene, tak' },
            { value: 'medium', label: 'Jeg kan godt følge en nogenlunde plottråd' },
            { value: 'high', label: 'Jeg er klar til noget der kræver hjerne' },
          ]}
        />

        <QuizQuestion<ArnoldLevel>
          question="Hvor meget Arnold vil du have på skærmen?"
          value={quizState.arnoldLevel}
          onChange={(value) => setQuizState({ ...quizState, arnoldLevel: value })}
          options={[
            { value: 'none', label: 'Ingen Arnold på skærmen, kun som "ånd"' },
            { value: 'medium', label: 'Arnold-vibe film (80\'er/90\'er action, sci-fi, etc.)' },
            { value: 'full', label: 'Kun Arnold-film, ellers glem det' },
          ]}
        />

        <QuizQuestion<EnergyLevel>
          question="Hvor meget eksplosion i din aften?"
          value={quizState.energy}
          onChange={(value) => setQuizState({ ...quizState, energy: value })}
          options={[
            { value: 'low', label: 'Langsom / stemningsfuld' },
            { value: 'medium', label: 'Blandet tempo' },
            { value: 'high', label: 'Helikopter, eksplosioner, skrigende skurke' },
          ]}
        />

        <QuizQuestion<Era>
          question="Era preference"
          value={quizState.era}
          onChange={(value) => setQuizState({ ...quizState, era: value })}
          options={[
            { value: '80s', label: 'VHS/nostalgi' },
            { value: '90s', label: 'Klassisk blockbuster' },
            { value: 'modern', label: 'Nyere film' },
            { value: 'any', label: 'Ligeglad' },
          ]}
        />

        <QuizQuestion<Mood>
          question="Mood"
          value={quizState.mood}
          onChange={(value) => setQuizState({ ...quizState, mood: value })}
          options={[
            { value: 'funny', label: 'Comedy / self-aware action' },
            { value: 'action', label: 'Ren action / sci-fi' },
            { value: 'dark', label: 'Lidt dystert / thriller' },
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
          {isLoading ? 'Arnold tænker...' : 'PUMP MY MOVIE!'}
        </Button>
      </div>
    </form>
  );
}

