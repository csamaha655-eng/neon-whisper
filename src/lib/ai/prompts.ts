import type { Difficulty } from '../../store/types';

// System prompts based on difficulty
export function getClueSystemPrompt(difficulty: Difficulty): string {
  const difficultyInstructions = {
    easy: 'Be somewhat obvious with your clue. Make it easier to guess the connection.',
    medium: 'Be moderately subtle. Balance between too obvious and too obscure.',
    hard: 'Be very subtle and clever. Make the connection indirect but still valid.',
  };

  return `You are a player in a word association game called "Neon Whisper".
${difficultyInstructions[difficulty]}
You must ONLY respond with a single word. No punctuation, no explanation, just one word.
Never use the secret word itself or any direct form of it.`;
}

export function getVotingSystemPrompt(): string {
  return `You are analyzing clues in a social deduction game.
Your goal is to identify who gave the most suspicious clues.
Respond with ONLY a player's name, nothing else.`;
}

// Build clue prompt for civilian
export function buildCivilianCluePrompt(params: {
  word: string;
  previousClues: string[];
  playerClues: string[];
  difficulty: Difficulty;
}): string {
  const { word, previousClues, playerClues, difficulty } = params;

  const subtletyGuide = {
    easy: 'Give an obvious clue that clearly relates to the word.',
    medium: 'Give a clue that is related but not too obvious.',
    hard: 'Give a subtle, indirect clue that requires thinking to connect.',
  };

  return `
The secret word is "${word}".
${subtletyGuide[difficulty]}

Previous clues from all players: ${previousClues.length > 0 ? previousClues.join(', ') : 'None yet'}
Your previous clues: ${playerClues.length > 0 ? playerClues.join(', ') : 'None yet'}

Rules:
- Give exactly ONE word
- Do NOT use the secret word "${word}" or any form of it
- Do NOT repeat any previous clues
- Your clue should relate to "${word}"

Your one-word clue:`.trim();
}

// Build clue prompt for impostor
export function buildImpostorCluePrompt(params: {
  category?: string;
  previousClues: string[];
  playerClues: string[];
  difficulty: Difficulty;
}): string {
  const { category, previousClues, playerClues, difficulty } = params;

  const strategyGuide = {
    easy: 'Give a generic clue that could fit many topics. Play it safe.',
    medium: 'Analyze the previous clues and try to give something that seems related.',
    hard: 'Carefully study the clues and give something that fits the pattern without being too generic.',
  };

  const categoryHint = category
    ? `The category is "${category}" - use this to guide your guess.`
    : 'You do not know the category.';

  return `
You are the IMPOSTOR. You do NOT know the secret word.
${categoryHint}
${strategyGuide[difficulty]}

Previous clues from other players: ${previousClues.length > 0 ? previousClues.join(', ') : 'None yet'}
Your previous clues: ${playerClues.length > 0 ? playerClues.join(', ') : 'None yet'}

Strategy:
- Analyze the previous clues to understand the theme
- Give a vague word that could fit multiple interpretations
- Try to blend in with the civilians
- Do NOT repeat any previous clues

Your one-word clue:`.trim();
}

// Build vote prompt for civilian
export function buildCivilianVotePrompt(params: {
  word: string;
  allClues: Record<string, string[]>;
  playerNames: Record<string, string>;
  selfId: string;
}): string {
  const { word, allClues, playerNames, selfId } = params;

  const clueList = Object.entries(allClues)
    .filter(([id]) => id !== selfId)
    .map(([id, clues]) => `${playerNames[id]}: ${clues.join(', ')}`)
    .join('\n');

  return `
You know the secret word is "${word}".
Analyze these players' clues and identify the IMPOSTOR (who doesn't know the word):

${clueList}

The impostor's clues will likely be:
- Too vague or generic
- Not directly related to "${word}"
- Possibly off-topic or contradictory

Vote for the player whose clues seem LEAST connected to "${word}".
Respond with ONLY the player name:`.trim();
}

// Build vote prompt for impostor
export function buildImpostorVotePrompt(params: {
  allClues: Record<string, string[]>;
  playerNames: Record<string, string>;
  selfId: string;
}): string {
  const { allClues, playerNames, selfId } = params;

  const clueList = Object.entries(allClues)
    .filter(([id]) => id !== selfId)
    .map(([id, clues]) => `${playerNames[id]}: ${clues.join(', ')}`)
    .join('\n');

  return `
You are the IMPOSTOR trying to survive.
You need to vote for someone to deflect suspicion.

Players and their clues:
${clueList}

Strategy:
- Vote for someone whose clues seem slightly different from the others
- Don't vote randomly - make it look like a thoughtful civilian vote
- Try to identify patterns and vote for anyone who seems "off"

Vote for the player name:`.trim();
}

// Temperature settings based on difficulty
export function getTemperature(difficulty: Difficulty): number {
  const temps = {
    easy: 0.9,
    medium: 0.7,
    hard: 0.5,
  };
  return temps[difficulty];
}
