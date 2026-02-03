// Fallback clues when AI fails

// Generic clues that could work for many topics (for impostors)
const GENERIC_CLUES = [
  'interesting',
  'unique',
  'special',
  'common',
  'popular',
  'famous',
  'typical',
  'classic',
  'normal',
  'different',
  'similar',
  'related',
  'connected',
  'important',
  'useful',
];

// Category-specific fallback clues
const CATEGORY_FALLBACKS: Record<string, string[]> = {
  Animals: ['creature', 'wild', 'nature', 'living', 'species'],
  Food: ['delicious', 'tasty', 'meal', 'eating', 'cooking'],
  Technology: ['digital', 'modern', 'electronic', 'device', 'smart'],
  Places: ['location', 'travel', 'visit', 'explore', 'destination'],
  Sports: ['active', 'athletic', 'competition', 'game', 'physical'],
  Jobs: ['work', 'professional', 'career', 'skilled', 'occupation'],
  Music: ['sound', 'melody', 'rhythm', 'musical', 'artistic'],
  Movies: ['story', 'character', 'fiction', 'entertainment', 'dramatic'],
  Objects: ['item', 'tool', 'useful', 'handy', 'physical'],
  Nature: ['natural', 'powerful', 'weather', 'phenomenon', 'earth'],
};

// Word association fallbacks based on common word relationships
const WORD_ASSOCIATIONS: Record<string, string[]> = {
  elephant: ['trunk', 'gray', 'large', 'memory', 'safari'],
  dolphin: ['ocean', 'smart', 'fin', 'swim', 'friendly'],
  pizza: ['cheese', 'round', 'slice', 'italian', 'oven'],
  robot: ['metal', 'machine', 'future', 'automatic', 'programmed'],
  beach: ['sand', 'waves', 'sunny', 'vacation', 'coastal'],
  doctor: ['health', 'hospital', 'medical', 'healing', 'stethoscope'],
  guitar: ['strings', 'music', 'strum', 'acoustic', 'rock'],
  // Add more as needed
};

/**
 * Get a fallback clue for when AI fails
 */
export function getFallbackClue(params: {
  role: 'civilian' | 'impostor';
  word?: string;
  category?: string;
  previousClues: string[];
}): string {
  const { role, word, category, previousClues } = params;
  const usedClues = new Set(previousClues.map((c) => c.toLowerCase()));

  if (role === 'civilian' && word) {
    // Try word associations first
    const associations = WORD_ASSOCIATIONS[word.toLowerCase()];
    if (associations) {
      const available = associations.filter((c) => !usedClues.has(c));
      if (available.length > 0) {
        return available[Math.floor(Math.random() * available.length)];
      }
    }

    // Fall back to category clues if available
    if (category && CATEGORY_FALLBACKS[category]) {
      const categoryClues = CATEGORY_FALLBACKS[category].filter(
        (c) => !usedClues.has(c)
      );
      if (categoryClues.length > 0) {
        return categoryClues[Math.floor(Math.random() * categoryClues.length)];
      }
    }
  }

  // For impostor or as final fallback, use generic clues
  const available = GENERIC_CLUES.filter((c) => !usedClues.has(c));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Ultimate fallback
  return 'thing';
}

/**
 * Get a fallback vote when AI fails
 */
export function getFallbackVote(params: {
  selfId: string;
  playerIds: string[];
}): string {
  const { selfId, playerIds } = params;
  const otherPlayers = playerIds.filter((id) => id !== selfId);

  if (otherPlayers.length === 0) {
    return selfId; // Should never happen, but safety
  }

  // Random vote among other players
  return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
}

/**
 * Validate and clean AI response for clue
 */
export function validateAndCleanClue(
  response: string | null | undefined,
  secretWord?: string
): string | null {
  if (!response) return null;

  // Clean the response
  let clue = response
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, ''); // Remove all non-letter characters

  // Validate
  if (!clue || clue.length < 2 || clue.length > 20) {
    return null;
  }

  // Check if it's the secret word
  if (secretWord && clue === secretWord.toLowerCase()) {
    return null;
  }

  return clue;
}

/**
 * Parse vote response and extract player name
 */
export function parseVoteResponse(
  response: string | null | undefined,
  validNames: string[]
): string | null {
  if (!response) return null;

  const cleanedResponse = response.trim().toUpperCase();

  // Try exact match
  const exactMatch = validNames.find(
    (name) => name.toUpperCase() === cleanedResponse
  );
  if (exactMatch) return exactMatch;

  // Try partial match
  const partialMatch = validNames.find((name) =>
    cleanedResponse.includes(name.toUpperCase())
  );
  if (partialMatch) return partialMatch;

  return null;
}
