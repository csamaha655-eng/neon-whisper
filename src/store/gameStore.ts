import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  GameState,
  GameStore,
  GamePhase,
  Difficulty,
} from './types';
import {
  createPlayers,
  assignRoles,
  generateTurnOrder,
  selectWordForGame,
  calculateVoteCounts,
  getEliminatedPlayer,
  determineWinner,
} from '../lib/utils/gameUtils';

// Initial state
const initialState: GameState = {
  phase: 'setup',
  currentRound: 1,
  currentTurnIndex: 0,
  turnOrder: [],
  players: [],
  humanPlayerId: 'human',
  impostorId: '',
  secretWord: '',
  category: '',
  settings: {
    playerName: '',
    difficulty: 'medium',
    impostorHintEnabled: true,
  },
  winner: null,
  voteCounts: {},
  isProcessingAI: false,
  error: null,
  showRoleReveal: false,
};

// Phase transition map
const phaseTransitions: Record<GamePhase, GamePhase> = {
  setup: 'roleReveal',
  roleReveal: 'round1',
  round1: 'round2',
  round2: 'voting',
  voting: 'result',
  result: 'setup',
};

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...initialState,

    // Setup actions
    setPlayerName: (name: string) => {
      set((state) => {
        state.settings.playerName = name;
      });
    },

    setDifficulty: (difficulty: Difficulty) => {
      set((state) => {
        state.settings.difficulty = difficulty;
      });
    },

    toggleImpostorHint: () => {
      set((state) => {
        state.settings.impostorHintEnabled = !state.settings.impostorHintEnabled;
      });
    },

    startGame: () => {
      const { settings } = get();
      const { word, category } = selectWordForGame();
      const players = createPlayers(settings.playerName);
      const { players: assignedPlayers, impostorId } = assignRoles(players);
      const turnOrder = generateTurnOrder(assignedPlayers);

      set((state) => {
        state.phase = 'roleReveal';
        state.showRoleReveal = true;
        state.secretWord = word;
        state.category = category;
        state.players = assignedPlayers;
        state.impostorId = impostorId;
        state.humanPlayerId = 'human';
        state.turnOrder = turnOrder;
        state.currentRound = 1;
        state.currentTurnIndex = 0;
        state.winner = null;
        state.voteCounts = {};
        state.error = null;
      });
    },

    // Game flow actions
    advancePhase: () => {
      set((state) => {
        const nextPhase = phaseTransitions[state.phase];
        state.phase = nextPhase;

        if (nextPhase === 'round2') {
          state.currentRound = 2;
          state.currentTurnIndex = 0;
        }

        if (nextPhase === 'setup') {
          // Reset all game state when going back to setup
          Object.assign(state, {
            ...initialState,
            settings: state.settings, // Keep settings
          });
        }
      });
    },

    nextTurn: () => {
      const { currentTurnIndex, turnOrder } = get();
      const nextIndex = currentTurnIndex + 1;

      if (nextIndex >= turnOrder.length) {
        // End of round
        get().advancePhase();
      } else {
        set((state) => {
          state.currentTurnIndex = nextIndex;
        });
      }
    },

    dismissRoleReveal: () => {
      set((state) => {
        state.showRoleReveal = false;
        state.phase = 'round1';
      });
    },

    // Clue actions
    submitClue: (playerId: string, clue: string) => {
      set((state) => {
        const player = state.players.find((p) => p.id === playerId);
        if (player) {
          player.clues.push(clue.toLowerCase().trim());
        }
      });
    },

    // Voting actions
    submitVote: (voterId: string, targetId: string) => {
      set((state) => {
        const voter = state.players.find((p) => p.id === voterId);
        if (voter) {
          voter.votedFor = targetId;
        }
      });
    },

    tallyVotes: () => {
      const { players, impostorId } = get();
      const counts = calculateVoteCounts(players);
      const eliminatedId = getEliminatedPlayer(counts);
      const winner = determineWinner(eliminatedId, impostorId);

      set((state) => {
        state.voteCounts = counts;
        state.winner = winner;
        state.phase = 'result';
      });
    },

    // AI actions
    setProcessingAI: (isProcessing: boolean) => {
      set((state) => {
        state.isProcessingAI = isProcessing;
      });
    },

    setError: (error: string | null) => {
      set((state) => {
        state.error = error;
      });
    },

    // Utility methods
    getCurrentPlayer: () => {
      const { turnOrder, currentTurnIndex, players } = get();
      const currentPlayerId = turnOrder[currentTurnIndex];
      return players.find((p) => p.id === currentPlayerId);
    },

    isHumanTurn: () => {
      const { turnOrder, currentTurnIndex, humanPlayerId } = get();
      return turnOrder[currentTurnIndex] === humanPlayerId;
    },

    getAllClues: () => {
      const { players } = get();
      return players.flatMap((p) => p.clues);
    },

    // Reset
    resetGame: () => {
      set((state) => {
        const settings = state.settings;
        Object.assign(state, {
          ...initialState,
          settings,
        });
      });
    },
  }))
);

// Selector hooks for commonly used state
export const usePhase = () => useGameStore((state) => state.phase);
export const usePlayers = () => useGameStore((state) => state.players);
export const useCurrentPlayer = () => useGameStore((state) => state.getCurrentPlayer());
export const useIsHumanTurn = () => useGameStore((state) => state.isHumanTurn());
export const useSecretWord = () => useGameStore((state) => state.secretWord);
export const useCategory = () => useGameStore((state) => state.category);
export const useSettings = () => useGameStore((state) => state.settings);
export const useIsProcessingAI = () => useGameStore((state) => state.isProcessingAI);
export const useWinner = () => useGameStore((state) => state.winner);
export const useImpostorId = () => useGameStore((state) => state.impostorId);
export const useHumanPlayer = () =>
  useGameStore((state) => state.players.find((p) => p.id === state.humanPlayerId));
