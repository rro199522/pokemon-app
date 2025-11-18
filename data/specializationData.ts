// data/specializationData.ts
import { SpecializationRule } from '../types';

// As chaves devem corresponder à propriedade `name` no array `specializations` em `trainerData.ts`.
export const SPECIALIZATION_RULES: Record<string, SpecializationRule> = {
  'Poké Fan': { type: 'attribute_increase', attribute: 'CHA', value: 1 },
  'Black Belt': { type: 'proficiency_grant', skill: 'Atletismo' },
  'Bird Keeper': { type: 'proficiency_grant', skill: 'Percepção' },
  'Punk': { type: 'proficiency_grant', skill: 'Furtividade' }, // Mapeado para Stealth/Furtividade
  'Camper': { type: 'proficiency_grant', skill: 'Sobrevivência' },
  'Hiker': { type: 'attribute_increase', attribute: 'CON', value: 1 },
  'Bug Maniac': { type: 'proficiency_grant', skill: 'Ciências' }, // Mapeado para Sciences/Ciências
  'Mystic': { type: 'proficiency_grant', skill: 'Ocultismo' }, // Mapeado para Religion/Ocultismo
  'Worker': { type: 'attribute_increase', attribute: 'STR', value: 1 },
  'Kindler': { type: 'proficiency_grant', skill: 'Intimidação' },
  'Swimmer': { type: 'attribute_increase', attribute: 'DEX', value: 1 },
  'Gardener': { type: 'proficiency_grant', skill: 'Medicina' },
  'Engineer': { type: 'attribute_increase', attribute: 'INT', value: 1 },
  'Psychic': { type: 'proficiency_grant', skill: 'Ocultismo' }, // Mapeado para Arcana/Ocultismo
  'Skier': { type: 'proficiency_grant', skill: 'Acrobacia' },
  'Dragon Tamer': { type: 'attribute_increase', attribute: 'WIS', value: 1 },
  'Delinquent': { type: 'proficiency_grant', skill: 'Furtividade' },
  'Actor': { type: 'proficiency_grant', skill: 'Artes' }, // Mapeado para Performance/Artes
};