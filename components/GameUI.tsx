import React from 'react';

interface StatBoxProps {
  label: string;
  value: string | number;
  colorClass?: string;
  subValue?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, colorClass = "bg-slate-700", subValue }) => (
  <div className={`${colorClass} p-0.5 sm:p-1 rounded-sm border-2 border-slate-900 shadow-sm w-full relative overflow-hidden flex flex-col justify-center`}>
    <div className="text-[8px] sm:text-[10px] text-white/80 uppercase font-bold tracking-wider mb-px leading-none">{label}</div>
    <div className="text-base sm:text-xl md:text-2xl font-bold text-white leading-none drop-shadow-md">{value}</div>
    {subValue && <div className="text-[8px] sm:text-xs text-yellow-300 mt-px leading-none font-bold">{subValue}</div>}
  </div>
);

interface RetroStatProps {
  label?: string;
  value: string | number;
  subValue?: string;
  type: 'blue' | 'red' | 'money' | 'orange';
  className?: string;
}

export const RetroStat: React.FC<RetroStatProps> = ({ label, value, subValue, type, className = '' }) => {
  let textColor = '';
  // Using slate-800 for background to match the reference image dark grey look
  const boxColor = 'bg-slate-800'; 
  const borderColor = 'border-slate-900';

  switch (type) {
    case 'blue': textColor = 'text-blue-400'; break;
    case 'red': textColor = 'text-red-500'; break;
    case 'money': textColor = 'text-amber-400'; break;
    case 'orange': textColor = 'text-orange-500'; break;
  }

  const isMoney = type === 'money';

  return (
    <div className={`
      relative flex flex-col items-center justify-center 
      pixel-stat-box ${boxColor}
      ${isMoney ? 'py-1 md:py-1.5' : 'py-0.5 md:py-1'}
      ${className}
      w-full
    `}>
      {label && (
        <div className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-[-2px]" style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.5)' }}>
          {label}
        </div>
      )}
      <div className={`
        font-vt323 font-bold leading-none 
        ${textColor} 
        ${isMoney ? 'text-2xl md:text-3xl tracking-widest' : 'text-xl md:text-2xl'}
      `} style={{
        textShadow: isMoney 
          ? '2px 2px 0px rgba(0, 0, 0, 0.8)' 
          : '2px 2px 0px rgba(0, 0, 0, 0.6)',
      }}>
        {value}
        {subValue && <span className="text-white/50 text-sm md:text-lg ml-1 align-baseline font-normal" style={{ textShadow: '1px 1px 0px rgba(0, 0, 0, 0.5)' }}>{subValue}</span>}
      </div>
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  label: string;
  color: 'blue' | 'orange' | 'red' | 'gray';
  disabled?: boolean;
  subLabel?: string;
}

export const GameButton: React.FC<ButtonProps> = ({ onClick, label, color, disabled, subLabel }) => {
  const colorMap = {
    blue: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-800',
    orange: 'bg-orange-600 hover:bg-orange-500 text-white border-orange-800',
    red: 'bg-red-600 hover:bg-red-500 text-white border-red-800',
    gray: 'bg-slate-600 hover:bg-slate-500 text-slate-200 border-slate-800',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${colorMap[color]}
        font-bold 
        px-2 md:px-4
        rounded-[4px]
        border-b-4 border-r-2 border-l-2 border-t-0
        active:border-b-0 active:border-t-4 active:translate-y-1
        transition-all w-full h-full relative
        flex flex-col items-center justify-center
        shadow-md
        ${disabled ? 'opacity-60 cursor-not-allowed active:border-b-4 active:border-t-0 active:translate-y-0 grayscale filter contrast-75' : ''}
      `}
    >
      <span className="text-base sm:text-lg md:text-xl lg:text-2xl tracking-wide leading-none drop-shadow-sm font-vt323 uppercase">{label}</span>
      {subLabel && <span className="hidden sm:inline text-[9px] sm:text-[10px] text-white/90 font-normal leading-none mt-0.5 tracking-tighter">{subLabel}</span>}
    </button>
  );
};