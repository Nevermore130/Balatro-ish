import React from 'react';
import { HAND_SCORES } from '../constants';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface ScoringRulesProps {
  onBack: () => void;
}

const ScoringRules: React.FC<ScoringRulesProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const handTypes = Object.entries(HAND_SCORES).map(([name, scores]) => ({
    name,
    chips: scores.chips,
    mult: scores.mult,
  }));

  // 按分数排序（从高到低）
  const sortedHands = [...handTypes].sort((a, b) => {
    const scoreA = a.chips * a.mult;
    const scoreB = b.chips * b.mult;
    return scoreB - scoreA;
  });

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white uppercase font-vt323">
            {t('scoring.title')}
          </h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg border-2 border-red-400 font-vt323 text-lg"
          >
            {t('common.back')}
          </button>
        </div>

        {/* Introduction */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6 border-2 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-3 font-vt323">{t('scoring.howToCalculate')}</h2>
          <div className="text-slate-300 space-y-2 font-vt323 text-lg">
            <p>{t('scoring.formula')}</p>
            <p className="text-amber-400 mt-3">{t('scoring.baseChips')}</p>
            <p className="text-amber-400">{t('scoring.cardChips')}</p>
            <p className="text-amber-400">{t('scoring.bonusChips')}</p>
            <p className="text-amber-400">{t('scoring.multiplier')}</p>
          </div>
        </div>

        {/* Hand Types Table */}
        <div className="bg-slate-800 rounded-lg border-2 border-slate-700 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {sortedHands.map((hand, index) => {
              const totalScore = hand.chips * hand.mult;
              return (
                <div
                  key={hand.name}
                  className="bg-slate-900 rounded-lg p-4 border-2 border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white font-vt323">{t(`hands.${hand.name}`)}</h3>
                    <div className="text-amber-400 font-bold text-lg font-vt323">
                      {totalScore} {t('scoring.points')}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-vt323">{t('scoring.chips')}:</span>
                      <span className="text-white font-bold font-vt323">{hand.chips}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 font-vt323">{t('scoring.mult')}:</span>
                      <span className="text-white font-bold font-vt323">{hand.mult}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Examples */}
        <div className="mt-6 bg-slate-800 rounded-lg p-4 border-2 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-3 font-vt323">{t('scoring.examples')}</h2>
          <div className="space-y-3 text-slate-300 font-vt323">
            <div className="bg-slate-900 rounded p-3">
              <p className="text-green-400 font-bold mb-1">{t('scoring.example1Title')}</p>
              <p>{t('scoring.example1Desc')}</p>
            </div>
            <div className="bg-slate-900 rounded p-3">
              <p className="text-green-400 font-bold mb-1">{t('scoring.example2Title')}</p>
              <p>{t('scoring.example2Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoringRules;

