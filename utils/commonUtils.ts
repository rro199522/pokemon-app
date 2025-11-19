
// utils/commonUtils.ts

/**
 * Calculates the ability modifier from a score.
 * (Score - 10) / 2, rounded down.
 */
export const getModifier = (value: number): string => {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : String(mod);
};

export const formatMoveName = (move: string): string => {
    return move.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
