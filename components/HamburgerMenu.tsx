
// components/HamburgerMenu.tsx
import React from 'react';
import { ScreenName } from '../types.ts';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenName) => void;
  currentScreen: ScreenName;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, onNavigate, currentScreen }) => {
  const screens = Object.values(ScreenName);

  return (
    <>
      {/* Overlay - Absolute to cover the container, not the window */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Menu Panel - Absolute within the container */}
      <aside
        className={`absolute top-0 right-0 h-full w-64 bg-red-50 shadow-2xl transform transition-transform duration-300 ease-out z-50 flex flex-col border-l-4 border-red-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <div className="p-6 border-b border-red-200 bg-red-100 flex justify-between items-center">
          <h2 id="menu-title" className="text-xl font-extrabold text-red-800 uppercase tracking-wider">Menu</h2>
          <button onClick={onClose} className="text-red-800 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="p-4 flex-grow overflow-y-auto">
          <ul className="space-y-2">
            {screens.map((screen) => (
              <li key={screen}>
                <button
                  onClick={() => onNavigate(screen)}
                  className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-between group ${
                    currentScreen === screen 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 transform scale-105' 
                      : 'text-red-900 hover:bg-red-100 hover:pl-7'
                  }`}
                >
                  <span>{screen}</span>
                  {currentScreen === screen && (
                    <span className="bg-white/20 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-red-200 text-center text-red-400 text-xs font-medium">
            PokéRPG System v1.1
        </div>
      </aside>
    </>
  );
};
