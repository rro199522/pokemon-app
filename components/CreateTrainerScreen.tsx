// components/CreateTrainerScreen.tsx
import React, { useState, useMemo } from 'react';
import { Trainer } from '../types.ts';
import { ITEM_DATA } from '../itemData.ts';
import { TRAINER_PATH_DATA } from '../data/trainerPathData.ts';
import { calculateFinalTrainerData } from '../utils/trainerUtils.ts';
import { SPECIALIZATION_RULES } from '../data/specializationData.ts';

interface CreateTrainerScreenProps {
  initialData: Trainer;
  onSave: (data: Trainer) => void;
  onCancel: () => void;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="relative bg-gray-700 text-white font-bold py-1.5 px-4 my-4">
    <h3 className="relative z-10 text-lg">{title}</h3>
    <div
      className="absolute top-0 right-0 h-full w-5 bg-gray-700"
      style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
    ></div>
  </div>
);

const InputField: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; readOnly?: boolean }> = 
({ label, value, onChange, type = 'text', placeholder, readOnly = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? 'opacity-70' : ''}`}
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
            // Ranger gets proficiency in Nature (Ciências) and Survival (Sobrevivência)
            return skillName === 'Ciências' || skillName === 'Sobrevivência';
        case 'pokemon-collector':
             return skillName === 'Adestramento'; // This path grants Expertise
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
            // Update level and let finalFormData recalculate everything
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

    if(level === 1) { // First checkbox (Proficiency)
      newProficiencies[index].level = currentLevel === 1 ? 0 : 1;
    } else { // Second checkbox (Expertise)
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
    <div className="p-4 text-gray-800 text-sm animate-fade-in">
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
        {/* FIX: Use Object.keys with a type assertion to safely iterate over attribute keys. */}
        {(Object.keys(finalFormData.attributes) as Array<keyof typeof finalFormData.attributes>).map((attrKey) => {
          const value = finalFormData.attributes[attrKey];
          return (
            <InputField 
              key={attrKey} 
              label={attrKey} 
              type="number" 
              value={value} 
              onChange={e => handleAttributeChange(attrKey, parseInt(e.target.value) || 10)} 
            />
          );
        })}
      </div>

      <SectionHeader title="Proficiencies" />
      <p className="text-xs text-gray-500 -mt-2 mb-2">First checkbox is proficiency. Second is expertise.</p>
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
              <span className="ml-2 text-sm">{prof.name} ({prof.attribute})</span>
            </div>
          );
        })}
      </div>

      <SectionHeader title="Saving Throws" />
      <p className="text-xs text-gray-500 -mt-2 mb-2">Proficient in {savingThrowsProficientCount} of {maxSavingThrowsAllowed} allowed.</p>
       <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {baseFormData.savingThrows.map((save, index) => (
          <div key={save.name} className="flex items-center">
            <input 
              type="checkbox" 
              checked={save.proficient} 
              onChange={() => handleSavingThrowChange(index)} 
              className="form-checkbox h-4 w-4 text-blue-600" 
              disabled={save.name === 'Charisma'} // Primary ability is always proficient
            />
            <span className="ml-2">{save.name}</span>
          </div>
        ))}
      </div>

      <SectionHeader title="Specializations" />
      <div className="text-center font-bold p-2 rounded-md bg-blue-100 text-blue-700 mb-2">
        {specializationPointsSpent} / {specializationPointsAvailable} Points Spent
      </div>
      <div className="grid grid-cols-2 gap-4">
        {baseFormData.specializations.map((spec, index) => (
          <div key={spec.name}>
            <p className="text-xs font-semibold capitalize">{spec.name} ({spec.type})</p>
            <div className="flex items-center gap-1 mt-1 p-1 rounded-full" style={{backgroundColor: `${spec.color}40`}}>
               <div className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs" style={{backgroundColor: spec.color}}>
                   {spec.value}
                </div>
               {Array.from({length: 3}).map((_, i) => (
                   <button key={i} onClick={() => handleSpecializationChange(index, i)} 
                   className={`w-3 h-3 rounded-full border-2`}
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
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
          {TRAINER_PATH_DATA.map(path => <option key={path.id} value={path.id}>{path.name}</option>)}
      </select>
      {selectedPathDetails && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-200 rounded-md text-xs space-y-2">
            <p className="italic text-gray-600">{selectedPathDetails.description}</p>
            <div>
                <h4 className="font-bold text-gray-800 mb-1">Features by Level:</h4>
                <ul className="list-disc list-inside space-y-1 pl-2">
                    {selectedPathDetails.features.map(feature => (
                        <li key={feature.name}>
                            <strong className="font-semibold">Lvl {feature.level}: {feature.name}</strong>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
      
      <SectionHeader title="Inventory" />
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <InputField 
                label="Money" 
                type="number" 
                value={baseFormData.inventory.money} 
                onChange={e => {
                    const newInventory = { ...baseFormData.inventory, money: parseInt(e.target.value) || 0 };
                    setBaseFormData(prev => ({ ...prev, inventory: newInventory }));
                }} 
            />
            <h4 className="font-bold mt-4 mb-2 text-gray-700">Items</h4>
            <div className="space-y-2">
                {baseFormData.inventory.items.map((item, index) => {
                    const itemDetails = ITEM_DATA.find(i => i.id === item.id);
                    return (
                        <div key={item.id + index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <span className="text-sm">{itemDetails?.name}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleItemQuantityChange(index, -1)} className="w-6 h-6 rounded-md bg-red-200 text-red-800 font-bold">-</button>
                                <span className="font-bold w-6 text-center">{item.quantity}</span>
                                <button onClick={() => handleItemQuantityChange(index, 1)} className="w-6 h-6 rounded-md bg-green-200 text-green-800 font-bold">+</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-end gap-2">
                <div className="flex-grow">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Add Item</label>
                     <select 
                        value={newItemId} 
                        onChange={e => setNewItemId(e.target.value)} 
                        className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                     >
                        {ITEM_DATA.map(item => <option key={item.id} value={item.id}>{item.name} (${item.cost})</option>)}
                     </select>
                </div>
                <button onClick={handleAddNewItem} className="px-4 h-9 bg-blue-600 text-white font-semibold rounded-md">Add</button>
            </div>
        </div>
      
      <div className="mt-6">
        <button onClick={handleSaveClick} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Salvar Treinador</button>
      </div>
    </div>
  );
};

export default CreateTrainerScreen;
