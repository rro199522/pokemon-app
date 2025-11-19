// components/PokedexListScreen.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Pokemon } from '../types.ts';
import { typeStyles } from './PokemonTypeIcons.tsx';
import LazyImage from './LazyImage.tsx';

interface PokedexListScreenProps {
  onSelectPokemon: (id: string) => void;
  pokedex: Pokemon[];
}

// Hook para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const PokedexListScreen: React.FC<PokedexListScreenProps> = ({ onSelectPokemon, pokedex }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredPokemon = useMemo(() => {
      const lowerTerm = debouncedSearch.toLowerCase();
      return pokedex.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(lowerTerm) || 
        pokemon.type.some(t => t.includes(lowerTerm))
      );
  }, [debouncedSearch, pokedex]);

  return (
    <div className="flex flex-col flex-grow p-4 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Pokedex</h2>
      
      <div className="sticky top-0 bg-white z-10 pb-2">
          <input
            type="text"
            placeholder="Buscar por Nome ou Tipo..."
            className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Campo de busca de Pokémon"
          />
      </div>

      <div className="flex-grow overflow-y-auto space-y-2 pb-4">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((pokemon: Pokemon) => (
              <button
                key={pokemon.id}
                onClick={() => onSelectPokemon(pokemon.id)}
                className="flex items-center w-full p-3 rounded-xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="relative mr-4">
                    <div className="absolute inset-0 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors"></div>
                    <LazyImage
                      src={pokemon.media.sprite}
                      alt={pokemon.name}
                      className="w-12 h-12"
                    />
                </div>
                <div className="flex-grow">
                  <div className="flex items-baseline gap-2 justify-between">
                    <span className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{pokemon.name}</span>
                    <span className="text-xs font-bold text-gray-400">#{String(pokemon.number).padStart(3, '0')}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {pokemon.type.map(t => {
                      const styleClass = typeStyles[t] || 'bg-gray-400 text-white';
                      return (
                        <span key={t} className={`px-2 py-0.5 text-[10px] font-bold rounded-full capitalize shadow-sm ${styleClass}`}>
                          {t}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </button>
            ))
        ) : (
          <div className="text-center py-10">
              <p className="text-gray-400 font-medium">Nenhum Pokémon encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexListScreen;