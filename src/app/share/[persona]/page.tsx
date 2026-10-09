import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PersonaId, PersonaStats } from '@/types/persona';
import { getPersona, personas } from '@/lib/personas';
import { SHARE_CARD_SIZE } from '@/lib/share-card';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gettothemovie.iamjarl.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(personas).map((persona) => ({ persona }));
}

type SharePageProps = {
  params: Promise<{ persona: string }>;
};

function isPersonaId(id: string): id is PersonaId {
  return id in personas;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { persona: id } = await params;
  if (!isPersonaId(id)) return {};
  const persona = getPersona(id);

  const title = `I'm ${persona.name} — ${persona.tagline}`;
  const description = `${persona.description} Which Arnold are YOU? Take the free 7-question quiz.`;
  const url = `${baseUrl}/share/${persona.id}`;
  const image = {
    url: `${baseUrl}/share/${persona.id}/card.png`,
    ...SHARE_CARD_SIZE,
    alt: `${persona.name}: ${persona.tagline}. "${persona.catchphrase}"`,
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Get to the Movie!',
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@iamjarl',
      images: [image.url],
    },
  };
}

const STAT_LABELS: Array<{ key: keyof PersonaStats; label: string }> = [
  { key: 'brains', label: 'BRAINS' },
  { key: 'boom', label: 'BOOM' },
  { key: 'heart', label: 'HEART' },
  { key: 'camp', label: 'CAMP' },
  { key: 'oneLiners', label: 'ONE-LINERS' },
];

export default async function SharePage({ params }: SharePageProps) {
  const { persona: id } = await params;
  if (!isPersonaId(id)) notFound();
  const persona = getPersona(id);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="crt-overlay fixed inset-0 z-40 pointer-events-none" aria-hidden></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none animate-pulse-glow"></div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-3xl space-y-10">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-primary/80">
          {'// INCOMING TRANSMISSION'}
        </p>

        <div className="glass-panel rounded-2xl p-8 md:p-12 text-center space-y-6 border-white/10">
          <p className="font-mono text-sm uppercase tracking-widest text-white/60">
            Someone just got matched as
          </p>
          <div className="text-7xl md:text-8xl" aria-hidden>
            {persona.emoji}
          </div>
          <h1 className="animate-glitch text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
            {persona.name}
          </h1>
          <p className="text-lg md:text-xl text-primary/90 font-semibold uppercase tracking-wider">
            {persona.tagline}
          </p>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {persona.description}
          </p>

          <div className="max-w-md mx-auto space-y-3 text-left pt-2">
            {STAT_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-4">
                <span className="w-28 shrink-0 font-mono text-xs uppercase tracking-widest text-white/60">
                  {label}
                </span>
                <div className="flex-1 h-2.5 bg-black/50 rounded-full border border-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_8px_var(--iamjarl-primary)]"
                    style={{ width: `${persona.stats[key]}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-xs text-primary/80">
                  {persona.stats[key]}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xl md:text-2xl font-bold text-white italic pt-2">
            &ldquo;{persona.catchphrase}&rdquo;
          </p>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            Which Arnold are <span className="text-primary">you</span>?
          </h2>
          <Link
            href="/"
            className="inline-block px-10 py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-lg transition-all uppercase tracking-widest shadow-lg shadow-primary/50 hover:shadow-xl transform hover:scale-105"
          >
            Take the quiz →
          </Link>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40">
            7 questions · under 90 seconds · free
          </p>
        </div>
      </div>
    </main>
  );
}
