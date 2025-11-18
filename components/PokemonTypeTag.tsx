// components/PokemonTypeTag.tsx
import React from 'react';
import { PokemonType } from '../types';
import { typeStyles } from './PokemonTypeIcons'; // Import from utility file

interface PokemonTypeTagProps {
  type: PokemonType;
}

const PokemonTypeTag: React.FC<PokemonTypeTagProps> = ({ type }) => {
  const styleClass = typeStyles[type] || 'bg-gray-500 text-white'; // Fallback color

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${styleClass} shadow-md`}
      aria-label={`Pokemon type: ${type}`}
    >
      {type}
    </span>
  );
};

export default PokemonTypeTag;