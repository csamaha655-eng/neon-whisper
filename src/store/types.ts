// Game Phase Types
export type GamePhase =
  | 'setup'
  | 'roleReveal'
  | 'round1'
  | 'round2'
  | 'voting'
  | 'result';

// Player Role Types
export type PlayerRole = 'civilian' | 'impostor';

// Difficulty Levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Player Interface
export interface Player {
  id: string;
  name: string;
  isBot: boolean;
  role: PlayerRole;
  avatar: string;
  clues: string[];
  votedFor: string | null;
}

// Game Settings
export interface GameSettings {
  playerName: string;
  difficulty: Difficulty;
  impostorHintEnabled: boolean;
}

// Vote Count Record
export type VoteCounts = Record<string, number>;

// Game State Interface
export interface GameState {
  // Phase management
  phase: GamePhase;
  currentRound: 1 | 2;
  currentTurnIndex: number;
  turnOrder: string[];

  // Players
  players: Player[];
  humanPlayerId: string;
  impostorId: string;

  // Word data
  secretWord: string;
  category: string;

  // Settings
  settings: GameSettings;

  // Results
  winner: 'civilians' | 'impostor' | null;
  voteCounts: VoteCounts;

  // UI State
  isProcessingAI: boolean;
  error: string | null;
  showRoleReveal: boolean;
}

// Game Actions Interface
export interface GameActions {
  // Setup actions
  setPlayerName: (name: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  toggleImpostorHint: () => void;
  startGame: () => void;

  // Game flow actions
  advancePhase: () => void;
  nextTurn: () => void;
  dismissRoleReveal: () => void;

  // Clue actions
  submitClue: (playerId: string, clue: string) => void;

  // Voting actions
  submitVote: (voterId: string, targetId: string) => void;
  tallyVotes: () => void;

  // AI actions
  setProcessingAI: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;

  // Utility
  getCurrentPlayer: () => Player | undefined;
  isHumanTurn: () => boolean;
  getAllClues: () => string[];

  // Reset
  resetGame: () => void;
}

// Combined Store Type
export type GameStore = GameState & GameActions;

// Bot Configuration
export interface BotConfig {
  id: string;
  name: string;
  avatar: string;
}

// AI Response Types
export interface ClueGenerationParams {
  role: PlayerRole;
  word?: string;
  category?: string;
  previousClues: string[];
  playerClues: string[];
  difficulty: Difficulty;
}

export interface VoteGenerationParams {
  role: PlayerRole;
  word?: string;
  allClues: Record<string, string[]>;
  playerNames: Record<string, string>;
  selfId: string;
  difficulty: Difficulty;
}
