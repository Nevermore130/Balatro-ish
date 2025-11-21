import React, { useState, useMemo } from 'react';
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
  // Fallback if visualStyle is missing
  const visualStyle = def.visualStyle || { bgColor: '#4b5563', patternColor: '#374151', pattern: 'solid', icon: '🃏' };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Uncommon': return COLORS.rarityUncommon;
      case 'Rare': return COLORS.rarityRare;
      case 'Legendary': return COLORS.rarityLegendary;
      default: return COLORS.rarityCommon;
    }
  };

  const rarityColor = getRarityColor(def.rarity);

  // Generate Background Pattern Style using SVG data URIs for crisp retro look
  const bgStyle = useMemo(() => {
    const { bgColor, patternColor, pattern } = visualStyle;
    
    // Helper to create SVG data URI with embedded background color
    const createPattern = (svgPath: string, size: number = 20) => {
      const svgContent = `
        <svg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'>
          <rect width='${size}' height='${size}' fill='${bgColor}'/>
          ${svgPath}
        </svg>
      `.trim();
      return `url("data:image/svg+xml,${encodeURIComponent(svgContent)}")`;
    };

    let cssStyle: React.CSSProperties = {
      backgroundColor: bgColor, // Fallback
      backgroundSize: '20px 20px',
      backgroundRepeat: 'repeat',
    };

    switch (pattern) {
      case 'stripes':
        // Vertical Stripes
        cssStyle.backgroundImage = createPattern(
          `<rect x='0' width='10' height='20' fill='${patternColor}'/>`
        );
        break;
      case 'dots':
        // Polka Dots
        cssStyle.backgroundImage = createPattern(
          `<circle cx='10' cy='10' r='4' fill='${patternColor}'/>`
        );
        break;
      case 'checkers':
        // Checkerboard
        cssStyle.backgroundImage = createPattern(
          `<rect width='10' height='10' fill='${patternColor}'/><rect x='10' y='10' width='10' height='10' fill='${patternColor}'/>`
        );
        break;
      case 'diamonds':
        // Diamond shape (Harlequin)
        cssStyle.backgroundImage = createPattern(
          `<path d='M10 0 L20 10 L10 20 L0 10 Z' fill='${patternColor}'/>`
        );
        break;
      case 'grid':
        // Grid lines
        cssStyle.backgroundImage = createPattern(
          `<path d='M0 0 H20 V20' fill='none' stroke='${patternColor}' stroke-width='2'/>`
        );
        break;
      case 'solid':
      default:
        cssStyle.backgroundImage = 'none';
        cssStyle.backgroundColor = bgColor;
        break;
    }

    return cssStyle;
  }, [visualStyle]);

  return (
    <div 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
            relative flex flex-col items-center justify-center text-center
            border-4 
            shadow-[0_4px_0_rgba(0,0,0,0.5)]
            transition-all duration-150
            cursor-pointer
            ${inShop 
                ? 'w-28 h-44 sm:w-32 sm:h-48 p-2 hover:-translate-y-1' 
                : 'w-12 h-20 sm:w-16 sm:h-24 md:w-20 md:h-32 p-1 hover:-translate-y-1'}
            group
            select-none
        `}
        style={{ 
          borderColor: rarityColor, 
          ...bgStyle 
        }}
    >
       {/* Bevel / Inner Border Effects */}
       <div className="absolute inset-0 border-[2px] border-white/10 pointer-events-none"></div>
       <div className="absolute inset-0 border-b-[3px] border-r-[3px] border-black/20 pointer-events-none"></div>

       {/* Noise Texture Overlay for Material Feel */}
       <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
            style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}>
       </div>

      {/* Art/Icon Container */}
      <div className={`
        relative z-10
        ${inShop ? 'w-16 h-16 sm:w-20 sm:h-20 mb-2' : 'w-8 h-8 sm:w-10 sm:h-10 mb-1'}
        bg-black/20 rounded-lg flex items-center justify-center backdrop-blur-[1px] 
        border-2 border-black/10 shadow-inner
      `}>
        <span className={`
            ${inShop ? 'text-4xl sm:text-5xl' : 'text-xl sm:text-2xl'} 
            filter drop-shadow-md grayscale-0
            transform transition-transform group-hover:scale-110 duration-300
        `}>
            {visualStyle.icon}
        </span>
      </div>

      {/* Name Label */}
      <div className={`
        relative z-10
        font-bold text-white uppercase leading-none tracking-wider
        bg-slate-900/80 px-1.5 py-1 rounded-[2px]
        border border-black/30
        font-vt323
        ${inShop ? 'text-xs sm:text-sm mb-1' : 'text-[8px] sm:text-[10px] max-w-full truncate'}
        text-shadow-sm
      `}>
        {def.name}
      </div>

      {/* Description (Shop Only) */}
      {inShop && (
         <div className="relative z-10 text-[10px] sm:text-xs text-blue-50 font-bold leading-tight mt-1 hidden sm:block bg-slate-900/70 p-1 rounded border border-white/5 text-center font-vt323 w-full">
            {def.description}
         </div>
      )}
      
      {/* Price Tag (Shop Only) */}
      {inShop && (
        <div className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-1 py-0.5 rounded-sm shadow-sm border-b border-amber-700 z-20 font-bold font-vt323">
            ${def.cost}
        </div>
      )}

      {/* Rarity Badge (Shop Only) */}
      {inShop && (
         <div 
            className="absolute top-1 left-1 text-[8px] px-1 py-0.5 rounded-sm text-white font-bold uppercase shadow-sm z-20 border-b border-black/20 font-vt323 tracking-wider"
            style={{ backgroundColor: rarityColor }}
         >
            {def.rarity}
         </div>
      )}

      {/* Tooltip (Play Area Only) */}
      {!inShop && isHovered && (
          <div className="absolute bottom-full mb-2 w-40 bg-slate-900 border-2 rounded p-2 z-[60] pointer-events-none shadow-xl left-1/2 transform -translate-x-1/2" 
               style={{ borderColor: rarityColor }}>
              <div className="flex flex-col gap-1">
                  <div className="font-bold text-base uppercase text-center font-vt323" style={{ color: rarityColor }}>{def.name}</div>
                  <div className="text-center text-[10px] bg-white/10 text-white px-2 py-0.5 rounded self-center uppercase tracking-wider font-vt323">{def.rarity}</div>
                  <div className="text-xs text-slate-200 text-center leading-tight font-vt323">{def.description}</div>
              </div>
              {/* Triangle Arrow */}
              <div className="absolute -bottom-2 left-1/2 -ml-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent" style={{ borderTopColor: rarityColor }}></div>
          </div>
      )}
    </div>
  );
};

export default JokerCard;