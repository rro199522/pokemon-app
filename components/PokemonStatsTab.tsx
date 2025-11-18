// components/PokemonStatsTab.tsx
import React from 'react';
import { Pokemon, Stat } from '../types.ts';
import PokemonWeaknessIcon from './PokemonWeaknessIcon.tsx'; // Corrected import path

interface PokemonStatsTabProps {
  pokemon: Pokemon;
}

const StatBar: React.FC<{ stat: Stat }> = ({ stat }) => {
  const percentage = (stat.value / stat.max) * 100;
  let barColor = 'bg-blue-400';
  if (percentage < 30) {
    barColor = 'bg-red-400';
  } else if (percentage < 60) {
    barColor = 'bg-yellow-400';
  } else {
    barColor = 'bg-green-400';
  }

  return (
    <div className="flex items-center text-gray-700 text-sm mb-1">
      <span className="w-16 font-medium text-right pr-2">{stat.name}</span>
      <span className="w-8 font-bold">{stat.value}</span>
      <div className="flex-grow bg-gray-200 rounded-full h-1.5 ml-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const PokemonStatsTab: React.FC<PokemonStatsTabProps> = ({ pokemon }) => {
  const formatAbilityName = (id: string) => {
    return id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div>
      {/* Stats Section */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Stats</h3>
      <div className="mb-6">
        {/* FIX: Use optional chaining as stats may not exist on all Pokemon objects */}
        {pokemon.stats?.map((stat) => (
          <StatBar key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Weaknesses Section */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Weaknesses</h3>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 mb-6">
        {/* FIX: Use optional chaining as weaknesses may not exist on all Pokemon objects */}
        {pokemon.weaknesses?.map((weakness, index) => (
          <PokemonWeaknessIcon key={index} type={weakness.type} multiplier={weakness.multiplier} />
        ))}
      </div>

      {/* Abilities Section */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Abilities</h3>
      <ul className="list-disc list-inside text-gray-700 text-base">
        {/* FIX: Render ability.id instead of the ability object to fix React child error */}
        {pokemon.abilities.map((ability, index) => (
          <li key={index} className="mb-1">{formatAbilityName(ability.id)}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonStatsTab;