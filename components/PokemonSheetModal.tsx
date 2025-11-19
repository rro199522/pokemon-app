
// components/PokemonSheetModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Pokemon, Move, PokemonAttributes, TM, Ability } from '../types.ts';
import { EVOLUTION_DATA } from '../evolutionData.ts';
import { POKEDEX_DATA } from '../pokedexData.ts';
import EvolutionModal from './EvolutionModal.tsx';
import { NATURE_DATA } from '../data/editPokemonData.ts';
import LazyImage from './LazyImage.tsx';
import SectionHeader from './SectionHeader.tsx';
import TypePill from './TypePill.tsx';
import { getModifier } from '../utils/commonUtils.ts';

// --- HELPERS & TYPES ---

interface PokemonSheetScreenProps {
  pokemon: Pokemon;
  onEdit: (pokemon: Pokemon) => void;
  onUpdate: (pokemon: Pokemon) => void;
  allMoves: Move[];
  allTMs: TM[];
  allAbilities: Ability[];
}

// --- SUB-COMPONENTS ---

// 1. Header Section (Image, Name, Types, HP Bar)
const SheetHeader = React.memo(({ pokemon, viewShiny, toggleShiny, onHpChange, onHitDiceChange, currentHp, maxHitDice, currentHitDice, activeStatuses, onStatusToggle }: any) => {
    const hpPercent = (currentHp / pokemon.hp) * 100;
    const hdPercent = maxHitDice > 0 ? (currentHitDice / maxHitDice) * 100 : 0;
    
    return (
        <div className="px-4 pt-4">
            <div className="w-32 h-32 mx-auto relative pt-4 group cursor-pointer" onClick={toggleShiny}>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <LazyImage 
                  src={viewShiny ? pokemon.media.mainShiny : pokemon.media.main} 
                  alt={pokemon.name} 
                  className="w-full h-full object-contain drop-shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            <div className="text-center mt-2">
                <div className="flex items-baseline justify-center gap-2">
                    <h1 className="text-3xl font-black text-gray-800">{pokemon.name}</h1>
                    {pokemon.currentGender && (
                        <span className={`text-2xl font-bold ${pokemon.currentGender === 'Male' ? 'text-blue-500' : pokemon.currentGender === 'Female' ? 'text-pink-500' : 'text-gray-400'}`}>
                            {pokemon.currentGender === 'Male' ? '♂' : pokemon.currentGender === 'Female' ? '♀' : ''}
                        </span>
                    )}
                    <div className="text-sm font-bold bg-gray-200 px-2 py-0.5 rounded text-gray-600">Lv. {pokemon.minLevel}</div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                    {pokemon.type.map((t: string) => <TypePill key={t} type={t} />)}
                </div>
            </div>
            
            <div className="mt-6 bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-end mb-1">
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
                        <button onClick={() => onHpChange(-1)} className="w-8 h-8 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center transition-colors font-bold text-lg pb-1">-</button>
                        <span className="min-w-[3ch] text-center">{currentHp}</span>
                        <button onClick={() => onHpChange(1)} className="w-8 h-8 bg-green-100 text-green-600 rounded hover:bg-green-200 flex items-center justify-center transition-colors font-bold text-lg pb-1">+</button>
                        <span className="text-sm text-gray-400 font-medium self-center ml-1">/ {pokemon.hp} HP</span>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden border border-gray-300/50">
                    <div className={`h-3 rounded-full transition-all duration-500 ${hpPercent < 30 ? 'bg-red-500' : hpPercent < 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${hpPercent}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hit Dice</span>
                     <div className="flex items-center gap-2">
                        <button onClick={() => onHitDiceChange(-1)} className="text-gray-400 hover:text-gray-600 font-bold w-6 h-6 flex items-center justify-center border border-gray-200 rounded bg-white">-</button>
                        <span className="text-xs font-semibold">{currentHitDice} / {maxHitDice} ({pokemon.hitDice})</span>
                        <button onClick={() => onHitDiceChange(1)} className="text-gray-400 hover:text-gray-600 font-bold w-6 h-6 flex items-center justify-center border border-gray-200 rounded bg-white">+</button>
                     </div>
                </div>
                 <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="bg-blue-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${hdPercent}%` }}></div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-200 flex flex-wrap gap-2 items-center">
                    <button onClick={onStatusToggle} className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100 font-bold text-gray-600 shadow-sm">
                        + Status
                    </button>
                    {activeStatuses.map((status: string) => (
                        <span key={status} className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-white uppercase tracking-wide">{status}</span>
                    ))}
                </div>
            </div>
        </div>
    );
});

// 2. Attributes Section
const SheetAttributes = React.memo(({ attributes, nature }: { attributes: PokemonAttributes, nature: string }) => {
    const natureInfo = React.useMemo(() => NATURE_DATA.find(n => n.name === nature), [nature]);
    return (
        <div className="mx-4 mt-4 bg-slate-800 text-white rounded-lg p-3 shadow-md">
            <div className="grid grid-cols-6 text-center divide-x divide-slate-700">
                {Object.entries(attributes).map(([key, value]) => {
                    const attrKey = key as keyof PokemonAttributes;
                    let colorClass = 'text-slate-200';
                    if (natureInfo?.increase === attrKey) colorClass = 'text-green-400 font-bold';
                    if (natureInfo?.decrease === attrKey) colorClass = 'text-red-400 font-bold';
                    
                    return (
                        <div key={key} className="px-1">
                            <div className={`text-[9px] uppercase tracking-widest mb-1 ${colorClass}`}>{key}</div>
                            <div className="text-lg font-bold leading-none">{value}</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">{getModifier(value as number)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

// 3. Moves Section
const SheetMove = React.memo(({ moveId, currentPP, maxPP, onPpChange, attributes, proficiencyBonus, types, getMove }: any) => {
    const move = getMove(moveId);
    if (!move) return <div className="p-3 bg-gray-100 rounded mb-2 text-sm">Unknown Move (ID: {moveId})</div>;

    const isDamaging = Array.isArray(move.power) && typeof move.power[0] === 'string';
    let toHit = 0, totalDmgBonus = 0;
    
    if (isDamaging) {
        const attrMod = Math.floor((attributes[move.power[0] as keyof PokemonAttributes] - 10) / 2);
        const stab = types.includes(move.type) ? attrMod : 0;
        totalDmgBonus = attrMod + stab;
        toHit = proficiencyBonus + attrMod;
    }

    return (
        <div className="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">{move.name}</span>
                    <TypePill type={move.type} className="px-2 py-0 text-[10px]" />
                </div>
                <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-sm">
                    <button disabled={currentPP <= 0} onClick={() => onPpChange(-1)} className="text-gray-400 hover:text-blue-600 disabled:opacity-30 font-bold text-base px-1.5">-</button>
                    <span className={`text-xs font-bold min-w-[24px] text-center ${currentPP === 0 ? 'text-red-500' : 'text-gray-700'}`}>{currentPP}</span>
                    <button disabled={currentPP >= maxPP} onClick={() => onPpChange(1)} className="text-gray-400 hover:text-blue-600 disabled:opacity-30 font-bold text-base px-1.5">+</button>
                </div>
            </div>
            <div className="p-3 text-xs text-gray-600 space-y-2">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span><strong>Time:</strong> {move.time}</span>
                    <span><strong>Range:</strong> {move.range}</span>
                </div>
                {isDamaging && (
                    <div className="flex gap-3 font-mono text-blue-800 bg-blue-50 p-1.5 rounded">
                        <span>HIT: +{toHit}</span>
                        <span>DMG: {move.lvl1 || '1d4'} {totalDmgBonus >= 0 ? `+${totalDmgBonus}` : totalDmgBonus}</span>
                    </div>
                )}
                <p className="leading-relaxed">
                    {Array.isArray(move.description) && typeof move.description[0] === 'string' 
                        ? move.description[0] 
                        : 'Description available in movedex.'}
                </p>
            </div>
        </div>
    );
});

// --- MAIN COMPONENT ---

const PokemonSheetScreen: React.FC<PokemonSheetScreenProps> = ({ pokemon, onEdit, onUpdate, allMoves, allTMs, allAbilities }) => {
    // --- LOCAL STATE ---
    const [viewShiny, setViewShiny] = useState(pokemon.isShiny ?? false);
    const [isRestMenuOpen, setIsRestMenuOpen] = useState(false);
    const [evolutionState, setEvolutionState] = useState<{isModalOpen: boolean, toPokemon: Pokemon | null}>({isModalOpen: false, toPokemon: null});
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    // --- HELPERS ---
    const getMoveFromId = useCallback((moveId: string | number): Move | undefined => {
        if (typeof moveId === 'number') {
            const tm = allTMs.find(t => t.id === moveId);
            if (!tm) return undefined;
            return allMoves.find(m => m.id === tm.move);
        }
        return allMoves.find(m => m.id === moveId);
    }, [allMoves, allTMs]);

    // --- DERIVED STATE (Memoized) ---
    const maxHitDice = useMemo(() => parseInt(pokemon.hitDice.split('d')[0] || '1', 10), [pokemon.hitDice]);
    const currentHp = pokemon.currentHp ?? pokemon.hp;
    const currentHitDice = pokemon.currentHitDice ?? maxHitDice;
    const proficiencyBonus = Math.floor((pokemon.minLevel - 1) / 4) + 2;

    const initialMovesPP = useMemo(() => {
        const pp: Record<string, number> = {};
        (pokemon.currentMoves || []).forEach(id => {
            const m = getMoveFromId(id);
            if (m) pp[m.id] = m.pp;
        });
        return pp;
    }, [pokemon.currentMoves, getMoveFromId]);
    
    const currentMovesPP = pokemon.currentMovesPP ?? initialMovesPP;
    const activeStatuses = pokemon.statuses ?? [];

    // --- HANDLERS (Callback) ---
    const handleUpdate = useCallback((updates: Partial<Pokemon>) => {
        onUpdate({ ...pokemon, ...updates });
    }, [pokemon, onUpdate]);

    const handleHpChange = useCallback((amount: number) => {
        handleUpdate({ currentHp: Math.max(0, Math.min(pokemon.hp, currentHp + amount)) });
    }, [currentHp, pokemon.hp, handleUpdate]);

    const handleHitDiceChange = useCallback((amount: number) => {
        handleUpdate({ currentHitDice: Math.max(0, Math.min(maxHitDice, currentHitDice + amount)) });
    }, [currentHitDice, maxHitDice, handleUpdate]);

    const handlePpChange = useCallback((moveId: string, amount: number) => {
        const move = getMoveFromId(moveId);
        if (!move) return;
        const cur = currentMovesPP[moveId] ?? move.pp;
        const newVal = Math.max(0, Math.min(move.pp, cur + amount));
        handleUpdate({ currentMovesPP: { ...currentMovesPP, [moveId]: newVal } });
    }, [currentMovesPP, handleUpdate, getMoveFromId]);

    const handleRest = useCallback((type: 'long' | 'poke') => {
        if (type === 'long') {
            handleUpdate({ currentHp: pokemon.hp, statuses: [], currentHitDice: maxHitDice });
        } else {
            handleUpdate({ currentHp: pokemon.hp, statuses: [], currentHitDice: maxHitDice, currentMovesPP: initialMovesPP });
        }
        setIsRestMenuOpen(false);
    }, [pokemon.hp, maxHitDice, initialMovesPP, handleUpdate]);

    const handleStatusAction = useCallback((action: string) => {
        if (action === 'clear') handleUpdate({ statuses: [] });
        else if (!activeStatuses.includes(action)) handleUpdate({ statuses: [...activeStatuses, action] });
        setIsStatusDropdownOpen(false);
    }, [activeStatuses, handleUpdate]);

    // Evolution
    const evolutionInfo = useMemo(() => EVOLUTION_DATA.find(e => e.from === pokemon.id), [pokemon.id]);
    const evolutionPossible = useMemo(() => {
        if (!evolutionInfo) return false;
        const lvlCond = evolutionInfo.conditions.find(c => c.type === 'level');
        return lvlCond && pokemon.minLevel >= (lvlCond.value as number);
    }, [evolutionInfo, pokemon.minLevel]);

    const handleEvolve = useCallback(() => {
        if (!evolutionInfo) return;
        const target = POKEDEX_DATA.find(p => p.id === evolutionInfo.to);
        if (target) setEvolutionState({ isModalOpen: true, toPokemon: target });
    }, [evolutionInfo]);

    return (
        <div className="font-sans text-gray-800 bg-white pb-20 animate-fade-in">
            <SheetHeader 
                pokemon={pokemon} 
                viewShiny={viewShiny} 
                toggleShiny={() => setViewShiny(!viewShiny)}
                currentHp={currentHp}
                onHpChange={handleHpChange}
                maxHitDice={maxHitDice}
                currentHitDice={currentHitDice}
                onHitDiceChange={handleHitDiceChange}
                activeStatuses={activeStatuses}
                onStatusToggle={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            />

            {/* Status Dropdown Overlay */}
            {isStatusDropdownOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setIsStatusDropdownOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl p-2 w-64" onClick={e => e.stopPropagation()}>
                        <h4 className="font-bold px-2 py-1 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 mb-1">Apply Status</h4>
                        {['Poisoned', 'Burned', 'Paralyzed', 'Asleep', 'Frozen'].map(s => (
                            <button key={s} onClick={() => handleStatusAction(s)} className="block w-full text-left px-3 py-2 hover:bg-blue-50 text-sm font-semibold text-gray-700 rounded transition-colors">
                                {s}
                            </button>
                        ))}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={() => handleStatusAction('clear')} className="block w-full text-left px-3 py-2 hover:bg-red-50 text-sm font-bold text-red-600 rounded transition-colors">Clear All</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-center text-xs mt-4 px-4">
                {[
                    { l: 'AC', v: pokemon.ac },
                    { l: 'Prof', v: `+${proficiencyBonus}` },
                    { l: 'Speed', v: pokemon.speed.map(s => s.value).join('/') },
                ].map(s => (
                    <div key={s.l} className="bg-white border border-gray-200 rounded p-1 shadow-sm">
                        <div className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">{s.l}</div>
                        <div className="font-bold text-gray-800 text-lg">{s.v}</div>
                    </div>
                ))}
            </div>

            <SheetAttributes attributes={pokemon.attributes} nature={pokemon.nature || 'Hardy'} />

            <SectionHeader title="Moves" />
            <div className="px-4">
                {(pokemon.currentMoves || []).map(moveId => (
                    <SheetMove 
                        key={moveId} 
                        moveId={moveId} 
                        currentPP={currentMovesPP[moveId] ?? 0} 
                        maxPP={getMoveFromId(moveId)?.pp || 0}
                        onPpChange={(amt: number) => handlePpChange(moveId as string, amt)}
                        attributes={pokemon.attributes}
                        proficiencyBonus={proficiencyBonus}
                        types={pokemon.type}
                        getMove={getMoveFromId}
                    />
                ))}
                {(!pokemon.currentMoves || pokemon.currentMoves.length === 0) && <p className="text-center text-gray-400 text-sm italic py-4">No moves known.</p>}
            </div>

            <SectionHeader title="Abilities" />
            <div className="px-4 space-y-2">
                {pokemon.abilities.map(a => {
                    const info = allAbilities.find(d => d.id.toLowerCase() === a.id.toLowerCase());
                    return (
                        <div key={a.id} className="bg-gray-50 p-3 rounded border border-gray-100 text-sm">
                            <span className="font-bold text-gray-800">{info?.name || a.id}</span>
                            <p className="text-gray-600 mt-1 text-xs leading-relaxed">{info?.description || 'No description available.'}</p>
                        </div>
                    )
                })}
            </div>

            {/* Actions Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 px-6 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 max-w-[393px] mx-auto">
                 <button onClick={() => onEdit(pokemon)} className="flex flex-col items-center text-gray-500 hover:text-blue-600 text-xs font-bold gap-1 transition-colors">
                    <span className="text-lg">✎</span> Edit
                 </button>
                 <button 
                    onClick={handleEvolve} 
                    disabled={!evolutionPossible} 
                    className={`flex flex-col items-center text-xs font-bold gap-1 transition-colors ${evolutionPossible ? 'text-purple-600 animate-pulse' : 'text-gray-300'}`}
                 >
                    <span className="text-lg">★</span> Evolve
                 </button>
                 <button onClick={() => setIsRestMenuOpen(true)} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all active:scale-95 text-sm">
                    REST
                 </button>
            </div>

            {/* Rest Modal */}
            {isRestMenuOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 max-w-[393px] mx-auto backdrop-blur-sm" onClick={() => setIsRestMenuOpen(false)}>
                    <div className="bg-white w-full rounded-t-2xl p-6 space-y-3 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-gray-800 text-center mb-4 text-lg">Rest & Recovery</h3>
                        <button onClick={() => handleRest('long')} className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">Long Rest (HP & HD)</button>
                        <button onClick={() => handleRest('poke')} className="w-full py-3 bg-pink-50 text-pink-700 font-bold rounded-xl border border-pink-100 hover:bg-pink-100 transition-colors">Pokécenter (Full Restore)</button>
                        <button onClick={() => setIsRestMenuOpen(false)} className="w-full py-3 text-gray-500 font-semibold mt-2">Cancel</button>
                    </div>
                </div>
            )}

            {/* Evolution Modal */}
            {evolutionState.isModalOpen && evolutionState.toPokemon && evolutionInfo && (
                <EvolutionModal
                    fromPokemon={pokemon}
                    toPokemonBase={evolutionState.toPokemon}
                    evolutionInfo={evolutionInfo}
                    onConfirm={(p) => { onUpdate(p); setEvolutionState({ isModalOpen: false, toPokemon: null }); }}
                    onCancel={() => setEvolutionState({ isModalOpen: false, toPokemon: null })}
                />
            )}
        </div>
    );
};

export default PokemonSheetScreen;
