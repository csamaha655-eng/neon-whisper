export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
}

export interface GamePlayer {
  id: string;
  name: string;
  isBot: boolean;
  role: 'civilian' | 'impostor';
  avatar: string;
  clues: string[];
  votedFor: string | null;
}

export interface GameState {
  phase: 'roleReveal' | 'round1' | 'round2' | 'voting' | 'result';
  currentRound: 1 | 2;
  currentTurnIndex: number;
  turnOrder: string[];
  players: GamePlayer[];
  secretWord: string;
  category: string;
  impostorId: string;
  winner: 'civilians' | 'impostor' | null;
  voteCounts: Record<string, number>;
  showRoleReveal: boolean;
}

export interface RoomSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  impostorHintEnabled: boolean;
}

export interface GameRoom {
  code: string;
  hostId: string;
  players: Player[];
  gameState: GameState | null;
  settings: RoomSettings;
}

