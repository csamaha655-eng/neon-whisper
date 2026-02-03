export interface WordCategory {
  name: string;
  words: string[];
}

export const wordDatabase: WordCategory[] = [
  {
    name: 'Animals',
    words: [
      'elephant', 'dolphin', 'penguin', 'kangaroo', 'octopus',
      'giraffe', 'crocodile', 'butterfly', 'flamingo', 'chameleon'
    ],
  },
  {
    name: 'Food',
    words: [
      'pizza', 'sushi', 'burger', 'taco', 'pasta',
      'chocolate', 'sandwich', 'pancake', 'popcorn', 'lasagna'
    ],
  },
  {
    name: 'Technology',
    words: [
      'smartphone', 'laptop', 'robot', 'satellite', 'drone',
      'keyboard', 'headphones', 'camera', 'microchip', 'hologram'
    ],
  },
  {
    name: 'Places',
    words: [
      'beach', 'mountain', 'desert', 'forest', 'island',
      'volcano', 'waterfall', 'canyon', 'glacier', 'jungle'
    ],
  },
  {
    name: 'Sports',
    words: [
      'basketball', 'tennis', 'swimming', 'skiing', 'boxing',
      'surfing', 'archery', 'hockey', 'gymnastics', 'wrestling'
    ],
  },
  {
    name: 'Jobs',
    words: [
      'doctor', 'firefighter', 'astronaut', 'detective', 'chef',
      'pilot', 'architect', 'scientist', 'photographer', 'mechanic'
    ],
  },
  {
    name: 'Music',
    words: [
      'guitar', 'piano', 'drums', 'violin', 'saxophone',
      'trumpet', 'concert', 'orchestra', 'karaoke', 'headphones'
    ],
  },
  {
    name: 'Movies',
    words: [
      'superhero', 'zombie', 'vampire', 'pirate', 'wizard',
      'dinosaur', 'alien', 'cowboy', 'samurai', 'gladiator'
    ],
  },
  {
    name: 'Objects',
    words: [
      'umbrella', 'telescope', 'microscope', 'compass', 'lantern',
      'hourglass', 'binoculars', 'kaleidoscope', 'pendulum', 'anchor'
    ],
  },
  {
    name: 'Nature',
    words: [
      'rainbow', 'lightning', 'tornado', 'earthquake', 'avalanche',
      'tsunami', 'eclipse', 'aurora', 'comet', 'meteor'
    ],
  },
];

// Helper function to select a random word
export function selectRandomWord(): { word: string; category: string } {
  const category = wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
  const word = category.words[Math.floor(Math.random() * category.words.length)];
  return { word, category: category.name };
}

// Get all words from a category
export function getWordsFromCategory(categoryName: string): string[] {
  const category = wordDatabase.find(c => c.name === categoryName);
  return category ? category.words : [];
}

// Get all category names
export function getAllCategories(): string[] {
  return wordDatabase.map(c => c.name);
}

// Get a random word from a specific category (for fallback logic)
export function getRandomWordFromCategory(categoryName: string): string | null {
  const words = getWordsFromCategory(categoryName);
  if (words.length === 0) return null;
  return words[Math.floor(Math.random() * words.length)];
}
