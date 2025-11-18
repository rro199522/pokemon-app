// components/PokedexHeader.tsx
import React from 'react';

interface PokedexHeaderProps {
  title: string;
  showBackButton: boolean;
  onBack: () => void;
  onMenuClick: () => void;
}

export const PokedexHeader: React.FC<PokedexHeaderProps> = ({ title, showBackButton, onBack, onMenuClick }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="w-10">
        {showBackButton && (
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
            aria-label="Voltar"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        )}
      </div>
      <h1 className="text-xl font-bold text-gray-800 capitalize">{title}</h1>
      <div className="w-10">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};
