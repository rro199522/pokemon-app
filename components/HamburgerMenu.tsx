// components/HamburgerMenu.tsx
import React from 'react';
import { ScreenName } from '../types.ts';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenName) => void;
  currentScreen: ScreenName;
  onLogout: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, onNavigate, currentScreen, onLogout }) => {
  const screens = Object.values(ScreenName);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Menu Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <div className="p-4 border-b border-gray-200">
          <h2 id="menu-title" className="text-lg font-semibold text-gray-800">Navegação</h2>
        </div>
        <nav className="p-2 flex-grow">
          <ul>
            {screens.map((screen) => (
              <li key={screen}>
                <button
                  onClick={() => onNavigate(screen)}
                  className={`w-full text-left px-4 py-2 rounded-md text-gray-700 font-medium transition-colors duration-200 ${
                    currentScreen === screen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  {screen}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-2 border-t border-gray-200">
           <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 rounded-md text-red-600 font-medium transition-colors duration-200 hover:bg-red-50"
            >
              Logout
            </button>
        </div>
      </aside>
    </>
  );
};