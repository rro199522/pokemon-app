
// components/AddPokemonForm.tsx
import React, { useState, useMemo } from 'react';
import { Trainer, Pokemon } from '../types.ts';
import { calculateFinalTrainerData } from '../utils/trainerUtils.ts';
import LazyImage from './LazyImage.tsx';

interface AddPokemonFormProps {
    trainer: Trainer;
    onAddPokemon: (pokemon: Pokemon) => void;
    pokedex: Pokemon[];
}

const AddPokemonForm: React.FC<AddPokemonFormProps> = React.memo(({ trainer, onAddPokemon, pokedex }) => {
    const [searchTerm, setSearchTerm] = useState('');
    // Memoize search to prevent lag on typing
    const searchResults = useMemo(() => {
         if (searchTerm.length < 2) return [];
         // We only filter by name and SR here, ensuring it uses the passed pokedex prop
         const finalTrainerData = calculateFinalTrainerData(trainer);
         return pokedex.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
            p.sr <= finalTrainerData.maxSr
        ).slice(0, 5);
    }, [searchTerm, trainer, pokedex]);

    return (
        <div className="mt-6 p-4 bg-gray-50 border-t border-gray-200 rounded-t-2xl">
            <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Add New Pokémon</h3>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search Species..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow"
                />
                {searchTerm.length >= 2 && searchResults.length === 0 && (
                    <div className="absolute top-full left-0 right-0 p-2 text-center text-gray-500 text-sm bg-white mt-1 rounded shadow z-10">No results found within your SR limit.</div>
                )}
            </div>
            
            <div className="mt-2 space-y-1">
                {searchResults.map(pokemon => (
                    <button
                        key={pokemon.id}
                        onClick={() => {
                            onAddPokemon(pokemon);
                            setSearchTerm('');
                        }}
                        className="flex items-center w-full text-left p-2 bg-white hover:bg-blue-50 rounded-lg border border-gray-100 shadow-sm transition-colors group"
                    >
                         <div className="w-8 h-8 mr-2 relative">
                            <LazyImage src={pokemon.media.sprite} alt="" className="w-full h-full object-contain" />
                         </div>
                        <div>
                             <span className="font-bold text-gray-800 group-hover:text-blue-700">{pokemon.name}</span>
                             <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-1.5 py-0.5 rounded">SR {pokemon.sr}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
});

export default AddPokemonForm;
