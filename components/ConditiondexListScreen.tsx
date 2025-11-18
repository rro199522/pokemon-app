// components/ConditiondexListScreen.tsx
import React, { useState } from 'react';
import { Condition } from '../types';
import { CONDITION_DATA } from '../conditionData';

const ConditiondexListScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConditions = CONDITION_DATA.filter((condition) =>
    condition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-grow p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Condições</h2>
      
      <div className="px-2">
        <input
          type="text"
          placeholder="Buscar Condição..."
          className="w-full p-3 mb-4 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Campo de busca de Condições"
        />
      </div>

      <div className="flex-grow overflow-y-auto px-2">
        {filteredConditions.length > 0 ? (
          filteredConditions.map((condition: Condition) => (
            <div
              key={condition.id}
              className="w-full p-3 mb-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
            >
              <h3 className="text-md font-semibold text-gray-800 capitalize">{condition.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhuma condição encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default ConditiondexListScreen;