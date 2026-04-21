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

export type Persona = {
  id: PersonaId;
  name: string;           // Display name: "Terminator Arnold"
  tagline: string;        // Short one-liner: "The Machine"
  description: string;    // 2-3 sentences of personality
  catchphrase: string;    // Iconic line
  emoji: string;          // Visual identifier
  /** TMDB movie IDs representative of this persona. */
  movieIds: number[];
};
