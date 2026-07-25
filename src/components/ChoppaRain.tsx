'use client';

import { useEffect } from 'react';

const CHOPPA_COUNT = 22;
const RAIN_DURATION_MS = 5000;

/**
 * Deterministic pseudo-random in [0, 1) — pure, so it satisfies the React
 * compiler and gives the same delightfully chaotic scatter every time.
 */
function scatter(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const CHOPPAS = Array.from({ length: CHOPPA_COUNT }, (_, i) => ({
  id: i,
  left: scatter(i) * 96,
  delaySec: scatter(i + 100) * 1.8,
  durationSec: 2 + scatter(i + 200) * 1.8,
  sizePx: 26 + Math.round(scatter(i + 300) * 34),
}));

type ChoppaRainProps = {
  /** Called when the rain has finished so the parent can unmount us. */
  onDone: () => void;
};

/**
 * Easter egg: helicopters raining down the screen with a big
 * "GET TO THE CHOPPA!!!" flash. Triggered by clicking the title three times.
 */
export function ChoppaRain({ onDone }: ChoppaRainProps) {
  useEffect(() => {
    const timeout = setTimeout(onDone, RAIN_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* The big flash */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="animate-choppa-flash text-4xl md:text-7xl font-black uppercase tracking-tighter text-white neon-text text-center px-4">
          GET TO THE CHOPPA!!!
        </span>
      </div>

      {/* Helicopter rain */}
      {CHOPPAS.map((c) => (
        <span
          key={c.id}
          className="absolute -top-16 animate-choppa-fall"
          style={{
            left: `${c.left}%`,
            fontSize: `${c.sizePx}px`,
            animationDelay: `${c.delaySec}s`,
            animationDuration: `${c.durationSec}s`,
          }}
        >
          🚁
        </span>
      ))}
    </div>
  );
}
