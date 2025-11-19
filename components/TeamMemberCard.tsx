
// components/TeamMemberCard.tsx
import React from 'react';
import { Pokemon } from '../types.ts';
import LazyImage from './LazyImage.tsx';

interface TeamMemberCardProps {
    pokemon: Pokemon;
    onShowDetails: (p: Pokemon) => void;
    onRemovePokemon: (id: string) => void;
    onSetActive: (id: string) => void;
    onSetInactive: (id: string) => void;
    isActiveMember: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = React.memo(({
    pokemon,
    onShowDetails,
    onRemovePokemon,
    onSetActive,
    onSetInactive,
    isActiveMember
}) => {
    // Calculate basic stats for quick view
    const currentHp = pokemon.currentHp ?? pokemon.hp;
    const hpPercent = Math.min(100, (currentHp / pokemon.hp) * 100);
    
    return (
        <div className="flex items-center p-3 mb-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="relative cursor-pointer" onClick={() => onShowDetails(pokemon)}>
                <div className="w-14 h-14 bg-gray-50 rounded-full p-1 border border-gray-100 group-hover:border-blue-200 transition-colors">
                     <LazyImage 
                        src={pokemon.media.sprite} 
                        alt={pokemon.name} 
                        className="w-full h-full object-contain" 
                    />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                    Lv.{pokemon.minLevel}
                </div>
            </div>
            
            <div className="flex-grow ml-3 min-w-0 cursor-pointer" onClick={() => onShowDetails(pokemon)}>
                <p className="font-bold text-gray-800 truncate">{pokemon.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                     <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-500 ${hpPercent < 30 ? 'bg-red-500' : hpPercent < 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${hpPercent}%` }}
                        ></div>
                     </div>
                     <span className="text-[10px] text-gray-500 font-medium">{currentHp}/{pokemon.hp}</span>
                </div>
            </div>
            
            <div className="flex gap-1 ml-2">
                {isActiveMember 
                    ? <button onClick={() => onSetInactive(pokemon.instanceId!)} className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors" aria-label="Move to PC" title="Move to PC Box">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>
                    : <button onClick={() => onSetActive(pokemon.instanceId!)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" aria-label="Add to Team" title="Add to Active Team">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                }
                <button onClick={() => onRemovePokemon(pokemon.instanceId!)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" aria-label="Release" title="Release Pokemon">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
});

export default TeamMemberCard;
