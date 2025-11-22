import React from 'react';
import JokerCard from './components/JokerCard';
import { JOKER_DEFINITIONS } from './constants';

interface TestJokerShopProps {
  onBack: () => void;
}

const TestJokerShop: React.FC<TestJokerShopProps> = ({ onBack }) => {
  const allJokers = Object.values(JOKER_DEFINITIONS);

  return (
    <div className="min-h-screen bg-slate-900 p-8 font-vt323 text-white overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400">Joker Shop Preview (Dev)</h1>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
          >
            Back to Game
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {allJokers.map((joker) => (
            <div key={joker.id} className="flex flex-col items-center gap-4 p-4 bg-black/30 rounded-xl border border-white/10">
              <JokerCard joker={joker} inShop={true} />
              <div className="text-center">
                <div className="text-lg font-bold text-blue-200">{joker.name}</div>
                <div className="text-sm text-slate-400">${joker.cost}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-4 bg-slate-800 rounded border border-slate-700">
            <h2 className="text-2xl mb-4 text-slate-300">Debug Info</h2>
            <pre className="text-xs text-green-400 bg-black p-4 rounded overflow-x-auto">
                {JSON.stringify(allJokers, null, 2)}
            </pre>
        </div>
      </div>
    </div>
  );
};

export default TestJokerShop;


