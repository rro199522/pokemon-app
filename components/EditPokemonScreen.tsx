import React, { useState, useMemo } from 'react';
import { Pokemon, Move, PokemonMoves, PokemonAttributes } from '../types';
import { TERA_TYPES, FEATS_LIST, NATURE_DATA, applyNature } from '../data/editPokemonData';
import { ABILITY_DATA } from '../abilityData';
import { MOVE_DATA } from '../moveData';
import { ITEM_DATA } from '../itemData';
import { TRAINER_DATA } from '../trainerData';
import { TM_DATA } from '../tmData';
import LevelUpModal from './LevelUpModal';

interface EditPokemonScreenProps {
  pokemon: Pokemon;
  onSave: (data: Pokemon) => void;
  onCancel: () => void;
}

// Helper to get move details from any kind of move ID (string or number)
const getMoveFromId = (moveId: string | number): Move | undefined => {
    if (typeof moveId === 'number') {
        const tm = TM_DATA.find(t => t.id === moveId);
        if (!tm) return undefined;
        return MOVE_DATA.find(m => m.id === tm.move);
    }
    return MOVE_DATA.find(m => m.id === moveId);
};


// Internal component for section headers
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-gray-800 text-white font-bold py-1 px-3 mt-6 mb-3 text-sm">
    <h3>{title}</h3>
  </div>
);

// Internal component for dropdowns
const SelectField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> =
({ label, value, onChange, children }) => (
    <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
        <select 
            value={value} 
            onChange={onChange}
            className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
        >
            {children}
        </select>
    </div>
);

// FIX: Define InputField component to resolve 'Cannot find name' errors.
const InputField: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }> = 
({ label, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
    </div>
);

const parseHitDice = (hd: string) => {
    // This regex handles "d6", "1d6", "2d10", etc.
    const match = hd.match(/(\d*)d(\d+)/);
    if (match) {
        const count = match[1] ? parseInt(match[1], 10) : 1;
        const type = parseInt(match[2], 10);
        return { count, type };
    }
    return { count: 1, type: 6 }; // A sensible default
};


const EditPokemonScreen: React.FC<EditPokemonScreenProps> = ({ pokemon, onSave, onCancel }) => {
    // --- STATE MANAGEMENT ---
    const [nickname, setNickname] = useState(pokemon.name);
    const [teraType, setTeraType] = useState(pokemon.type[0]);
    const [nature, setNature] = useState(pokemon.nature || 'Hardy');
    const [level, setLevel] = useState(pokemon.minLevel);
    const [ac, setAc] = useState(pokemon.ac);
    
    const { type: initialType } = useMemo(() => parseHitDice(pokemon.hitDice), [pokemon.hitDice]);
    const [hitDiceType, setHitDiceType] = useState(initialType);
    
    const [isShiny, setIsShiny] = useState(pokemon.isShiny ?? false);
    const [gender, setGender] = useState(pokemon.currentGender ?? 'Female');
    const [baseAttributes, setBaseAttributes] = useState(pokemon.baseAttributes || pokemon.attributes);
    const [ability, setAbility] = useState(pokemon.abilities[0]?.id || '');
    
    const finalAttributes = useMemo(() => {
        return applyNature(baseAttributes, nature);
    }, [baseAttributes, nature]);

    // Proficiencies state
    const [proficiencies, setProficiencies] = useState(() => 
        TRAINER_DATA.proficiencies.map(p => ({
            ...p,
            level: pokemon.skills.includes(p.name.toLowerCase().replace(/ /g, '-')) ? 1 : 0
        }))
    );

    // Saving Throws state
    const [savingThrows, setSavingThrows] = useState(() => 
        TRAINER_DATA.savingThrows.map(s => ({
            ...s,
            proficient: pokemon.savingThrows.includes(s.name.substring(0,3).toLowerCase())
        }))
    );

    const [currentMoves, setCurrentMoves] = useState<string[]>(pokemon.currentMoves || pokemon.moves.start.slice(0, 4));
    
    const [feats, setFeats] = useState<{ id: string; notes: string }[]>(pokemon.feats || []);
    const [inventory, setInventory] = useState<{ id: string }[]>(pokemon.inventory || []);
    const [generalNotes, setGeneralNotes] = useState('');

    const [levelUpState, setLevelUpState] = useState<{
        isOpen: boolean;
        pokemonWithEdits: Pokemon | null;
        asiEvents: number[];
        isPeakPower: boolean;
    }>({ isOpen: false, pokemonWithEdits: null, asiEvents: [], isPeakPower: false });

    // Create a memoized list of all moves a pokemon can learn
    const learnableMoves = useMemo(() => {
        const moveIds = new Set<string | number>();
        // Add start moves
        pokemon.moves.start.forEach(id => moveIds.add(id));
        // Add level-up moves based on current level
        for (const key in pokemon.moves) {
            if (key.startsWith('level')) {
                const requiredLevel = parseInt(key.replace('level', ''), 10);
                if (level >= requiredLevel) {
                    (pokemon.moves[key] as string[]).forEach(id => moveIds.add(id));
                }
            }
        }
        // Add TM and Egg moves
        if (pokemon.moves.tm) (pokemon.moves.tm as number[]).forEach(id => moveIds.add(id));
        if (pokemon.moves.egg) (pokemon.moves.egg as string[]).forEach(id => moveIds.add(id));

        // Convert IDs to full Move objects, filter out any not found, and sort alphabetically
        return Array.from(moveIds)
            .map(id => getMoveFromId(id))
            .filter((move): move is Move => move !== undefined)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [pokemon, level]);


    // --- HANDLERS ---
    const handleProficiencyChange = (index: number, type: 'prof' | 'exp') => {
        const newProficiencies = [...proficiencies];
        const currentLevel = newProficiencies[index].level;
        if (type === 'prof') {
            newProficiencies[index].level = currentLevel >= 1 ? 0 : 1;
        } else { // expertise
            newProficiencies[index].level = currentLevel === 2 ? 1 : (currentLevel === 1 ? 2 : 0);
        }
        setProficiencies(newProficiencies);
    };

    const handleSavingThrowChange = (index: number) => {
        const newSavingThrows = [...savingThrows];
        newSavingThrows[index].proficient = !newSavingThrows[index].proficient;
        setSavingThrows(newSavingThrows);
    };

    const addListItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, newItem: T) => {
        setter(prev => [...prev, newItem]);
    };

    const removeListItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };
    
    const updateListItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, updatedItem: Partial<T>) => {
        setter(prev => prev.map((item, i) => i === index ? { ...item, ...updatedItem } : item));
    };

    const calculateFinalHp = (originalPokemon: Pokemon, editedPokemon: Pokemon): Pokemon => {
        const originalLevel = originalPokemon.minLevel;
        const newLevel = editedPokemon.minLevel;
        const levelDifference = newLevel - originalLevel;

        // Start with the original HP values
        let newMaxHp = originalPokemon.hp;
        let originalCurrentHp = originalPokemon.currentHp ?? originalPokemon.hp;

        // Handle retroactive CON changes for same or lower level
        if (levelDifference <= 0) {
            const oldConModifier = Math.floor(((originalPokemon.baseAttributes?.con || originalPokemon.attributes.con) - 10) / 2);
            const newConModifier = Math.floor((editedPokemon.attributes.con - 10) / 2);
            const conModifierDifference = newConModifier - oldConModifier;

            if (conModifierDifference !== 0) {
                const retroactiveHpChange = conModifierDifference * newLevel;
                newMaxHp = originalPokemon.hp + retroactiveHpChange;
                const newCurrentHp = Math.min(newMaxHp, originalCurrentHp + retroactiveHpChange);
                return { ...editedPokemon, hp: newMaxHp, currentHp: newCurrentHp };
            }
            return { ...editedPokemon, hp: newMaxHp, currentHp: originalCurrentHp };
        }

        // --- Level up logic ---
        const dieSize = parseHitDice(editedPokemon.hitDice).type;
        const oldConModifier = Math.floor(((originalPokemon.baseAttributes?.con || originalPokemon.attributes.con) - 10) / 2);
        const newConModifier = Math.floor((editedPokemon.attributes.con - 10) / 2);

        // 1. Roll for new levels
        let hpGainedFromLevels = 0;
        for (let i = 0; i < levelDifference; i++) {
            const roll = Math.floor(Math.random() * dieSize) + 1;
            hpGainedFromLevels += Math.max(1, roll + newConModifier); // Minimum 1 HP per level
        }

        // 2. Calculate retroactive HP from CON change
        const retroactiveHpGain = (newConModifier - oldConModifier) * originalLevel;
        
        // 3. Sum up and update
        const totalHpIncrease = hpGainedFromLevels + retroactiveHpGain;
        newMaxHp = originalPokemon.hp + totalHpIncrease;
        const newCurrentHp = Math.min(newMaxHp, originalCurrentHp + totalHpIncrease);
        
        return { ...editedPokemon, hp: newMaxHp, currentHp: newCurrentHp };
    }

    const handleFinish = () => {
        const originalLevel = pokemon.minLevel;
        const newLevel = level;

        const updatedSkills = proficiencies.filter(p => p.level >= 1).map(p => p.name.toLowerCase().replace(/ /g, '-'));
        const updatedSavingThrows = savingThrows.filter(s => s.proficient).map(s => s.name.substring(0, 3).toLowerCase());
        
        const pokemonWithBaseEdits: Pokemon = {
            ...pokemon,
            name: nickname,
            nature: nature,
            baseAttributes: baseAttributes,
            attributes: finalAttributes,
            minLevel: newLevel,
            ac: ac,
            hitDice: `${newLevel}d${hitDiceType}`,
            abilities: [{ id: ability, hidden: pokemon.abilities.find(a => a.id === ability)?.hidden ?? false }],
            skills: updatedSkills,
            savingThrows: updatedSavingThrows,
            feats: feats,
            inventory: inventory,
            currentMoves: currentMoves,
            isShiny: isShiny,
            currentGender: gender as 'Male' | 'Female' | 'None' | 'Other',
        };

        const asiLevels = [4, 8, 12, 16];
        const asiEvents = asiLevels.filter(l => originalLevel < l && newLevel >= l);
        const isPeakPower = originalLevel < 20 && newLevel >= 20;

        if (asiEvents.length > 0 || isPeakPower) {
            setLevelUpState({
                isOpen: true,
                pokemonWithEdits: pokemonWithBaseEdits,
                asiEvents,
                isPeakPower,
            });
        } else {
            const finalPokemon = calculateFinalHp(pokemon, pokemonWithBaseEdits);
            onSave(finalPokemon);
        }
    };

    const handleLevelUpConfirm = (pokemonWithNewStats: Pokemon) => {
        const finalPokemon = calculateFinalHp(pokemon, pokemonWithNewStats);
        onSave(finalPokemon);
        setLevelUpState({ isOpen: false, pokemonWithEdits: null, asiEvents: [], isPeakPower: false });
    };

    const handleLevelUpCancel = () => {
        setLevelUpState({ isOpen: false, pokemonWithEdits: null, asiEvents: [], isPeakPower: false });
    };
    
    return (
        <div className="p-4 text-gray-800 text-sm bg-white">
            <h2 className="text-xl font-bold text-center text-white bg-gray-800 p-2 -mx-4 -mt-4 mb-4">Edit {pokemon.name}</h2>
            
            <SectionHeader title="Basic Info" />
            <div className="space-y-4">
                <InputField label="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} />
                <SelectField label="Tera" value={teraType} onChange={e => setTeraType(e.target.value)}>
                    {TERA_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                </SelectField>
                <SelectField label="Nature" value={nature} onChange={e => setNature(e.target.value)}>
                    {NATURE_DATA.map(n => <option key={n.name} value={n.name}>{n.name}</option>)}
                </SelectField>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Level" type="number" value={level} onChange={e => setLevel(parseInt(e.target.value) || 1)} />
                    <InputField label="AC" type="number" value={ac} onChange={e => setAc(parseInt(e.target.value) || 10)} />
                    <InputField label="Hit Dice Type" type="number" value={hitDiceType} onChange={e => setHitDiceType(parseInt(e.target.value) || 6)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Shiny</label>
                    <div className="flex gap-4">
                        <label className="flex items-center"><input type="radio" name="shiny" checked={!isShiny} onChange={() => setIsShiny(false)} className="mr-1" /> Off</label>
                        <label className="flex items-center"><input type="radio" name="shiny" checked={isShiny} onChange={() => setIsShiny(true)} className="mr-1" /> On</label>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
                    <div className="flex gap-4">
                        {['Male', 'Female', 'None', 'Other'].map(g => (
                            <label key={g} className="flex items-center"><input type="radio" name="gender" value={g} checked={gender === g} onChange={e => setGender(e.target.value as NonNullable<Pokemon['currentGender']>)} className="mr-1" /> {g}</label>
                        ))}
                    </div>
                </div>
            </div>

            <SectionHeader title="Attributes" />
            <div className="grid grid-cols-3 gap-3">
                {Object.entries(baseAttributes).map(([key, baseValue]) => {
                    const attrKey = key as keyof PokemonAttributes;
                    const finalValue = finalAttributes[attrKey];
                    {/* FIX: Cast baseValue to number to prevent arithmetic error with different inferred types. */}
                    const diff = finalValue - (baseValue as number);
                    return (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-700 mb-1 flex justify-between">
                                <span>{key.toUpperCase()}</span>
                                <span className={`font-bold ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                    {finalValue} {diff !== 0 ? `(${diff > 0 ? '+' : ''}${diff})` : ''}
                                </span>
                            </label>
                            <input 
                                type="number" 
                                value={baseValue} 
                                onChange={e => setBaseAttributes(prev => ({ ...prev, [attrKey]: parseInt(e.target.value) || 10}))}
                                className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    );
                })}
            </div>
            
            <SectionHeader title="Ability" />
             <SelectField label="Ability" value={ability} onChange={e => setAbility(e.target.value)}>
                {ABILITY_DATA.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </SelectField>

            <SectionHeader title="Proficiencies" />
            <p className="text-xs text-gray-500 -mt-2 mb-2">First checkbox is for proficiency. Second checkbox is for expertise.</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {proficiencies.map((prof, index) => (
                <div key={prof.name} className="flex items-center">
                    <input type="checkbox" checked={prof.level >= 1} onChange={() => handleProficiencyChange(index, 'prof')} className="form-checkbox h-4 w-4 text-blue-600 rounded-sm" />
                    <input type="checkbox" checked={prof.level === 2} onChange={() => handleProficiencyChange(index, 'exp')} className="form-checkbox h-4 w-4 text-yellow-500 ml-1 rounded-sm" />
                    <span className="ml-2 text-sm">{prof.name}</span>
                </div>
                ))}
            </div>
            
            <SectionHeader title="Saving Throws" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {savingThrows.map((save, index) => (
                <div key={save.name} className="flex items-center">
                    <input type="checkbox" checked={save.proficient} onChange={() => handleSavingThrowChange(index)} className="form-checkbox h-4 w-4 text-blue-600 rounded-sm" />
                    <span className="ml-2 text-sm">{save.name}</span>
                </div>
                ))}
            </div>

            {/* --- MOVES --- */}
            <SectionHeader title="Moves" />
            <div className="space-y-3">
                {currentMoves.map((moveId, index) => (
                    <div key={index} className="p-3 bg-gray-100 rounded-md border border-gray-200 flex items-end gap-2">
                        <div className="flex-grow">
                            <SelectField
                                label={`Move ${index + 1}`}
                                value={moveId}
                                onChange={e => {
                                    const newMoves = [...currentMoves];
                                    newMoves[index] = e.target.value;
                                    setCurrentMoves(newMoves);
                                }}
                            >
                                {learnableMoves.map(move => (
                                    <option key={move.id} value={move.id}>{move.name}</option>
                                ))}
                            </SelectField>
                        </div>
                        <button 
                            onClick={() => setCurrentMoves(currentMoves.filter((_, i) => i !== index))}
                            className="px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700 h-10"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {currentMoves.length < 4 && (
                    <button 
                        onClick={() => {
                            const firstAvailableMove = learnableMoves.find(m => !currentMoves.includes(m.id));
                            if (firstAvailableMove) {
                                setCurrentMoves([...currentMoves, firstAvailableMove.id]);
                            }
                        }}
                        className="w-full py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-700"
                    >
                        Add Move
                    </button>
                )}
            </div>

            {/* --- FEATS --- */}
            <SectionHeader title="Feats" />
             <div className="space-y-4">
                {feats.map((feat, index) => (
                     <div key={index} className="p-3 bg-gray-100 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-bold">Feat {index+1}</p>
                            <button onClick={() => removeListItem(setFeats, index)} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700">Remove</button>
                        </div>
                        <div className="space-y-2">
                            <SelectField label="Feat" value={feat.id} onChange={e => updateListItem(setFeats, index, { id: e.target.value })}>
                                {FEATS_LIST.map(f => <option key={f} value={f.toLowerCase().replace(' ', '-')}>{f}</option>)}
                            </SelectField>
                            <textarea placeholder="Any additional notes" value={feat.notes} onChange={e => updateListItem(setFeats, index, { notes: e.target.value })} className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md text-sm h-16"/>
                        </div>
                    </div>
                ))}
                <button onClick={() => addListItem(setFeats, {id: 'elemental-adept', notes: ''})} className="w-full py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-700">Add Feat</button>
            </div>
            
            {/* --- INVENTORY --- */}
            <SectionHeader title="Inventory" />
            <div className="space-y-4">
                {inventory.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-100 rounded-md border border-gray-200 flex justify-between items-center">
                        <div className="flex-grow pr-4">
                             <SelectField label={`Item ${index+1}`} value={item.id} onChange={e => updateListItem(setInventory, index, { id: e.target.value })}>
                                {ITEM_DATA.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </SelectField>
                        </div>
                        <button onClick={() => removeListItem(setInventory, index)} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700 self-end mb-1">Remove</button>
                    </div>
                ))}
                 <button onClick={() => addListItem(setInventory, { id: 'poke-ball'})} className="w-full py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-700">Add Item</button>
            </div>


            <SectionHeader title="General" />
            <textarea placeholder="Use this for any general notes not covered by the above fields..." value={generalNotes} onChange={e => setGeneralNotes(e.target.value)} className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md text-sm h-24"/>

            <div className="mt-6 flex justify-end items-center gap-4">
                <button onClick={onCancel} className="font-bold text-gray-700 hover:text-black">Cancel</button>
                <button onClick={handleFinish} className="px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700">Finish!</button>
            </div>

            {levelUpState.isOpen && levelUpState.pokemonWithEdits && (
                <LevelUpModal
                    pokemonToLevelUp={levelUpState.pokemonWithEdits}
                    asiEvents={levelUpState.asiEvents}
                    isPeakPower={levelUpState.isPeakPower}
                    onConfirm={handleLevelUpConfirm}
                    onCancel={handleLevelUpCancel}
                />
            )}
        </div>
    );
};

export default EditPokemonScreen;