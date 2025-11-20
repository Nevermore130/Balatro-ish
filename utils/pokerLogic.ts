import { CardData, PokerHandResult, JokerInstance, Rank, Suit } from '../types';
import { HAND_SCORES, CHIP_VALUES, JOKER_DEFINITIONS } from '../constants';

export const evaluateHand = (selectedCards: CardData[]): PokerHandResult => {
  if (selectedCards.length === 0) {
    return { name: 'High Card', baseChips: 0, baseMult: 0, cards: [] };
  }

  const sorted = [...selectedCards].sort((a, b) => a.value - b.value);
  const values = sorted.map(c => c.value);
  const suits = sorted.map(c => c.suit);

  const isFlush = suits.every(s => s === suits[0]) && suits.length >= 5;
  
  // Check Straight
  let isStraight = false;
  if (values.length >= 5) {
      let distinctValues = Array.from(new Set(values)).sort((a,b) => a-b);
      // Handle Ace low straight (A, 2, 3, 4, 5) -> Values: 2, 3, 4, 5, 14
      if (distinctValues.includes(14) && distinctValues.includes(2) && distinctValues.includes(3) && distinctValues.includes(4) && distinctValues.includes(5)) {
          isStraight = true; 
      } else {
           let consecutiveCount = 0;
           for(let i = 0; i < distinctValues.length - 1; i++) {
               if (distinctValues[i+1] === distinctValues[i] + 1) {
                   consecutiveCount++;
               } else {
                   consecutiveCount = 0;
               }
               if (consecutiveCount >= 4) isStraight = true;
           }
      }
  }

  const counts: Record<number, number> = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const frequencies = Object.values(counts).sort((a, b) => b - a); // Descending [4, 1] etc.

  let handType = 'High Card';

  if (isFlush && isStraight) {
    const isRoyal = values.includes(14) && values.includes(13);
    handType = isRoyal ? 'Royal Flush' : 'Straight Flush';
  } else if (frequencies[0] === 4) {
    handType = 'Four of a Kind';
  } else if (frequencies[0] === 3 && frequencies[1] >= 2) {
    handType = 'Full House';
  } else if (isFlush) {
    handType = 'Flush';
  } else if (isStraight) {
    handType = 'Straight';
  } else if (frequencies[0] === 3) {
    handType = 'Three of a Kind';
  } else if (frequencies[0] === 2 && frequencies[1] === 2) {
    handType = 'Two Pair';
  } else if (frequencies[0] === 2) {
    handType = 'Pair';
  }

  const scoreRules = HAND_SCORES[handType as keyof typeof HAND_SCORES];
  
  return {
    name: handType,
    baseChips: scoreRules.chips,
    baseMult: scoreRules.mult,
    cards: sorted
  };
};

interface ScoreBreakdown {
    total: number;
    details: {
        baseChips: number;
        cardChips: number;
        baseMult: number;
        bonusChips: number;
        bonusMult: number;
        xMult: number;
    }
}

export const calculateScore = (handResult: PokerHandResult, jokers: JokerInstance[] = [], deckSize: number = 0): ScoreBreakdown => {
    // 1. Base Score from Hand Type
    let chips = handResult.baseChips;
    let mult = handResult.baseMult;
    
    let bonusChips = 0;
    let bonusMult = 0;
    let xMult = 1;

    // 2. Add Chips from individual cards
    const cardChips = handResult.cards.reduce((sum, card) => sum + CHIP_VALUES[card.rank], 0);
    chips += cardChips;

    // 3. Apply Joker Effects
    // We iterate over jokers. 
    // NOTE: In a full engine, this would be event-driven. Here we switch on ID for simplicity.
    
    jokers.forEach(jokerInst => {
        const def = JOKER_DEFINITIONS[jokerInst.defId];
        if (!def) return;

        // --- Per Card Triggers ---
        handResult.cards.forEach(card => {
            const isEven = [2,4,6,8,10].includes(card.value);
            const isOdd = [3,5,7,9,14].includes(card.value); // Ace is 14 (odd)

            switch (def.id) {
                case 'greedy_joker':
                    if (card.suit === Suit.Diamonds) bonusMult += 4;
                    break;
                case 'lusty_joker':
                    if (card.suit === Suit.Hearts) bonusMult += 4;
                    break;
                case 'wrathful_joker':
                    if (card.suit === Suit.Spades) bonusMult += 4;
                    break;
                case 'gluttonous_joker':
                    if (card.suit === Suit.Clubs) bonusMult += 4;
                    break;
                case 'even_steven':
                    if (isEven) bonusMult += 4;
                    break;
                case 'odd_todd':
                    if (isOdd) bonusChips += 30;
                    break;
            }
        });

        // --- Hand/Global Triggers ---
        switch (def.id) {
            case 'joker':
                bonusMult += 4;
                break;
            case 'big_chip':
                bonusChips += 25;
                break;
            case 'blue_joker':
                bonusChips += (deckSize * 2);
                break;
            case 'the_duo':
                if (handResult.name === 'Pair' || handResult.name === 'Two Pair' || handResult.name === 'Full House') {
                     xMult *= 2;
                }
                break;
            case 'the_trio':
                 if (['Three of a Kind', 'Full House', 'Four of a Kind'].includes(handResult.name)) {
                     xMult *= 3;
                 }
                 break;
            case 'cavendish':
                 xMult *= 3;
                 break;
        }
    });

    const totalChips = chips + bonusChips;
    const totalMult = (mult + bonusMult) * xMult;

    return {
        total: Math.floor(totalChips * totalMult),
        details: {
            baseChips: handResult.baseChips,
            cardChips,
            baseMult: handResult.baseMult,
            bonusChips,
            bonusMult,
            xMult
        }
    };
};