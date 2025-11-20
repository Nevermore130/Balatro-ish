import React, { useState, useEffect, useMemo } from 'react';
import { createDeck, getRandomJokers, JOKER_DEFINITIONS } from './constants';
import { CardData, GameState, JokerInstance, JokerDefinition } from './types';
import Card from './components/Card';
import JokerCard from './components/JokerCard';
import { StatBox, GameButton, RetroStat } from './components/GameUI';
import { evaluateHand, calculateScore } from './utils/pokerLogic';
import { getJokerAdvice } from './services/geminiService';
import { AnimatePresence } from 'framer-motion';

const INITIAL_HAND_SIZE = 8;
const MAX_SELECTED = 5;
const MAX_JOKERS = 5;

export default function App() {
  // --- State ---
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
    jokerMessage: "Select cards to play.",
    isThinking: false,
    lastHandName: null,
    lastHandScore: 0,
  });

  // --- Initialization ---
  useEffect(() => {
    startNewRound(1, 300, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      jokerMessage: `Round ${round}. Target: ${target}`,
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
      jokerMessage: "Trash taken out."
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
      jokerMessage: `Played ${currentHandEvaluation.name} for ${scoreResult.total}!`
    }));

    if (roundWon) {
       setTimeout(() => {
           openShop();
       }, 1500);
    } else if (gameState.handsRemaining - 1 <= 0 && newTotalScore < gameState.targetScore) {
        setGameState(prev => ({...prev, gamePhase: 'GAME_OVER', jokerMessage: "GAME OVER."}));
    }
  };

  const openShop = () => {
      const shopItems = getRandomJokers(3);
      setGameState(prev => ({
          ...prev,
          gamePhase: 'SHOP',
          shopOptions: shopItems,
          money: prev.money + 5,
          jokerMessage: "Choose a Joker to add to your deck!"
      }));
  };

  const buyJoker = (jokerDef: JokerDefinition) => {
      if (gameState.money < jokerDef.cost) {
          setGameState(prev => ({...prev, jokerMessage: "Too poor!"}));
          return;
      }
      if (gameState.jokers.length >= MAX_JOKERS) {
          setGameState(prev => ({...prev, jokerMessage: "No room for more Jokers!"}));
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

  const askJoker = async () => {
    setGameState(prev => ({ ...prev, isThinking: true, jokerMessage: "Thinking..." }));
    const advice = await getJokerAdvice(gameState.hand, gameState.currentScore, gameState.targetScore);
    setGameState(prev => ({ ...prev, isThinking: false, jokerMessage: advice }));
  };

  // --- Render ---
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center overflow-hidden relative crt font-vt323"
         style={{ padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }}>
      
      {/* Shop Overlay */}
      {gameState.gamePhase === 'SHOP' && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
              <h2 className="text-3xl md:text-4xl text-white mb-2">Round Cleared!</h2>
              <p className="text-lg md:text-xl text-green-400 mb-6">Current Money: ${gameState.money}</p>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
                  {gameState.shopOptions.map(option => (
                      <div key={option.id} className="flex flex-col items-center gap-2">
                        <JokerCard 
                            joker={option} 
                            inShop={true} 
                            onClick={() => buyJoker(option)} 
                        />
                        <button 
                            onClick={() => buyJoker(option)}
                            disabled={gameState.money < option.cost}
                            className={`px-3 py-1 rounded text-sm md:text-base text-white ${gameState.money < option.cost ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'}`}
                        >
                            Buy ${option.cost}
                        </button>
                      </div>
                  ))}
              </div>

              <button 
                onClick={skipShop}
                className="px-6 py-2 md:px-8 md:py-3 bg-red-600 hover:bg-red-500 text-white rounded text-lg md:text-xl border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
              >
                  Skip Shop
              </button>
          </div>
      )}

      {/* Game Over Overlay */}
      {gameState.gamePhase === 'GAME_OVER' && (
          <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
              <h1 className="text-5xl md:text-6xl text-red-600 mb-4">GAME OVER</h1>
              <p className="text-xl md:text-2xl text-white mb-8">Reached Round {gameState.round}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                  Try Again
              </button>
          </div>
      )}

      {/* Main Game Container */}
      <div className="w-full max-w-7xl h-full flex flex-col md:flex-row p-1 md:p-2 gap-2 relative z-10">
        
        {/* LEFT PANEL: Stats */}
        {/* Fixed width on md to save space for landscape play area */}
        <div className="w-full md:w-56 flex-shrink-0 flex flex-col gap-1 md:gap-2 overflow-y-auto no-scrollbar">
          
          {/* Blind Info */}
          <div className="bg-blue-600 border-2 md:border-4 border-slate-800 rounded-xl p-1 md:p-2 shadow-lg text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="bg-red-500 rounded-xl w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 border-red-700 shadow-inner flex-shrink-0 transform rotate-[-2deg]">
                <span className="text-center text-[9px] md:text-[10px] font-bold leading-tight uppercase">Small<br/>Blind</span>
              </div>
              <div className="text-right overflow-hidden flex flex-col justify-center">
                <div className="text-[9px] md:text-[11px] uppercase opacity-90 whitespace-nowrap font-bold text-blue-100">Score at least</div>
                <div className="text-2xl md:text-4xl font-bold text-white drop-shadow-md leading-none tracking-wide">{gameState.targetScore}</div>
              </div>
            </div>
          </div>

          {/* Current Score */}
          <div className="bg-slate-800 border-2 md:border-4 border-slate-900 rounded-xl p-1 md:p-2 flex flex-row md:flex-col items-center justify-between md:justify-center gap-1 shadow-inner">
             <div className="text-[10px] md:text-xs text-slate-400 uppercase font-bold tracking-wider">Round Score</div>
             <div className="text-3xl md:text-4xl text-white font-bold tracking-widest drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">{gameState.currentScore}</div>
          </div>

          {/* Visual Divider */}
          <div className="h-0.5 bg-slate-700/50 w-full my-0.5"></div>

          {/* Hand/Discard Counters (Retro Style) */}
          <div className="grid grid-cols-2 gap-2">
             <RetroStat label="Hands" value={gameState.handsRemaining} type="blue" />
             <RetroStat label="Discards" value={gameState.discardsRemaining} type="red" />
          </div>

           {/* Money */}
           <div className="w-full">
             <RetroStat value={`$${gameState.money}`} type="money" />
           </div>

           {/* Ante & Round */}
           <div className="grid grid-cols-2 gap-2">
             <RetroStat label="Ante" value={gameState.ante} subValue="/ 8" type="orange" />
             <RetroStat label="Round" value={gameState.round} type="orange" />
          </div>

          {/* Joker / AI Message Area */}
          <div className="flex-grow bg-black/40 rounded border-2 border-dashed border-slate-600 p-2 relative min-h-[60px] max-h-[150px] mt-1">
             <div className="absolute -top-2 md:-top-3 left-2 bg-purple-600 text-white text-[10px] md:text-xs px-2 py-0.5 rounded border border-white">Joker</div>
             <p className="text-green-400 text-xs md:text-sm leading-tight mt-2 font-sans animate-pulse">
                 {gameState.isThinking ? "Analyzing..." : `"${gameState.jokerMessage}"`}
             </p>
             <button 
                onClick={askJoker}
                disabled={gameState.isThinking}
                className="absolute bottom-1 right-1 bg-purple-700 hover:bg-purple-600 text-white text-[10px] px-2 py-1 rounded border border-purple-400 z-20"
             >
                ASK
             </button>
          </div>

        </div>

        {/* RIGHT PANEL: Play Area */}
        <div className="flex-grow bg-[#355c46] rounded-xl border-4 sm:border-8 border-slate-700 relative shadow-2xl flex flex-col overflow-hidden">
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

            {/* TOP JOKER RACK */}
            {/* Compact height for mobile landscape */}
            <div className="h-16 sm:h-24 md:h-32 w-full flex items-center justify-center gap-1 sm:gap-2 p-1 border-b-4 border-black/20 bg-black/10 flex-shrink-0">
                {gameState.jokers.length === 0 && <div className="text-white/20 text-xs sm:text-sm">Joker Slots (Empty)</div>}
                {gameState.jokers.map((joker) => (
                    <JokerCard key={joker.id} joker={joker} />
                ))}
            </div>

            {/* Play Info (Predicted Score) - "Select up related area" */}
            <div className="h-8 sm:h-14 md:h-20 flex items-center justify-center gap-2 sm:gap-8 bg-black/20 p-0.5 sm:p-1 relative z-0 flex-shrink-0">
                {gameState.selectedCardIds.length > 0 ? (
                    <>
                        <div className="bg-blue-600 text-white px-2 py-0.5 rounded border-2 border-blue-400 shadow-lg hidden sm:block">
                             <div className="text-[10px] uppercase">Hand Type</div>
                             <div className="text-sm md:text-xl font-bold">{currentHandEvaluation.name}</div>
                        </div>
                        {/* Small screen only hand name */}
                         <div className="sm:hidden text-white font-bold text-xs mr-2 whitespace-nowrap">{currentHandEvaluation.name}</div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Chips */}
                            <div className="bg-white text-blue-900 font-bold text-sm sm:text-xl md:text-2xl px-1 sm:px-2 py-0.5 rounded-l border-2 border-r-0 border-slate-400 flex flex-col items-center leading-none">
                                <span>
                                    {(currentProjectedScore as any).details?.baseChips + (currentProjectedScore as any).details?.cardChips + (currentProjectedScore as any).details?.bonusChips}
                                </span>
                                <span className="text-[6px] sm:text-[10px] text-slate-500">CHIPS</span>
                            </div>
                            {/* Mult */}
                            <div className="bg-red-500 text-white font-bold text-sm sm:text-xl md:text-2xl px-1 sm:px-2 py-0.5 rounded-r border-2 border-l-0 border-slate-400 flex flex-col items-center leading-none">
                                <span>
                                   {((currentProjectedScore as any).details?.baseMult + (currentProjectedScore as any).details?.bonusMult) * (currentProjectedScore as any).details?.xMult}
                                </span>
                                <span className="text-[6px] sm:text-[10px] text-red-200">MULT</span>
                            </div>
                        </div>
                        <div className="text-yellow-300 font-bold text-sm sm:text-xl drop-shadow-md ml-2">
                            = {(currentProjectedScore as any).total}
                        </div>
                    </>
                ) : (
                    <div className="text-white/50 text-xs md:text-lg italic">Select up to 5 cards</div>
                )}
            </div>

            {/* Card Area */}
            <div className="flex-grow flex items-center justify-center p-1 sm:p-4 overflow-visible relative min-h-[120px] z-10 pt-4">
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
            <div className="bg-slate-900/95 p-1 flex items-center gap-2 border-t-2 border-slate-700 relative z-30 flex-shrink-0 h-12 md:h-16 backdrop-blur-sm shadow-[0_-4px_6px_rgba(0,0,0,0.3)]">
                
                <div className="flex gap-1 md:gap-2 w-auto h-full items-center">
                    <button onClick={() => handleSort('rank')} className="h-full bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 md:px-5 rounded-sm border-b-4 border-slate-900 active:border-b-0 active:border-t-4 active:scale-95 transition-all text-lg md:text-xl font-bold uppercase tracking-wider font-vt323 shadow-md">Rank</button>
                    <button onClick={() => handleSort('suit')} className="h-full bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 md:px-5 rounded-sm border-b-4 border-slate-900 active:border-b-0 active:border-t-4 active:scale-95 transition-all text-lg md:text-xl font-bold uppercase tracking-wider font-vt323 shadow-md">Suit</button>
                </div>

                <div className="flex-grow"></div>

                <div className="flex gap-1 md:gap-2 h-full items-center">
                    <div className="w-20 sm:w-32 h-full">
                        <GameButton 
                            label="Discard" 
                            color="red" 
                            onClick={handleDiscard} 
                            disabled={gameState.selectedCardIds.length === 0 || gameState.discardsRemaining === 0}
                            subLabel={`-$${1}`} 
                        />
                    </div>
                    <div className="w-24 sm:w-40 h-full">
                        <GameButton 
                            label="Play Hand" 
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