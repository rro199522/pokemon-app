// data/editPokemonData.ts
import { PokemonAttributes } from '../types.ts';

export interface Nature {
  name: string;
  increase: keyof PokemonAttributes | null;
  decrease: keyof PokemonAttributes | null;
}

// Based on standard Pokemon nature effects mapped to D&D-like attributes
// STR: Attack, CON: Defense, DEX: Speed, WIS: Special Attack, CHA: Special Defense
// INT is unused by natures.
export const NATURE_DATA: Nature[] = [
  // Neutral Natures
  { name: 'Hardy', increase: null, decrease: null },
  { name: 'Docile', increase: null, decrease: null },
  { name: 'Serious', increase: null, decrease: null },
  { name: 'Bashful', increase: null, decrease: null },
  { name: 'Quirky', increase: null, decrease: null },
  
  // +STR Natures
  { name: 'Lonely', increase: 'str', decrease: 'con' },
  { name: 'Brave', increase: 'str', decrease: 'dex' },
  { name: 'Adamant', increase: 'str', decrease: 'wis' },
  { name: 'Naughty', increase: 'str', decrease: 'cha' },
  
  // +CON Natures
  { name: 'Bold', increase: 'con', decrease: 'str' },
  { name: 'Relaxed', increase: 'con', decrease: 'dex' },
  { name: 'Impish', increase: 'con', decrease: 'wis' },
  { name: 'Lax', increase: 'con', decrease: 'cha' },
  
  // +DEX Natures
  { name: 'Timid', increase: 'dex', decrease: 'str' },
  { name: 'Hasty', increase: 'dex', decrease: 'con' },
  { name: 'Jolly', increase: 'dex', decrease: 'wis' },
  { name: 'Naive', increase: 'dex', decrease: 'cha' },

  // +WIS Natures (Sp. Atk)
  { name: 'Modest', increase: 'wis', decrease: 'str' },
  { name: 'Mild', increase: 'wis', decrease: 'con' },
  { name: 'Quiet', increase: 'wis', decrease: 'dex' },
  { name: 'Rash', increase: 'wis', decrease: 'cha' },
  
  // +CHA Natures (Sp. Def)
  { name: 'Calm', increase: 'cha', decrease: 'str' },
  { name: 'Gentle', increase: 'cha', decrease: 'con' },
  { name: 'Sassy', increase: 'cha', decrease: 'dex' },
  { name: 'Careful', increase: 'cha', decrease: 'wis' },
];

export const applyNature = (baseAttributes: PokemonAttributes, natureName: string): PokemonAttributes => {
    const nature = NATURE_DATA.find(n => n.name === natureName);
    if (!nature || (!nature.increase && !nature.decrease)) {
        return { ...baseAttributes };
    }
    const newAttributes = { ...baseAttributes };
    if (nature.increase) {
        newAttributes[nature.increase] = (newAttributes[nature.increase] || 0) + 1;
    }
    if (nature.decrease) {
        newAttributes[nature.decrease] = (newAttributes[nature.decrease] || 0) - 1;
    }
    return newAttributes;
};

export const FEATS_LIST: string[] = [ 
    'Elemental Adept', 'Chef', 'Alert', 'Athlete', 
    'Durable', 'Tough', 'Mobile', 'Skulker' 
];

export const TERA_TYPES: string[] = [ 
    'Normal', 'Fire', 'Water', 'Grass', 'Electric', 
    'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 
    'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 
    'Dark', 'Steel', 'Fairy' 
];