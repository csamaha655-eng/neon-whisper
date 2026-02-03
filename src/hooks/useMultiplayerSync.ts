import { useEffect } from 'react';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { useGameStore } from '../store/gameStore';

export function useMultiplayerSync() {
  const multiplayerState = useMultiplayerStore((state) => ({
    gameState: state.gameState,
    playerRole: state.playerRole,
    playerSecretWord: state.playerSecretWord,
    playerCategory: state.playerCategory,
    roomCode: state.roomCode,
  }));

  useEffect(() => {
    if (multiplayerState.gameState && multiplayerState.roomCode) {
      const gameState = multiplayerState.gameState;
      useGameStore.setState((state) => {
        state.phase = gameState.phase;
        state.currentRound = gameState.currentRound;
        state.currentTurnIndex = gameState.currentTurnIndex;
        state.turnOrder = gameState.turnOrder;
        state.players = gameState.players;
        state.impostorId = gameState.impostorId;
        state.category = gameState.category;
        state.winner = gameState.winner;
        state.voteCounts = gameState.voteCounts;
        state.showRoleReveal = gameState.showRoleReveal;
        // Use player's secret word if they're a civilian
        if (multiplayerState.playerSecretWord) {
          state.secretWord = multiplayerState.playerSecretWord;
        }
      });
    }
  }, [multiplayerState.gameState, multiplayerState.roomCode, multiplayerState.playerSecretWord]);

  return {
    isMultiplayer: !!multiplayerState.roomCode,
    playerRole: multiplayerState.playerRole,
    playerSecretWord: multiplayerState.playerSecretWord,
    playerCategory: multiplayerState.playerCategory,
  };
}

