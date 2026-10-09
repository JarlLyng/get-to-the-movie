import type { ArnoldCommentContext } from '@/types/quiz';
import type { PersonaId } from '@/types/persona';

/**
 * Persona-specific comment templates. `{TITLE}` is replaced with the movie
 * title (uppercased). One template is picked deterministically per movie so a
 * refresh gives the same comment, but different movies get variety.
 */
const personaComments: Record<PersonaId, string[]> = {
  terminator: [
    'MY CPU RAN 4 MILLION SIMULATIONS. IN EVERY SINGLE ONE, YOU WATCH "{TITLE}". RESISTANCE IS POINTLESS.',
    'TARGET LOCKED: "{TITLE}". POPCORN ACQUISITION IS NOT OPTIONAL. IT IS MISSION CRITICAL.',
    'I HAVE DETAILED FILES ON HUMAN ENTERTAINMENT. "{TITLE}" IS THE OPTIMAL CHOICE. TRUST THE MACHINE.',
    'SKYNET SPENT BILLIONS ON AI. THE ANSWER WAS ALWAYS "{TITLE}". WATCH IT, OR I WILL BE BACK.',
    'YOUR MISSION PARAMETERS ARE CLEAR: COUCH. BLANKET. "{TITLE}". FAILURE IS NOT AN OPTION.',
  ],
  commando: [
    'I EAT GREEN BERETS FOR BREAKFAST. AND TONIGHT, I AM HAVING "{TITLE}" FOR DINNER.',
    '"{TITLE}" HAS MORE EXPLOSIONS PER MINUTE THAN YOUR SMOKE DETECTOR CAN HANDLE. PERFECT.',
    'REMEMBER WHEN I PROMISED TO WATCH "{TITLE}" LAST? I LIED. WATCH IT FIRST.',
    'DO NOT THINK. THINKING IS FOR SEQUELS. JUST PRESS PLAY ON "{TITLE}" AND LET OFF SOME STEAM.',
    'CARRYING A LOG UPHILL IS CARDIO. WATCHING "{TITLE}" IS LEG DAY FOR YOUR EYEBALLS.',
  ],
  kindergartenCop: [
    'STOP WHINING! YOU WILL WATCH "{TITLE}" WITH THE PEOPLE YOU LOVE, AND YOU WILL ENJOY IT.',
    '"{TITLE}" IS NOT A TUMOR. IT IS A CERTIFIED HUG IN MOVIE FORM. WHO IS YOUR MOVIE DADDY?',
    'I AM A COP, YOU IDIOT! AND I AM ORDERING YOU TO WATCH "{TITLE}" UNDER A COZY BLANKET.',
    'BIG MUSCLES. BIGGER FEELINGS. "{TITLE}" WILL MAKE YOU CRY, AND THAT IS OK. IT IS THE LAW.',
    'PUT THE COOKIE DOWN — ACTUALLY NO, KEEP THE COOKIE. YOU WILL NEED IT FOR "{TITLE}".',
  ],
  totalRecall: [
    'IS "{TITLE}" REAL, OR IS IT AN IMPLANTED MEMORY? ONLY ONE WAY TO FIND OUT. PRESS PLAY.',
    'IF YOU REMEMBER WATCHING "{TITLE}", DID YOU REALLY WATCH IT? WATCH IT AGAIN. FOR SCIENCE.',
    'YOUR WHOLE LIFE MIGHT BE A SIMULATION. BUT "{TITLE}" ON YOUR SCREEN TONIGHT? THAT IS REAL.',
    'GET YOUR ASS TO THE SOFA. "{TITLE}" CONTAINS AT LEAST THREE PLOT TWISTS AND ONE MARS.',
    'TRUST NOBODY. NOT ME. NOT YOURSELF. TRUST ONLY "{TITLE}". THE ALGORITHM HAS SPOKEN.',
  ],
  trueLies: [
    'OFFICIALLY, TONIGHT YOU ARE DOING LAUNDRY. UNOFFICIALLY, YOU ARE WATCHING "{TITLE}". CLASSIFIED.',
    '"{TITLE}": HELICOPTERS, TUXEDOS, AND AT LEAST ONE EXPLOSION AT SUNSET. VERY SOPHISTICATED.',
    'I LIVE TWO LIVES. IN BOTH OF THEM, "{TITLE}" IS ON THE WATCHLIST. THAT IS NOT A COINCIDENCE.',
    'YOUR MISSION, SHOULD YOU ACCEPT IT: "{TITLE}", A DRINK WITH AN UMBRELLA, AND ZERO REGRETS.',
    'FIRST THE CHARM. THEN THE EXPLOSIONS. "{TITLE}" DELIVERS BOTH. YOU ARE WELCOME.',
  ],
  mrFreeze: [
    'THE FORECAST FOR TONIGHT? "{TITLE}" WITH A 100% CHANCE OF PUNS. ICE TO SEE YOU COMMITTED.',
    'EVERYBODY CHILL! "{TITLE}" IS ON. THE PUNS ARE CRIMINAL. THE ENTERTAINMENT IS NOT.',
    'ALLOW ME TO BREAK THE ICE: "{TITLE}" IS SO CAMP IT NEEDS A TENT. WATCH IT PROUDLY.',
    'WHAT KILLED THE DINOSAURS? NOT WATCHING "{TITLE}". LEARN FROM HISTORY.',
    'COOL PARTY. YOU KNOW WHAT WOULD MAKE IT COOLER? "{TITLE}". LET\'S KICK SOME ICE.',
  ],
};

/**
 * Quiz-flavored tag lines appended to the end of comments for extra spice.
 */
function flavorTag(ctx: ArnoldCommentContext): string | null {
  const { quiz, voteAverage } = ctx;
  const rating = voteAverage ? Math.round(voteAverage) : null;

  if (rating !== null && rating >= 8) return 'CRITICS AGREE. CRITICS ARE AFRAID TO DISAGREE.';
  if (quiz.energy === 'high') return 'MAXIMUM EXPLOSIONS GUARANTEED.';
  if (quiz.brainLevel === 'low') return 'NO BRAIN REQUIRED. BRING SNACKS INSTEAD.';
  if (quiz.mood === 'dark') return 'BRING A NIGHTLIGHT. OR DON\'T. YOUR CALL.';
  return null;
}

/**
 * Deterministic pick based on movie title hash so a refresh gives the same
 * comment for the same movie, but different movies get variety.
 */
function pickComment(personaId: PersonaId, movieTitle: string): string {
  const pool = personaComments[personaId];
  const hash = movieTitle
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

export function getArnoldComment(ctx: ArnoldCommentContext): string {
  const { persona, movieTitle } = ctx;

  const comment = pickComment(persona, movieTitle).replaceAll(
    '{TITLE}',
    movieTitle.toUpperCase()
  );

  const tag = flavorTag(ctx);
  return tag ? `${comment} ${tag}` : comment;
}
