import React from 'react';
import { JOKER_DEFINITIONS, COLORS } from '../constants';
import JokerCard from './JokerCard';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface JokerGalleryProps {
  onBack: () => void;
}

const JokerGallery: React.FC<JokerGalleryProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const allJokers = Object.values(JOKER_DEFINITIONS);
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Uncommon': return COLORS.rarityUncommon;
      case 'Rare': return COLORS.rarityRare;
      case 'Legendary': return COLORS.rarityLegendary;
      default: return COLORS.rarityCommon;
    }
  };

  const jokersByRarity = {
    Common: allJokers.filter(j => j.rarity === 'Common'),
    Uncommon: allJokers.filter(j => j.rarity === 'Uncommon'),
    Rare: allJokers.filter(j => j.rarity === 'Rare'),
    Legendary: allJokers.filter(j => j.rarity === 'Legendary'),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white uppercase font-vt323">
            {t('gallery.title')}
          </h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg border-2 border-red-400 font-vt323 text-lg"
          >
            {t('common.back')}
          </button>
        </div>

        {/* Rarity Sections */}
        {Object.entries(jokersByRarity).map(([rarity, jokers]) => {
          if (jokers.length === 0) return null;
          const rarityColor = getRarityColor(rarity);
          
          return (
            <div key={rarity} className="mb-8">
              <div 
                className="text-2xl md:text-3xl font-bold uppercase mb-4 px-3 py-1 inline-block rounded-lg font-vt323"
                style={{ 
                  backgroundColor: rarityColor,
                  color: 'white',
                }}
              >
                {t(`gallery.${rarity.toLowerCase()}`)}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {jokers.map((joker) => (
                  <div key={joker.id} className="flex flex-col items-center">
                    <JokerCard joker={joker} inShop={true} />
                    <div className="mt-2 text-center">
                      <div className="text-white font-bold text-sm font-vt323">{joker.name}</div>
                      <div className="text-slate-300 text-xs font-vt323 mt-1">{joker.description}</div>
                      <div className="text-amber-400 text-xs font-vt323 mt-1">${joker.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default JokerGallery;

