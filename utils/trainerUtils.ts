// utils/trainerUtils.ts
import { Trainer } from '../types';
import { SPECIALIZATION_RULES } from '../data/specializationData';
import { TRAINER_LEVEL_TABLE, CLASS_FEATURES } from '../data/trainerClassData';
import { TRAINER_PATH_DATA } from '../data/trainerPathData';

export const calculateFinalTrainerData = (baseTrainer: Trainer): Trainer => {
    const finalTrainer = JSON.parse(JSON.stringify(baseTrainer));

    // --- Core Class Stats ---
    const levelInfo = TRAINER_LEVEL_TABLE[finalTrainer.level - 1] || TRAINER_LEVEL_TABLE[0];
    finalTrainer.pokeslots = levelInfo.pokeslots;
    finalTrainer.maxSr = levelInfo.maxSr;

    // Calculate Max HP
    const conModifier = Math.floor((finalTrainer.attributes.CON - 10) / 2);
    let maxHp = 6 + conModifier; // HP at level 1
    if (finalTrainer.level > 1) {
        // For levels 2 and up, add the average of a d6 roll (4) + CON modifier
        maxHp += (finalTrainer.level - 1) * (4 + conModifier);
    }
    finalTrainer.maxHp = maxHp;

    // --- Trainer Path Proficiency Bonuses ---
    // Applied before specializations to ensure correct state for subsequent calculations.
    if (finalTrainer.level >= 2) {
        switch (finalTrainer.trainerPath) {
            case 'pokemon-collector': {
                const adestramentoIndex = finalTrainer.proficiencies.findIndex(p => p.name === 'Adestramento');
                if (adestramentoIndex !== -1) {
                    finalTrainer.proficiencies[adestramentoIndex].level = 2; // Expertise
                }
                break;
            }
            case 'nurse': {
                const medicinaIndex = finalTrainer.proficiencies.findIndex(p => p.name === 'Medicina');
                if (medicinaIndex !== -1 && finalTrainer.proficiencies[medicinaIndex].level < 1) {
                    finalTrainer.proficiencies[medicinaIndex].level = 1; // Proficiency
                }
                break;
            }
            case 'ranger': {
                const natureIndex = finalTrainer.proficiencies.findIndex(p => p.name === 'Ciências'); // 'Ciências' maps to 'Nature'
                if (natureIndex !== -1 && finalTrainer.proficiencies[natureIndex].level < 1) {
                    finalTrainer.proficiencies[natureIndex].level = 1;
                }
                const survivalIndex = finalTrainer.proficiencies.findIndex(p => p.name === 'Sobrevivência');
                if (survivalIndex !== -1 && finalTrainer.proficiencies[survivalIndex].level < 1) {
                    finalTrainer.proficiencies[survivalIndex].level = 1;
                }
                break;
            }
        }
    }
    
    // --- Specialization Bonuses ---
    for (const spec of finalTrainer.specializations) {
        if (spec.value > 0) {
            const rule = SPECIALIZATION_RULES[spec.name];
            if (rule) {
                if (rule.type === 'attribute_increase' && rule.attribute && rule.value) {
                    finalTrainer.attributes[rule.attribute] = Math.min(20, finalTrainer.attributes[rule.attribute] + (rule.value * spec.value));
                }
                if (rule.type === 'proficiency_grant' && rule.skill) {
                    const profIndex = finalTrainer.proficiencies.findIndex(p => p.name === rule.skill);
                    if (profIndex !== -1) {
                        const currentLevel = finalTrainer.proficiencies[profIndex].level;
                        if (currentLevel < spec.value + 1 && currentLevel < 2) {
                           finalTrainer.proficiencies[profIndex].level = Math.min(2, currentLevel + spec.value);
                        }
                    }
                }
            }
        }
    }
    
    // --- Class Feature Bonuses ---
    finalTrainer.classFeatures = [];
    const unlockedFeatures = levelInfo.features.split(', ');
    for(const featureName of unlockedFeatures) {
        const feature = CLASS_FEATURES[featureName];
        if (feature) {
            finalTrainer.classFeatures.push({ name: featureName, description: feature });
        }
    }
    
    // Apply "Pokemon Tracker" Expertise
    if (finalTrainer.level >= 13) {
        const adestramentoIndex = finalTrainer.proficiencies.findIndex(p => p.name === 'Adestramento');
        if (adestramentoIndex !== -1) {
            finalTrainer.proficiencies[adestramentoIndex].level = 2; // Expertise
        }
    }


    return finalTrainer;
};