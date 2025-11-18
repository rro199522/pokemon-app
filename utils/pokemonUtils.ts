// utils/pokemonUtils.ts
import { EVOLUTION_DATA } from '../evolutionData';

const findBaseForm = (pokemonId: string): string => {
    let currentId = pokemonId;
    let baseForm = currentId;

    while (true) {
        const evolution = EVOLUTION_DATA.find(e => e.to === currentId);
        if (evolution) {
            baseForm = evolution.from;
            currentId = evolution.from;
        } else {
            break;
        }
    }
    return baseForm;
};

const countStagesFromBase = (baseFormId: string): number => {
    let count = 1;
    let currentId = baseFormId;

    while (true) {
        const evolution = EVOLUTION_DATA.find(e => e.from === currentId);
        if (evolution) {
            count++;
            currentId = evolution.to;
        } else {
            break;
        }
    }
    return count;
};

export const getEvolutionStageCount = (pokemonId: string): number => {
    if (!pokemonId) return 1;
    const baseForm = findBaseForm(pokemonId);
    const stageCount = countStagesFromBase(baseForm);
    return stageCount || 1; // Default to 1 if something goes wrong
};