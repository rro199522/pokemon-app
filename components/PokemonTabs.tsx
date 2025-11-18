// components/PokemonTabs.tsx
import React from 'react';
import { TabName } from '../types.ts';

interface PokemonTabsProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const PokemonTabs: React.FC<PokemonTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-around items-center bg-gray-50 rounded-full p-1 mx-4 sm:mx-6 mb-6 shadow-inner">
      {Object.values(TabName).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          aria-selected={activeTab === tab}
          role="tab"
          className={`
            flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300
            ${activeTab === tab
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default PokemonTabs;