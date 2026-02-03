import type { Player, BotConfig } from '../../store/types';
import { selectRandomWord } from '../../data/words';

// Bot configurations with cyberpunk names
export const BOT_CONFIGS: BotConfig[] = [
  { id: 'bot-1', name: 'NEXUS-7', avatar: '🤖' },
  { id: 'bot-2', name: 'CIPHER', avatar: '🔮' },
  { id: 'bot-3', name: 'NOVA', avatar: '⚡' },
  { id: 'bot-4', name: 'VOLT', avatar: '💠' },
];

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Create all players (1 human + 4 bots)
export function createPlayers(humanName: string): Player[] {
  const humanPlayer: Player = {
    id: 'human',
    name: humanName || 'AGENT',
    isBot: false,
    role: 'civilian', // Will be assigned later
    avatar: '👤',
    clues: [],
    votedFor: null,
  };

  const botPlayers: Player[] = BOT_CONFIGS.map(bot => ({
    id: bot.id,
    name: bot.name,
    isBot: true,
    role: 'civilian' as const, // Will be assigned later
    avatar: bot.avatar,
    clues: [],
    votedFor: null,
  }));

  return [humanPlayer, ...botPlayers];
}

// Assign roles (1 impostor, rest civilians)
export function assignRoles(players: Player[]): {
  players: Player[];
  impostorId: string;
} {
  // Create a shuffled array of indices to ensure better randomization
  const indices = Array.from({ length: players.length }, (_, i) => i);
  
  // Fisher-Yates shuffle for better randomness
  for (let i = indices.length - 1; i > 0; i--) {
    // Use crypto.getRandomValues for better randomness if available, otherwise fallback to Math.random
    let randomValue: number;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      randomValue = array[0] / (0xFFFFFFFF + 1);
    } else {
      randomValue = Math.random();
    }
    const j = Math.floor(randomValue * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // Select the first shuffled index as the impostor
  const impostorIndex = indices[0];
  const impostorId = players[impostorIndex].id;

  const assignedPlayers = players.map((player, index) => ({
    ...player,
    role: index === impostorIndex ? 'impostor' as const : 'civilian' as const,
  }));

  return { players: assignedPlayers, impostorId };
}

// Generate randomized turn order
export function generateTurnOrder(players: Player[]): string[] {
  const ids = players.map(p => p.id);
  // Fisher-Yates shuffle
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

// Select a word and category for the game
export function selectWordForGame(): { word: string; category: string } {
  return selectRandomWord();
}

// Validate a clue (single word, not the secret word)
export function validateClue(clue: string, secretWord: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmedClue = clue.trim().toLowerCase();
  const trimmedSecret = secretWord.toLowerCase();

  if (!trimmedClue) {
    return { isValid: false, error: 'Please enter a clue' };
  }

  if (trimmedClue.includes(' ')) {
    return { isValid: false, error: 'Clue must be a single word' };
  }

  if (trimmedClue === trimmedSecret) {
    return { isValid: false, error: 'Cannot use the secret word as a clue!' };
  }

  if (trimmedSecret.includes(trimmedClue) || trimmedClue.includes(trimmedSecret)) {
    return { isValid: false, error: 'Clue is too similar to the secret word!' };
  }

  if (trimmedClue.length < 2) {
    return { isValid: false, error: 'Clue must be at least 2 characters' };
  }

  if (trimmedClue.length > 20) {
    return { isValid: false, error: 'Clue is too long (max 20 characters)' };
  }

  return { isValid: true };
}

// Get player by ID
export function getPlayerById(players: Player[], id: string): Player | undefined {
  return players.find(p => p.id === id);
}

// Get all clues from all players
export function getAllCluesFromPlayers(players: Player[]): string[] {
  return players.flatMap(p => p.clues);
}

// Calculate vote counts
export function calculateVoteCounts(players: Player[]): Record<string, number> {
  const counts: Record<string, number> = {};

  players.forEach(player => {
    if (player.votedFor) {
      counts[player.votedFor] = (counts[player.votedFor] || 0) + 1;
    }
  });

  return counts;
}

// Determine the eliminated player (most votes)
export function getEliminatedPlayer(voteCounts: Record<string, number>): string | null {
  if (Object.keys(voteCounts).length === 0) return null;

  const maxVotes = Math.max(...Object.values(voteCounts));
  const playersWithMaxVotes = Object.entries(voteCounts)
    .filter(([, votes]) => votes === maxVotes)
    .map(([id]) => id);

  // In case of tie, randomly select one
  if (playersWithMaxVotes.length > 1) {
    return playersWithMaxVotes[Math.floor(Math.random() * playersWithMaxVotes.length)];
  }

  return playersWithMaxVotes[0] || null;
}

// Determine the winner
export function determineWinner(
  eliminatedPlayerId: string | null,
  impostorId: string
): 'civilians' | 'impostor' {
  if (eliminatedPlayerId === impostorId) {
    return 'civilians';
  }
  return 'impostor';
}
