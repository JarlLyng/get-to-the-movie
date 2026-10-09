'use client';

import { useState } from 'react';
import type { PersonaMatch } from '@/types/quiz';
import type { PersonaStats } from '@/types/persona';
import { getPersona } from '@/lib/personas';
import { trackEvent, UmamiEvents } from '@/lib/umami';

type PersonaCardProps = {
  match: PersonaMatch;
};

const SITE_URL = 'https://gettothemovie.iamjarl.com';

const STAT_LABELS: Array<{ key: keyof PersonaStats; label: string }> = [
  { key: 'brains', label: 'BRAINS' },
  { key: 'boom', label: 'BOOM' },
  { key: 'heart', label: 'HEART' },
  { key: 'camp', label: 'CAMP' },
  { key: 'oneLiners', label: 'ONE-LINERS' },
];

/** Staggered entrance helper — tw-animate-css `animate-in` + delay. */
function enter(delayMs: number) {
  return {
    className: 'animate-in fade-in slide-in-from-bottom-3 duration-500',
    style: { animationDelay: `${delayMs}ms`, animationFillMode: 'both' as const },
  };
}

export function PersonaCard({ match }: PersonaCardProps) {
  const persona = getPersona(match.personaId);
  const runnerUp = getPersona(match.runnerUp);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `I got ${persona.name.toUpperCase()} ${persona.emoji} — ${persona.tagline} (${match.matchPercent}% match). Which Arnold are YOU?`;
    trackEvent(UmamiEvents.RESULT_SHARED, { persona: persona.id });

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Get to the Movie!', text, url: SITE_URL });
        return;
      } catch {
        // User cancelled the share sheet — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${SITE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing more we can do.
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden relative p-0 border-white/10">
      {/* Cinematic edge lighting */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none"></div>

      <div className="relative z-10 p-8 md:p-12 text-center space-y-6">
        <div
          {...enter(0)}
          className={`${enter(0).className} flex items-center justify-between font-mono text-xs uppercase tracking-widest`}
        >
          <span className="text-primary/70">{'// ARNOLD.AI IDENTITY REVEAL'}</span>
          <span className="text-primary font-bold border border-primary/40 rounded px-2 py-1 bg-primary/10">
            {match.matchPercent}% MATCH
          </span>
        </div>

        <div {...enter(150)}>
          <div className="text-7xl md:text-8xl" aria-hidden>
            {persona.emoji}
          </div>
        </div>

        <div {...enter(300)}>
          <div className="space-y-2">
            <p className="text-sm md:text-base text-white/60 uppercase tracking-widest font-mono">
              You are
            </p>
            <h2 className="animate-glitch text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
              {persona.name}
            </h2>
            <p className="text-lg md:text-xl text-primary/90 font-semibold uppercase tracking-wider">
              {persona.tagline}
            </p>
          </div>
        </div>

        <div {...enter(450)}>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {persona.description}
          </p>
        </div>

        {/* HUD attribute bars */}
        <div {...enter(600)}>
          <div className="max-w-xl mx-auto pt-2 space-y-3 text-left">
            <h3 className="text-sm font-mono uppercase tracking-widest text-primary/80">
              Subject Attributes
            </h3>
            {STAT_LABELS.map(({ key, label }, i) => (
              <div key={key} className="flex items-center gap-4">
                <span className="w-28 shrink-0 font-mono text-xs uppercase tracking-widest text-white/60">
                  {label}
                </span>
                <div className="flex-1 h-2.5 bg-black/50 rounded-full border border-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary origin-left animate-barfill shadow-[0_0_8px_var(--iamjarl-primary)]"
                    style={{
                      width: `${persona.stats[key]}%`,
                      animationDelay: `${700 + i * 120}ms`,
                    }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-xs text-primary/80">
                  {persona.stats[key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div {...enter(750)}>
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
        </div>

        {match.reasons.length > 0 && (
          <div {...enter(900)}>
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
          </div>
        )}

        <div {...enter(1050)}>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleShare}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-md transition-all text-sm uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transform hover:scale-105 cursor-pointer"
              aria-label="Share your Arnold persona result"
            >
              {copied ? 'COPIED TO CLIPBOARD!' : 'SHARE YOUR ARNOLD ➤'}
            </button>
            <span className="text-sm text-white/50 font-mono uppercase tracking-widest">
              Runner-up:{' '}
              <span className="text-white/70">
                {runnerUp.emoji} {runnerUp.name}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
