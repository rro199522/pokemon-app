
// components/TrainerSheet.tsx
import React, { useMemo } from 'react';
import { Trainer, Pokemon } from '../types.ts';
import { ITEM_DATA } from '../itemData.ts';
import { TRAINER_PATH_DATA } from '../data/trainerPathData.ts';
import { calculateFinalTrainerData } from '../utils/trainerUtils.ts';
import { TRAINER_LEVEL_UP_REQUIREMENTS } from '../data/trainerClassData.ts';
import { getModifier } from '../utils/commonUtils.ts';
import SectionHeader from './SectionHeader.tsx';

interface TrainerSheetProps {
    trainer: Trainer;
    team: Pokemon[];
    onEdit: () => void;
    onLevelUp: () => void;
}

const TrainerSheet: React.FC<TrainerSheetProps> = React.memo(({ trainer, onEdit, team, onLevelUp }) => {
    // Expensive calculation memoized
    const finalTrainerData = useMemo(() => calculateFinalTrainerData(trainer), [trainer]);
    
    const isPathLocked = finalTrainerData.level < 2;
    const pathDetails = !isPathLocked ? TRAINER_PATH_DATA.find(p => p.id === finalTrainerData.trainerPath) : null;
    const profBonus = Math.floor((finalTrainerData.level - 1) / 4) + 2;

    // Memoize level calculations
    const { totalPokemonLevels, requiredLevels, canLevelUp, progressPercent } = useMemo(() => {
        const total = team.reduce((sum, p) => sum + p.minLevel, 0);
        const nextLvl = finalTrainerData.level + 1;
        const req = nextLvl <= 20 ? TRAINER_LEVEL_UP_REQUIREMENTS[nextLvl] : Infinity;
        const canLvl = req && total >= req;
        const percent = req ? Math.min(100, (total / req) * 100) : 100;
        return { totalPokemonLevels: total, requiredLevels: req, canLevelUp: canLvl, progressPercent: percent };
    }, [team, finalTrainerData.level]);

  return (
    <div className="bg-white p-4 text-gray-800 font-sans text-sm shadow-sm border-b border-gray-200">
      {/* Header & Level */}
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-3 border border-gray-100">
        <div className="flex items-center gap-3">
            <div>
                 <h2 className="text-xl font-extrabold text-gray-800 leading-tight">{finalTrainerData.name}</h2>
                 <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{pathDetails?.name || 'Novice Trainer'}</p>
            </div>
            <button onClick={onEdit} aria-label="Edit Trainer" className="p-1.5 bg-white text-gray-400 rounded-full shadow-sm hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
        <div className="bg-slate-800 text-white px-3 py-1 rounded-full font-bold shadow-md text-xs">Level {finalTrainerData.level}</div>
      </div>
      
      {/* Level Progress */}
      {finalTrainerData.level < 20 && requiredLevels && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
              <span>Next Level</span>
              <span>{totalPokemonLevels} / {requiredLevels} PL</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${canLevelUp ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {canLevelUp && (
            <button 
              onClick={onLevelUp}
              className="mt-2 w-full bg-green-500 text-white font-bold py-1.5 rounded-md hover:bg-green-600 transition-colors shadow-sm text-xs uppercase tracking-wide"
            >
              Level Up Available!
            </button>
          )}
        </div>
      )}

      {/* Core Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
        {[
            { label: 'Max HP', value: finalTrainerData.maxHp },
            { label: 'Pokeslots', value: finalTrainerData.pokeslots },
            { label: 'Max SR', value: finalTrainerData.maxSr }
        ].map(stat => (
            <div key={stat.label} className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-0.5">{stat.label}</div>
                <div className="text-lg font-bold text-slate-700 leading-none">{stat.value}</div>
            </div>
        ))}
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-6 gap-1 text-center mb-4">
        {Object.entries(finalTrainerData.attributes).map(([key, value]) => (
          <div key={key} className="bg-slate-800 text-white py-1.5 px-0.5 rounded flex flex-col justify-center">
            <div className="text-[9px] font-bold text-slate-400 mb-0.5">{key}</div>
            <div className="font-bold leading-none">{value}</div>
            <div className="text-[9px] text-slate-400">{getModifier(value as number)}</div>
          </div>
        ))}
      </div>

      {/* Saves & Skills */}
      <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
              <SectionHeader title="Saves" />
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                {finalTrainerData.savingThrows.map((save) => {
                    const attributeValue = finalTrainerData.attributes[save.name.substring(0, 3).toUpperCase() as keyof typeof finalTrainerData.attributes];
                    const modifier = getModifier(attributeValue);
                    const total = parseInt(modifier.toString()) + (save.proficient ? profBonus : 0);
                   return (
                     <div key={save.name} className="flex items-center justify-between text-xs">
                       <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${save.proficient ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <span className={`font-semibold ${save.proficient ? 'text-gray-800' : 'text-gray-500'}`}>{save.name.substring(0,3)}</span>
                       </div>
                       <span className={`font-bold ${save.proficient ? 'text-blue-600' : 'text-gray-400'}`}>{total >= 0 ? `+${total}` : total}</span>
                     </div>
                   )
                })}
              </div>
          </div>
          
          <div>
             <SectionHeader title="Skills" />
             <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-gray-50 p-2 rounded border border-gray-100">
                {finalTrainerData.proficiencies.map(skill => {
                    const attributeValue = finalTrainerData.attributes[skill.attribute as keyof typeof finalTrainerData.attributes];
                    const modifier = getModifier(attributeValue);
                    const total = parseInt(modifier.toString()) + (skill.level * profBonus);
                   return (
                    <div key={skill.name} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                             <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${skill.level === 0 ? 'bg-gray-300' : skill.level === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                            <span className={`truncate ${skill.level > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{skill.name}</span>
                        </div>
                        <span className={`font-bold ml-1 ${skill.level > 0 ? 'text-blue-600' : 'text-gray-400'}`}>{total >= 0 ? `+${total}` : total}</span>
                  </div>
                )})}
             </div>
          </div>
      </div>

      {/* Features & Inventory */}
      <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
             <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Path Features
             </h4>
             <div className="text-xs text-gray-700 space-y-2">
                {isPathLocked ? <p>Reach Level 2 to unlock Trainer Path.</p> : pathDetails ? (
                    <>
                        <p className="italic text-blue-900/70 mb-2">{pathDetails.description}</p>
                        {pathDetails.features.filter(f => f.level <= finalTrainerData.level).map(f => (
                            <div key={f.name} className="bg-white/50 p-1.5 rounded"><span className="font-bold text-blue-900">{f.name}:</span> {f.description}</div>
                        ))}
                    </>
                ) : <p>Select a path in edit mode.</p>}
             </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-yellow-800 text-xs uppercase tracking-wide">Inventory</h4>
                <span className="font-mono font-bold text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded text-xs">₽ {finalTrainerData.inventory.money}</span>
            </div>
             {finalTrainerData.inventory.items.length > 0 ? (
                 <div className="grid grid-cols-2 gap-2">
                    {finalTrainerData.inventory.items.map(item => {
                         const details = ITEM_DATA.find(i => i.id === item.id);
                         return (
                             <div key={item.id} className="flex justify-between text-xs bg-white p-1.5 rounded border border-yellow-100">
                                 <span className="text-gray-800">{details?.name || item.id}</span>
                                 <span className="font-bold text-yellow-700">x{item.quantity}</span>
                             </div>
                         )
                    })}
                 </div>
             ) : <p className="text-xs text-gray-500 italic">Empty inventory.</p>}
          </div>
      </div>
    </div>
  );
});

export default TrainerSheet;
