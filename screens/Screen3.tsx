import React from 'react';
import { POKEMON_DATA } from '../pokemonData';
import { PokemonDetailCard } from '../components/PokemonDetailCard'; // Changed to named import

const Screen3: React.FC = () => {
  const pokemon = POKEMON_DATA[2]; // Charmander
  // FIX: Removed unused showBackButton prop. The PokemonDetailCard component does not accept this prop.
  return <PokemonDetailCard pokemon={pokemon} onShowEvolutionRules={() => {}} />;
};

export default Screen3;