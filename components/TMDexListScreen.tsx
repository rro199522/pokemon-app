
// components/TMDexListScreen.tsx
import React, { useState } from 'react';
import { TM } from '../types.ts';

interface TMDexListScreenProps {
    tms: TM[];
}

const TMDexListScreen: React.FC<TMDexListScreenProps> = ({ tms }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTMs = tms.filter((tm) =>
    tm.move.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMoveName = (move: string) => {
    return move.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="flex flex-col flex-grow p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">TMdex</h2>
      
      <div className="px-2">
        <input
          type="text"
          placeholder="Buscar TM..."
          className="w-full p-3 mb-4 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Campo de busca de TMs"
        />
      </div>

      <div className="flex-grow overflow-y-auto px-2">
        {filteredTMs.length > 0 ? (
          filteredTMs.map((tm: TM) => (
            <div
              key={tm.id}
              className="flex items-center w-full p-3 mb-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
            >
              <div className="flex-grow">
                <span className="text-sm font-medium text-gray-500 mr-2">TM{String(tm.id).padStart(2, '0')}</span>
                <span className="text-md font-semibold text-gray-800">{formatMoveName(tm.move)}</span>
              </div>
              <div className="text-right">
                <span className="text-md font-semibold text-gray-700">${tm.cost}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhum TM encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default TMDexListScreen;
