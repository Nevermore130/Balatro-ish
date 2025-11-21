export enum Suit {
  Hearts = 'Hearts',
  Diamonds = 'Diamonds',
  Clubs = 'Clubs',
  Spades = 'Spades',
}

export enum Rank {
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A',
}

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // Numeric value for sorting/scoring (2-14)
}

export interface PokerHandResult {
  name: string;
  baseChips: number;
  baseMult: number;
  cards: CardData[]; // The cards forming the hand
}

export type JokerPattern = 'stripes' | 'dots' | 'checkers' | 'diamonds' | 'grid' | 'solid';

export interface JokerVisualStyle {
    bgColor: string;     // CSS Hex or Name
    patternColor: string; // CSS Hex or Name
    pattern: JokerPattern;
    icon: string;
}

export interface JokerDefinition {
  id: string;
  name: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  cost: number;
  // Used for filtering or UI hints
  type: 'passive' | 'on_play'; 
  visualStyle: JokerVisualStyle;
}

export interface JokerInstance {
  id: string; // Unique instance ID
  defId: string; // Reference to definition
}

export type GamePhase = 'PLAY' | 'SHOP' | 'GAME_OVER';

export interface GameState {
  deck: CardData[];
  hand: CardData[];
  discardPile: CardData[];
  selectedCardIds: string[];
  
  // Joker State
  jokers: JokerInstance[];
  shopOptions: JokerDefinition[];
  gamePhase: GamePhase;

  // Scoring
  currentScore: number;
  targetScore: number;
  round: number;
  ante: number;
  
  // Resources
  handsRemaining: number;
  discardsRemaining: number;
  money: number;
  
  // UI State
  jokerMessage: string | null;
  isThinking: boolean;
  lastHandName: string | null;
  lastHandScore: number;
  lastHandDetails?: {
    baseChips: number;
    cardChips: number;
    baseMult: number;
    bonusChips: number;
    bonusMult: number;
    xMult: number;
  };
}