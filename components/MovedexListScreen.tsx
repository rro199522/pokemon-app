// components/MovedexListScreen.tsx
import React, { useState } from 'react';
import { MOVE_DATA } from '../moveData.ts';
import { Move, PokemonType } from '../types.ts';
import { typeStyles } from './PokemonTypeIcons.tsx';

const englishToPortugueseMap: { [key: string]: string } = {
  'normal': 'normal',
  'fire': 'fogo',
  'water': 'água',
  'grass': 'planta',
  'electric': 'elétrico',
  'ice': 'gelo',
  'fighting': 'lutador',
  'poison': 'veneno',
  'ground': 'terra',
  'flying': 'voador',
  'psychic': 'psíquico',
  'bug': 'inseto',
  'rock': 'pedra',
  'ghost': 'fantasma',
  'dragon': 'dragão',
  'dark': 'sombrio',
  'steel': 'metal',
  'fairy': 'fada',
  'varies': 'normal', // Fallback for 'varies'
  'typeless': 'normal' // Fallback for 'typeless'
};


const MovedexListScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMoves = MOVE_DATA.filter((move) =>
    move.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDetail = (label: string, value: string | number) => (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
      <p className="text-sm text-gray-800 capitalize">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col flex-grow p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Movedex</h2>
      
      <div className="px-2">
        <input
          type="text"
          placeholder="Buscar Golpe..."
          className="w-full p-3 mb-4 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Campo de busca de golpes"
        />
      </div>

      <div className="flex-grow overflow-y-auto px-2">
        {filteredMoves.length > 0 ? (
          filteredMoves.map((move: Move) => {
            const portugueseType = englishToPortugueseMap[move.type.toLowerCase()] || 'normal';
            const styleClass = typeStyles[portugueseType] || 'bg-gray-400 text-white';
            const borderColorVarName = portugueseType.replace(/[áéíóúç]/g, (c: string) => 'aeiouc'['áéíóúç'.indexOf(c)]);

            return (
                <div key={move.id} className="p-4 mb-3 rounded-lg bg-gray-50 shadow-sm border-l-4" style={{ borderColor: `var(--tw-color-${borderColorVarName})` }}>
                    {/* Header: Name and Type */}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-800">{move.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${styleClass}`}>
                            {move.type}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mb-3 border-t border-b border-gray-200 py-2">
                        {formatDetail("Poder", Array.isArray(move.power) ? move.power.join(', ').toUpperCase() : move.power)}
                        {formatDetail("Tempo", move.time)}
                        {formatDetail("PP", move.pp)}
                        {formatDetail("Alcance", move.range)}
                    </div>
                    
                    {/* Description */}
                    <div className="mb-3">
                        {/* FIX: Check if description element is a string before rendering to prevent React child error. */}
                        <p className="text-sm text-gray-700">{Array.isArray(move.description) && typeof move.description[0] === 'string' ? move.description[0] : 'Descrição complexa.'}</p>
                    </div>
                    
                    {/* Higher Levels Damage */}
                    {/* FIX: Corrected typo from `higherlevels` to `higherLevels`. */}
                    {move.higherLevels && (
                      <div>
                          <p className="text-sm font-semibold text-gray-800 mb-2">Dano por Nível</p>
                          {/* FIX: Corrected typo from `higherlevels` to `higherLevels`. */}
                          <p className="text-sm text-gray-700">{move.higherLevels}</p>
                      </div>
                    )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhum golpe encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default MovedexListScreen;