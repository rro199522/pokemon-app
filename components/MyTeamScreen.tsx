// components/MyTeamScreen.tsx
import React, { useState, useMemo } from 'react';
import { Pokemon, Trainer } from '../types';
import { ITEM_DATA } from '../itemData';
import { TRAINER_PATH_DATA } from '../data/trainerPathData';
import { calculateFinalTrainerData } from '../utils/trainerUtils';
import { TRAINER_LEVEL_UP_REQUIREMENTS } from '../data/trainerClassData';

interface MyTeamScreenProps {
  trainer: Trainer;
  team: Pokemon[];
  onAddPokemon: (pokemon: Pokemon) => void;
  onRemovePokemon: (instanceId: string) => void;
  onShowDetails: (pokemon: Pokemon) => void;
  onEdit: () => void;
  onSetPokemonActive: (instanceId: string) => void;
  onSetPokemonInactive: (instanceId: string) => void;
  pokedex: Pokemon[];
  onTrainerLevelUp: () => void;
}

const SectionHeader: React.FC<{ title: string; count?: string }> = ({ title, count }) => (
  <div className="relative bg-gray-700 text-white font-bold py-1 px-3 mb-2 flex justify-between items-center">
    <h3 className="relative z-10">{title}</h3>
    {count && <span className="text-sm font-semibold bg-gray-600 px-2 py-0.5 rounded-md">{count}</span>}
    <div
      className="absolute top-0 right-0 h-full w-4 bg-gray-700"
      style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
    ></div>
  </div>
);

const getModifier = (value: number) => {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod;
};

const TrainerSheet: React.FC<{ trainer: Trainer; onEdit: () => void; team: Pokemon[]; onLevelUp: () => void }> = ({ trainer, onEdit, team, onLevelUp }) => {
    const finalTrainerData = useMemo(() => calculateFinalTrainerData(trainer), [trainer]);
    
    // Check if trainer path is selectable
    const isPathLocked = finalTrainerData.level < 2;
    const pathDetails = !isPathLocked ? TRAINER_PATH_DATA.find(p => p.id === finalTrainerData.trainerPath) : null;

    const profBonus = Math.floor((finalTrainerData.level - 1) / 4) + 2;

    const totalPokemonLevels = useMemo(() => team.reduce((sum, p) => sum + p.minLevel, 0), [team]);
    const nextLevel = finalTrainerData.level + 1;
    const requiredLevels = nextLevel <= 20 ? TRAINER_LEVEL_UP_REQUIREMENTS[nextLevel] : Infinity;
    const canLevelUp = requiredLevels && totalPokemonLevels >= requiredLevels;

  return (
    <div className="bg-white p-4 text-gray-800 font-sans text-sm">
      {/* Name and Level */}
      <div className="flex justify-between items-center bg-gray-200 p-2 mb-2">
        <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{finalTrainerData.name}</h2>
            <button onClick={onEdit} aria-label="Edit Trainer" className="p-1 rounded-full hover:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
        <span className="text-lg font-bold">Lv. {finalTrainerData.level}</span>
      </div>
      
      {/* Level Up section */}
      {finalTrainerData.level < 20 && requiredLevels && (
        <div className="mb-2 p-2 border border-gray-300 rounded-md text-center">
          <p className="text-xs font-bold text-gray-600">Next Level Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 my-1 shadow-inner">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, (totalPokemonLevels / requiredLevels) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs font-semibold">{totalPokemonLevels} / {requiredLevels} Total Pokémon Levels</p>
          {canLevelUp && (
            <button 
              onClick={onLevelUp}
              className="mt-2 w-full bg-green-500 text-white font-bold py-1 rounded-md hover:bg-green-600 transition-colors"
            >
              Level Up!
            </button>
          )}
        </div>
      )}


       {/* Core Stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
        <div className="bg-gray-200 p-1 rounded">
          <div className="font-bold">Max HP</div>
          <div>{finalTrainerData.maxHp}</div>
        </div>
        <div className="bg-gray-200 p-1 rounded">
          <div className="font-bold">Pokeslots</div>
          <div>{finalTrainerData.pokeslots}</div>
        </div>
        <div className="bg-gray-200 p-1 rounded">
          <div className="font-bold">Max SR</div>
          <div>{finalTrainerData.maxSr}</div>
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-6 gap-1 text-center bg-gray-800 text-white p-1 mb-2 text-xs">
        {Object.entries(finalTrainerData.attributes).map(([key, value]) => (
          <div key={key}>
            <div>{key}</div>
            <div>{value} ({getModifier(value as number)})</div>
          </div>
        ))}
      </div>

      {/* Saves */}
      <SectionHeader title="Saves" />
      <div className="grid grid-cols-3 gap-x-4 bg-gray-800 text-white p-2 mb-4">
        {finalTrainerData.savingThrows.map((save) => {
            const attributeValue = finalTrainerData.attributes[save.name.substring(0, 3).toUpperCase() as keyof typeof finalTrainerData.attributes];
            const modifier = getModifier(attributeValue);
            const proficiencyBonus = save.proficient ? profBonus : 0;
            const total = parseInt(modifier.toString()) + proficiencyBonus;

           return (
             <div key={save.name} className="flex items-center gap-2">
                {save.proficient ? 
                   <div className="w-3 h-3 border-2 border-white rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div> : 
                   <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                }
               <span>{save.name.substring(0,3)} <strong>{total >= 0 ? `+${total}` : total}</strong></span>
             </div>
           )
        })}
      </div>

      {/* Skills */}
      <SectionHeader title="Skills" />
      <div className="grid grid-cols-2 gap-x-6 bg-gray-800 text-white p-2 mb-4">
        {finalTrainerData.proficiencies.map(skill => {
            const attributeValue = finalTrainerData.attributes[skill.attribute as keyof typeof finalTrainerData.attributes];
            const modifier = getModifier(attributeValue);
            const skillBonus = skill.level * profBonus;
            const total = parseInt(modifier.toString()) + skillBonus;
            
           return (
            <div key={skill.name} className="flex justify-between items-center text-xs py-0.5">
                <div className="flex items-center gap-2">
                    {skill.level > 0 ? 
                        <div className="w-3 h-3 border-2 border-white rounded-full flex items-center justify-center"><div className={`w-1.5 h-1.5 ${skill.level === 2 ? 'bg-yellow-400' : 'bg-white'} rounded-full`}></div></div> : 
                        <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                    }
                    <span>{skill.name} ({skill.attribute})</span>
                </div>
                <strong>{total >= 0 ? `+${total}` : total}</strong>
          </div>
        )})}
      </div>
      
      {/* Class Features */}
      <SectionHeader title="Class Features" />
       <div className="mb-4 text-xs italic space-y-2 p-2 bg-gray-100 rounded">
          {(finalTrainerData.classFeatures || []).map(feature => (
            <div key={feature.name}>
              <p className="font-bold not-italic text-gray-800">{feature.name}</p>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

      {/* Path */}
        <SectionHeader title={`Path: ${isPathLocked ? 'None' : (pathDetails?.name || 'Not Selected')}`} />
        {isPathLocked ? (
            <div className="mb-4 text-xs italic p-2 bg-gray-100 rounded">
                <p>Choose a Trainer Path at Level 2.</p>
            </div>
        ) : pathDetails ? (
            <div className="mb-4 text-xs italic space-y-2 p-2 bg-gray-100 rounded">
                <p>{pathDetails.description}</p>
                {pathDetails.features.filter(f => f.level <= finalTrainerData.level).map(feature => (
                    <div key={feature.name}>
                        <p className="font-bold not-italic text-gray-800">Lvl {feature.level}: {feature.name}</p>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        ) : (
            <div className="mb-4 text-xs italic p-2 bg-gray-100 rounded">
                <p>No path selected. Go to the edit screen to choose one.</p>
            </div>
        )}

      {/* Specializations */}
      <h3 className="text-lg font-bold mb-2">Specializations</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {finalTrainerData.specializations.filter(s => s.value > 0).map(spec => (
            <div key={spec.name}>
                <div className={`p-1 rounded-t-md text-white font-semibold text-xs text-center`} style={{backgroundColor: spec.color}}>
                    {spec.type}
                </div>
                <div className="bg-gray-800 text-white p-1 rounded-b-md text-center text-xs">
                    {spec.name} x{spec.value}
                </div>
            </div>
        ))}
      </div>
      
      <SectionHeader title="Feats" />
      <div className="mb-4">
        {finalTrainerData.feats.map(feat => (
            <div key={feat.name}>
                <p><strong>{feat.name}</strong></p>
                <p className="text-xs">{feat.notes}</p>
            </div>
        ))}
      </div>

      <SectionHeader title="Inventory" />
      <div className="bg-gray-200 p-2 mb-4 rounded-md">
        <p>Money: <strong>₽ {finalTrainerData.inventory.money}</strong></p>
        {(finalTrainerData.inventory.items || []).length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-300">
                <ul className="list-disc list-inside space-y-1">
                    {(finalTrainerData.inventory.items).map(item => {
                        const itemDetails = ITEM_DATA.find(i => i.id === item.id);
                        return (
                            <li key={item.id}>
                                {itemDetails?.name || item.id} <span className="font-semibold">x{item.quantity}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}
      </div>

      <SectionHeader title="About" />
      <p>{finalTrainerData.about}</p>
    </div>
  );
};

const AddPokemonForm: React.FC<{ trainer: Trainer; onAddPokemon: (pokemon: Pokemon) => void; pokedex: Pokemon[] }> = ({ trainer, onAddPokemon, pokedex }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Pokemon[]>([]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) {
            setSearchResults([]);
            return;
        }
        const finalTrainerData = calculateFinalTrainerData(trainer);
        const results = pokedex.filter(p => 
            p.name.toLowerCase().includes(term.toLowerCase()) && 
            p.sr <= finalTrainerData.maxSr
        );
        setSearchResults(results.slice(0, 5)); // Limit results
    };

    return (
        <div className="mt-4 p-4 border-t border-gray-200">
            <h3 className="font-bold text-lg mb-2">Add Pokémon to Team</h3>
            <input
                type="text"
                placeholder="Search Pokedex..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 space-y-1">
                {searchResults.map(pokemon => (
                    <button
                        key={pokemon.id}
                        onClick={() => {
                            onAddPokemon(pokemon);
                            setSearchTerm('');
                            setSearchResults([]);
                        }}
                        className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                        #{String(pokemon.number).padStart(3, '0')} {pokemon.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

const PokemonTeamMember: React.FC<{
    pokemon: Pokemon;
    onShowDetails: (p: Pokemon) => void;
    onRemovePokemon: (id: string) => void;
    onSetActive: (id: string) => void;
    onSetInactive: (id: string) => void;
    isActiveMember: boolean;
}> = ({ pokemon, onShowDetails, onRemovePokemon, onSetActive, onSetInactive, isActiveMember }) => {
    return (
        <div className="flex items-center p-2 mb-2 bg-gray-50 rounded-lg shadow-sm">
            <img src={pokemon.media.sprite} alt={pokemon.name} className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-grow ml-3">
                <p className="font-bold">{pokemon.name}</p>
                <p className="text-xs text-gray-500">Lvl {pokemon.minLevel} | HP: {pokemon.currentHp}/{pokemon.hp}</p>
            </div>
            <div className="flex gap-1">
                <button onClick={() => onShowDetails(pokemon)} className="p-2 text-xs bg-blue-500 text-white rounded">Details</button>
                {isActiveMember 
                    ? <button onClick={() => onSetInactive(pokemon.instanceId!)} className="p-2 text-xs bg-yellow-500 text-white rounded">Store</button>
                    : <button onClick={() => onSetActive(pokemon.instanceId!)} className="p-2 text-xs bg-green-500 text-white rounded">Add</button>
                }
                <button onClick={() => onRemovePokemon(pokemon.instanceId!)} className="p-2 text-xs bg-red-500 text-white rounded">X</button>
            </div>
        </div>
    );
};

const MyTeamScreen: React.FC<MyTeamScreenProps> = ({
    trainer,
    team,
    onAddPokemon,
    onRemovePokemon,
    onShowDetails,
    onEdit,
    onSetPokemonActive,
    onSetPokemonInactive,
    pokedex,
    onTrainerLevelUp,
}) => {
    const finalTrainerData = useMemo(() => calculateFinalTrainerData(trainer), [trainer]);
    const activeTeam = team.filter(p => p.isActive);
    const inactiveTeam = team.filter(p => !p.isActive);

    return (
        <div className="animate-fade-in">
            <div className="border-b border-gray-200">
              <TrainerSheet trainer={trainer} onEdit={onEdit} team={team} onLevelUp={onTrainerLevelUp} />
            </div>

            <div className="p-4">
                <SectionHeader title="Active Team" count={`${activeTeam.length}/${finalTrainerData.pokeslots}`} />
                {activeTeam.map(pokemon => (
                    <PokemonTeamMember
                        key={pokemon.instanceId}
                        pokemon={pokemon}
                        onShowDetails={onShowDetails}
                        onRemovePokemon={onRemovePokemon}
                        onSetActive={onSetPokemonActive}
                        onSetInactive={onSetPokemonInactive}
                        isActiveMember={true}
                    />
                ))}
                {activeTeam.length === 0 && <p className="text-center text-gray-500 py-4">No active Pokémon.</p>}
                
                <SectionHeader title="PC Box" count={`${inactiveTeam.length}`} />
                 {inactiveTeam.map(pokemon => (
                    <PokemonTeamMember
                        key={pokemon.instanceId}
                        pokemon={pokemon}
                        onShowDetails={onShowDetails}
                        onRemovePokemon={onRemovePokemon}
                        onSetActive={onSetPokemonActive}
                        onSetInactive={onSetPokemonInactive}
                        isActiveMember={false}
                    />
                ))}
                 {inactiveTeam.length === 0 && <p className="text-center text-gray-500 py-4">PC Box is empty.</p>}
            </div>

            <AddPokemonForm trainer={trainer} onAddPokemon={onAddPokemon} pokedex={pokedex} />
        </div>
    );
};

export default MyTeamScreen;