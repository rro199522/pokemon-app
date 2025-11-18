// components/PokemonTypeIcons.tsx
import { PokemonType } from '../types.ts';

// Map Portuguese type names to their respective Tailwind CSS classes for background and text color
export const typeStyles: Record<string, string> = {
  'água': 'bg-water text-white',
  'fogo': 'bg-fire text-white',
  'planta': 'bg-grass text-white',
  'elétrico': 'bg-electric text-black',
  'psíquico': 'bg-psychic text-white',
  'sombrio': 'bg-dark text-white',
  'normal': 'bg-normal text-white',
  'lutador': 'bg-fighting text-white',
  'voador': 'bg-flying text-white',
  'veneno': 'bg-poison text-white',
  'terra': 'bg-ground text-black',
  'pedra': 'bg-rock text-white',
  'inseto': 'bg-bug text-white',
  'fantasma': 'bg-ghost text-white',
  'dragão': 'bg-dragon text-white',
  'metal': 'bg-steel text-white',
  'gelo': 'bg-ice text-white',
  'fada': 'bg-fairy text-black',
};