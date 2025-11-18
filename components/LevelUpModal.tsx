// components/LevelUpModal.tsx
import React, { useState, useMemo } from 'react';
import { Pokemon, PokemonAttributes } from '../types';
import { getEvolutionStageCount } from '../utils/pokemonUtils';

interface LevelUpModalProps {
    pokemonToLevelUp: Pokemon;
    asiEvents: number[];
    isPeakPower: boolean;
    onConfirm: (finalPokemon: Pokemon) => void;
    onCancel: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ pokemonToLevelUp, asiEvents, isPeakPower, onConfirm, onCancel }) => {
    const evolutionStages = useMemo(() => getEvolutionStageCount(pokemonToLevelUp.id), [pokemonToLevelUp.id]);
    
    const pointsPerASI = useMemo(() => {
        if (evolutionStages === 1) return 4;
        if (evolutionStages === 2) return 3;
        return 2; // 3 or more stages
    }, [evolutionStages]);
    
    const totalAsiPoints = asiEvents.length * pointsPerASI;

    const [distributedAttributes, setDistributedAttributes] = useState<PokemonAttributes>(pokemonToLevelUp.attributes);
    // FIX: Changed state type to PokemonAttributes for better type safety.
    const [pointsSpent, setPointsSpent] = useState<PokemonAttributes>({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });
    const [peakPowerStat, setPeakPowerStat] = useState<keyof PokemonAttributes | null>(null);

    const totalPointsSpent = useMemo(() => Object.values(pointsSpent).reduce((a, b) => a + b, 0), [pointsSpent]);
    const remainingAsiPoints = totalAsiPoints - totalPointsSpent;

    const handleAttributeChange = (attr: keyof PokemonAttributes, amount: number) => {
        const currentVal = distributedAttributes[attr];
        
        if (amount < 0 && currentVal <= pokemonToLevelUp.attributes[attr]) return;
        if (amount > 0 && remainingAsiPoints <= 0) return;
        if (amount > 0 && currentVal >= 20) return;

        // FIX: Removed unnecessary `|| 0` fallback now that types are stricter.
        setDistributedAttributes(prev => ({ ...prev, [attr]: prev[attr] + amount }));
        setPointsSpent(prev => ({ ...prev, [attr]: prev[attr] + amount }));
    };

    const handleConfirmClick = () => {
        let finalAttributes = { ...distributedAttributes };
        if (isPeakPower && peakPowerStat) {
            finalAttributes[peakPowerStat] = (finalAttributes[peakPowerStat] || 0) + 2;
        }

        const finalPokemon = {
            ...pokemonToLevelUp,
            attributes: finalAttributes,
        };
        onConfirm(finalPokemon);
    };
    
    const peakPowerMax = pokemonToLevelUp.sr >= 15 ? 30 : 22;
    const isConfirmDisabled = (totalAsiPoints > 0 && remainingAsiPoints !== 0) || (isPeakPower && !peakPowerStat);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Leveled Up!</h2>
                    <p className="text-sm text-gray-500">Distribute your attribute points.</p>
                </div>

                <div className="p-5 space-y-4">
                    {totalAsiPoints > 0 && (
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Ability Score Improvement (ASI)</h3>
                            <p className={`text-center font-bold p-2 rounded-md ${remainingAsiPoints === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {remainingAsiPoints} / {totalAsiPoints} Points Remaining
                            </p>
                            <p className="text-xs text-center text-gray-500 mt-1">Gained at levels: {asiEvents.join(', ')}. Max stat value of 20.</p>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {Object.keys(pokemonToLevelUp.attributes).map(key => (
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
                    )}
                    {isPeakPower && (
                        <div>
                             <h3 className="font-bold text-lg text-gray-800">Peak Power (Level 20)</h3>
                             <p className="text-sm text-gray-600 mb-2">Choose one ability score to increase by 2, up to a maximum of {peakPowerMax}.</p>
                             <div className="space-y-1">
                                {Object.keys(pokemonToLevelUp.attributes).map(key => {
                                    const attrKey = key as keyof PokemonAttributes;
                                    const finalValue = distributedAttributes[attrKey] + 2;
                                    const isDisabled = finalValue > peakPowerMax;
                                    return (
                                        <label key={key} className={`flex items-center p-2 rounded-md transition-colors ${peakPowerStat === key ? 'bg-blue-100' : 'hover:bg-gray-50'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                            <input type="radio" name="peak-power" value={key} disabled={isDisabled} checked={peakPowerStat === key} onChange={() => setPeakPowerStat(attrKey)} className="mr-3" />
                                            <span className="font-semibold uppercase">{key}:</span>
                                            <span className="ml-auto">{distributedAttributes[attrKey]} → <span className="font-bold text-green-600">{finalValue}</span></span>
                                        </label>
                                    )
                                })}
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-gray-50 flex justify-end items-center gap-3">
                    <button onClick={onCancel} className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmClick}
                        disabled={isConfirmDisabled}
                        className="px-5 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpModal;
