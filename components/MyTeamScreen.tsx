
// components/MyTeamScreen.tsx
import React, { useMemo } from 'react';
import { Pokemon, Trainer, Move, TM } from '../types.ts';
import { calculateFinalTrainerData } from '../utils/trainerUtils.ts';
import TrainerSheet from './TrainerSheet.tsx';
import TeamMemberCard from './TeamMemberCard.tsx';
import AddPokemonForm from './AddPokemonForm.tsx';
import SectionHeader from './SectionHeader.tsx';

interface MyTeamScreenProps {
  trainer: Trainer;
  team: Pokemon[];
  onAddPokemon: (pokemon: Pokemon) => void;
  onRemovePokemon: (instanceId: string) => void;
  onShowDetails: (pokemon: Pokemon) => void;
  onEdit: () => void;
  onSetPokemonActive: (instanceId: string) => void;
  onSetPokemonInactive: (instanceId: string) => void;
  pokedex: Pokemon[];
  moves: Move[];
  tms: TM[];
  onTrainerLevelUp: () => void;
}

const MyTeamScreen: React.FC<MyTeamScreenProps> = ({
    trainer,
    team,
    onAddPokemon,
    onRemovePokemon,
    onShowDetails,
    onEdit,
    onSetPokemonActive,
    onSetPokemonInactive,
    pokedex,
    onTrainerLevelUp,
}) => {
    const finalTrainerData = useMemo(() => calculateFinalTrainerData(trainer), [trainer]);
    const { activeTeam, inactiveTeam } = useMemo(() => ({
        activeTeam: team.filter(p => p.isActive),
        inactiveTeam: team.filter(p => !p.isActive)
    }), [team]);

    return (
        <div className="animate-fade-in pb-20">
            <TrainerSheet 
                trainer={trainer} 
                onEdit={onEdit} 
                team={team} 
                onLevelUp={onTrainerLevelUp} 
            />

            <div className="p-4 space-y-6">
                <div>
                    <SectionHeader title="Active Team" count={`${activeTeam.length}/${finalTrainerData.pokeslots}`} />
                    {activeTeam.length > 0 ? activeTeam.map(pokemon => (
                        <TeamMemberCard
                            key={pokemon.instanceId}
                            pokemon={pokemon}
                            onShowDetails={onShowDetails}
                            onRemovePokemon={onRemovePokemon}
                            onSetActive={onSetPokemonActive}
                            onSetInactive={onSetPokemonInactive}
                            isActiveMember={true}
                        />
                    )) : (
                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
                            Your active team is empty.
                        </div>
                    )}
                </div>
                
                <div>
                    <SectionHeader title="PC Box" count={inactiveTeam.length} />
                     {inactiveTeam.length > 0 ? inactiveTeam.map(pokemon => (
                        <TeamMemberCard
                            key={pokemon.instanceId}
                            pokemon={pokemon}
                            onShowDetails={onShowDetails}
                            onRemovePokemon={onRemovePokemon}
                            onSetActive={onSetPokemonActive}
                            onSetInactive={onSetPokemonInactive}
                            isActiveMember={false}
                        />
                    )) : (
                        <div className="text-center py-4 text-gray-400 text-sm italic">PC Box is empty.</div>
                    )}
                </div>
            </div>

            <AddPokemonForm trainer={trainer} onAddPokemon={onAddPokemon} pokedex={pokedex} />
        </div>
    );
};

export default MyTeamScreen;
