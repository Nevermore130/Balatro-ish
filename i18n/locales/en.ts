export const en = {
  // Common
  common: {
    back: 'Back',
    close: 'Close',
    confirm: 'Confirm',
    cancel: 'Cancel',
    empty: 'Empty',
  },

  // Game UI
  game: {
    selectCards: 'Select cards to play.',
    selectUpTo: 'Select up to 5 cards',
    roundCleared: 'Round Cleared!',
    gameOver: 'GAME OVER',
    tryAgain: 'Try Again',
    reachedRound: 'Reached Round {round}',
    currentMoney: 'Current Money',
    tooPoor: 'Too poor!',
    noRoomForJokers: 'No room for more Jokers!',
    trashTakenOut: 'Trash taken out.',
    played: 'Played {hand} for {score}!',
  },

  // Stats
  stats: {
    smallBlind: 'Small Blind',
    scoreAtLeast: 'Score at least',
    roundScore: 'Round Score',
    hands: 'Hands',
    discards: 'Discards',
    ante: 'Ante',
    round: 'Round',
    money: 'Money',
  },

  // Shop
  shop: {
    title: 'Round Cleared!',
    buy: 'Buy ${{cost}}',
    skipShop: 'Skip Shop',
    chooseJoker: 'Choose a Joker to add to your deck!',
  },

  // Buttons
  buttons: {
    discard: 'Discard',
    playHand: 'Play Hand',
    rank: 'Rank',
    suit: 'Suit',
    jokerGallery: 'Joker Gallery',
    scoringRules: 'Scoring Rules',
  },

  // Joker Gallery
  gallery: {
    title: 'Joker Gallery',
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    legendary: 'Legendary',
  },

  // Scoring Rules
  scoring: {
    title: 'Scoring Rules',
    handType: 'Hand Type',
    howToCalculate: 'How to Calculate Score',
    formula: 'Final Score = (Base Chips + Card Chips + Bonus Chips) × (Base Mult + Bonus Mult) × Mult Multiplier',
    baseChips: '• Base Chips: Based on hand type',
    cardChips: '• Card Chips: Sum of card values (2-10 face value, J/Q/K=10, A=11)',
    bonusChips: '• Bonus Chips: Provided by Joker cards',
    multiplier: '• Mult Multiplier: Provided by Joker cards (e.g., The Duo, The Trio)',
    chips: 'Chips',
    mult: 'Mult',
    points: 'points',
    examples: 'Examples',
    example1Title: 'Example 1: Pair of Aces',
    example1Desc: 'Base Chips: 10 + Card Chips: 11+11 = 22\nBase Mult: 2\nFinal Score: (10 + 22) × 2 = 64 points',
    example2Title: 'Example 2: Straight Flush',
    example2Desc: 'Base Chips: 100 + Card Chips: ~50\nBase Mult: 8\nFinal Score: (100 + 50) × 8 = 1200 points',
  },

  // Hand Types
  hands: {
    'Royal Flush': 'Royal Flush',
    'Straight Flush': 'Straight Flush',
    'Four of a Kind': 'Four of a Kind',
    'Full House': 'Full House',
    'Flush': 'Flush',
    'Straight': 'Straight',
    'Three of a Kind': 'Three of a Kind',
    'Two Pair': 'Two Pair',
    'Pair': 'Pair',
    'High Card': 'High Card',
  },

  // Orientation
  orientation: {
    rotateDevice: 'Please Rotate Device',
    rotateDescription: 'Please rotate your device to landscape mode',
    rotateDescriptionEn: 'Please rotate your device to landscape mode',
  },

  // Joker Card Details
  jokerDetails: {
    type: 'Type',
    rarity: 'Rarity',
    passive: 'Passive',
    onPlay: 'On Play',
  },

  // Dev
  dev: {
    shopTest: 'Dev: Shop Test',
  },
};

