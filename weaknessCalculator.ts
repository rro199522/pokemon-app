// weaknessCalculator.ts
import { PokemonType, Weakness } from './types';

// The full type chart for all 18 types in Portuguese
const typeChart: Record<PokemonType, { weaknesses: PokemonType[], resistances: PokemonType[], immunities: PokemonType[] }> = {
    [PokemonType.Normal]: { weaknesses: [PokemonType.Lutador], resistances: [], immunities: [PokemonType.Fantasma] },
    [PokemonType.Fogo]: { weaknesses: [PokemonType.Agua, PokemonType.Terra, PokemonType.Pedra], resistances: [PokemonType.Fogo, PokemonType.Planta, PokemonType.Gelo, PokemonType.Inseto, PokemonType.Metal, PokemonType.Fada], immunities: [] },
    [PokemonType.Agua]: { weaknesses: [PokemonType.Planta, PokemonType.Eletrico], resistances: [PokemonType.Fogo, PokemonType.Agua, PokemonType.Gelo, PokemonType.Metal], immunities: [] },
    [PokemonType.Planta]: { weaknesses: [PokemonType.Fogo, PokemonType.Gelo, PokemonType.Veneno, PokemonType.Voador, PokemonType.Inseto], resistances: [PokemonType.Agua, PokemonType.Planta, PokemonType.Eletrico, PokemonType.Terra], immunities: [] },
    [PokemonType.Eletrico]: { weaknesses: [PokemonType.Terra], resistances: [PokemonType.Eletrico, PokemonType.Voador, PokemonType.Metal], immunities: [] },
    [PokemonType.Gelo]: { weaknesses: [PokemonType.Fogo, PokemonType.Lutador, PokemonType.Pedra, PokemonType.Metal], resistances: [PokemonType.Gelo], immunities: [] },
    [PokemonType.Lutador]: { weaknesses: [PokemonType.Voador, PokemonType.Psiquico, PokemonType.Fada], resistances: [PokemonType.Pedra, PokemonType.Inseto, PokemonType.Sombrio], immunities: [] },
    [PokemonType.Veneno]: { weaknesses: [PokemonType.Terra, PokemonType.Psiquico], resistances: [PokemonType.Planta, PokemonType.Lutador, PokemonType.Veneno, PokemonType.Inseto, PokemonType.Fada], immunities: [] },
    [PokemonType.Terra]: { weaknesses: [PokemonType.Agua, PokemonType.Planta, PokemonType.Gelo], resistances: [PokemonType.Veneno, PokemonType.Pedra], immunities: [PokemonType.Eletrico] },
    [PokemonType.Voador]: { weaknesses: [PokemonType.Eletrico, PokemonType.Gelo, PokemonType.Pedra], resistances: [PokemonType.Planta, PokemonType.Lutador, PokemonType.Inseto], immunities: [PokemonType.Terra] },
    [PokemonType.Psiquico]: { weaknesses: [PokemonType.Inseto, PokemonType.Fantasma, PokemonType.Sombrio], resistances: [PokemonType.Lutador, PokemonType.Psiquico], immunities: [] },
    [PokemonType.Inseto]: { weaknesses: [PokemonType.Fogo, PokemonType.Voador, PokemonType.Pedra], resistances: [PokemonType.Planta, PokemonType.Lutador, PokemonType.Terra], immunities: [] },
    [PokemonType.Pedra]: { weaknesses: [PokemonType.Agua, PokemonType.Planta, PokemonType.Lutador, PokemonType.Terra, PokemonType.Metal], resistances: [PokemonType.Normal, PokemonType.Fogo, PokemonType.Veneno, PokemonType.Voador], immunities: [] },
    [PokemonType.Fantasma]: { weaknesses: [PokemonType.Fantasma, PokemonType.Sombrio], resistances: [PokemonType.Veneno, PokemonType.Inseto], immunities: [PokemonType.Normal, PokemonType.Lutador] },
    [PokemonType.Dragao]: { weaknesses: [PokemonType.Gelo, PokemonType.Dragao, PokemonType.Fada], resistances: [PokemonType.Fogo, PokemonType.Agua, PokemonType.Planta, PokemonType.Eletrico], immunities: [] },
    [PokemonType.Sombrio]: { weaknesses: [PokemonType.Lutador, PokemonType.Inseto, PokemonType.Fada], resistances: [PokemonType.Fantasma, PokemonType.Sombrio], immunities: [PokemonType.Psiquico] },
    [PokemonType.Metal]: { weaknesses: [PokemonType.Fogo, PokemonType.Lutador, PokemonType.Terra], resistances: [PokemonType.Normal, PokemonType.Planta, PokemonType.Gelo, PokemonType.Voador, PokemonType.Psiquico, PokemonType.Inseto, PokemonType.Pedra, PokemonType.Dragao, PokemonType.Metal, PokemonType.Fada], immunities: [PokemonType.Veneno] },
    [PokemonType.Fada]: { weaknesses: [PokemonType.Veneno, PokemonType.Metal], resistances: [PokemonType.Lutador, PokemonType.Inseto, PokemonType.Sombrio], immunities: [PokemonType.Dragao] },
};

/**
 * Gets the damage multiplier for a single attacking type against a single defending type.
 * @param attackingType The type of the incoming attack.
 * @param defendingType The type of the Pokémon being attacked.
 * @returns 0 for immunity, 0.5 for resistance, 1 for neutral, 2 for weakness.
 */
const getMultiplier = (attackingType: PokemonType, defendingType: PokemonType): number => {
    const defenseInfo = typeChart[defendingType];
    if (defenseInfo.immunities.includes(attackingType)) return 0;
    if (defenseInfo.weaknesses.includes(attackingType)) return 2;
    if (defenseInfo.resistances.includes(attackingType)) return 0.5;
    return 1;
};

/**
 * Calculates the final list of weaknesses, resistances, and immunities for a Pokémon
 * based on its type or types.
 * @param types An array of the Pokémon's types.
 * @returns An array of Weakness objects, sorted with weaknesses first.
 */
export const calculateWeaknesses = (types: (PokemonType | string)[]): Weakness[] => {
    const allTypes = Object.values(PokemonType);
    const calculatedMultipliers: Record<string, number> = {};

    // Calculate final multiplier for each attacking type against the Pokémon
    for (const attackingType of allTypes) {
        let finalMultiplier = 1;
        for (const defendingType of types) {
            finalMultiplier *= getMultiplier(attackingType, defendingType as PokemonType);
        }
        calculatedMultipliers[attackingType] = finalMultiplier;
    }

    const weaknesses: Weakness[] = [];
    for (const type of allTypes) {
        const multiplier = calculatedMultipliers[type];
        if (multiplier > 1) { // 2x or 4x weakness
            weaknesses.push({ type, multiplier: '2x' });
        } else if (multiplier > 0 && multiplier < 1) { // 1/2x or 1/4x resistance
            weaknesses.push({ type, multiplier: '1/2x' });
        } else if (multiplier === 0) { // immunity
            weaknesses.push({ type, multiplier: '0x' });
        }
        // Neutral (multiplier === 1) is ignored
    }
    
    // Sort to have weaknesses first, then resistances, then immunities
    weaknesses.sort((a, b) => {
        const valA = a.multiplier === '2x' ? 3 : a.multiplier === '1/2x' ? 2 : 1;
        const valB = b.multiplier === '2x' ? 3 : b.multiplier === '1/2x' ? 2 : 1;
        return valB - valA;
    });

    return weaknesses;
};