
// components/AbilitydexListScreen.tsx
import React, { useState } from 'react';
import { Ability } from '../types.ts';

interface AbilitydexListScreenProps {
    abilities: Ability[];
}

const AbilitydexListScreen: React.FC<AbilitydexListScreenProps> = ({ abilities }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAbilities = abilities.filter((ability) =>
    ability.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-grow p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Habilidades</h2>
      
      <div className="px-2">
        <input
          type="text"
          placeholder="Buscar Habilidade..."
          className="w-full p-3 mb-4 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Campo de busca de Habilidades"
        />
      </div>

      <div className="flex-grow overflow-y-auto px-2">
        {filteredAbilities.length > 0 ? (
          filteredAbilities.map((ability: Ability) => (
            <div
              key={ability.id}
              className="w-full p-3 mb-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
            >
              <h3 className="text-md font-semibold text-gray-800 capitalize">{ability.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{ability.description}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhuma habilidade encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default AbilitydexListScreen;
