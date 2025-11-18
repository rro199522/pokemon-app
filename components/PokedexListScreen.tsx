// components/PokedexListScreen.tsx
import React, { useState } from 'react';
import { Pokemon } from '../types';
import { typeStyles } from './PokemonTypeIcons';

interface PokedexListScreenProps {
  onSelectPokemon: (id: string) => void; // <-- ID is now a string
  pokedex: Pokemon[];
}

const PokedexListScreen: React.FC<PokedexListScreenProps> = ({ onSelectPokemon, pokedex }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemon = pokedex.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-grow overflow-y-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Pokedex</h2>
      
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        className="w-full p-3 mb-4 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Campo de busca de Pokémon"
      />

      <div className="flex-grow overflow-y-auto -mx-2">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((pokemon: Pokemon) => {
            return (
              <button
                key={pokemon.id}
                onClick={() => onSelectPokemon(pokemon.id)}
                className="flex items-center w-full p-2 mb-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm text-left"
                aria-label={`Ver detalhes de ${pokemon.name}`}
              >
                <img
                  src={pokemon.media.sprite} // <-- Updated image source
                  alt={pokemon.name}
                  className="w-12 h-12 object-contain mr-4 bg-gray-200 rounded-full"
                />
                <div className="flex-grow">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-gray-800">{pokemon.name}</span>
                    <span className="text-sm font-medium text-gray-500">#{String(pokemon.number).padStart(3, '0')}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {pokemon.type.map(t => {
                      const styleClass = typeStyles[t] || 'bg-gray-400 text-white';
                      return (
                        <span key={t} className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${styleClass}`}>
                          {t}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhum Pokémon encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default PokedexListScreen;