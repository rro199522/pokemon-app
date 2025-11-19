
// components/CreateTrainerScreen.tsx
import React, { useState, useMemo } from 'react';
import { Trainer } from '../types.ts';
import { ITEM_DATA } from '../itemData.ts';
import { TRAINER_PATH_DATA } from '../data/trainerPathData.ts';
import { calculateFinalTrainerData } from '../utils/trainerUtils.ts';
import { SPECIALIZATION_RULES } from '../data/specializationData.ts';
import SectionHeader from './SectionHeader.tsx';

interface CreateTrainerScreenProps {
  initialData: Trainer;
  onSave: (data: Trainer) => void;
  onCancel: () => void;
}

const InputField: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; readOnly?: boolean }> = 
({ label, value, onChange, type = 'text', placeholder, readOnly = false }) => (
    <div>
        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
    </div>
);

const CreateTrainerScreen: React.FC<CreateTrainerScreenProps> = ({ initialData, onSave, onCancel }) => {
  const [baseFormData, setBaseFormData] = useState<Trainer>(() => ({
    ...initialData,
    inventory: {
        ...initialData.inventory,
        items: initialData.inventory.items || []
    }
  }));
  const [newItemId, setNewItemId] = useState<string>(ITEM_DATA[0]?.id || '');
  
  // --- DERIVED STATE & CALCULATIONS ---
  const finalFormData = useMemo(() => calculateFinalTrainerData(baseFormData), [baseFormData]);

  const selectedPathDetails = useMemo(() => {
    return TRAINER_PATH_DATA.find(p => p.id === baseFormData.trainerPath);
  }, [baseFormData.trainerPath]);

  const specializationPointsAvailable = useMemo(() => {
    const level = baseFormData.level;
    return (level >= 1 ? 1 : 0) + (level >= 7 ? 1 : 0) + (level >= 18 ? 1 : 0);
  }, [baseFormData.level]);

  const specializationPointsSpent = useMemo(() => {
    return baseFormData.specializations.reduce((total, spec) => total + spec.value, 0);
  }, [baseFormData.specializations]);

  const savingThrowsProficientCount = useMemo(() => {
    return baseFormData.savingThrows.filter(s => s.proficient).length;
  }, [baseFormData.savingThrows]);

  const maxSavingThrowsAllowed = useMemo(() => {
    return baseFormData.level >= 10 ? 2 : 1;
  }, [baseFormData.level]);

  const isProficiencyGrantedBySpec = (skillName: string): boolean => {
    for (const spec of baseFormData.specializations) {
      if (spec.value > 0) {
        const rule = SPECIALIZATION_RULES[spec.name];
        if (rule && rule.type === 'proficiency_grant' && rule.skill === skillName) {
          return true;
        }
      }
    }
    return false;
  };
  
  const isProficiencyGrantedByPath = (skillName: string): boolean => {
    if (baseFormData.level < 2) return false;
    switch (baseFormData.trainerPath) {
        case 'nurse':
            return skillName === 'Medicina';
        case 'ranger':
            return skillName === 'Ciências' || skillName === 'Sobrevivência';
        case 'pokemon-collector':
             return skillName === 'Adestramento';
        default:
            return false;
    }
  };

  // --- HANDLERS ---
  const handleInputChange = (section: keyof Trainer | 'biography', key: string, value: any) => {
    setBaseFormData(prev => {
        const newFormData = { ...prev };
        if (section === 'biography') {
            newFormData.biography = { ...newFormData.biography, [key]: value };
        } else if (key === 'level') {
            const newLevel = parseInt(value, 10) || 1;
            newFormData.level = newLevel;
        } else {
            (newFormData as any)[key] = value;
        }
        return newFormData;
    });
  };
  
  const handleAttributeChange = (key: keyof Trainer['attributes'], value: number) => {
    const baseValue = baseFormData.attributes[key];
    const finalValue = finalFormData.attributes[key];
    
    const bonusFromSpecs = finalValue - baseValue;
    const newBaseValue = value - bonusFromSpecs;

    setBaseFormData(prev => ({
        ...prev,
        attributes: {
            ...prev.attributes,
            [key]: newBaseValue
        }
    }));
  };
  
  const handleProficiencyChange = (index: number, level: 1 | 2) => {
    const newProficiencies = [...baseFormData.proficiencies];
    const currentLevel = newProficiencies[index].level;

    if(level === 1) { 
      newProficiencies[index].level = currentLevel === 1 ? 0 : 1;
    } else { 
      newProficiencies[index].level = currentLevel === 2 ? 1 : 2;
    }
    setBaseFormData(prev => ({...prev, proficiencies: newProficiencies}));
  };

  const handleSavingThrowChange = (index: number) => {
    const newSavingThrows = [...baseFormData.savingThrows];
    const isCurrentlyProficient = newSavingThrows[index].proficient;

    if (!isCurrentlyProficient && savingThrowsProficientCount >= maxSavingThrowsAllowed) {
        alert(`You can only be proficient in ${maxSavingThrowsAllowed} saving throw(s) at this level.`);
        return;
    }

    newSavingThrows[index].proficient = !isCurrentlyProficient;
    setBaseFormData(prev => ({...prev, savingThrows: newSavingThrows}));
  };
  
  const handleSpecializationChange = (specIndex: number, valueIndex: number) => {
    const newSpecializations = [...baseFormData.specializations];
    const currentSpecValue = newSpecializations[specIndex].value;
    const clickedValue = valueIndex + 1;
    
    const newValue = (currentSpecValue === clickedValue) ? 0 : clickedValue;
    const changeInPoints = newValue - currentSpecValue;

    if (changeInPoints > 0 && specializationPointsSpent + changeInPoints > specializationPointsAvailable) {
        alert("No more specialization points available at this level.");
        return;
    }

    newSpecializations[specIndex].value = newValue;
    setBaseFormData(prev => ({...prev, specializations: newSpecializations}));
  }

  const handleItemQuantityChange = (index: number, amount: number) => {
    setBaseFormData(prev => {
      const itemToChange = prev.inventory.items[index];
      const itemDetails = ITEM_DATA.find(i => i.id === itemToChange.id);
      if (!itemToChange || !itemDetails) return prev;

      if (amount > 0 && prev.inventory.money < itemDetails.cost) return prev;
      
      const newQuantity = itemToChange.quantity + amount;
      if (newQuantity < 0) return prev;

      const moneyChange = amount > 0 ? -itemDetails.cost : 0;

      let updatedItems;
      if (newQuantity === 0) {
        updatedItems = prev.inventory.items.filter((_, i) => i !== index);
      } else {
        updatedItems = prev.inventory.items.map((item, i) =>
          i === index ? { ...item, quantity: newQuantity } : item
        );
      }
      
      return {
        ...prev,
        inventory: { ...prev.inventory, money: prev.inventory.money + moneyChange, items: updatedItems },
      };
    });
  };

  const handleAddNewItem = () => {
    if (!newItemId) return;

    setBaseFormData(prev => {
      const itemDetails = ITEM_DATA.find(i => i.id === newItemId);
      if (!itemDetails || prev.inventory.money < itemDetails.cost) return prev;

      const existingItemIndex = prev.inventory.items.findIndex(i => i.id === newItemId);
      
      let newItems;
      if (existingItemIndex !== -1) {
          newItems = prev.inventory.items.map((item, index) => 
              index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
          );
      } else {
          newItems = [...prev.inventory.items, { id: newItemId, quantity: 1 }];
      }

      return {
          ...prev,
          inventory: {
              ...prev.inventory,
              money: prev.inventory.money - itemDetails.cost,
              items: newItems,
          }
      };
    });
  };

  const handleSaveClick = () => {
    onSave(baseFormData);
  };
  
  return (
    <div className="p-4 text-gray-800 text-sm animate-fade-in bg-white pb-20">
      <SectionHeader title="Basic Info" />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Name" value={baseFormData.name} onChange={e => handleInputChange('name', 'name', e.target.value)} />
        <InputField label="Level" type="number" value={baseFormData.level} onChange={e => handleInputChange('level', 'level', e.target.value)} />
        <InputField label="AC" type="number" value={baseFormData.ac} onChange={e => handleInputChange('ac', 'ac', parseInt(e.target.value) || 10)} />
        <InputField label="Max HP" type="number" value={finalFormData.maxHp} onChange={() => {}} readOnly />
        <InputField label="Max Hit Dice" type="number" value={baseFormData.maxHitDice} onChange={e => handleInputChange('maxHitDice', 'maxHitDice', parseInt(e.target.value) || 1)} />
      </div>

      <SectionHeader title="Biography" />
       <InputField label="Avatar URL" value={baseFormData.biography.avatarUrl} onChange={e => handleInputChange('biography', 'avatarUrl', e.target.value)} />

      <SectionHeader title="Attributes" />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {(Object.entries(finalFormData.attributes) as [keyof Trainer['attributes'], number][]).map(([attrKey, value]) => (
            <InputField 
              key={attrKey} 
              label={attrKey} 
              type="number" 
              value={value} 
              onChange={e => handleAttributeChange(attrKey, parseInt(e.target.value) || 10)} 
            />
        ))}
      </div>

      <SectionHeader title="Proficiencies" />
      <p className="text-xs text-gray-500 -mt-2 mb-2 italic">First checkbox: Proficiency. Second: Expertise.</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {finalFormData.proficiencies.map((prof, index) => {
          const isGrantedBySpec = isProficiencyGrantedBySpec(prof.name);
          const isGrantedByPath = isProficiencyGrantedByPath(prof.name);
          const isGrantedByFeature = (prof.name === "Adestramento" && finalFormData.level >= 13);
          const isDisabled = isGrantedBySpec || isGrantedByPath || isGrantedByFeature;

          return (
            <div key={prof.name} className="flex items-center">
              <input type="checkbox" checked={prof.level >= 1} onChange={() => handleProficiencyChange(index, 1)} disabled={isDisabled} className="form-checkbox h-4 w-4 text-blue-600 rounded-sm disabled:opacity-50" />
              <input type="checkbox" checked={prof.level === 2} onChange={() => handleProficiencyChange(index, 2)} disabled={isDisabled} className="form-checkbox h-4 w-4 text-yellow-500 ml-1 rounded-sm disabled:opacity-50" />
              <span className={`ml-2 text-sm ${prof.level > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{prof.name} ({prof.attribute})</span>
            </div>
          );
        })}
      </div>

      <SectionHeader title="Saving Throws" />
      <p className="text-xs text-gray-500 -mt-2 mb-2 italic">Proficient in {savingThrowsProficientCount} of {maxSavingThrowsAllowed} allowed.</p>
       <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {baseFormData.savingThrows.map((save, index) => (
          <div key={save.name} className="flex items-center">
            <input 
              type="checkbox" 
              checked={save.proficient} 
              onChange={() => handleSavingThrowChange(index)} 
              className="form-checkbox h-4 w-4 text-blue-600 rounded-sm" 
              disabled={save.name === 'Charisma'} 
            />
            <span className={`ml-2 text-sm ${save.proficient ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{save.name}</span>
          </div>
        ))}
      </div>

      <SectionHeader title="Specializations" />
      <div className={`text-center font-bold p-2 rounded-md mb-4 text-sm ${specializationPointsSpent > specializationPointsAvailable ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
        {specializationPointsSpent} / {specializationPointsAvailable} Points Spent
      </div>
      <div className="grid grid-cols-2 gap-4">
        {baseFormData.specializations.map((spec, index) => (
          <div key={spec.name}>
            <p className="text-xs font-semibold capitalize text-gray-700 mb-1">{spec.name} ({spec.type})</p>
            <div className="flex items-center gap-1 mt-1 p-1 rounded-full border border-gray-100 shadow-sm" style={{backgroundColor: `${spec.color}10`}}>
               <div className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-sm" style={{backgroundColor: spec.color}}>
                   {spec.value}
                </div>
               {Array.from({length: 3}).map((_, i) => (
                   <button key={i} onClick={() => handleSpecializationChange(index, i)} 
                   className={`w-3 h-3 rounded-full border transition-colors`}
                   style={{borderColor: spec.color, backgroundColor: i < spec.value ? spec.color : 'transparent'}}
                   ></button>
               ))}
            </div>
          </div>
        ))}
      </div>
      
      <SectionHeader title="Trainer Path" />
      <select
          value={baseFormData.trainerPath}
          onChange={e => handleInputChange('trainerPath', 'trainerPath', e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
          {TRAINER_PATH_DATA.map(path => <option key={path.id} value={path.id}>{path.name}</option>)}
      </select>
      {selectedPathDetails && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs space-y-3">
            <p className="italic text-blue-900">{selectedPathDetails.description}</p>
            <div>
                <h4 className="font-bold text-blue-800 mb-2 uppercase tracking-wide text-[10px]">Path Features:</h4>
                <ul className="space-y-2">
                    {selectedPathDetails.features.map(feature => (
                        <li key={feature.name} className="bg-white p-2 rounded border border-blue-100 shadow-sm">
                            <strong className="font-bold text-gray-800 block mb-0.5">Lvl {feature.level}: {feature.name}</strong>
                            <span className="text-gray-600">{feature.description}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
      
      <SectionHeader title="Inventory" />
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <InputField 
                label="Money (₽)" 
                type="number" 
                value={baseFormData.inventory.money} 
                onChange={e => {
                    const newInventory = { ...baseFormData.inventory, money: parseInt(e.target.value) || 0 };
                    setBaseFormData(prev => ({ ...prev, inventory: newInventory }));
                }} 
            />
            <h4 className="font-bold mt-4 mb-2 text-gray-700 text-xs uppercase tracking-wide">Items</h4>
            <div className="space-y-2">
                {baseFormData.inventory.items.map((item, index) => {
                    const itemDetails = ITEM_DATA.find(i => i.id === item.id);
                    return (
                        <div key={item.id + index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 shadow-sm">
                            <span className="text-sm font-medium text-gray-700">{itemDetails?.name}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleItemQuantityChange(index, -1)} className="w-6 h-6 rounded bg-red-100 text-red-700 font-bold hover:bg-red-200 transition-colors">-</button>
                                <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                                <button onClick={() => handleItemQuantityChange(index, 1)} className="w-6 h-6 rounded bg-green-100 text-green-700 font-bold hover:bg-green-200 transition-colors">+</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-end gap-2">
                <div className="flex-grow">
                     <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Add Item</label>
                     <select 
                        value={newItemId} 
                        onChange={e => setNewItemId(e.target.value)} 
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm"
                     >
                        {ITEM_DATA.map(item => <option key={item.id} value={item.id}>{item.name} (${item.cost})</option>)}
                     </select>
                </div>
                <button onClick={handleAddNewItem} className="px-4 h-10 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Add</button>
            </div>
        </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-4 max-w-[393px] mx-auto">
        <button onClick={onCancel} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
        <button onClick={handleSaveClick} className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-transform active:scale-95">Save Trainer</button>
      </div>
    </div>
  );
};

export default CreateTrainerScreen;
