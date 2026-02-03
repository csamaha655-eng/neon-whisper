import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAI } from './useAI';

export function useGameLoop() {
  const phase = useGameStore((state) => state.phase);
  const currentTurnIndex = useGameStore((state) => state.currentTurnIndex);
  const turnOrder = useGameStore((state) => state.turnOrder);
  const players = useGameStore((state) => state.players);
  const isProcessingAI = useGameStore((state) => state.isProcessingAI);
  const humanPlayerId = useGameStore((state) => state.humanPlayerId);
  const submitClue = useGameStore((state) => state.submitClue);
  const nextTurn = useGameStore((state) => state.nextTurn);
  const submitVote = useGameStore((state) => state.submitVote);

  const { processBotClue, processAllBotVotes } = useAI();

  const currentPlayerId = turnOrder[currentTurnIndex];
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const isHumanTurn = currentPlayerId === humanPlayerId;
  const isCluePhase = phase === 'round1' || phase === 'round2';
  const isVotingPhase = phase === 'voting';

  // Handle bot clue turns automatically
  useEffect(() => {
    if (!isCluePhase) return;
    if (isProcessingAI) return;
    if (!currentPlayer) return;
    if (isHumanTurn) return;

    // It's a bot's turn - process their clue
    processBotClue(currentPlayerId);
  }, [
    isCluePhase,
    isProcessingAI,
    currentPlayer,
    isHumanTurn,
    currentPlayerId,
    processBotClue,
  ]);

  // Handle human clue submission
  const handleHumanClue = useCallback(
    (clue: string) => {
      if (!isHumanTurn || !isCluePhase) return;

      submitClue(humanPlayerId, clue);
      nextTurn();
    },
    [isHumanTurn, isCluePhase, submitClue, humanPlayerId, nextTurn]
  );

  // Handle human vote submission
  const handleHumanVote = useCallback(
    async (targetId: string) => {
      if (!isVotingPhase) return;

      submitVote(humanPlayerId, targetId);

      // Process all bot votes after human votes
      await processAllBotVotes();
    },
    [isVotingPhase, submitVote, humanPlayerId, processAllBotVotes]
  );

  return {
    phase,
    currentTurnIndex,
    turnOrder,
    isHumanTurn,
    isCluePhase,
    isVotingPhase,
    handleHumanClue,
    handleHumanVote,
  };
}
