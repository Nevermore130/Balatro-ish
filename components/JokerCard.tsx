import React, { useState } from 'react';
import { JokerInstance, JokerDefinition } from '../types';
import { JOKER_DEFINITIONS, COLORS } from '../constants';

interface JokerCardProps {
  joker: JokerInstance | JokerDefinition;
  onClick?: () => void;
  inShop?: boolean;
}

const JokerCard: React.FC<JokerCardProps> = ({ joker, onClick, inShop }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Handle both Instance and Definition (Shop uses Definition)
  const defId = 'defId' in joker ? joker.defId : joker.id;
  const def = JOKER_DEFINITIONS[defId] || joker as JokerDefinition;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Uncommon': return COLORS.rarityUncommon;
      case 'Rare': return COLORS.rarityRare;
      case 'Legendary': return COLORS.rarityLegendary;
      default: return COLORS.rarityCommon;
    }
  };

  const rarityColor = getRarityColor(def.rarity);

  return (
    <div 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
            relative flex flex-col items-center justify-center text-center
            bg-slate-800 border-4 
            shadow-lg overflow-visible
            transition-transform hover:scale-105 cursor-pointer
            ${inShop 
                ? 'w-28 h-44 sm:w-32 sm:h-48 p-2' 
                : 'w-12 h-20 sm:w-16 sm:h-24 md:w-20 md:h-32 p-1'}
            hover:z-50
        `}
        style={{ borderColor: rarityColor }}
    >
      {/* Art Placeholder */}
      <div className={`
        ${inShop ? 'w-16 h-16 sm:w-20 sm:h-20 mb-2' : 'w-8 h-8 sm:w-10 sm:h-10 mb-1'}
        bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center
      `}>
        <span className={`${inShop ? 'text-2xl sm:text-3xl' : 'text-base sm:text-xl'} select-none`}>🤡</span>
      </div>

      {/* Name */}
      <div className={`font-bold text-white uppercase leading-none ${inShop ? 'text-xs sm:text-sm mb-1' : 'text-[8px] sm:text-[10px]'}`}>
        {def.name}
      </div>

      {/* Description (Shop Only usually) */}
      {inShop && (
         <div className="text-[10px] text-slate-300 leading-tight mt-1 hidden sm:block">
            {def.description}
         </div>
      )}
      
      {/* Price (Shop Only) */}
      {inShop && (
        <div className="absolute top-1 right-1 bg-yellow-600 text-white text-xs px-1 rounded shadow">
            ${def.cost}
        </div>
      )}

      {/* Rarity Badge (Shop Only) */}
      {inShop && (
         <div 
            className="absolute top-1 left-1 text-[8px] px-1 rounded text-white font-bold uppercase"
            style={{ backgroundColor: rarityColor }}
         >
            {def.rarity}
         </div>
      )}

      {/* Tooltip (Non-Shop Only) */}
      {!inShop && isHovered && (
          <div className="absolute top-full mt-2 w-40 sm:w-48 bg-slate-900 border-4 rounded p-2 z-50 pointer-events-none shadow-2xl left-1/2 transform -translate-x-1/2" 
               style={{ borderColor: rarityColor }}>
              <div className="flex flex-col gap-1">
                  <div className="font-bold text-sm uppercase text-center" style={{ color: rarityColor }}>{def.name}</div>
                  <div className="text-center text-[10px] bg-white/10 text-white px-1 rounded self-center">{def.rarity}</div>
                  <div className="text-xs text-white text-center leading-tight mt-1">{def.description}</div>
              </div>
          </div>
      )}

    </div>
  );
};

export default JokerCard;