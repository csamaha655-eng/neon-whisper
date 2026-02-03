import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getSocket } from '../lib/multiplayer/socket';
import type { GameState, PlayerRole } from './types';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
}

export interface MultiplayerGameState extends Omit<GameState, 'secretWord'> {
  secretWord?: string;
}

interface MultiplayerStore {
  // Connection state
  isConnected: boolean;
  roomCode: string | null;
  playerId: string | null;
  isHost: boolean;

  // Room state
  players: MultiplayerPlayer[];
  gameState: MultiplayerGameState | null;
  
  // Player role info (only for current player)
  playerRole: PlayerRole | null;
  playerSecretWord: string | null;
  playerCategory: string | null;

  // Actions
  connect: () => void;
  disconnect: () => void;
  createRoom: (playerName: string, difficulty: string, impostorHintEnabled: boolean) => void;
  joinRoom: (roomCode: string, playerName: string) => void;
  toggleReady: () => void;
  startGame: () => void;
  submitClue: (clue: string) => void;
  submitVote: (targetId: string) => void;
  dismissRoleReveal: () => void;
  setConnected: (connected: boolean) => void;
  setRoomCode: (code: string | null) => void;
  setPlayerId: (id: string | null) => void;
  setPlayers: (players: MultiplayerPlayer[]) => void;
  setGameState: (state: MultiplayerGameState | null) => void;
  setPlayerRoleInfo: (role: PlayerRole, secretWord: string | null, category: string | null) => void;
  reset: () => void;
}

const initialState = {
  isConnected: false,
  roomCode: null,
  playerId: null,
  isHost: false,
  players: [],
  gameState: null,
  playerRole: null,
  playerSecretWord: null,
  playerCategory: null,
};

export const useMultiplayerStore = create<MultiplayerStore>()(
  immer((set, get) => ({
    ...initialState,

    connect: () => {
      const socket = getSocket();

      socket.on('connect', () => {
        set((state) => {
          state.isConnected = true;
        });
      });

      socket.on('disconnect', () => {
        set((state) => {
          state.isConnected = false;
        });
      });

      socket.on('room-created', ({ roomCode, playerId }) => {
        set((state) => {
          state.roomCode = roomCode;
          state.playerId = playerId;
          state.isHost = true;
        });
      });

      socket.on('room-joined', ({ roomCode, playerId }) => {
        set((state) => {
          state.roomCode = roomCode;
          state.playerId = playerId;
          state.isHost = false;
        });
      });

      socket.on('room-updated', ({ players }) => {
        set((state) => {
          state.players = players;
          // Update isHost status
          const player = players.find((p) => p.id === state.playerId);
          if (player) {
            state.isHost = player.isHost;
          }
        });
      });

      socket.on('game-started', ({ gameState, playerRoles }) => {
        const currentPlayerId = get().playerId;
        const playerRoleInfo = playerRoles.find((pr: any) => pr.id === currentPlayerId);

        set((state) => {
          state.gameState = gameState;
          if (playerRoleInfo) {
            state.playerRole = playerRoleInfo.role;
            state.playerSecretWord = playerRoleInfo.secretWord || null;
            state.playerCategory = playerRoleInfo.category || null;
          }
        });
      });

      socket.on('game-state-updated', ({ gameState }) => {
        set((state) => {
          state.gameState = gameState;
        });
      });

      socket.on('game-ended', ({ message }) => {
        console.log('Game ended:', message);
        // Reset game state but keep room
        set((state) => {
          state.gameState = null;
          state.playerRole = null;
          state.playerSecretWord = null;
          state.playerCategory = null;
        });
      });

      socket.on('error', ({ message }) => {
        console.error('Socket error:', message);
        alert(message);
      });
    },

    disconnect: () => {
      const socket = getSocket();
      socket.disconnect();
      set((state) => {
        Object.assign(state, initialState);
      });
    },

    createRoom: (playerName, difficulty, impostorHintEnabled) => {
      const socket = getSocket();
      socket.emit('create-room', { playerName, difficulty, impostorHintEnabled });
    },

    joinRoom: (roomCode, playerName) => {
      const socket = getSocket();
      socket.emit('join-room', { roomCode, playerName });
    },

    toggleReady: () => {
      const socket = getSocket();
      const roomCode = get().roomCode;
      if (roomCode) {
        socket.emit('toggle-ready', { roomCode });
      }
    },

    startGame: () => {
      const socket = getSocket();
      const roomCode = get().roomCode;
      if (roomCode) {
        socket.emit('start-game', { roomCode });
      }
    },

    submitClue: (clue) => {
      const socket = getSocket();
      const roomCode = get().roomCode;
      if (roomCode) {
        socket.emit('submit-clue', { roomCode, clue });
      }
    },

    submitVote: (targetId) => {
      const socket = getSocket();
      const roomCode = get().roomCode;
      if (roomCode) {
        socket.emit('submit-vote', { roomCode, targetId });
      }
    },

    dismissRoleReveal: () => {
      const socket = getSocket();
      const roomCode = get().roomCode;
      if (roomCode) {
        socket.emit('dismiss-role-reveal', { roomCode });
      }
    },

    setConnected: (connected) => {
      set((state) => {
        state.isConnected = connected;
      });
    },

    setRoomCode: (code) => {
      set((state) => {
        state.roomCode = code;
      });
    },

    setPlayerId: (id) => {
      set((state) => {
        state.playerId = id;
      });
    },

    setPlayers: (players) => {
      set((state) => {
        state.players = players;
      });
    },

    setGameState: (gameState) => {
      set((state) => {
        state.gameState = gameState;
      });
    },

    setPlayerRoleInfo: (role, secretWord, category) => {
      set((state) => {
        state.playerRole = role;
        state.playerSecretWord = secretWord;
        state.playerCategory = category;
      });
    },

    reset: () => {
      set((state) => {
        Object.assign(state, initialState);
      });
    },
  }))
);

