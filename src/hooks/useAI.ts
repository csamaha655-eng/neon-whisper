import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { generateClue, generateVote } from '../lib/ai/openrouter';
import { randomSleep } from '../lib/utils/delay';

export function useAI() {
  const submitClue = useGameStore((state) => state.submitClue);
  const submitVote = useGameStore((state) => state.submitVote);
  const setProcessingAI = useGameStore((state) => state.setProcessingAI);
  const nextTurn = useGameStore((state) => state.nextTurn);
  const tallyVotes = useGameStore((state) => state.tallyVotes);

  /**
   * Process a bot's clue turn
   */
  const processBotClue = useCallback(async (botId: string) => {
    setProcessingAI(true);

    // Random delay to simulate "thinking"
    await randomSleep(1500, 4000);

    const state = useGameStore.getState();
    const bot = state.players.find((p) => p.id === botId);

    if (!bot) {
      setProcessingAI(false);
      return;
    }

    const allClues = state.players.flatMap((p) => p.clues);

    const clue = await generateClue({
      role: bot.role,
      word: bot.role === 'civilian' ? state.secretWord : undefined,
      category: state.settings.impostorHintEnabled ? state.category : undefined,
      previousClues: allClues,
      playerClues: bot.clues,
      difficulty: state.settings.difficulty,
    });

    submitClue(botId, clue);
    setProcessingAI(false);
    nextTurn();
  }, [submitClue, setProcessingAI, nextTurn]);

  /**
   * Process a bot's vote
   */
  const processBotVote = useCallback(async (botId: string) => {
    setProcessingAI(true);

    // Random delay
    await randomSleep(1000, 2500);

    const state = useGameStore.getState();
    const bot = state.players.find((p) => p.id === botId);

    if (!bot) {
      setProcessingAI(false);
      return;
    }

    const allClues: Record<string, string[]> = {};
    const playerNames: Record<string, string> = {};

    state.players.forEach((p) => {
      allClues[p.id] = p.clues;
      playerNames[p.id] = p.name;
    });

    const targetId = await generateVote({
      role: bot.role,
      word: bot.role === 'civilian' ? state.secretWord : undefined,
      allClues,
      playerNames,
      selfId: botId,
      difficulty: state.settings.difficulty,
    });

    submitVote(botId, targetId);
    setProcessingAI(false);
  }, [submitVote, setProcessingAI]);

  /**
   * Process all bot votes sequentially
   */
  const processAllBotVotes = useCallback(async () => {
    const state = useGameStore.getState();
    const bots = state.players.filter((p) => p.isBot && !p.votedFor);

    for (const bot of bots) {
      await processBotVote(bot.id);
    }

    // Check if all votes are in
    const updatedState = useGameStore.getState();
    const allVoted = updatedState.players.every((p) => p.votedFor !== null);

    if (allVoted) {
      tallyVotes();
    }
  }, [processBotVote, tallyVotes]);

  return {
    processBotClue,
    processBotVote,
    processAllBotVotes,
  };
}
