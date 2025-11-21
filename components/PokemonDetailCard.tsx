
// components/PokemonDetailCard.tsx
import React from 'react';
import { Pokemon, PokemonType } from '../types.ts';
import { ABILITY_DATA } from '../abilityData.ts';
import { TM_DATA } from '../tmData.ts';
import { EVOLUTION_DATA } from '../evolutionData.ts';
import { POKEDEX_DATA } from '../pokedexData.ts';
import { typeStyles } from './PokemonTypeIcons.tsx';
import LazyImage from './LazyImage.tsx';
import SectionHeader from './SectionHeader.tsx';
import TypePill from './TypePill.tsx';
import { getModifier, formatMoveName } from '../utils/commonUtils.ts';
import { ITEM_DATA } from '../itemData.ts';
import { getEvolutionLine } from '../utils/pokemonUtils.ts';

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

interface PokemonDetailCardProps {
  pokemon: Pokemon;
  onShowEvolutionRules: () => void;
}

export const PokemonDetailCard: React.FC<PokemonDetailCardProps> = ({ pokemon, onShowEvolutionRules }) => {
    const [viewShiny, setViewShiny] = React.useState(false);

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

    const evolutionLine = React.useMemo(() => getEvolutionLine(pokemon.id), [pokemon.id]);

    return (
        <div className="p-4 font-sans text-gray-800 animate-fade-in">
            {/* Header */}
            <div className="flex items-start mb-2">
                <div className="flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-3xl font-extrabold text-slate-800">{pokemon.name}</h1>
                        <div className="flex gap-1">
                            {pokemon.type.map((type) => (
                                <TypePill key={type} type={type} />
                            ))}
                        </div>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Número:</strong> #{String(pokemon.number).padStart(4, '0')}</p>
                        <p><strong>Tamanho:</strong> {pokemon.size}</p>
                        <p><strong>SR:</strong> {pokemon.sr}</p>
                        <p><strong>Grupo de Ovos:</strong> {pokemon.eggGroup.join(', ')}</p>
                        <p><strong>Nível Mínimo:</strong> {pokemon.minLevel}</p>
                    </div>
                </div>
                <div 
                    className="w-32 flex-shrink-0 cursor-pointer group relative" 
                    onClick={() => setViewShiny(!viewShiny)}
                    title="Click to toggle Shiny"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none"></div>
                    <LazyImage 
                        src={viewShiny ? pokemon.media.mainShiny : pokemon.media.main} 
                        alt={pokemon.name} 
                        className="w-full object-contain drop-shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-105"
                    />
                     <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm z-20">
                        <span className="text-xs">✨</span>
                    </div>
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

            <p className="text-sm italic text-gray-600 pt-4 border-t border-gray-100 mt-4">{pokemon.description}</p>
            
            {/* Stats */}
            <SectionHeader title="Stats" />
            <div className="space-y-1 text-sm px-2">
                <p><strong>Classe de Armadura:</strong> {pokemon.ac}</p>
                <p><strong>Pontos de Vida:</strong> {pokemon.hp} ({pokemon.hitDice})</p>
                <p><strong>Velocidade:</strong> {pokemon.speed.map(s => `${Math.round(s.value / 1.5 * 5)}ft. ${s.type}`).join(', ')}</p>
            </div>
            
            {/* Attributes */}
            <div className="grid grid-cols-6 text-center bg-slate-800 text-white p-1 mt-3 text-sm rounded-md shadow-sm">
                {Object.entries(pokemon.attributes).map(([key, value]) => (
                    <div key={key} className="py-1">
                        <div className="font-bold text-[10px] text-slate-400 uppercase mb-0.5">{key}</div>
                        <div className="font-bold text-lg leading-none">{value}</div>
                        <div className="text-[10px] text-slate-400">{getModifier(value as number)}</div>
                    </div>
                ))}
            </div>

            {/* Saves, Skills, Resistances */}
            <div className="space-y-2 text-sm mt-3 px-2">
                <p><strong>Proficiências:</strong> <span className="capitalize">{pokemon.skills.join(', ')}</span></p>
                <p><strong>Testes de Resistência:</strong> <span className="uppercase">{pokemon.savingThrows.join(', ')}</span></p>
                <div className="flex items-start">
                    <strong className="w-32 flex-shrink-0 pt-0.5">Vulnerabilidades:</strong>
                    <div className="flex flex-wrap gap-1">
                        {vulnerabilities.length > 0 ? vulnerabilities.map(t => <TypePill key={t} type={t} className="px-2 py-0 text-[10px]" />) : <span className="text-gray-500">Nenhuma</span>}
                    </div>
                </div>
                <div className="flex items-start">
                    <strong className="w-32 flex-shrink-0 pt-0.5">Resistências:</strong>
                     <div className="flex flex-wrap gap-1">
                        {resistances.length > 0 ? resistances.map(t => <TypePill key={t} type={t} className="px-2 py-0 text-[10px]" />) : <span className="text-gray-500">Nenhuma</span>}
                    </div>
                </div>
                <p><strong>Imunidades:</strong> {immunities.length > 0 ? immunities.join(', ') : <span className="text-gray-500">Nenhuma</span>}</p>
            </div>
            
            {/* Abilities */}
            <SectionHeader title="Habilidades" />
            <div className="space-y-2 text-sm px-2">
                {pokemon.abilities.map(abilityInfo => {
                    const details = getAbilityDetails(abilityInfo.id);
                    return (
                        <div key={abilityInfo.id} className="bg-gray-50 p-2 rounded border border-gray-100">
                            <p>
                                <strong>{formatMoveName(abilityInfo.id)}</strong>
                                {abilityInfo.hidden && <span className="text-[10px] bg-slate-600 text-white rounded px-1.5 py-0.5 ml-2 font-semibold uppercase tracking-wide">Oculta</span>}
                            </p>
                            {details && <p className="text-gray-600 text-xs mt-1">{details.description}</p>}
                        </div>
                    )
                })}
            </div>

            {/* Inventory */}
            {pokemon.inventory && pokemon.inventory.length > 0 && (
                <>
                    <SectionHeader title="Itens" />
                    <div className="grid grid-cols-1 gap-2 px-2">
                        {pokemon.inventory.map((invItem, index) => {
                             const item = ITEM_DATA.find(i => i.id === invItem.id);
                             if (!item) return null;
                             return (
                                <div key={index} className="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 p-1 mr-3 flex-shrink-0 flex items-center justify-center">
                                        <LazyImage src={item.media.sprite} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                                            <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">{item.type}</span>
                                        </div>
                                        {item.description && item.description.length > 0 && (
                                            <p className="text-xs text-gray-600 leading-relaxed">{item.description[0]}</p>
                                        )}
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                </>
            )}

            {/* Evolution */}
            <SectionHeader title="Evolução">
                <button 
                    onClick={onShowEvolutionRules}
                    className="p-1 rounded-full text-gray-300 hover:text-white transition-colors"
                    aria-label="Ver regras de evolução"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </button>
            </SectionHeader>
            <div className="flex flex-col items-center px-2 py-4 bg-gray-50 rounded-lg border border-gray-100 mx-2">
                <div className="flex items-end justify-center gap-1 flex-wrap">
                    {evolutionLine.map((stage, index) => (
                        <React.Fragment key={stage.id}>
                            {/* Arrow and Condition */}
                            {index > 0 && (
                                <div className="flex flex-col items-center justify-center px-1 pb-6 text-gray-400">
                                    <span className="text-[10px] font-bold uppercase text-center leading-tight mb-0.5">
                                        {stage.conditions?.find(c => c.type === 'level') 
                                            ? `Lvl ${stage.conditions.find(c => c.type === 'level')?.value}` 
                                            : stage.conditions?.[0]?.type || '?'}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            )}
                            
                            {/* Sprite Card */}
                            <div className={`flex flex-col items-center transition-transform duration-300 ${stage.id === pokemon.id ? 'scale-110 z-10' : 'opacity-60 hover:opacity-100'}`}>
                                <div className={`w-16 h-16 rounded-full bg-white p-2 shadow-sm border-2 flex items-center justify-center ${stage.id === pokemon.id ? 'border-blue-500 shadow-blue-100' : 'border-gray-200'}`}>
                                    <LazyImage src={stage.sprite} alt={stage.name} className="w-full h-full object-contain" />
                                </div>
                                <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${stage.id === pokemon.id ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}>
                                    {stage.name}
                                </span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                {evolutionLine.length === 1 && (
                    <p className="text-xs text-gray-400 italic mt-2">Não evolui.</p>
                )}
            </div>
            
            {/* Moves */}
            <SectionHeader title="Movimentos" />
            <div className="text-sm space-y-2 px-2 pb-4">
                {Object.entries(pokemon.moves).map(([level, moves]) => {
                    if (!Array.isArray(moves) || moves.length === 0) return null;

                    let title = '';
                    if (level === 'start') title = 'Iniciais';
                    else if (level.startsWith('level')) title = `Nível ${level.replace('level', '')}`;
                    else if (level === 'egg') title = 'Ovo';
                    else if (level === 'tm') title = 'TM';
                    else return null;

                    return (
                        <div key={level} className="grid grid-cols-[70px_1fr] gap-x-2 border-b border-gray-100 pb-1 mb-1 last:border-0">
                            <strong className="text-right text-gray-500">{title}:</strong>
                             {level === 'tm' && pokemon.id === 'charmander' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                  {Object.entries(charmanderTMs).map(([num, name]) => (
                                      <div key={num}>
                                        <span className="font-bold text-gray-700">{num}</span> - {name}
                                      </div>
                                  ))}
                                </div>
                            ) : (
                                <span className="text-gray-800 capitalize">
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
    