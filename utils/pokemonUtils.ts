
// utils/pokemonUtils.ts
import { EVOLUTION_DATA } from '../evolutionData.ts';
import { POKEDEX_DATA } from '../pokedexData.ts';
import { Pokemon, EvolutionCondition } from '../types.ts';

const findBaseForm = (pokemonId: string): string => {
    let currentId = pokemonId;
    
    // Loop backwards to find the root
    let iterations = 0;
    while (iterations < 10) { // Safety break
        const evolution = EVOLUTION_DATA.find(e => e.to === currentId);
        if (evolution) {
            currentId = evolution.from;
        } else {
            break;
        }
        iterations++;
    }
    return currentId;
};

const countStagesFromBase = (baseFormId: string): number => {
    let count = 1;
    let currentId = baseFormId;
    let iterations = 0;

    while (iterations < 10) {
        const evolution = EVOLUTION_DATA.find(e => e.from === currentId);
        if (evolution) {
            count++;
            currentId = evolution.to;
        } else {
            break;
        }
        iterations++;
    }
    return count;
};

export const getEvolutionStageCount = (pokemonId: string): number => {
    if (!pokemonId) return 1;
    const baseForm = findBaseForm(pokemonId);
    const stageCount = countStagesFromBase(baseForm);
    return stageCount || 1; // Default to 1 if something goes wrong
};

export interface EvolutionStage {
    id: string;
    name: string;
    sprite: string;
    minLevel: number;
    conditions?: EvolutionCondition[];
}

export const getEvolutionLine = (pokemonId: string): EvolutionStage[] => {
    const baseFormId = findBaseForm(pokemonId);
    const line: EvolutionStage[] = [];
    
    let currentId: string | null = baseFormId;
    let iterations = 0;

    while (currentId && iterations < 5) { // Limit to prevent infinite loops
        const pokemon = POKEDEX_DATA.find(p => p.id === currentId);
        
        // Even if we don't have full data for the pokemon (like Venusaur in current data), 
        // we try to construct a basic object or skip it if totally missing.
        if (pokemon) {
            // Check if this stage has a predecessor to find conditions
            let conditions: EvolutionCondition[] | undefined = undefined;
            if (line.length > 0) {
                const prevId = line[line.length - 1].id;
                const evoData = EVOLUTION_DATA.find(e => e.from === prevId && e.to === currentId);
                if (evoData) {
                    conditions = evoData.conditions;
                }
            }

            line.push({
                id: pokemon.id,
                name: pokemon.name,
                sprite: pokemon.media.sprite,
                minLevel: pokemon.minLevel,
                conditions: conditions
            });
        } else {
            // Handle case where data might be missing from POKEDEX_DATA but exists in EVOLUTION_DATA
            // Useful for placeholders
            let conditions: EvolutionCondition[] | undefined = undefined;
             if (line.length > 0) {
                const prevId = line[line.length - 1].id;
                const evoData = EVOLUTION_DATA.find(e => e.from === prevId && e.to === currentId);
                if (evoData) conditions = evoData.conditions;
            }
            
            line.push({
                id: currentId,
                name: currentId.charAt(0).toUpperCase() + currentId.slice(1),
                sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png", // Placeholder or fetch dynamically if possible
                minLevel: 0,
                conditions: conditions
            });
        }

        // Find next step
        const nextEvo = EVOLUTION_DATA.find(e => e.from === currentId);
        currentId = nextEvo ? nextEvo.to : null;
        iterations++;
    }

    return line;
};
