// components/EvolutionModal.tsx
import React, { useState, useMemo } from 'react';
import { Pokemon, Evolution, PokemonAttributes } from '../types';

interface EvolutionModalProps {
  fromPokemon: Pokemon;
  toPokemonBase: Pokemon;
  evolutionInfo: Evolution;
  onConfirm: (evolvedPokemon: Pokemon) => void;
  onCancel: () => void;
}

const StatChange: React.FC<{ label: string; from: any; to: any }> = ({ label, from, to }) => (
    <div className="flex justify-between items-center py-1.5 px-3 bg-gray-100 rounded">
        <span className="font-semibold text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-gray-500">{from}</span>
            <span className="font-bold text-lg">→</span>
            <span className="font-bold text-green-600">{to}</span>
        </div>
    </div>
);

const EvolutionModal: React.FC<EvolutionModalProps> = ({ fromPokemon, toPokemonBase, evolutionInfo, onConfirm, onCancel }) => {
    const asiPointsToDistribute = useMemo(() => {
        return evolutionInfo.effects.find(e => e.type === 'asi')?.value as number || 0;
    }, [evolutionInfo]);
    
    const [distributedAttributes, setDistributedAttributes] = useState<PokemonAttributes>(fromPokemon.attributes);
    // FIX: Changed state type to PokemonAttributes for better type safety.
    const [pointsSpent, setPointsSpent] = useState<PokemonAttributes>({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });

    const totalPointsSpent = useMemo(() => Object.values(pointsSpent).reduce((a, b) => a + b, 0), [pointsSpent]);
    const remainingPoints = asiPointsToDistribute - totalPointsSpent;

    const handleAttributeChange = (attr: keyof PokemonAttributes, amount: number) => {
        const currentVal = distributedAttributes[attr];
        const spentOnAttr = pointsSpent[attr];

        // Cannot decrease below original value
        if (amount < 0 && currentVal <= fromPokemon.attributes[attr]) return;
        // Cannot increase if no points are left
        if (amount > 0 && remainingPoints <= 0) return;
        // Cannot spend more than 4 points on a single stat
        if (amount > 0 && spentOnAttr >= 4) return;
        // Cannot increase stat above 20
        if (amount > 0 && currentVal >= 20) return;

        // FIX: Removed unnecessary `|| 0` fallback now that types are stricter.
        // FIX: Explicitly cast prev[attr] to number to resolve "unknown" type error.
        setDistributedAttributes(prev => ({ ...prev, [attr]: (prev[attr] as number) + amount }));
        setPointsSpent(prev => ({ ...prev, [attr]: (prev[attr] as number) + amount }));
    };

    const handleConfirmClick = () => {
        // Construct the new evolved Pokemon object
        const evolvedPokemon: Pokemon = {
            ...toPokemonBase, // Base data from the new form
            instanceId: fromPokemon.instanceId, // Keep the same unique ID
            
            // Apply evolution changes based on rules
            attributes: distributedAttributes,
            hp: toPokemonBase.hp + (fromPokemon.minLevel * 2),
            currentHp: Math.min(toPokemonBase.hp + (fromPokemon.minLevel * 2), (fromPokemon.currentHp ?? fromPokemon.hp) + (fromPokemon.minLevel * 2)),
            currentHitDice: parseInt(toPokemonBase.hitDice.split('d')[0] || '1', 10), // Reset hit dice
            
            // Keep dynamic data from the previous form
            statuses: fromPokemon.statuses,
            currentMovesPP: fromPokemon.currentMovesPP, // Pokémon keeps its known moves
            feats: fromPokemon.feats,
            inventory: fromPokemon.inventory,
        };
        onConfirm(evolvedPokemon);
    };

    const newMaxHp = toPokemonBase.hp + (fromPokemon.minLevel * 2);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Evolving to {toPokemonBase.name}</h2>
                    <p className="text-sm text-gray-500">Confirm the changes below.</p>
                </div>

                <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg text-gray-800">Stat Changes</h3>
                    <StatChange label="HP" from={fromPokemon.hp} to={`${newMaxHp} (+${fromPokemon.minLevel * 2})`} />
                    <StatChange label="AC" from={fromPokemon.ac} to={toPokemonBase.ac} />
                    <StatChange label="Hit Dice" from={fromPokemon.hitDice} to={toPokemonBase.hitDice} />
                    
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mt-4">Distribute ASI Points</h3>
                        <p className={`text-center font-bold p-2 rounded-md ${remainingPoints === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {remainingPoints} / {asiPointsToDistribute} Points Remaining
                        </p>
                        <p className="text-xs text-center text-gray-500 mt-1">Max 4 points per stat. Max stat value of 20.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {Object.keys(fromPokemon.attributes).map(key => (
                            <div key={key} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                                <span className="font-bold text-sm uppercase">{key}: {distributedAttributes[key as keyof PokemonAttributes]}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleAttributeChange(key as keyof PokemonAttributes, -1)} className="w-6 h-6 rounded-full bg-red-200 text-red-800 font-bold flex items-center justify-center">-</button>
                                    <button onClick={() => handleAttributeChange(key as keyof PokemonAttributes, 1)} className="w-6 h-6 rounded-full bg-green-200 text-green-800 font-bold flex items-center justify-center">+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-5 bg-gray-50 flex justify-end items-center gap-3">
                    <button onClick={onCancel} className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmClick}
                        disabled={remainingPoints !== 0}
                        className="px-5 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Confirm Evolution
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EvolutionModal;