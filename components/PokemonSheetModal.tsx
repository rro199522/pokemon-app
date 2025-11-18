// components/PokemonSheetModal.tsx
import React, { useState, useMemo } from 'react';
import { Pokemon, Move, PokemonAttributes } from '../types.ts';
import { ABILITY_DATA } from '../abilityData.ts';
import { MOVE_DATA } from '../moveData.ts';
import { TM_DATA } from '../tmData.ts';
import { TRAINER_DATA } from '../trainerData.ts'; // To get full skill list
import { EVOLUTION_DATA } from '../evolutionData.ts';
import { POKEDEX_DATA } from '../pokedexData.ts';
import EvolutionModal from './EvolutionModal.tsx';
import { NATURE_DATA } from '../data/editPokemonData.ts';
import { typeStyles } from './PokemonTypeIcons.tsx';


interface PokemonSheetScreenProps {
  pokemon: Pokemon;
  onEdit: (pokemon: Pokemon) => void;
  onUpdate: (pokemon: Pokemon) => void;
}

const statusOptions = ['Asleep', 'Burned', 'Frozen', 'Paralysis', 'Poisoned'];
const statusColors: { [key: string]: string } = {
  Asleep: 'bg-sky-500',
  Burned: 'bg-orange-500',
  Frozen: 'bg-cyan-400',
  Paralysis: 'bg-yellow-400',
  Poisoned: 'bg-fuchsia-500',
};


const TypePill: React.FC<{ type: string }> = ({ type }) => {
    const styleClass = typeStyles[type] || 'bg-gray-400 text-white';
    return (
        <span className={`px-3 py-1 text-sm font-bold shadow-sm capitalize ${styleClass}`}>
            {type}
        </span>
    );
};

const getModifier = (value: number) => {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : String(mod);
};

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="bg-slate-800 text-white font-bold py-1 px-4 text-lg mt-4">{children}</h3>
);

// Helper to get move details from any kind of move ID (string or number)
const getMoveFromId = (moveId: string | number): Move | undefined => {
    if (typeof moveId === 'number') {
        const tm = TM_DATA.find(t => t.id === moveId);
        if (!tm) return undefined;
        return MOVE_DATA.find(m => m.id === tm.move);
    }
    return MOVE_DATA.find(m => m.id === moveId);
};

const PokemonSheetScreen: React.FC<PokemonSheetScreenProps> = ({ pokemon, onEdit, onUpdate }) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isRestMenuOpen, setIsRestMenuOpen] = useState(false);
  const [isShortRestModalOpen, setIsShortRestModalOpen] = useState(false);
  const [shortRestDiceCount, setShortRestDiceCount] = useState(1);
  const [evolutionState, setEvolutionState] = useState<{isModalOpen: boolean, toPokemon: Pokemon | null}>({isModalOpen: false, toPokemon: null});
  const [viewShiny, setViewShiny] = useState(pokemon.isShiny ?? false);

  // Derive state from props
  const getHitDiceCount = (str: string): number => {
      const match = str.match(/^(\d+)d/);
      return match ? parseInt(match[1], 10) : 1;
  };

  const maxHitDice = getHitDiceCount(pokemon.hitDice);
  
  const currentHp = pokemon.currentHp ?? pokemon.hp;
  const currentHitDice = pokemon.currentHitDice ?? maxHitDice;
  const activeStatuses = pokemon.statuses ?? [];
  
  const initialMovesPP = useMemo(() => {
    const initialState: Record<string, number> = {};
    const currentMoves = pokemon.currentMoves || [];

    for (const moveId of currentMoves) {
        const moveDetails = getMoveFromId(moveId);
        if (moveDetails) {
            initialState[moveDetails.id] = moveDetails.pp;
        }
    }
    return initialState;
  }, [pokemon.currentMoves]);

  const currentMovesPP = pokemon.currentMovesPP ?? initialMovesPP;
  const proficiencyBonus = Math.floor((pokemon.minLevel - 1) / 4) + 2;
  const natureInfo = useMemo(() => NATURE_DATA.find(n => n.name === (pokemon.nature || 'Hardy')), [pokemon.nature]);

  // Update handlers to call onUpdate
  const handleHpChange = (amount: number) => {
    const newHp = Math.max(0, Math.min(pokemon.hp, currentHp + amount));
    onUpdate({ ...pokemon, currentHp: newHp });
  };

  const handleHitDiceChange = (amount: number) => {
    const newHitDice = Math.max(0, Math.min(maxHitDice, currentHitDice + amount));
    onUpdate({ ...pokemon, currentHitDice: newHitDice });
  };
  
  const handleStatusAdd = (status: string) => {
      if (!activeStatuses.includes(status)) {
          onUpdate({ ...pokemon, statuses: [...activeStatuses, status] });
      }
      setIsStatusDropdownOpen(false);
  };
  
  const handleStatusRemove = (status: string) => {
      onUpdate({ ...pokemon, statuses: activeStatuses.filter(s => s !== status) });
  };
  
  const handleStatusClear = () => {
      onUpdate({ ...pokemon, statuses: [] });
      setIsStatusDropdownOpen(false);
  };

  const getAttributeModifier = (attr: keyof typeof pokemon.attributes) => {
    return Math.floor((pokemon.attributes[attr] - 10) / 2);
  }
  
  const allSkills = TRAINER_DATA.proficiencies;
  const allSaves = TRAINER_DATA.savingThrows.map(s => s.name.substring(0, 3).toUpperCase());

  const handleLongRest = () => {
    onUpdate({ 
        ...pokemon, 
        currentHp: pokemon.hp, 
        statuses: [], 
        currentHitDice: maxHitDice 
    });
    setIsRestMenuOpen(false);
  };

  const handleOpenShortRest = () => {
    setIsRestMenuOpen(false);
    if (currentHitDice > 0) {
      setShortRestDiceCount(1);
      setIsShortRestModalOpen(true);
    }
  };
  
  const handleConfirmShortRest = () => {
      if (shortRestDiceCount <= 0 || shortRestDiceCount > currentHitDice) return;

      const dieMatch = pokemon.hitDice.match(/d(\d+)/);
      const dieSize = dieMatch ? parseInt(dieMatch[1], 10) : 6;
      
      let totalHealed = 0;
      for (let i = 0; i < shortRestDiceCount; i++) {
          totalHealed += Math.floor(Math.random() * dieSize) + 1;
      }

      onUpdate({
          ...pokemon,
          currentHp: Math.min(pokemon.hp, currentHp + totalHealed),
          currentHitDice: currentHitDice - shortRestDiceCount,
      });

      setIsShortRestModalOpen(false);
  };

  const handlePokecenterRest = () => {
    onUpdate({
        ...pokemon,
        currentHp: pokemon.hp,
        statuses: [],
        currentHitDice: maxHitDice,
        currentMovesPP: initialMovesPP
    });
    setIsRestMenuOpen(false);
  };

  const handlePpChange = (moveId: string, amount: number) => {
    const moveDetails = getMoveFromId(moveId);
    if (!moveDetails) return;

    const maxPP = moveDetails.pp;
    const currentPP = currentMovesPP[moveId] ?? maxPP;
    const newPP = Math.max(0, Math.min(maxPP, currentPP + amount));

    const newCurrentMovesPP = { ...currentMovesPP, [moveId]: newPP };
    onUpdate({ ...pokemon, currentMovesPP: newCurrentMovesPP });
  };

  // Evolution Logic
  const evolutionInfo = useMemo(() => EVOLUTION_DATA.find(e => e.from === pokemon.id), [pokemon.id]);
  
  const levelCondition = useMemo(() => evolutionInfo?.conditions.find(c => c.type === 'level'), [evolutionInfo]);
  
  const evolutionPossible = evolutionInfo && levelCondition && pokemon.minLevel >= (levelCondition.value as number);

  const handleEvolveClick = () => {
    if (!evolutionInfo) return;
    const toPokemonData = POKEDEX_DATA.find(p => p.id === evolutionInfo.to);
    if (toPokemonData) {
      setEvolutionState({ isModalOpen: true, toPokemon: toPokemonData });
    }
  };

  const handleConfirmEvolution = (evolvedPokemon: Pokemon) => {
      onUpdate(evolvedPokemon);
      setEvolutionState({ isModalOpen: false, toPokemon: null });
  };

  const getGenderSymbol = (gender?: string) => {
    if (gender === 'Male') return '♂';
    if (gender === 'Female') return '♀';
    return null;
  };
  const genderSymbol = getGenderSymbol(pokemon.currentGender);

  return (
    <div className="font-sans text-gray-800 animate-fade-in bg-white pb-4">
      {/* --- TOP SECTION --- */}
      <div className="px-4 pt-4">
        {/* Image Section - Centered at top */}
        <div className="w-32 h-32 mx-auto relative pt-8">
            <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50"></div>
            <img 
              src={viewShiny ? pokemon.media.mainShiny : pokemon.media.main} 
              alt={pokemon.name} 
              className="w-full h-full object-contain drop-shadow-lg relative z-10"
            />
            <button
                onClick={() => setViewShiny(!viewShiny)}
                className="absolute -bottom-1 -right-1 z-20 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all"
                aria-label="Toggle shiny sprite"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </button>
        </div>

        {/* Name, Level, and Types Section - Centered */}
        <div className="text-center mt-2">
            <div className="flex items-baseline justify-center gap-2">
                <h1 className="text-3xl font-bold">{pokemon.name}</h1>
                {genderSymbol && <span className={`text-3xl font-bold ${pokemon.currentGender === 'Male' ? 'text-blue-500' : 'text-pink-500'}`}>{genderSymbol}</span>}
                <div className="text-lg font-bold">Lv. {pokemon.minLevel}</div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
                {pokemon.type.map(t => <TypePill key={t} type={t} />)}
            </div>
        </div>
        
        {/* HP, EXP, Status Section */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <button onClick={() => handleHpChange(-1)} className="px-1" aria-label="Decrease HP">▾</button>
            <span>{currentHp}</span>
            <button onClick={() => handleHpChange(1)} className="px-1" aria-label="Increase HP">▴</button>
            <span className="text-gray-500">/ {pokemon.hp}</span>
          </div>
          
          <div className="w-full bg-gray-300 rounded-full h-2 my-1 shadow-inner">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentHp / pokemon.hp) * 100}%` }}></div>
          </div>
          
          <div className="flex justify-end items-center gap-2">
            <span className="text-sm font-semibold">{currentHitDice} / {maxHitDice} ({pokemon.hitDice})</span>
            <div className="flex flex-col -my-1">
                <button onClick={() => handleHitDiceChange(1)} className="h-4 w-5 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-sm" aria-label="Increase Hit Dice">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
                <button onClick={() => handleHitDiceChange(-1)} className="h-4 w-5 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-sm" aria-label="Decrease Hit Dice">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 my-1 shadow-inner">
            <div className="bg-sky-400 h-2 rounded-full transition-all duration-300" style={{ width: `${(maxHitDice > 0 ? (currentHitDice / maxHitDice) : 0) * 100}%` }}></div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="relative">
              <button 
                onClick={() => setIsStatusDropdownOpen(prev => !prev)}
                className="text-sm font-semibold border-2 border-gray-400 px-3 py-0.5 hover:bg-gray-200 transition-colors rounded-md"
              >
                Add Status
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-40">
                  <ul>
                    <li 
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-semibold bg-blue-500 text-white"
                      onClick={handleStatusClear}
                    >None</li>
                    {statusOptions.filter(s => !activeStatuses.includes(s)).map(status => (
                      <li 
                        key={status} 
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleStatusAdd(status)}
                      >
                        {status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 flex-grow">
                <span className="text-xs font-bold">Exp:</span>
                <div className="w-full bg-gray-300 rounded-full h-1.5 shadow-inner">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <span className="text-xs font-bold">0</span>
            </div>
          </div>
          {activeStatuses.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
              {activeStatuses.map(status => (
                  <div key={status} className="flex items-center gap-1">
                  <span className={`px-2 py-1 text-xs font-bold text-white uppercase rounded-md ${statusColors[status]}`}>{status}</span>
                  <button 
                      onClick={() => handleStatusRemove(status)}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-gray-700"
                      aria-label={`Remove ${status} status`}
                  >
                      X
                  </button>
                  </div>
              ))}
              </div>
          )}
        </div>
      </div>
      
      {/* --- General Info: AC, Bonus, Speed etc --- */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm mt-4 px-4">
          <div className="p-1 border-2 border-gray-300"><div className="font-bold">AC</div><div>{pokemon.ac}</div></div>
          <div className="p-1 border-2 border-gray-300"><div className="font-bold">Bonus</div><div>+{proficiencyBonus}</div></div>
          <div className="p-1 border-2 border-gray-300"><div className="font-bold">Speed</div><div>{pokemon.speed.map(s => `${Math.round(s.value / 1.5 * 5)}ft`).join(', ')}</div></div>
          <div className="p-1 border-2 border-gray-300"><div className="font-bold">Nature</div><div>{pokemon.nature || 'Hardy'}</div></div>
          <div className="p-1 border-2 border-gray-300 col-span-2"><div className="font-bold">Size</div><div className="capitalize">{pokemon.size}</div></div>
      </div>

      {/* --- ATTRIBUTES --- */}
      <div className="mt-4 mx-4 bg-slate-800 text-white rounded-md overflow-hidden p-2">
        <div className="grid grid-cols-6 text-center text-sm">
          {Object.entries(pokemon.attributes).map(([key, value]) => {
              const attrKey = key as keyof PokemonAttributes;
              let textColor = 'text-white';
              if (natureInfo) {
                  if (natureInfo.increase === attrKey) textColor = 'text-green-400';
                  if (natureInfo.decrease === attrKey) textColor = 'text-red-400';
              }
              return (
                  <div key={key} className={textColor}>
                      <div className="font-bold">{key.toUpperCase()}</div>
                      <div>{value} ({getModifier(value as number)})</div>
                  </div>
              );
          })}
        </div>
      </div>

      {/* --- SAVES --- */}
      <div className="mt-4 mx-4 rounded-md overflow-hidden">
        <h3 className="bg-slate-800 text-white font-bold py-1 px-4 text-lg">Saves</h3>
        <div className="p-3 grid grid-cols-3 gap-x-4 gap-y-2 bg-slate-800 text-white">
          {allSaves.map(save => {
              const isProficient = pokemon.savingThrows.includes(save.toLowerCase());
              const attr = save.toLowerCase() as keyof typeof pokemon.attributes;
              const modifier = getAttributeModifier(attr);
              const total = modifier + (isProficient ? proficiencyBonus : 0);
              return (
                  <div key={save} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                          {isProficient && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span>{save} <strong className="font-bold">{total >= 0 ? `+${total}`: total}</strong></span>
                  </div>
              )
          })}
        </div>
      </div>
      
      {/* --- SKILLS --- */}
      <div className="mt-4 mx-4 rounded-md overflow-hidden">
        <h3 className="bg-slate-800 text-white font-bold py-1 px-4 text-lg">Skills</h3>
        <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm bg-slate-800 text-white">
          {allSkills.map(skill => {
              const isProficient = pokemon.skills.includes(skill.name.toLowerCase().replace(/ /g, '-'));
              const attr = skill.attribute.toLowerCase() as keyof typeof pokemon.attributes;
              const modifier = getAttributeModifier(attr);
              const total = modifier + (isProficient ? proficiencyBonus : 0);
              return (
                  <div key={skill.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                              {isProficient && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span>{skill.name}</span>
                      </div>
                      <strong className="font-bold">{total >= 0 ? `+${total}`: total}</strong>
                  </div>
              )
          })}
        </div>
      </div>

      {/* --- VULNERABILITIES, RESISTANCES, IMMUNITIES --- */}
      <div className="text-sm space-y-2 mt-4 px-4">
           <div className="flex items-center gap-2"><strong>Vulnerabilities:</strong> <span className="flex flex-wrap gap-1">{pokemon.weaknesses?.filter(w => w.multiplier === '2x').map(w => <TypePill key={w.type} type={w.type} />) || 'None'}</span></div>
           <div className="flex items-center gap-2"><strong>Resistances:</strong> <span className="flex flex-wrap gap-1">{pokemon.weaknesses?.filter(w => w.multiplier === '1/2x').map(w => <TypePill key={w.type} type={w.type} />) || 'None'}</span></div>
           <div className="flex items-center gap-2"><strong>Immunities:</strong> <span className="font-semibold">{pokemon.weaknesses?.filter(w => w.multiplier === '0x').map(w => w.type).join(', ') || 'None'}</span></div>
      </div>

      {/* --- ABILITIES & ITEMS --- */}
      <SectionHeader>Abilities & Items</SectionHeader>
      <div className="p-2 px-4 space-y-2 text-sm">
        {pokemon.abilities.map(abilityInfo => {
            const details = ABILITY_DATA.find(a => a.id.toLowerCase() === abilityInfo.id.toLowerCase());
            return (
                <div key={abilityInfo.id}>
                    <p><strong>{details?.name || abilityInfo.id}</strong>: {details?.description}</p>
                </div>
            )
        })}
        <p><strong>Held Item:</strong> None</p>
      </div>

      {/* --- FEATS --- */}
      <SectionHeader>Feats</SectionHeader>
      <div className="p-2 px-4"><p className="text-sm">None</p></div>

      {/* --- MOVES --- */}
      <SectionHeader>Moves</SectionHeader>
      <div className="space-y-3 p-2 px-4">
      {(pokemon.currentMoves || []).map((moveId, index) => {
          const move = getMoveFromId(moveId);

          if (!move) {
            const moveName = typeof moveId === 'number' ? `TM ${moveId}` : `${moveId}`.replace(/-/g, ' ');
            return <div key={index} className="text-sm p-3 bg-gray-50 shadow-sm border border-gray-200"><strong>{moveName}:</strong> Details not available.</div>;
          }
          
          const isDamagingMove = Array.isArray(move.power) && move.power.length > 0 && typeof move.power[0] === 'string';

          let toHit = 0;
          let moveDc = 0;
          let totalDmgBonus = 0;

          if (isDamagingMove) {
              const powerAttr = move.power[0] as keyof typeof pokemon.attributes;
              const attrMod = getAttributeModifier(powerAttr);
              const hasStab = pokemon.type.includes(move.type);
              const stabBonus = hasStab ? attrMod : 0;
              totalDmgBonus = attrMod + stabBonus;
              toHit = proficiencyBonus + attrMod;
              moveDc = 8 + toHit;
          }

          const maxPP = move.pp;
          const currentPP = currentMovesPP[move.id] ?? maxPP;

          return (
              <div key={move.id} className="text-sm p-3 bg-gray-100 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center font-bold">
                     <div className="flex items-center gap-2">
                       <h4 className="capitalize text-base">{move.name}</h4>
                       <TypePill type={move.type} />
                     </div>
                     <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-xl font-bold">
                            <button 
                                onClick={() => handlePpChange(move.id, -1)} 
                                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-2xl" 
                                aria-label={`Decrease PP for ${move.name}`}
                                disabled={currentPP <= 0}
                            >
                                -
                            </button>
                            <span className="min-w-[55px] text-center tabular-nums">{currentPP}/{maxPP}</span>
                            <button 
                                onClick={() => handlePpChange(move.id, 1)} 
                                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-2xl" 
                                aria-label={`Increase PP for ${move.name}`}
                                disabled={currentPP >= maxPP}
                            >
                                +
                            </button>
                        </div>
                         {isDamagingMove && <div className="text-xs text-gray-700">To Hit: +{toHit}, Dc: {moveDc}, Dmg: +{totalDmgBonus}</div>}
                     </div>
                  </div>
                  <div className="flex gap-4 my-1 text-xs text-gray-600">
                      <span><strong>Range:</strong> {move.range}</span>
                      <span><strong>Time:</strong> {move.time}</span>
                      <span><strong>Duration:</strong> {move.duration}</span>
                  </div>
                  <p className="text-xs">{Array.isArray(move.description) && typeof move.description[0] === 'string' ? move.description[0] : 'Descrição complexa.'}</p>
                  <p className="mt-1 text-xs text-gray-600">{move.higherLevels}</p>
              </div>
          );
      })}
      </div>

      {/* Action Buttons */}
      <div className="p-4 mt-4 border-t border-gray-200 flex items-center justify-center gap-4">
          <button className="text-gray-700 font-semibold hover:text-black transition-colors">Remove</button>
          <button 
            onClick={handleEvolveClick}
            disabled={!evolutionPossible}
            className="text-gray-700 font-semibold hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Evolve
          </button>
          <button 
            onClick={() => setIsRestMenuOpen(true)}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition-colors">
            Rest
          </button>
          <button 
            onClick={() => onEdit(pokemon)}
            className="bg-slate-800 text-white font-bold py-2 px-6 rounded-full hover:bg-slate-900 transition-colors">
              Edit
          </button>
      </div>

      {/* Rest Menu Modal */}
      {isRestMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsRestMenuOpen(false)}>
              <div className="bg-white rounded-lg p-6 space-y-3 shadow-xl" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-center mb-4">Choose a Rest Option</h3>
                  <button onClick={handleLongRest} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">Long Rest</button>
                  <button onClick={handleOpenShortRest} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors">Short Rest</button>
                  <button onClick={handlePokecenterRest} className="w-full bg-pink-500 text-white font-bold py-2 px-4 rounded hover:bg-pink-600 transition-colors">Pokécenter</button>
              </div>
          </div>
      )}

      {/* Short Rest Modal */}
      {isShortRestModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsShortRestModalOpen(false)}>
              <div className="bg-white rounded-lg p-6 shadow-xl w-80" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-center mb-4">Short Rest</h3>
                  <p className="text-center mb-4">Spend Hit Dice to recover HP. Available: <span className="font-bold">{currentHitDice}</span></p>
                  <div className="flex items-center justify-center gap-4">
                      <label htmlFor="hit-dice-spend" className="font-semibold">Dice to spend:</label>
                      <input
                          id="hit-dice-spend"
                          type="number"
                          value={shortRestDiceCount}
                          onChange={(e) => setShortRestDiceCount(Math.max(0, Math.min(currentHitDice, parseInt(e.target.value) || 0)))}
                          min="1"
                          max={currentHitDice}
                          className="w-20 p-2 border border-gray-300 rounded-md text-center"
                      />
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                      <button onClick={() => setIsShortRestModalOpen(false)} className="px-4 py-2 bg-gray-200 font-semibold rounded hover:bg-gray-300">Cancel</button>
                      <button 
                          onClick={handleConfirmShortRest} 
                          disabled={shortRestDiceCount <= 0 || shortRestDiceCount > currentHitDice}
                          className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:bg-gray-400"
                      >
                          Heal
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Evolution Modal */}
      {evolutionState.isModalOpen && evolutionState.toPokemon && evolutionInfo && (
          <EvolutionModal
              fromPokemon={pokemon}
              toPokemonBase={evolutionState.toPokemon}
              evolutionInfo={evolutionInfo}
              onConfirm={handleConfirmEvolution}
              onCancel={() => setEvolutionState({ isModalOpen: false, toPokemon: null })}
          />
      )}
    </div>
  );
}

export default PokemonSheetScreen;