
// types.ts

// --- Pokedex V2 Interfaces ---
export interface PokemonSpeed {
  type: string;
  value: number;
}

export interface PokemonAttributes {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface PokemonAbility {
  id: string;
  hidden: boolean;
}

export interface PokemonMoves {
  start: string[];
  [key: string]: string[] | number[]; // For level2, level6, tm, egg etc.
}

export interface PokemonMedia {
  main: string;
  sprite: string;
  mainShiny: string;
  spriteShiny: string;
}

// FIX: Added Stat and Weakness interfaces for the old data structure
export interface Stat {
  name: string;
  value: number;
  max: number;
}

export interface Weakness {
  type: PokemonType;
  multiplier: string;
}

export interface PokemonFeat {
  id: string;
  notes: string;
}

export interface PokemonInventoryItem {
  id: string;
}

export interface EvolutionCondition {
  type: 'level' | 'item' | 'trade';
  value: number | string;
}

export interface EvolutionEffect {
  type: 'asi' | 'hp_increase';
  value: number | string;
}

export interface Evolution {
  from: string; // pokemon id
  to: string;   // pokemon id
  conditions: EvolutionCondition[];
  effects: EvolutionEffect[];
}


export interface Pokemon {
  id: string; // Species ID, e.g., "bulbasaur"
  instanceId?: string; // Unique ID for team members, e.g., "bulbasaur-1678886400000"
  name: string;
  number: number;
  type: string[];
  size: string;
  sr: number;
  minLevel: number;
  eggGroup: string[];
  gender: string;
  description: string;
  ac: number;
  hp: number;
  hitDice: string;
  speed: PokemonSpeed[];
  attributes: PokemonAttributes;
  skills: string[];
  savingThrows: string[];
  senses: string[];
  abilities: PokemonAbility[];
  moves: PokemonMoves;
  media: PokemonMedia;
  // FIX: Added optional fields for backward compatibility with pokemonData.ts
  stats?: Stat[];
  weaknesses?: Weakness[];
  imageUrl?: string;
  isActive?: boolean;
  // Fields for Edit Screen
  feats?: PokemonFeat[];
  inventory?: PokemonInventoryItem[];
  // Persisted dynamic fields
  currentHp?: number;
  currentHitDice?: number;
  statuses?: string[];
  currentMoves?: string[];
  currentMovesPP?: Record<string, number>;
  nature?: string;
  baseAttributes?: PokemonAttributes;
  isShiny?: boolean;
  // FIX: Add missing isFavorite property
  isFavorite?: boolean;
  currentGender?: 'Male' | 'Female' | 'None' | 'Other';
}


// --- Trainer Sheet Interfaces ---

export interface StatValue {
  value: number;
  modifier: number;
}

export interface Biography {
  species: string;
  gender: string;
  age: string;
  homeRegion: string;
  background: string;
  avatarUrl: string;
}

export interface Proficiency {
  name: string;
  attribute: 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
  level: 0 | 1 | 2; // 0: None, 1: Proficient, 2: Expertise
}

export interface SavingThrow {
  name: 'Strength' | 'Dexterity' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma';
  proficient: boolean;
}

export interface Specialization {
  name: string;
  type: string;
  value: number;
  color: string;
}

export interface SpecializationRule {
    type: 'attribute_increase' | 'proficiency_grant';
    attribute?: 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
    value?: number;
    skill?: string; // The name of the proficiency in Portuguese
}

export interface Feat {
  name: string;
  notes: string;
}

export interface TrainerInventoryItem {
  id: string;
  quantity: number;
}

export interface TrainerPathFeature {
  level: number;
  name: string;
  description: string;
}

export interface TrainerPath {
  id: string;
  name: string;
  description: string;
  features: TrainerPathFeature[];
}

export interface Trainer {
  name: string;
  level: number;
  ac: number;
  maxHp: number;
  maxHitDice: number;
  biography: Biography;
  attributes: Record<'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA', number>;
  proficiencies: Proficiency[];
  savingThrows: SavingThrow[];
  specializations: Specialization[];
  trainerPath: string;
  feats: Feat[];
  notes: string;
  inventory: {
    money: number;
    items: TrainerInventoryItem[];
  };
  about: string;
  // Calculated properties from trainer class
  pokeslots?: number;
  maxSr?: number;
  classFeatures?: { name: string; description: string }[];
}


// --- Existing Interfaces ---

export interface Condition {
  id: string;
  name: string;
  description: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
}

// FIX: Updated Move interface to match the data structure in moveData.ts and fix multiple type errors.
export interface Move {
  id: string;
  name: string;
  type: string;
  power: string | string[];
  time: string;
  pp: number;
  duration: string;
  range: string;
  description: (string | { [key: string]: any })[];
  higherLevels?: string;
  optional?: (string | { [key: string]: any })[];
  // FIX: Added missing properties to support level-based damage from moveData.ts.
  lvl1?: string;
  lvl5?: string;
  lvl10?: string;
  lvl17?: string;
}

export interface TM {
  id: number;
  move: string;
  cost: number;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  cost: number;
  description: string[];
  media: {
    sprite: string;
  };
}

export enum ScreenName {
  Pokedex = 'Pokedex',
  MyTeam = 'Meu Time',
  Itemdex = 'Itemdex',
  TMDex = 'TMdex',
  Movedex = 'Movedex',
  Abilitydex = 'Habilidades',
  Condicoes = 'Condições',
  ImportData = 'Importar Dados',
}

// Keeping for type colors, but may need adjustment for new data structure
export enum PokemonType {
  Agua = 'água',
  Fogo = 'fogo',
  Planta = 'planta',
  Eletrico = 'elétrico',
  Psiquico = 'psíquico',
  Sombrio = 'sombrio',
  Normal = 'normal',
  Lutador = 'lutador',
  Voador = 'voador',
  Veneno = 'veneno',
  Terra = 'terra',
  Pedra = 'pedra',
  Inseto = 'inseto',
  Fantasma = 'fantasma',
  Dragao = 'dragão',
  Metal = 'metal',
  Gelo = 'gelo',
  Fada = 'fada',
}

// FIX: Added missing TabName enum for PokemonTabs component
export enum TabName {
  About = 'About',
  Stats = 'Stats',
  Evolutions = 'Evolutions',
  Moves = 'Moves',
}

// FIX: Added missing PokemonTypeAbbreviation enum for PokemonWeaknessIcon component
export enum PokemonTypeAbbreviation {
  agua = 'AGU',
  fogo = 'FOG',
  planta = 'PLA',
  eletrico = 'ELE',
  psiquico = 'PSI',
  sombrio = 'SOM',
  normal = 'NOR',
  lutador = 'LUT',
  voador = 'VOA',
  veneno = 'VEN',
  terra = 'TER',
  pedra = 'PED',
  inseto = 'INS',
  fantasma = 'FAN',
  dragao = 'DRA',
  metal = 'MET',
  gelo = 'GEL',
  fada = 'FAD',
}
