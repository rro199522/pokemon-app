// components/PokemonDetailCard.tsx
import React from 'react';
import { Pokemon, PokemonType } from '../types';
import { ABILITY_DATA } from '../abilityData';
import { TM_DATA } from '../tmData';
import { EVOLUTION_DATA } from '../evolutionData';
import { POKEDEX_DATA } from '../pokedexData';
import { typeStyles } from './PokemonTypeIcons';

// --- Helper Components & Functions ---

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-gray-800 text-white font-bold py-1 px-3 mt-4 mb-2">
    <h3>{children}</h3>
  </div>
);

const TypePill: React.FC<{ type: PokemonType | string }> = ({ type }) => {
    const styleClass = typeStyles[type] || 'bg-gray-400 text-white';
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-md shadow-sm capitalize ${styleClass}`}>
            {type}
        </span>
    );
};

const getModifier = (value: number) => {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : String(mod);
};

const formatMoveName = (move: string) => {
    return move.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const charmanderTMs: { [key: string]: string } = {
    '1': 'Work Up', '2': 'Dragon Claw', '6': 'Toxic', '10': 'Hidden Power',
    '11': 'Sunny Day', '17': 'Protect', '21': 'Frustration', '27': 'Return',
    '31': 'Brick Break', '32': 'Double Team', '35': 'Flamethrower', '38': 'Fire Blast',
    '39': 'Rock Tomb', '40': 'Aerial Ace', '42': 'Facade', '43': 'Flame Charge',
    '44': 'Rest', '45': 'Attract', '48': 'Round', '49': 'Echoed Voice',
    '50': 'Overheat', '56': 'Fling', '61': 'Will-O-Wisp', '65': 'Shadow Claw',
    '75': 'Swords Dance', '80': 'Rock Slide', '87': 'Swagger', '88': 'Sleep Talk',
    '90': 'Substitute', '100': 'Confide'
};


// --- Main Component ---

interface PokemonDetailCardProps {
  pokemon: Pokemon;
  onShowEvolutionRules: () => void;
}

export const PokemonDetailCard: React.FC<PokemonDetailCardProps> = ({ pokemon, onShowEvolutionRules }) => {
    const getAbilityDetails = (abilityId: string) => {
      return ABILITY_DATA.find(a => a.id.toLowerCase() === abilityId.toLowerCase());
    }

    const parseGender = (genderRatio: string) => {
        if (genderRatio === "1:1") return { female: 50, male: 50 };
        if (genderRatio === "Genderless") return { female: 0, male: 0, genderless: true };
        const [female, male] = genderRatio.split(':').map(Number);
        const total = female + male;
        return {
            female: Math.round((female / total) * 100),
            male: Math.round((male / total) * 100)
        };
    };
    const genderData = parseGender(pokemon.gender);
    
    // Set a minimum aesthetic width for the gender bar
    let femaleDisplayWidth = genderData.female;
    let maleDisplayWidth = genderData.male;
    const minDisplayWidth = 30;

    if (genderData.female > 0 && genderData.female < minDisplayWidth) {
        femaleDisplayWidth = minDisplayWidth;
        maleDisplayWidth = 100 - minDisplayWidth;
    } else if (genderData.male > 0 && genderData.male < minDisplayWidth) {
        maleDisplayWidth = minDisplayWidth;
        femaleDisplayWidth = 100 - minDisplayWidth;
    }

    const vulnerabilities = pokemon.weaknesses?.filter(w => w.multiplier === '2x').map(w => w.type) || [];
    const resistances = pokemon.weaknesses?.filter(w => w.multiplier === '1/2x').map(w => w.type) || [];
    const immunities = pokemon.weaknesses?.filter(w => w.multiplier === '0x').map(w => w.type) || [];

    const evolutionInfo = EVOLUTION_DATA.find(e => e.from === pokemon.id);

    const generateEvolutionText = () => {
        if (!evolutionInfo) {
            return 'Este Pokémon não evolui mais.';
        }

        const toPokemon = POKEDEX_DATA.find(p => p.id === evolutionInfo.to);
        const toName = toPokemon ? toPokemon.name : evolutionInfo.to.charAt(0).toUpperCase() + evolutionInfo.to.slice(1);
        
        const conditions = evolutionInfo.conditions.map(cond => {
            if (cond.type === 'level') {
                return `no nível ${cond.value} ou superior`;
            }
            return `com a condição: ${cond.type}`;
        }).join(', ');

        const effects = evolutionInfo.effects.map(eff => {
            if (eff.type === 'asi') {
                return `ganha ${eff.value} pontos para adicionar às suas pontuações de habilidade`;
            }
             return `ganhando o efeito: ${eff.type}`;
        }).join(', e ');

        return `${pokemon.name} pode evoluir para ${toName} ${conditions}. Quando evolui, ${effects}.`;
    };

    return (
        <div className="p-4 font-sans text-gray-800 animate-fade-in">
            {/* Header */}
            <div className="flex items-start mb-2">
                <div className="flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-3xl font-extrabold">{pokemon.name}</h1>
                        <div className="flex gap-2">
                            {pokemon.type.map((type) => {
                                const styleClass = typeStyles[type] || 'bg-gray-400 text-white';
                                return (
                                    <span key={type} className={`px-3 py-1 text-sm font-bold rounded-md capitalize ${styleClass}`}>
                                        {type}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                        <p><strong>Número:</strong> #{String(pokemon.number).padStart(4, '0')}</p>
                        <p><strong>Tamanho:</strong> {pokemon.size}</p>
                        <p><strong>SR:</strong> {pokemon.sr}</p>
                        <p><strong>Grupo de Ovos:</strong> {pokemon.eggGroup.join(', ')}</p>
                        <p><strong>Nível Mínimo:</strong> {pokemon.minLevel}</p>
                    </div>
                </div>
                <div className="w-1/3 flex-shrink-0">
                    <img src={pokemon.media.main} alt={pokemon.name} className="w-full object-contain drop-shadow-lg"/>
                </div>
            </div>
            
            <div className="mt-2 text-sm">
                <strong>Gênero:</strong>
                <div className="w-full bg-gray-200 rounded-full h-5 mt-1 flex overflow-hidden border border-gray-300">
                    <div className="bg-pink-500 h-full flex items-center justify-center text-white text-xs font-bold" style={{width: `${femaleDisplayWidth}%`}}>
                        ♀ {genderData.female > 10 ? `${genderData.female}%` : ''}
                    </div>
                    <div className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-bold" style={{width: `${maleDisplayWidth}%`}}>
                        ♂ {genderData.male > 10 ? `${genderData.male}%` : ''}
                    </div>
                </div>
            </div>


            <p className="text-sm italic text-gray-600 pt-4">{pokemon.description}</p>
            
            {/* Stats */}
            <SectionHeader>Stats</SectionHeader>
            <div className="space-y-1 text-sm">
                <p><strong>Classe de Armadura:</strong> {pokemon.ac}</p>
                <p><strong>Pontos de Vida:</strong> {pokemon.hp} ({pokemon.hitDice})</p>
                <p><strong>Velocidade:</strong> {pokemon.speed.map(s => `${Math.round(s.value / 1.5 * 5)}ft. ${s.type}`).join(', ')}</p>
            </div>
            
            {/* Attributes */}
            <div className="grid grid-cols-6 text-center bg-gray-800 text-white p-1 mt-3 text-sm rounded-md shadow-inner">
                {Object.entries(pokemon.attributes).map(([key, value]) => (
                    <div key={key} className="py-1">
                        <div className="font-bold text-xs">{key.toUpperCase()}</div>
                        {/* FIX: Cast value to number as Object.entries infers it as unknown. */}
                        <div className="font-semibold">{value} ({getModifier(value as number)})</div>
                    </div>
                ))}
            </div>

            {/* Saves, Skills, Resistances */}
            <div className="space-y-1.5 text-sm mt-3">
                <p><strong>Proficiências:</strong> <span className="capitalize">{pokemon.skills.join(', ')}</span></p>
                <p><strong>Testes de Resistência:</strong> <span className="uppercase">{pokemon.savingThrows.join(', ')}</span></p>
                <div className="flex items-start">
                    <strong className="w-32 flex-shrink-0 pt-0.5">Vulnerabilidades:</strong>
                    <div className="flex flex-wrap gap-1">
                        {vulnerabilities.length > 0 ? vulnerabilities.map(t => <TypePill key={t} type={t} />) : <span>Nenhuma</span>}
                    </div>
                </div>
                <div className="flex items-start">
                    <strong className="w-32 flex-shrink-0 pt-0.5">Resistências:</strong>
                     <div className="flex flex-wrap gap-1">
                        {resistances.length > 0 ? resistances.map(t => <TypePill key={t} type={t} />) : <span>Nenhuma</span>}
                    </div>
                </div>
                <p><strong>Imunidades:</strong> {immunities.length > 0 ? immunities.join(', ') : <span>Nenhuma</span>}</p>
            </div>
            
            {/* Abilities */}
            <SectionHeader>Habilidades</SectionHeader>
            <div className="space-y-2 text-sm">
                {pokemon.abilities.map(abilityInfo => {
                    const details = getAbilityDetails(abilityInfo.id);
                    return (
                        <div key={abilityInfo.id}>
                            <p>
                                <strong>{formatMoveName(abilityInfo.id)}</strong>
                                {abilityInfo.hidden && <span className="text-xs bg-gray-600 text-white rounded-sm px-1.5 py-0.5 ml-2 font-semibold">Oculta</span>}
                            </p>
                            {details && <p className="text-gray-600 text-xs">{details.description}</p>}
                        </div>
                    )
                })}
            </div>

            {/* Evolution */}
            <div className="bg-gray-800 text-white font-bold py-1 px-3 mt-4 mb-2 flex items-center justify-between">
                <h3>Evolução</h3>
                <button 
                    onClick={onShowEvolutionRules}
                    className="p-1 rounded-full text-gray-800 bg-white/80 hover:bg-white transition-colors"
                    aria-label="Ver regras de evolução"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="text-sm">
                <p><strong>Evolução:</strong> 1 / 3</p>
                <p className="text-gray-600">{generateEvolutionText()}</p>
            </div>
            
            {/* Moves */}
            <SectionHeader>Movimentos</SectionHeader>
            <div className="text-sm space-y-2">
                {Object.entries(pokemon.moves).map(([level, moves]) => {
                    if (!Array.isArray(moves) || moves.length === 0) return null;

                    let title = '';
                    if (level === 'start') title = 'Iniciais';
                    else if (level.startsWith('level')) title = `Nível ${level.replace('level', '')}`;
                    else if (level === 'egg') title = 'Ovo';
                    else if (level === 'tm') title = 'TM';
                    else return null;

                    return (
                        <div key={level} className="grid grid-cols-[80px_1fr] gap-x-2">
                            <strong className="text-right">{title}:</strong>
                             {level === 'tm' && pokemon.id === 'charmander' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs -ml-2">
                                  {Object.entries(charmanderTMs).map(([num, name]) => (
                                      <div key={num}>
                                        <span className="font-bold">{num}</span> - {name}
                                      </div>
                                  ))}
                                </div>
                            ) : (
                                <span className="text-gray-700 capitalize">
                                    {level === 'tm'
                                        ? (moves as number[]).map(moveId => {
                                            const tm = TM_DATA.find(t => t.id === moveId);
                                            return tm ? formatMoveName(tm.move) : `TM${String(moveId).padStart(2, '0')}`;
                                          }).join(', ')
                                        : (moves as string[]).map(move => formatMoveName(move)).join(', ')
                                    }
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>

        </div>
    );
};