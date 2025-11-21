import React, { useState, useEffect, useMemo } from 'react';
import { createDeck, getRandomJokers, JOKER_DEFINITIONS } from './constants';
import { CardData, GameState, JokerInstance, JokerDefinition } from './types';
import Card from './components/Card';
import JokerCard from './components/JokerCard';
import { GameButton, RetroStat } from './components/GameUI';
import { evaluateHand, calculateScore } from './utils/pokerLogic';
import { AnimatePresence } from 'framer-motion';
import TestJokerShop from './TestJokerShop';
import JokerGallery from './components/JokerGallery';
import ScoringRules from './components/ScoringRules';
import { useLanguage } from './contexts/LanguageContext';

const INITIAL_HAND_SIZE = 8;
const MAX_SELECTED = 5;
const MAX_JOKERS = 5;

export default function App() {
  const { t, language, setLanguage } = useLanguage();
  
  // --- State ---
  const [showTestShop, setShowTestShop] = useState(false);
  const [showJokerGallery, setShowJokerGallery] = useState(false);
  const [showScoringRules, setShowScoringRules] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    hand: [],
    discardPile: [],
    selectedCardIds: [],
    jokers: [],
    shopOptions: [],
    gamePhase: 'PLAY',
    currentScore: 0,
    targetScore: 300,
    round: 1,
    ante: 1,
    handsRemaining: 4,
    discardsRemaining: 3,
    money: 4,
    jokerMessage: t('game.selectCards'),
    lastHandName: null,
    lastHandScore: 0,
  });

  // --- Initialization ---
  useEffect(() => {
    startNewRound(1, 300, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Screen Orientation Detection ---
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscapeMode = window.innerWidth > window.innerHeight;
      const isMobileDevice = window.innerWidth <= 1024; // 平板和移动设备
      setIsMobile(isMobileDevice);
      setIsLandscape(isLandscapeMode || !isMobileDevice); // 桌面设备始终视为横屏
      
      // 尝试锁定横屏（如果浏览器支持且是移动设备）
      if (isMobileDevice && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
          // 锁定失败时忽略错误（某些浏览器不支持或需要用户手势）
        });
      }
    };

    // 初始检查
    checkOrientation();

    // 监听窗口大小变化
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // 监听屏幕方向变化（如果支持）
    if (screen.orientation) {
      screen.orientation.addEventListener('change', checkOrientation);
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  const startNewRound = (round: number, target: number, money: number, existingJokers?: JokerInstance[]) => {
    const fullDeck = createDeck();
    const initialHand = fullDeck.slice(0, INITIAL_HAND_SIZE);
    const remainingDeck = fullDeck.slice(INITIAL_HAND_SIZE);

    setGameState(prev => ({
      ...prev,
      deck: remainingDeck,
      hand: initialHand,
      discardPile: [],
      selectedCardIds: [],
      currentScore: 0,
      round: round,
      targetScore: target,
      money: money || prev.money,
      handsRemaining: 4,
      discardsRemaining: 3,
      lastHandName: null,
      lastHandScore: 0,
      jokerMessage: t('game.selectCards'),
      gamePhase: 'PLAY',
      jokers: existingJokers || prev.jokers,
      shopOptions: []
    }));
  };

  // --- Helpers ---
  const selectedCards = useMemo(() => {
    return gameState.hand.filter(c => gameState.selectedCardIds.includes(c.id));
  }, [gameState.hand, gameState.selectedCardIds]);

  const currentHandEvaluation = useMemo(() => {
    return evaluateHand(selectedCards);
  }, [selectedCards]);

  const currentProjectedScore = useMemo(() => {
      if (gameState.selectedCardIds.length === 0) return { total: 0 };
      return calculateScore(currentHandEvaluation, gameState.jokers, gameState.deck.length + gameState.hand.length + gameState.discardPile.length);
  }, [currentHandEvaluation, gameState.jokers, gameState.selectedCardIds.length, gameState.deck.length, gameState.hand.length, gameState.discardPile.length]);

  // --- Actions ---
  const handleCardClick = (id: string) => {
    setGameState(prev => {
      const isSelected = prev.selectedCardIds.includes(id);
      if (isSelected) {
        return { ...prev, selectedCardIds: prev.selectedCardIds.filter(cid => cid !== id) };
      } else {
        if (prev.selectedCardIds.length >= MAX_SELECTED) return prev;
        return { ...prev, selectedCardIds: [...prev.selectedCardIds, id] };
      }
    });
  };

  const handleSort = (type: 'rank' | 'suit') => {
    setGameState(prev => {
      const sortedHand = [...prev.hand].sort((a, b) => {
        if (type === 'rank') return b.value - a.value || a.suit.localeCompare(b.suit);
        return a.suit.localeCompare(b.suit) || b.value - a.value;
      });
      return { ...prev, hand: sortedHand };
    });
  };

  const drawCards = (currentHand: CardData[], currentDeck: CardData[]) => {
    const needed = INITIAL_HAND_SIZE - currentHand.length;
    if (needed <= 0 || currentDeck.length === 0) return { hand: currentHand, deck: currentDeck };

    const drawn = currentDeck.slice(0, needed);
    const newDeck = currentDeck.slice(needed);
    return { hand: [...currentHand, ...drawn], deck: newDeck };
  };

  const handleDiscard = () => {
    if (gameState.selectedCardIds.length === 0 || gameState.discardsRemaining <= 0) return;

    const remainingInHand = gameState.hand.filter(c => !gameState.selectedCardIds.includes(c.id));
    const { hand: newHand, deck: newDeck } = drawCards(remainingInHand, gameState.deck);

    setGameState(prev => ({
      ...prev,
      hand: newHand,
      deck: newDeck,
      discardPile: [...prev.discardPile, ...selectedCards],
      selectedCardIds: [],
      discardsRemaining: prev.discardsRemaining - 1,
      money: Math.max(0, prev.money - 1),
      jokerMessage: t('game.trashTakenOut')
    }));
  };

  const handlePlayHand = async () => {
    if (gameState.selectedCardIds.length === 0 || gameState.handsRemaining <= 0) return;

    const totalCards = gameState.deck.length + gameState.hand.length + gameState.discardPile.length;
    const scoreResult = calculateScore(currentHandEvaluation, gameState.jokers, totalCards);
    
    const remainingInHand = gameState.hand.filter(c => !gameState.selectedCardIds.includes(c.id));
    const { hand: newHand, deck: newDeck } = drawCards(remainingInHand, gameState.deck);

    const newTotalScore = gameState.currentScore + scoreResult.total;
    const roundWon = newTotalScore >= gameState.targetScore;

    setGameState(prev => ({
      ...prev,
      hand: newHand,
      deck: newDeck,
      discardPile: [...prev.discardPile, ...selectedCards],
      selectedCardIds: [],
      currentScore: newTotalScore,
      handsRemaining: prev.handsRemaining - 1,
      lastHandName: currentHandEvaluation.name,
      lastHandScore: scoreResult.total,
      lastHandDetails: scoreResult.details,
      jokerMessage: t('game.played', { hand: t(`hands.${currentHandEvaluation.name}`), score: scoreResult.total.toString() })
    }));

    if (roundWon) {
       setTimeout(() => {
           openShop();
       }, 1500);
    } else if (gameState.handsRemaining - 1 <= 0 && newTotalScore < gameState.targetScore) {
        setGameState(prev => ({...prev, gamePhase: 'GAME_OVER', jokerMessage: t('game.gameOver')}));
    }
  };

  const openShop = () => {
      const shopItems = getRandomJokers(3);
      setGameState(prev => ({
          ...prev,
          gamePhase: 'SHOP',
          shopOptions: shopItems,
          money: prev.money + 5,
          jokerMessage: t('shop.chooseJoker')
      }));
  };

  const buyJoker = (jokerDef: JokerDefinition) => {
      if (gameState.money < jokerDef.cost) {
          setGameState(prev => ({...prev, jokerMessage: t('game.tooPoor')}));
          return;
      }
      if (gameState.jokers.length >= MAX_JOKERS) {
          setGameState(prev => ({...prev, jokerMessage: t('game.noRoomForJokers')}));
          return;
      }

      const newJoker: JokerInstance = {
          id: `${jokerDef.id}-${Date.now()}`,
          defId: jokerDef.id
      };

      const nextRound = gameState.round + 1;
      const nextTarget = Math.floor(gameState.targetScore * 1.5);
      const newJokers = [...gameState.jokers, newJoker];
      const newMoney = gameState.money - jokerDef.cost;

      startNewRound(nextRound, nextTarget, newMoney, newJokers);
  };

  const skipShop = () => {
      const nextRound = gameState.round + 1;
      const nextTarget = Math.floor(gameState.targetScore * 1.5);
      startNewRound(nextRound, nextTarget, gameState.money, gameState.jokers);
  };


  // --- Render ---
  if (showTestShop) {
    return <TestJokerShop onBack={() => setShowTestShop(false)} />;
  }

  if (showJokerGallery) {
    return <JokerGallery onBack={() => setShowJokerGallery(false)} />;
  }

  if (showScoringRules) {
    return <ScoringRules onBack={() => setShowScoringRules(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center overflow-hidden relative crt font-vt323"
         style={{ 
           padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
           height: '100dvh', // Dynamic viewport height for mobile, falls back to 100vh
           width: '100dvw', // Dynamic viewport width for mobile, falls back to 100vw
         }}>
      
      {/* 横屏提示遮罩 - 仅在移动设备竖屏时显示 */}
      {!isLandscape && isMobile && (
        <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center gap-6 p-4">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">📱</div>
            <h2 className="text-3xl md:text-4xl text-white mb-4 font-bold uppercase font-vt323">{t('orientation.rotateDevice')}</h2>
            <p className="text-xl md:text-2xl text-slate-300 font-vt323">{t('orientation.rotateDescription')}</p>
            <p className="text-lg text-slate-400 mt-4 font-vt323">{t('orientation.rotateDescriptionEn')}</p>
          </div>
          <div className="animate-spin text-5xl text-green-400">↻</div>
        </div>
      )}
      
      {/* Language Switcher */}
      <div className="absolute top-1 right-1 z-[100] flex gap-1">
        <button
          onClick={() => setLanguage('zh')}
          className={`text-[10px] px-2 py-1 rounded border font-vt323 ${
            language === 'zh' 
              ? 'bg-blue-600 text-white border-blue-400' 
              : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
          }`}
        >
          中文
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`text-[10px] px-2 py-1 rounded border font-vt323 ${
            language === 'en' 
              ? 'bg-blue-600 text-white border-blue-400' 
              : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
          }`}
        >
          EN
        </button>
      </div>

      {/* Dev Mode: Test Shop Button */}
      {import.meta.env.DEV && (
        <button 
          onClick={() => setShowTestShop(true)}
          className="absolute top-1 left-1 z-[100] text-[10px] bg-red-900/50 text-white px-2 py-1 rounded border border-red-500/50 hover:bg-red-900"
        >
          {t('dev.shopTest')}
        </button>
      )}

      {/* Shop Overlay */}
      {gameState.gamePhase === 'SHOP' && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
              <h2 className="text-3xl md:text-4xl text-white mb-2">{t('shop.title')}</h2>
              <p className="text-lg md:text-xl text-green-400 mb-6">{t('game.currentMoney')}: ${gameState.money}</p>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
                  {gameState.shopOptions.map(option => (
                      <div key={option.id} className="flex flex-col items-center gap-2">
                        <JokerCard 
                            joker={option} 
                            inShop={true} 
                        />
                        <button 
                            onClick={() => buyJoker(option)}
                            disabled={gameState.money < option.cost}
                            className={`px-3 py-1 rounded text-sm md:text-base text-white ${gameState.money < option.cost ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'}`}
                        >
                            {t('shop.buy', { cost: option.cost })}
                        </button>
                      </div>
                  ))}
              </div>

              <button 
                onClick={skipShop}
                className="px-6 py-2 md:px-8 md:py-3 bg-red-600 hover:bg-red-500 text-white rounded text-lg md:text-xl border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
              >
                  {t('shop.skipShop')}
              </button>
          </div>
      )}

      {/* Game Over Overlay */}
      {gameState.gamePhase === 'GAME_OVER' && (
          <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
              <h1 className="text-5xl md:text-6xl text-red-600 mb-4">{t('game.gameOver')}</h1>
              <p className="text-xl md:text-2xl text-white mb-8">{t('game.reachedRound', { round: gameState.round })}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                  {t('game.tryAgain')}
              </button>
          </div>
      )}

      {/* Main Game Container */}
      <div className="w-full h-full flex flex-col sm:flex-row p-1 sm:p-1.5 md:p-2 lg:p-3 gap-1 sm:gap-1.5 md:gap-2 relative z-10"
           style={{ 
             width: '100%',
             height: '100%',
             maxWidth: '100dvw',
             maxHeight: '100dvh',
           }}>
        
        {/* LEFT PANEL: Stats */}
        {/* Fixed width optimized for iPhone 15 landscape (2.17:1 aspect ratio) */}
        <div className="w-full sm:w-48 md:w-56 lg:w-64 xl:w-72 flex-shrink-0 flex flex-col gap-1 overflow-y-auto no-scrollbar h-full">
          
          {/* Blind Info */}
          <div className="pixel-info-box bg-blue-600 p-1 text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="pixel-stat-box bg-red-500 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0 transform rotate-[-2deg]" style={{ clipPath: 'polygon(0 2px, 2px 2px, 2px 0, calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px))', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.3), 1px 1px 0px rgba(0, 0, 0, 0.3)' }}>
                <span className="text-center text-[8px] md:text-[9px] font-bold leading-tight uppercase text-white" style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.5)' }}>
                  {t('stats.smallBlind').split(' ').length > 1 ? (
                    <>
                      {t('stats.smallBlind').split(' ')[0]}
                      <br/>
                      {t('stats.smallBlind').split(' ')[1]}
                    </>
                  ) : t('stats.smallBlind')}
                </span>
              </div>
              <div className="text-right overflow-hidden flex flex-col justify-center">
                <div className="text-[8px] md:text-[9px] uppercase opacity-90 whitespace-nowrap font-bold text-blue-100" style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.5)' }}>{t('stats.scoreAtLeast')}</div>
                <div className="text-xl md:text-2xl font-bold text-white leading-none tracking-wide" style={{ textShadow: '2px 2px 0px rgba(0, 0, 0, 0.6)' }}>{gameState.targetScore}</div>
              </div>
            </div>
          </div>

          {/* Current Score */}
          <div className="pixel-stat-box bg-slate-800 p-1 flex flex-row md:flex-col items-center justify-between md:justify-center gap-0.5">
             <div className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold tracking-wider" style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.5)' }}>{t('stats.roundScore')}</div>
             <div className="text-2xl md:text-3xl text-white font-bold tracking-widest" style={{ textShadow: '2px 2px 0px rgba(0, 0, 0, 0.6)' }}>{gameState.currentScore}</div>
          </div>

          {/* Visual Divider */}
          <div className="h-0.5 bg-slate-700/50 w-full my-0.5"></div>

          {/* Hand/Discard Counters (Retro Style) */}
          <div className="grid grid-cols-2 gap-1">
             <RetroStat label={t('stats.hands')} value={gameState.handsRemaining} type="blue" />
             <RetroStat label={t('stats.discards')} value={gameState.discardsRemaining} type="red" />
          </div>

           {/* Money */}
           <div className="w-full">
             <RetroStat value={`$${gameState.money}`} type="money" />
           </div>

           {/* Ante & Round */}
           <div className="grid grid-cols-2 gap-1">
             <RetroStat label={t('stats.ante')} value={`${gameState.ante}`} subValue="/ 8" type="orange" />
             <RetroStat label={t('stats.round')} value={gameState.round} type="orange" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-1.5 mt-1">
            <button
              onClick={() => setShowJokerGallery(true)}
              className="w-full pixel-button bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold py-2 px-3 text-sm md:text-base font-vt323 uppercase tracking-wider"
              style={{
                textShadow: '2px 2px 0px rgba(0, 0, 0, 0.5)',
              }}
            >
              {t('buttons.jokerGallery')}
            </button>
            <button
              onClick={() => setShowScoringRules(true)}
              className="w-full pixel-button bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-2 px-3 text-sm md:text-base font-vt323 uppercase tracking-wider"
              style={{
                textShadow: '2px 2px 0px rgba(0, 0, 0, 0.5)',
              }}
            >
              {t('buttons.scoringRules')}
            </button>
          </div>

        </div>

        {/* RIGHT PANEL: Play Area */}
        <div className="flex-grow bg-[#355c46] rounded-xl border-4 sm:border-8 border-slate-700 relative shadow-2xl flex flex-col overflow-hidden min-w-0 h-full">
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

            {/* TOP JOKER RACK */}
            {/* Optimized for iPhone 15 landscape aspect ratio */}
            <div className="h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28 w-full flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 p-0.5 sm:p-1 border-b-4 border-black/20 bg-black/10 flex-shrink-0">
                {gameState.jokers.length === 0 && <div className="text-white/20 text-xs sm:text-sm">{t('gallery.title')} ({t('common.empty', { defaultValue: 'Empty' })})</div>}
                {gameState.jokers.map((joker) => (
                    <JokerCard key={joker.id} joker={joker} />
                ))}
            </div>

            {/* Play Info (Predicted Score) - "Select up related area" */}
            <div className="h-7 sm:h-10 md:h-14 lg:h-16 flex items-center justify-center gap-1.5 sm:gap-4 md:gap-6 lg:gap-8 bg-black/20 p-0.5 sm:p-1 relative z-0 flex-shrink-0">
                {gameState.selectedCardIds.length > 0 ? (
                    <>
                        <div className="bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 rounded border-2 border-blue-400 shadow-lg hidden sm:block">
                             <div className="text-[9px] sm:text-[10px] uppercase">{t('scoring.handType', { defaultValue: 'Hand Type' })}</div>
                             <div className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold">{t(`hands.${currentHandEvaluation.name}`)}</div>
                        </div>
                        {/* Small screen only hand name */}
                         <div className="sm:hidden text-white font-bold text-[10px] sm:text-xs mr-1 sm:mr-2 whitespace-nowrap">{t(`hands.${currentHandEvaluation.name}`)}</div>

                        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
                            {/* Chips */}
                            <div className="bg-white text-blue-900 font-bold text-xs sm:text-base md:text-xl lg:text-2xl px-0.5 sm:px-1 md:px-2 py-0.5 rounded-l border-2 border-r-0 border-slate-400 flex flex-col items-center leading-none">
                                <span>
                                    {(currentProjectedScore as any).details?.baseChips + (currentProjectedScore as any).details?.cardChips + (currentProjectedScore as any).details?.bonusChips}
                                </span>
                                <span className="text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px] text-slate-500">{t('scoring.chips').toUpperCase()}</span>
                            </div>
                            {/* Mult */}
                            <div className="bg-red-500 text-white font-bold text-xs sm:text-base md:text-xl lg:text-2xl px-0.5 sm:px-1 md:px-2 py-0.5 rounded-r border-2 border-l-0 border-slate-400 flex flex-col items-center leading-none">
                                <span>
                                   {((currentProjectedScore as any).details?.baseMult + (currentProjectedScore as any).details?.bonusMult) * (currentProjectedScore as any).details?.xMult}
                                </span>
                                <span className="text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px] text-red-200">{t('scoring.mult').toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="text-yellow-300 font-bold text-xs sm:text-sm md:text-lg lg:text-xl drop-shadow-md ml-1 sm:ml-2">
                            = {(currentProjectedScore as any).total}
                        </div>
                    </>
                ) : (
                    <div className="text-white/50 text-[10px] sm:text-xs md:text-base lg:text-lg italic">{t('game.selectUpTo')}</div>
                )}
            </div>

            {/* Card Area */}
            <div className="flex-grow flex items-center justify-center p-0.5 sm:p-2 md:p-4 overflow-visible relative min-h-[100px] sm:min-h-[120px] z-10 pt-2 sm:pt-3 md:pt-4">
                <div className="flex justify-center items-center -space-x-2 sm:-space-x-3 w-full">
                    <AnimatePresence mode='popLayout'>
                        {gameState.hand.map((card, index) => (
                            <Card 
                                key={card.id}
                                index={index}
                                card={card} 
                                selected={gameState.selectedCardIds.includes(card.id)}
                                onClick={handleCardClick}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Deck Pile (Visual Only) - Hide on smaller mobile landscape */}
            <div className="absolute right-4 bottom-16 lg:bottom-32 hidden lg:block z-0">
                <div className="w-16 h-24 md:w-20 md:h-28 bg-red-700 rounded-lg border-4 border-white shadow-xl transform rotate-3 flex items-center justify-center">
                    <div className="w-12 h-20 md:w-16 md:h-24 border-2 border-dashed border-red-300 rounded opacity-50"></div>
                    <span className="absolute bottom-1 right-1 text-white font-bold text-sm">{gameState.deck.length}</span>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-slate-900/95 p-0.5 sm:p-1 flex items-center gap-0.5 sm:gap-1 md:gap-2 border-t-2 border-slate-700 relative z-30 flex-shrink-0 h-11 sm:h-12 md:h-14 lg:h-16 backdrop-blur-sm shadow-[0_-4px_6px_rgba(0,0,0,0.3)]">
                
                <div className="flex gap-0.5 sm:gap-1 md:gap-2 h-full items-center px-0.5 sm:px-1">
                    <button onClick={() => handleSort('rank')} className="h-5/6 bg-slate-700 hover:bg-slate-600 text-slate-200 px-1.5 sm:px-2 md:px-4 rounded-sm border-b-2 border-slate-900 active:border-b-0 active:translate-y-0.5 transition-all text-xs sm:text-sm md:text-lg font-bold uppercase tracking-wider font-vt323 shadow-sm">{t('buttons.rank')}</button>
                    <button onClick={() => handleSort('suit')} className="h-5/6 bg-slate-700 hover:bg-slate-600 text-slate-200 px-1.5 sm:px-2 md:px-4 rounded-sm border-b-2 border-slate-900 active:border-b-0 active:translate-y-0.5 transition-all text-xs sm:text-sm md:text-lg font-bold uppercase tracking-wider font-vt323 shadow-sm">{t('buttons.suit')}</button>
                </div>

                <div className="flex-grow"></div>

                <div className="flex gap-0.5 sm:gap-1 md:gap-2 h-full items-center pr-0.5 sm:pr-1">
                    <div className="w-16 sm:w-20 md:w-28 h-5/6">
                        <GameButton 
                            label={t('buttons.discard')} 
                            color="red" 
                            onClick={handleDiscard} 
                            disabled={gameState.selectedCardIds.length === 0 || gameState.discardsRemaining === 0}
                            subLabel={`-$${1}`} 
                        />
                    </div>
                    <div className="w-20 sm:w-24 md:w-36 h-5/6">
                        <GameButton 
                            label={t('buttons.playHand')} 
                            color="orange" 
                            onClick={handlePlayHand} 
                            disabled={gameState.selectedCardIds.length === 0 || gameState.handsRemaining === 0}
                        />
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}