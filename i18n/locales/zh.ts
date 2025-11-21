export const zh = {
  // Common
  common: {
    back: '返回',
    close: '关闭',
    confirm: '确认',
    cancel: '取消',
    empty: '空',
  },

  // Game UI
  game: {
    selectCards: '选择卡牌进行游戏',
    selectUpTo: '最多选择 5 张卡牌',
    roundCleared: '回合完成！',
    gameOver: '游戏结束',
    tryAgain: '再试一次',
    reachedRound: '到达第 {round} 回合',
    currentMoney: '当前金钱',
    tooPoor: '太穷了！',
    noRoomForJokers: '没有空间放置更多特效卡牌！',
    trashTakenOut: '已丢弃',
    played: '打出 {hand}，得分 {score}！',
  },

  // Stats
  stats: {
    smallBlind: '小盲注',
    scoreAtLeast: '至少得分',
    roundScore: '回合得分',
    hands: '手数',
    discards: '弃牌',
    ante: '盲注',
    round: '回合',
    money: '金钱',
  },

  // Shop
  shop: {
    title: '回合完成！',
    buy: '购买 ${{cost}}',
    skipShop: '跳过商店',
    chooseJoker: '选择一张特效卡牌加入你的牌组！',
  },

  // Buttons
  buttons: {
    discard: '弃牌',
    playHand: '出牌',
    rank: '按点数',
    suit: '按花色',
    jokerGallery: '特效卡牌图鉴',
    scoringRules: '得分规则介绍',
  },

  // Joker Gallery
  gallery: {
    title: '特效卡牌图鉴',
    common: '普通',
    uncommon: '不常见',
    rare: '稀有',
    legendary: '传说',
  },

  // Scoring Rules
  scoring: {
    title: '得分规则',
    handType: '手牌类型',
    howToCalculate: '如何计算分数',
    formula: '最终分数 = (基础筹码 + 卡牌筹码 + 加成筹码) × (基础倍数 + 加成倍数) × 倍数倍率',
    baseChips: '• 基础筹码：根据手牌类型获得',
    cardChips: '• 卡牌筹码：每张卡牌的点数相加（2-10按面值，J/Q/K=10，A=11）',
    bonusChips: '• 加成筹码：由特效卡牌提供',
    multiplier: '• 倍数倍率：由特效卡牌提供（如 The Duo, The Trio 等）',
    chips: '筹码',
    mult: '倍数',
    points: '分',
    examples: '示例',
    example1Title: '示例 1: 一对 A (Pair of Aces)',
    example1Desc: '基础筹码: 10 + 卡牌筹码: 11+11 = 22\n基础倍数: 2\n最终分数: (10 + 22) × 2 = 64 分',
    example2Title: '示例 2: 同花顺 (Straight Flush)',
    example2Desc: '基础筹码: 100 + 卡牌筹码: 约 50\n基础倍数: 8\n最终分数: (100 + 50) × 8 = 1200 分',
  },

  // Hand Types
  hands: {
    'Royal Flush': '皇家同花顺',
    'Straight Flush': '同花顺',
    'Four of a Kind': '四条',
    'Full House': '满堂红',
    'Flush': '同花',
    'Straight': '顺子',
    'Three of a Kind': '三条',
    'Two Pair': '两对',
    'Pair': '一对',
    'High Card': '高牌',
  },

  // Orientation
  orientation: {
    rotateDevice: '请横屏游戏',
    rotateDescription: '请将设备旋转至横屏模式',
    rotateDescriptionEn: 'Please rotate your device to landscape mode',
  },

  // Joker Card Details
  jokerDetails: {
    type: '类型',
    rarity: '稀有度',
    passive: '被动',
    onPlay: '出牌时',
  },

  // Dev
  dev: {
    shopTest: '商店测试',
  },
};

