import type { ArnoldCommentContext } from '@/types/quiz';

export function getArnoldComment(ctx: ArnoldCommentContext): string {
  const { quiz, movieTitle, year, voteAverage } = ctx;
  
  const comments: string[] = [];
  
  // Brain level comments
  if (quiz.brainLevel === 'low') {
    comments.push('BRAIN OFF.');
  } else if (quiz.brainLevel === 'high') {
    comments.push('USE YOUR BRAIN.');
  }
  
  // Arnold level comments
  if (quiz.arnoldLevel === 'full') {
    comments.push('PURE ARNOLD POWER.');
  } else if (quiz.arnoldLevel === 'medium') {
    comments.push('ARNOLD VIBES.');
  } else {
    comments.push('NO ARNOLD, BUT STILL PUMPED.');
  }
  
  // Energy level comments
  if (quiz.energy === 'high') {
    comments.push('EXPLOSIONS ON.');
  } else if (quiz.energy === 'low') {
    comments.push('CHILL MODE.');
  }
  
  // Era comments
  if (quiz.era === '80s') {
    comments.push('NOSTALGIA MAX.');
  } else if (quiz.era === '90s') {
    comments.push('CLASSIC BLOCKBUSTER.');
  }
  
  // Mood comments
  if (quiz.mood === 'action') {
    comments.push('ACTION TIME.');
  } else if (quiz.mood === 'funny') {
    comments.push('LAUGH MODE.');
  } else if (quiz.mood === 'dark') {
    comments.push('DARK VIBES.');
  }
  
  // Movie-specific comment
  const rating = voteAverage ? Math.round(voteAverage) : null;
  if (rating && rating >= 8) {
    comments.push('TOP TIER MOVIE.');
  }
  
  // Combine comments
  const baseComment = comments.length > 0 
    ? comments.join(' ') 
    : 'GET PUMPED.';
  
  return `${baseComment} WATCH "${movieTitle.toUpperCase()}" NOW.`;
}

