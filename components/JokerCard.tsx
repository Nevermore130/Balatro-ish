import React, { useState, useMemo } from 'react';
import { JokerInstance, JokerDefinition } from '../types';
import { JOKER_DEFINITIONS, COLORS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface JokerCardProps {
  joker: JokerInstance | JokerDefinition;
  onClick?: () => void;
  inShop?: boolean;
}

const JokerCard: React.FC<JokerCardProps> = ({ joker, inShop }) => {
  const { t } = useLanguage();
  const [showInfo, setShowInfo] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Handle both Instance and Definition (Shop uses Definition)
  const defId = 'defId' in joker ? joker.defId : joker.id;
  const def = JOKER_DEFINITIONS[defId] || joker as JokerDefinition;
  // Fallback if visualStyle is missing
  const visualStyle = def.visualStyle || { bgColor: '#4b5563', patternColor: '#374151', pattern: 'solid' };

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
    const { bgColor, patternColor, pattern, imagePath } = visualStyle;
    
    let cssStyle: React.CSSProperties = {
      backgroundColor: bgColor, // Fallback
      backgroundSize: '20px 20px',
      backgroundRepeat: 'repeat',
    };

    if (imagePath) {
      cssStyle.backgroundImage = `url(${imagePath})`;
      cssStyle.backgroundSize = 'cover';
      cssStyle.backgroundPosition = 'center';
      cssStyle.backgroundRepeat = 'no-repeat';
      return cssStyle;
    }

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

  const handleClick = () => {
    if (inShop) {
      setShowInfo(!showInfo);
    } else {
      // 在牌桌上点击时显示详情模态框
      setShowDetailModal(true);
    }
  };

  return (
    <>
    <div 
        onClick={handleClick}
        className={`
            relative flex flex-col items-center justify-center text-center
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

      {/* Art/Icon Container - Removed as per icon property removal */}
      {/* 
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
      */}

      {/* Name Label - REMOVED as per request */}
      
      {/* Description (Shop Only) - REMOVED as per request */}
      
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

      {/* Tooltip (Click to toggle) */}
      {showInfo && (
          <div className="absolute bottom-full mb-2 w-40 bg-slate-900 border-2 rounded p-2 z-[100] pointer-events-none shadow-xl left-1/2 transform -translate-x-1/2" 
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

    {/* 像素风格详情模态框 - 仅在牌桌上显示 */}
    <AnimatePresence>
      {showDetailModal && !inShop && (
        <motion.div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowDetailModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="relative w-[90vw] max-w-md bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
          >
          
          {/* 背景纹理 */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%23ffffff'/%3E%3Crect x='0' y='0' width='2' height='2' fill='%23000000'/%3E%3Crect x='2' y='2' width='2' height='2' fill='%23000000'/%3E%3C/svg%3E")`,
              backgroundSize: '8px 8px',
            }}
          ></div>

          {/* 关闭按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetailModal(false);
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white font-bold text-xl flex items-center justify-center hover:bg-red-500 transition-colors z-50 cursor-pointer"
            type="button"
          >
            ×
          </button>

          {/* 内容区域 */}
          <div className="relative z-10 p-6">
            {/* 标题区域 */}
            <div className="mb-4 pb-4">
              <div 
                className="inline-block px-3 py-1 mb-2 text-white font-bold text-xs uppercase tracking-wider"
                style={{ 
                  backgroundColor: rarityColor,
                  clipPath: 'polygon(0 2px, 2px 2px, 2px 0, calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px))',
                }}
              >
                {t(`gallery.${def.rarity.toLowerCase()}`)}
              </div>
              <h2 
                className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider mb-2"
                style={{ 
                  color: rarityColor,
                  textShadow: '4px 4px 0px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
                  fontFamily: 'VT323, monospace',
                }}
              >
                {def.name}
              </h2>
            </div>

            {/* 卡片预览 */}
            <div className="mb-6 flex justify-center">
              <div 
                className="relative w-32 h-48 sm:w-40 sm:h-60 shadow-[0_8px_0_rgba(0,0,0,0.8)]"
                style={{
                  ...bgStyle,
                }}
              >
              </div>
            </div>

            {/* 描述区域 */}
            <div className="bg-black/40 p-4 mb-4">
              <div className="text-white text-base md:text-lg leading-relaxed font-vt323" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
                {def.description}
              </div>
            </div>

            {/* 类型标签 */}
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm uppercase tracking-wider font-vt323">{t('jokerDetails.type')}:</span>
              <div 
                className="px-3 py-1 bg-blue-600 text-white text-sm font-bold uppercase"
                style={{
                  clipPath: 'polygon(0 2px, 2px 2px, 2px 0, calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px))',
                }}
              >
                {def.type === 'passive' ? t('jokerDetails.passive') : t('jokerDetails.onPlay')}
              </div>
            </div>

           
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default JokerCard;