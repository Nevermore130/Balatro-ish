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
  'joker': { id: 'joker', name: 'Joker', description: '+4 Mult', rarity: 'Common', cost: 2, type: 'passive' },
  'big_chip': { id: 'big_chip', name: 'Big Chip', description: '+25 Chips', rarity: 'Common', cost: 3, type: 'passive' },
  'greedy_joker': { id: 'greedy_joker', name: 'Greedy Joker', description: 'Played cards with Diamond suit give +4 Mult when scored', rarity: 'Common', cost: 4, type: 'on_play' },
  'lusty_joker': { id: 'lusty_joker', name: 'Lusty Joker', description: 'Played cards with Heart suit give +4 Mult when scored', rarity: 'Common', cost: 4, type: 'on_play' },
  'wrathful_joker': { id: 'wrathful_joker', name: 'Wrathful Joker', description: 'Played cards with Spade suit give +4 Mult when scored', rarity: 'Common', cost: 4, type: 'on_play' },
  'gluttonous_joker': { id: 'gluttonous_joker', name: 'Gluttonous Joker', description: 'Played cards with Club suit give +4 Mult when scored', rarity: 'Common', cost: 4, type: 'on_play' },
  'even_steven': { id: 'even_steven', name: 'Even Steven', description: '+4 Mult for each even rank card played (10, 8, 6, 4, 2)', rarity: 'Uncommon', cost: 5, type: 'on_play' },
  'odd_todd': { id: 'odd_todd', name: 'Odd Todd', description: '+30 Chips for each odd rank card played (A, 9, 7, 5, 3)', rarity: 'Uncommon', cost: 5, type: 'on_play' },
  'the_duo': { id: 'the_duo', name: 'The Duo', description: 'X2 Mult if played hand contains a Pair', rarity: 'Rare', cost: 7, type: 'passive' },
  'the_trio': { id: 'the_trio', name: 'The Trio', description: 'X3 Mult if played hand contains a Three of a Kind', rarity: 'Rare', cost: 7, type: 'passive' },
  'cavendish': { id: 'cavendish', name: 'Cavendish', description: 'X3 Mult', rarity: 'Rare', cost: 8, type: 'passive' },
  'blue_joker': { id: 'blue_joker', name: 'Blue Joker', description: '+2 Chips for every remaining card in deck', rarity: 'Common', cost: 5, type: 'passive' },
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