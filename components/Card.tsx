import React, { useMemo } from 'react';
import { CardData, Suit } from '../types';
import { motion } from 'framer-motion';

interface CardProps {
  card: CardData;
  selected: boolean;
  onClick: (id: string) => void;
  disabled?: boolean;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, selected, onClick, disabled, index }) => {
  const isRed = card.suit === Suit.Hearts || card.suit === Suit.Diamonds;
  
  // Generate stable random values based on card ID so they don't change on re-renders
  const { rotation, yOffset } = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < card.id.length; i++) {
      hash = card.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Reduced rotation: between -2 and 2 degrees
    const r = (Math.abs(hash) % 5) - 2; 
    // Reduced offset: between 0 and 4px
    const y = (Math.abs(hash) % 5);
    return { rotation: r, yOffset: y };
  }, [card.id]);

  const SuitIcon = ({ small }: { small?: boolean }) => {
    const className = small ? "text-sm" : "text-3xl sm:text-4xl md:text-5xl";
    switch (card.suit) {
      case Suit.Hearts: return <span className={`${className} text-[#ef4444]`}>♥</span>;
      case Suit.Diamonds: return <span className={`${className} text-[#f97316]`}>♦</span>;
      case Suit.Clubs: return <span className={`${className} text-[#334155]`}>♣</span>;
      case Suit.Spades: return <span className={`${className} text-[#0f172a]`}>♠</span>;
      default: return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ y: 200, opacity: 0, rotate: rotation }}
      animate={{ 
        y: selected ? -15 : 0 + yOffset, 
        rotate: selected ? 0 : rotation,
        opacity: disabled ? 0.5 : 1,
        scale: selected ? 1.05 : 1,
        filter: selected ? 'brightness(1.15)' : 'brightness(1)',
        zIndex: selected ? 50 + index : index,
      }}
      exit={{ 
        y: -200, 
        opacity: 0, 
        scale: 0.8, 
        transition: { duration: 0.3 } 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        mass: 0.8
      }}
      whileHover={{ 
        y: selected ? -20 : -10,
        scale: 1.1,
        zIndex: 100 + index,
        rotate: 0
      }}
      onClick={() => !disabled && onClick(card.id)}
      className={`
        relative
        w-[16vw] h-[24vw] max-w-[80px] max-h-[120px]
        md:w-20 md:h-32 lg:w-28 lg:h-40
        card-texture rounded-lg
        flex flex-col items-center justify-between
        p-1 md:p-2
        cursor-pointer
        border-2 sm:border-4 border-slate-800
        select-none
        transition-shadow duration-300
        ${selected ? 'shadow-2xl' : 'shadow-hard'}
        flex-shrink-0
      `}
      style={{
        color: isRed ? '#ef4444' : '#0f172a',
        transformOrigin: 'bottom center'
      }}
    >
      {/* Top Left Rank */}
      <div className="self-start font-bold text-lg sm:text-xl md:text-3xl leading-none flex flex-col items-center -ml-1 -mt-1">
        <span>{card.rank}</span>
        <div className="block md:hidden"><SuitIcon small /></div>
      </div>

      {/* Center Suit (Large) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <SuitIcon />
      </div>

      {/* Bottom Right Rank (Inverted) */}
      <div className="self-end font-bold text-lg sm:text-xl md:text-3xl leading-none rotate-180 -mr-1 -mb-1">
        {card.rank}
      </div>
    </motion.div>
  );
};

export default Card;