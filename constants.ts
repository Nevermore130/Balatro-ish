import { Rank, Suit, CardData, JokerDefinition } from './types';

// Colors mimicking the Balatro palette
export const COLORS = {
  bg: '#355c46', // Green felt
  sidebar: '#2c2d30', // Dark grey
  redSuit: '#ef4444', // Red-500
  blackSuit: '#374151', // Gray-700 (using gray for black suits for softer contrast)
  accentBlue: '#3b82f6', // Blue-500
  accentOrange: '#f97316', // Orange-500
  accentRed: '#dc2626', // Red-600
  cardBg: '#f3f4f6', // Gray-100
  jokerPurple: '#9333ea', // Purple-600
  rarityCommon: '#3b82f6',
  rarityUncommon: '#22c55e',
  rarityRare: '#eab308',
  rarityLegendary: '#a855f7',
};

export const RANK_VALUES: Record<Rank, number> = {
  [Rank.Two]: 2,
  [Rank.Three]: 3,
  [Rank.Four]: 4,
  [Rank.Five]: 5,
  [Rank.Six]: 6,
  [Rank.Seven]: 7,
  [Rank.Eight]: 8,
  [Rank.Nine]: 9,
  [Rank.Ten]: 10,
  [Rank.Jack]: 11,
  [Rank.Queen]: 12,
  [Rank.King]: 13,
  [Rank.Ace]: 14,
};

export const CHIP_VALUES: Record<Rank, number> = {
    [Rank.Two]: 2,
    [Rank.Three]: 3,
    [Rank.Four]: 4,
    [Rank.Five]: 5,
    [Rank.Six]: 6,
    [Rank.Seven]: 7,
    [Rank.Eight]: 8,
    [Rank.Nine]: 9,
    [Rank.Ten]: 10,
    [Rank.Jack]: 10,
    [Rank.Queen]: 10,
    [Rank.King]: 10,
    [Rank.Ace]: 11,
};

export const HAND_SCORES = {
    'Royal Flush': { chips: 100, mult: 8 },
    'Straight Flush': { chips: 100, mult: 8 },
    'Four of a Kind': { chips: 60, mult: 7 },
    'Full House': { chips: 40, mult: 4 },
    'Flush': { chips: 35, mult: 4 },
    'Straight': { chips: 30, mult: 4 },
    'Three of a Kind': { chips: 30, mult: 3 },
    'Two Pair': { chips: 20, mult: 2 },
    'Pair': { chips: 10, mult: 2 },
    'High Card': { chips: 5, mult: 1 },
};

export const JOKER_DEFINITIONS: Record<string, JokerDefinition> = {
  'joker': { 
    id: 'joker', name: 'Joker', description: '+4 Mult', rarity: 'Common', cost: 2, type: 'passive',
    visualStyle: { bgColor: '#4b5563', patternColor: '#6b7280', pattern: 'stripes', icon: '🤡' }
  },
  'big_chip': { 
    id: 'big_chip', name: 'Big Chip', description: '+25 Chips', rarity: 'Common', cost: 3, type: 'passive',
    visualStyle: { bgColor: '#1e3a8a', patternColor: '#3b82f6', pattern: 'grid', icon: '🔵' }
  },
  'greedy_joker': { 
    id: 'greedy_joker', name: 'Greedy Joker', description: 'Diamonds give +4 Mult', rarity: 'Common', cost: 4, type: 'on_play',
    visualStyle: { bgColor: '#7c2d12', patternColor: '#f97316', pattern: 'diamonds', icon: '💎' }
  },
  'lusty_joker': { 
    id: 'lusty_joker', name: 'Lusty Joker', description: 'Hearts give +4 Mult', rarity: 'Common', cost: 4, type: 'on_play',
    visualStyle: { bgColor: '#7f1d1d', patternColor: '#ef4444', pattern: 'dots', icon: '♥️' }
  },
  'wrathful_joker': { 
    id: 'wrathful_joker', name: 'Wrathful Joker', description: 'Spades give +4 Mult', rarity: 'Common', cost: 4, type: 'on_play',
    visualStyle: { bgColor: '#111827', patternColor: '#4b5563', pattern: 'checkers', icon: '♠️' }
  },
  'gluttonous_joker': { 
    id: 'gluttonous_joker', name: 'Gluttonous Joker', description: 'Clubs give +4 Mult', rarity: 'Common', cost: 4, type: 'on_play',
    visualStyle: { bgColor: '#14532d', patternColor: '#22c55e', pattern: 'grid', icon: '♣️' }
  },
  'even_steven': { 
    id: 'even_steven', name: 'Even Steven', description: '+4 Mult for even cards', rarity: 'Uncommon', cost: 5, type: 'on_play',
    visualStyle: { bgColor: '#312e81', patternColor: '#818cf8', pattern: 'stripes', icon: '2️⃣' }
  },
  'odd_todd': { 
    id: 'odd_todd', name: 'Odd Todd', description: '+30 Chips for odd cards', rarity: 'Uncommon', cost: 5, type: 'on_play',
    visualStyle: { bgColor: '#854d0e', patternColor: '#facc15', pattern: 'dots', icon: '9️⃣' }
  },
  'the_duo': { 
    id: 'the_duo', name: 'The Duo', description: 'X2 Mult for Pair', rarity: 'Rare', cost: 7, type: 'passive',
    visualStyle: { bgColor: '#831843', patternColor: '#ec4899', pattern: 'checkers', icon: '✌️' }
  },
  'the_trio': { 
    id: 'the_trio', name: 'The Trio', description: 'X3 Mult for 3-of-a-Kind', rarity: 'Rare', cost: 7, type: 'passive',
    visualStyle: { bgColor: '#581c87', patternColor: '#a855f7', pattern: 'diamonds', icon: '🤟' }
  },
  'cavendish': { 
    id: 'cavendish', name: 'Cavendish', description: 'X3 Mult', rarity: 'Rare', cost: 8, type: 'passive',
    visualStyle: { bgColor: '#fcd34d', patternColor: '#fbbf24', pattern: 'dots', icon: '🍌' }
  },
  'blue_joker': { 
    id: 'blue_joker', name: 'Blue Joker', description: '+Chips per remaining card', rarity: 'Common', cost: 5, type: 'passive',
    visualStyle: { bgColor: '#172554', patternColor: '#60a5fa', pattern: 'stripes', icon: '📘' }
  },
};

export const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  Object.values(Suit).forEach((suit) => {
    Object.values(Rank).forEach((rank) => {
      deck.push({
        id: `${rank}-${suit}-${Math.random().toString(36).substr(2, 9)}`,
        suit,
        rank,
        value: RANK_VALUES[rank],
      });
    });
  });
  return shuffle(deck);
};

export const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }
  return newArray;
};

export const getRandomJokers = (count: number): JokerDefinition[] => {
  const allJokers = Object.values(JOKER_DEFINITIONS);
  const shuffled = shuffle(allJokers);
  return shuffled.slice(0, count);
}