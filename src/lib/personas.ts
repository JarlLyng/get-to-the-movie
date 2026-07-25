import type { Persona, PersonaId } from '@/types/persona';
import type {
  QuizState,
  BrainLevel,
  EnergyLevel,
  Era,
  Mood,
  DecisionStyle,
  WorkoutVibe,
  CatchphraseEnergy,
  PersonaMatch,
} from '@/types/quiz';

/**
 * Persona definitions with display data and representative movies.
 *
 * Movie IDs are TMDB IDs. To verify a movie ID, visit:
 *   https://www.themoviedb.org/movie/{id}
 * IDs verified against TMDB on 2026-04-21.
 *
 * If you add new movies: confirm Arnold is in the cast on the TMDB page,
 * not just that the ID resolves to a movie.
 */
export const personas: Record<PersonaId, Persona> = {
  terminator: {
    id: 'terminator',
    name: 'Terminator Arnold',
    tagline: 'The Machine',
    description:
      'Cold precision. Zero wasted motion. You have a target and a timeline, and the only emotion allowed is relentless forward momentum. Nothing personal — just mission parameters.',
    catchphrase: "I'll be back.",
    emoji: '🤖',
    stats: { brains: 85, boom: 90, heart: 10, camp: 20, oneLiners: 95 },
    movieIds: [
      218,    // The Terminator (1984)
      280,    // Terminator 2: Judgment Day (1991)
      296,    // Terminator 3: Rise of the Machines (2003)
      87101,  // Terminator Genisys (2015)
      290859, // Terminator: Dark Fate (2019)
    ],
  },
  commando: {
    id: 'commando',
    name: 'Commando Arnold',
    tagline: 'Pure 80s Firepower',
    description:
      'Head empty, muscles full. You are a walking explosion in a tank top. Subtlety is for people who have not yet tried kicking down the door.',
    catchphrase: "Let off some steam, Bennett.",
    emoji: '💥',
    stats: { brains: 15, boom: 100, heart: 40, camp: 60, oneLiners: 90 },
    movieIds: [
      10999, // Commando (1985)
      2099,  // Raw Deal (1986)
      9604,  // Red Heat (1988)
      865,   // The Running Man (1987)
      9268,  // Eraser (1996)
      106,   // Predator (1987)
      9387,  // Conan the Barbarian (1982)
    ],
  },
  kindergartenCop: {
    id: 'kindergartenCop',
    name: 'Kindergarten Cop Arnold',
    tagline: 'Heart of Gold',
    description:
      'Big muscles, bigger heart. Dad energy with a holster. You could snap a spine but instead you would rather read bedtime stories and wear ugly sweaters.',
    catchphrase: "It's not a tumor!",
    emoji: '👶',
    stats: { brains: 55, boom: 35, heart: 100, camp: 55, oneLiners: 70 },
    movieIds: [
      951,  // Kindergarten Cop (1990)
      9279, // Jingle All the Way (1996)
      6280, // Junior (1994)
      9493, // Twins (1988)
    ],
  },
  totalRecall: {
    id: 'totalRecall',
    name: 'Total Recall Arnold',
    tagline: 'The Paranoid Thinker',
    description:
      'Is this even real? You question every memory, every shadow, every handshake. The answer is always "blow it up and ask questions later" — but thoughtfully.',
    catchphrase: 'Get your ass to Mars.',
    emoji: '🧠',
    stats: { brains: 100, boom: 75, heart: 35, camp: 40, oneLiners: 65 },
    movieIds: [
      861,  // Total Recall (1990)
      8452, // The 6th Day (2000)
      9946, // End of Days (1999)
      106,  // Predator (1987) — the paranoid jungle classic
    ],
  },
  trueLies: {
    id: 'trueLies',
    name: 'True Lies Arnold',
    tagline: 'The Smooth Operator',
    description:
      'Secret agent at work, family man at home, charm offensive everywhere. You live two lives, both stylish, both involving at least one helicopter explosion.',
    catchphrase: 'You are fired.',
    emoji: '🕶️',
    stats: { brains: 70, boom: 80, heart: 65, camp: 50, oneLiners: 75 },
    movieIds: [
      36955, // True Lies (1994)
      9593,  // Last Action Hero (1993)
      9884,  // Collateral Damage (2002)
    ],
  },
  mrFreeze: {
    id: 'mrFreeze',
    name: 'Mr. Freeze Arnold',
    tagline: 'The Camp King',
    description:
      'Every sentence a pun. Every pun a crime against screenwriting. You embrace the chaos, deliver it with a straight face, and refuse to apologize.',
    catchphrase: "Let's kick some ice!",
    emoji: '❄️',
    stats: { brains: 40, boom: 45, heart: 30, camp: 100, oneLiners: 100 },
    movieIds: [
      415,  // Batman & Robin (1997)
      5227, // Hercules in New York (1970)
      9279, // Jingle All the Way (1996)
      9593, // Last Action Hero (1993)
    ],
  },
};

/**
 * Signature defines preferred quiz answers per persona.
 * Values are positive weights — higher means stronger match.
 * Missing answers score 0 (neutral).
 */
type PersonaSignature = {
  brainLevel: Partial<Record<BrainLevel, number>>;
  energy: Partial<Record<EnergyLevel, number>>;
  era: Partial<Record<Era, number>>;
  mood: Partial<Record<Mood, number>>;
  decisionStyle: Partial<Record<DecisionStyle, number>>;
  workoutVibe: Partial<Record<WorkoutVibe, number>>;
  catchphraseEnergy: Partial<Record<CatchphraseEnergy, number>>;
};

const signatures: Record<PersonaId, PersonaSignature> = {
  terminator: {
    brainLevel: { high: 2, medium: 1 },
    energy: { high: 2, medium: 1 },
    era: { '80s': 1, '90s': 1, any: 1 },
    mood: { dark: 2, action: 1 },
    decisionStyle: { analysis: 2 },
    workoutVibe: { pumpIron: 2 },
    catchphraseEnergy: { oneLiner: 2 },
  },
  commando: {
    brainLevel: { low: 2, medium: 1 },
    energy: { high: 3 },
    era: { '80s': 3 },
    mood: { action: 3 },
    decisionStyle: { gut: 2 },
    workoutVibe: { pumpIron: 2 },
    catchphraseEnergy: { oneLiner: 2 },
  },
  kindergartenCop: {
    brainLevel: { medium: 2 },
    energy: { medium: 2, low: 1 },
    era: { '90s': 2 },
    mood: { funny: 3 },
    decisionStyle: { gut: 2, vibes: 1 },
    workoutVibe: { chill: 1, pumpIron: 1 },
    catchphraseEnergy: { speech: 2 },
  },
  totalRecall: {
    brainLevel: { high: 3 },
    energy: { medium: 1, high: 1 },
    era: { '90s': 2, modern: 1, any: 1 },
    mood: { dark: 2, action: 1 },
    decisionStyle: { analysis: 2 },
    workoutVibe: { cardio: 1, pumpIron: 1 },
    catchphraseEnergy: { silence: 2, oneLiner: 1 },
  },
  trueLies: {
    brainLevel: { medium: 2, high: 1 },
    energy: { medium: 1, high: 1 },
    era: { '90s': 3 },
    mood: { funny: 1, action: 2 },
    decisionStyle: { vibes: 2 },
    workoutVibe: { cardio: 2, pumpIron: 1 },
    catchphraseEnergy: { speech: 2 },
  },
  mrFreeze: {
    brainLevel: { medium: 1, low: 1 },
    energy: { low: 2, medium: 1 },
    era: { '90s': 2, modern: 1 },
    mood: { funny: 3 },
    decisionStyle: { vibes: 2 },
    workoutVibe: { chill: 2 },
    catchphraseEnergy: { oneLiner: 2 },
  },
};

/**
 * Human-readable reason strings per quiz dimension answer.
 * Used in the "Why this result" explanation UI.
 */
const reasonStrings: Record<string, string> = {
  'brainLevel:low': 'You chose brain OFF — pure instinct mode',
  'brainLevel:medium': 'You balance brain with brawn',
  'brainLevel:high': 'You bring brain power to action',
  'energy:low': 'You like things slow-burn',
  'energy:medium': 'You pace yourself',
  'energy:high': 'You want maximum explosions',
  'era:80s': 'You are tuned to 80s VHS nostalgia',
  'era:90s': 'You prefer 90s blockbusters',
  'era:modern': 'You lean toward modern releases',
  'era:any': 'Era does not matter to you',
  'mood:funny': 'You want laughs with your muscle',
  'mood:action': 'You want pure action',
  'mood:dark': 'You want dark and thrilling',
  'decisionStyle:gut': 'You decide from the gut',
  'decisionStyle:analysis': 'You analyze first, act second',
  'decisionStyle:vibes': 'You go by vibes',
  'workoutVibe:pumpIron': 'You pump iron',
  'workoutVibe:cardio': 'You stay mobile',
  'workoutVibe:chill': 'You skip the gym',
  'catchphraseEnergy:oneLiner': 'Your power is in the one-liner',
  'catchphraseEnergy:speech': 'You move people with speeches',
  'catchphraseEnergy:silence': 'You let the silence speak',
};

/**
 * Match a quiz result to the best-fit Arnold persona.
 * Returns the winning persona, runner-up, and reasons for the match.
 */
export function matchPersona(quiz: QuizState): PersonaMatch {
  const scores: Record<PersonaId, number> = {
    terminator: 0,
    commando: 0,
    kindergartenCop: 0,
    totalRecall: 0,
    trueLies: 0,
    mrFreeze: 0,
  };

  const dimensions: Array<keyof PersonaSignature> = [
    'brainLevel',
    'energy',
    'era',
    'mood',
    'decisionStyle',
    'workoutVibe',
    'catchphraseEnergy',
  ];

  // Map quiz state keys to signature keys
  const quizAnswers: Record<keyof PersonaSignature, string> = {
    brainLevel: quiz.brainLevel,
    energy: quiz.energy,
    era: quiz.era,
    mood: quiz.mood,
    decisionStyle: quiz.decisionStyle,
    workoutVibe: quiz.workoutVibe,
    catchphraseEnergy: quiz.catchphraseEnergy,
  };

  for (const [personaId, sig] of Object.entries(signatures) as Array<
    [PersonaId, PersonaSignature]
  >) {
    for (const dim of dimensions) {
      const answer = quizAnswers[dim];
      const dimSig = sig[dim] as Record<string, number>;
      scores[personaId] += dimSig[answer] ?? 0;
    }
  }

  // Sort personas by score descending
  const sorted = (Object.entries(scores) as Array<[PersonaId, number]>).sort(
    ([, a], [, b]) => b - a
  );

  const [winnerId, winnerScore] = sorted[0];
  const [runnerUpId] = sorted[1];

  // Build reason list: dimensions where the winner has the highest weight for this answer
  const winnerSig = signatures[winnerId];

  // Match percentage: winner score relative to that persona's best possible score.
  const maxPossible = dimensions.reduce((sum, dim) => {
    const weights = Object.values(winnerSig[dim] as Record<string, number>);
    return sum + (weights.length > 0 ? Math.max(...weights) : 0);
  }, 0);
  const matchPercent =
    maxPossible > 0
      ? Math.min(100, Math.round((winnerScore / maxPossible) * 100))
      : 0;

  const reasons: string[] = [];
  for (const dim of dimensions) {
    const answer = quizAnswers[dim];
    const weight = (winnerSig[dim] as Record<string, number>)[answer] ?? 0;
    if (weight >= 2) {
      const reason = reasonStrings[`${dim}:${answer}`];
      if (reason) reasons.push(reason);
    }
  }

  return {
    personaId: winnerId,
    score: winnerScore,
    matchPercent,
    runnerUp: runnerUpId,
    reasons: reasons.slice(0, 4), // Cap at 4 for readability
  };
}

/**
 * Get the persona object by ID.
 */
export function getPersona(id: PersonaId): Persona {
  return personas[id];
}

/**
 * List all personas (useful for structured data / SEO).
 */
export function listPersonas(): Persona[] {
  return Object.values(personas);
}
