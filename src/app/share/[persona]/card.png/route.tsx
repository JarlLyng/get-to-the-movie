import { notFound } from 'next/navigation';
import type { PersonaId } from '@/types/persona';
import { personas } from '@/lib/personas';
import { renderShareCard } from '@/lib/share-card';

// Pre-rendered at build time so it works with the static GitHub Pages export.
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(personas).map((persona) => ({ persona }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ persona: string }> }
) {
  const { persona: id } = await params;
  const persona = personas[id as PersonaId];
  if (!persona) notFound();
  return renderShareCard(persona);
}
