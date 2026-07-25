'use client';

import { useEffect, useState } from 'react';

type ScanLine = {
  text: string;
  status: string;
};

const SCAN_LINES: ScanLine[] = [
  { text: 'INITIALIZING ARNOLD.AI v4.2', status: 'ONLINE' },
  { text: 'SCANNING SUBJECT', status: 'HUMAN (PROBABLY)' },
  { text: 'MEASURING BICEP POTENTIAL', status: 'ABOVE AVERAGE' },
  { text: 'COUNTING AVAILABLE EXPLOSIONS', status: '847' },
  { text: 'ANALYZING ONE-LINER CAPACITY', status: 'DANGEROUS' },
  { text: 'CHECKING FOR SARAH CONNOR', status: 'NOT FOUND' },
  { text: 'LOCATING NEAREST CHOPPA', status: 'FOUND' },
  { text: 'CROSS-REFERENCING 40 YEARS OF ARNOLD', status: 'DONE' },
  { text: 'PERSONA MATCH', status: 'LOCKED' },
];

const LINE_INTERVAL_MS = 300;
const COMPLETE_DELAY_MS = 650;

type AnalysisSequenceProps = {
  /** Called once the full scan script has played out. */
  onComplete: () => void;
  /** When true, the sequence holds on the last line instead of completing. */
  holdAtEnd?: boolean;
};

/**
 * Terminator-style boot/scan sequence shown while the persona verdict is
 * "computed". Types out scan lines one by one, then signals completion.
 */
export function AnalysisSequence({ onComplete, holdAtEnd = false }: AnalysisSequenceProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((count) => {
        if (count >= SCAN_LINES.length) {
          clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, LINE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const done = visibleCount >= SCAN_LINES.length;

  useEffect(() => {
    if (!done || holdAtEnd) return;
    const timeout = setTimeout(onComplete, COMPLETE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [done, holdAtEnd, onComplete]);

  const progress = Math.round((visibleCount / SCAN_LINES.length) * 100);

  return (
    <div
      className="glass-panel rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-primary/20 shadow-2xl"
      role="status"
      aria-live="polite"
      aria-label="Analyzing your answers"
    >
      {/* Sweeping scanner beam */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/25 to-transparent h-10 w-full animate-scan z-0 opacity-50 blur-sm pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2 text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" aria-hidden></span>
            T-800 Vision — Subject Analysis
          </span>
          <span className="text-primary/70">{progress}%</span>
        </div>

        <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden border border-white/10">
          <div
            className="bg-primary h-full transition-all duration-300 ease-out shadow-[0_0_10px_var(--iamjarl-primary)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="font-mono text-sm md:text-base space-y-2 min-h-[280px]">
          {SCAN_LINES.slice(0, visibleCount).map((line, i) => {
            const isLast = i === SCAN_LINES.length - 1;
            return (
              <div
                key={line.text}
                className={`flex justify-between gap-4 ${
                  isLast ? 'text-primary font-bold text-base md:text-lg pt-2' : 'text-white/70'
                }`}
              >
                <span>
                  <span className="text-primary/60 mr-2" aria-hidden>
                    &gt;
                  </span>
                  {line.text}
                  {'.'.repeat(3)}
                </span>
                <span className={isLast ? 'text-primary' : 'text-primary/80'}>
                  [{line.status}]
                </span>
              </div>
            );
          })}
          <span
            className="inline-block w-3 h-4 bg-primary animate-caret-blink align-middle"
            aria-hidden
          ></span>
        </div>

        {done && holdAtEnd && (
          <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
            Waiting for TMDB uplink...
          </p>
        )}
      </div>
    </div>
  );
}
