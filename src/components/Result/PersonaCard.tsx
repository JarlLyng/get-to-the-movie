'use client';

import type { PersonaMatch } from '@/types/quiz';
import { getPersona } from '@/lib/personas';

type PersonaCardProps = {
  match: PersonaMatch;
};

export function PersonaCard({ match }: PersonaCardProps) {
  const persona = getPersona(match.personaId);
  const runnerUp = getPersona(match.runnerUp);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden relative p-0 border-white/10">
      {/* Cinematic edge lighting */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none"></div>

      <div className="relative z-10 p-8 md:p-12 text-center space-y-6">
        <div className="font-mono text-xs text-primary/70 uppercase tracking-widest">
          {'// ARNOLD.AI IDENTITY REVEAL'}
        </div>

        <div className="text-7xl md:text-8xl" aria-hidden>
          {persona.emoji}
        </div>

        <div className="space-y-2">
          <p className="text-sm md:text-base text-white/60 uppercase tracking-widest font-mono">
            You are
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white">
            {persona.name}
          </h2>
          <p className="text-lg md:text-xl text-primary/90 font-semibold uppercase tracking-wider">
            {persona.tagline}
          </p>
        </div>

        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          {persona.description}
        </p>

        <div className="pt-4 max-w-2xl mx-auto">
          <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-5xl font-serif">&quot;</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white italic leading-relaxed relative z-10">
              &quot;{persona.catchphrase}&quot;
            </p>
            <div className="mt-2 text-primary/70 font-mono text-xs uppercase tracking-widest">
              {'// SIGNATURE LINE'}
            </div>
          </div>
        </div>

        {match.reasons.length > 0 && (
          <div className="pt-2 max-w-2xl mx-auto text-left">
            <h3 className="text-sm font-mono uppercase tracking-widest text-primary/80 mb-3">
              Why this result
            </h3>
            <ul className="space-y-2 text-white/70 text-sm md:text-base">
              {match.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <span className="text-primary mt-1" aria-hidden>
                    ▸
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 text-sm text-white/50 font-mono uppercase tracking-widest">
          Runner-up:{' '}
          <span className="text-white/70">
            {runnerUp.emoji} {runnerUp.name}
          </span>
        </div>
      </div>
    </div>
  );
}
