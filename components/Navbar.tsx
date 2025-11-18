import React from 'react';
import { ScreenName } from '../types.ts';

interface NavbarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const screens = Object.values(ScreenName);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 sm:p-3 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex flex-wrap justify-center items-center gap-1 sm:gap-2">
        {/* Optional: Add a subtle Pokedex logo or title here if desired */}
        {screens.map((screen) => (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            aria-current={currentScreen === screen ? 'page' : undefined}
            className={`
              px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300
              ${currentScreen === screen
                ? 'bg-white text-blue-700 shadow-md transform scale-105'
                : 'text-white hover:bg-blue-500 hover:bg-opacity-80'
              }
            `}
          >
            {screen}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;