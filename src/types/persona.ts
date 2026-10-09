/**
 * Arnold Schwarzenegger persona archetypes.
 * Each persona represents a distinct side of Arnold's career.
 */

export type PersonaId =
  | 'terminator'
  | 'commando'
  | 'kindergartenCop'
  | 'totalRecall'
  | 'trueLies'
  | 'mrFreeze';

/**
 * Persona attribute ratings (0-100) shown as animated HUD bars
 * on the result card.
 */
export type PersonaStats = {
  brains: number;
  boom: number;
  heart: number;
  camp: number;
  oneLiners: number;
};

export type Persona = {
  id: PersonaId;
  name: string;           // Display name: "Terminator Arnold"
  tagline: string;        // Short one-liner: "The Machine"
  description: string;    // 2-3 sentences of personality
  catchphrase: string;    // Iconic line
  emoji: string;          // Visual identifier
  /** HUD attribute bars (0-100). */
  stats: PersonaStats;
  /** TMDB movie IDs representative of this persona. */
  movieIds: number[];
};
