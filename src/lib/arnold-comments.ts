import type { ArnoldCommentContext } from '@/types/quiz';
import type { PersonaId } from '@/types/persona';

/**
 * Persona-specific opening phrases. One random phrase is picked per comment
 * to avoid repetition across multiple movie recommendations.
 */
const personaOpeners: Record<PersonaId, string[]> = {
  terminator: [
    'MISSION ACQUIRED.',
    'TARGET LOCKED.',
    'SYSTEMS ONLINE.',
    'NO EMOTION. ONLY OBJECTIVE.',
  ],
  commando: [
    'LET OFF SOME STEAM.',
    'HEAD EMPTY. HEART FULL.',
    'EXPLOSIONS INCOMING.',
    'PURE 80s POWER.',
  ],
  kindergartenCop: [
    "IT'S NOT A TUMOR.",
    'WHO IS YOUR DADDY?',
    'HEART OF GOLD ENGAGED.',
    'HUG FIRST. PUNCH LATER.',
  ],
  totalRecall: [
    'THIS MAY OR MAY NOT BE REAL.',
    'TRUST NOBODY. NOT EVEN YOURSELF.',
    'GET YOUR ASS TO MARS.',
    'CONSIDER EVERYTHING.',
  ],
  trueLies: [
    'TWO LIVES. ONE ARNOLD.',
    'CLASSIFIED CHARM.',
    'SECRET AGENT MODE.',
    'TANGO WITH DANGER.',
  ],
  mrFreeze: [
    "LET'S KICK SOME ICE.",
    'CHILL OUT.',
    'ICE TO SEE YOU.',
    'THE ICEMAN COMETH.',
  ],
};

/**
 * Pick an opener deterministically based on movie title hash so a refresh
 * gives the same comment for the same movie, but different movies get variety.
 */
function pickOpener(personaId: PersonaId, movieTitle: string): string {
  const openers = personaOpeners[personaId];
  const hash = movieTitle
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return openers[hash % openers.length];
}

export function getArnoldComment(ctx: ArnoldCommentContext): string {
  const { quiz, persona, movieTitle, voteAverage } = ctx;

  const parts: string[] = [pickOpener(persona, movieTitle)];

  // Keep a couple of quiz-state flavours to make it feel responsive
  if (quiz.energy === 'high') {
    parts.push('MAX EXPLOSIONS.');
  } else if (quiz.energy === 'low') {
    parts.push('SLOW BURN.');
  }

  if (quiz.mood === 'dark') {
    parts.push('DARKNESS ENGAGED.');
  } else if (quiz.mood === 'funny') {
    parts.push('LAUGHTER PROTOCOL.');
  }

  // Movie-specific: high-rated films get a tag
  const rating = voteAverage ? Math.round(voteAverage) : null;
  if (rating !== null && rating >= 8) {
    parts.push('TOP TIER.');
  }

  return `${parts.join(' ')} WATCH "${movieTitle.toUpperCase()}" NOW.`;
}
