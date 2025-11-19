import React from 'react';
import { ScreenName } from '../types.ts';

interface NavbarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const screens = Object.values(ScreenName);

  return (
    <nav className="w-full overflow-x-auto whitespace-nowrap p-2 scrollbar-hide">
      <div className="flex space-x-2 px-2">
        {screens.map((screen) => (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200
              ${currentScreen === screen
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
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