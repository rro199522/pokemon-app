// components/ItemdexListScreen.tsx
import React, { useState } from 'react';
import { Item } from '../types';
import { ITEM_DATA } from '../itemData';

const ItemdexListScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = ITEM_DATA.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-grow p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Itemdex</h2>
      
      <div className="px-2">
        <input
          type="text"
          placeholder="Buscar Item..."
          className="w-full p-3 mb-4 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Campo de busca de itens"
        />
      </div>

      <div className="flex-grow overflow-y-auto px-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item: Item) => (
            <div
              key={item.id}
              className="grid grid-cols-[auto,1fr,auto] items-center w-full p-3 mb-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm gap-4"
            >
              {/* Coluna da Imagem */}
              <img
                src={item.media.sprite}
                alt={item.name}
                className="w-10 h-10 object-contain"
              />
              
              {/* Coluna do Nome e Descrição */}
              <div>
                <span className="text-md font-semibold text-gray-800">{item.name}</span>
                <p className="text-sm text-gray-600 capitalize">{item.description[0]}</p>
              </div>

              {/* Coluna do Custo e Tipo */}
              <div className="text-right">
                <span className="text-md font-semibold text-gray-700">${item.cost}</span>
                <p className="text-xs text-gray-500 capitalize">{item.type}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhum item encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ItemdexListScreen;