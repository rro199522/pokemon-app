// components/PokemonWeaknessIcon.tsx
import React from 'react';
import { PokemonType, PokemonTypeAbbreviation } from '../types';
import { typeStyles } from './PokemonTypeIcons'; // Centralized icons

interface PokemonWeaknessIconProps {
  type: PokemonType;
  multiplier: string;
}

const PokemonWeaknessIcon: React.FC<PokemonWeaknessIconProps> = ({ type, multiplier }) => {
  const styleClass = typeStyles[type] || 'bg-gray-400 text-white'; // Fallback
  // Get abbreviation from PokemonTypeAbbreviation enum
  const typeAbbreviation = PokemonTypeAbbreviation[type.replace(/[áéíóúç]/g, (c) => 'aeiouc'['áéíóúç'.indexOf(c)]) as keyof typeof PokemonTypeAbbreviation] || type.substring(0, 3).toUpperCase();


  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shadow-inner ${styleClass}`}
        role="img"
        aria-label={`${type} type weakness`}
      >
        <span className="text-[0.6rem] leading-none px-0.5">{typeAbbreviation}</span>
      </div>
      <span className="text-gray-700 text-xs">{multiplier}</span>
    </div>
  );
};

export default PokemonWeaknessIcon;