import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PokedexHeader } from './components/PokedexHeader';
import { ScreenName, Pokemon, Trainer, Move } from './types';
import PokedexListScreen from './components/PokedexListScreen';
import { PokemonDetailCard } from './components/PokemonDetailCard';
import { POKEDEX_DATA } from './pokedexData';
import { HamburgerMenu } from './components/HamburgerMenu';
import MyTeamScreen from './components/MyTeamScreen';
import ItemdexListScreen from './components/ItemdexListScreen';
import TMDexListScreen from './components/TMDexListScreen';
import MovedexListScreen from './components/MovedexListScreen';
import AbilitydexListScreen from './components/AbilitydexListScreen';
import ConditiondexListScreen from './components/ConditiondexListScreen';
import CreateTrainerScreen from './components/CreateTrainerScreen';
import PokemonSheetScreen from './components/PokemonSheetModal';
import EditPokemonScreen from './components/EditPokemonScreen';
import { MOVE_DATA } from './moveData';
import { TM_DATA } from './tmData';
import EvolutionRulesScreen from './components/EvolutionRulesScreen';
import { TRAINER_LEVEL_UP_REQUIREMENTS } from './data/trainerClassData';
import { calculateFinalTrainerData } from './utils/trainerUtils';
import LoginScreen from './components/LoginScreen';
import * as api from './data/api';

const getMoveFromId = (moveId: string | number): Move | undefined => {
    if (typeof moveId === 'number') {
        const tm = TM_DATA.find(t => t.id === moveId);
        if (!tm) return undefined;
        return MOVE_DATA.find(m => m.id === tm.move);
    }
    return MOVE_DATA.find(m => m.id === moveId);
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.MyTeam);
  const [selectedPokemonIdFromList, setSelectedPokemonIdFromList] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sheetPokemon, setSheetPokemon] = useState<Pokemon | null>(null);
  const [isEditingPokemon, setIsEditingPokemon] = useState<Pokemon | null>(null);
  const [isEditingTrainer, setIsEditingTrainer] = useState(false);
  const [showEvolutionRules, setShowEvolutionRules] = useState(false);
  
  // Auth and Data State
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);
  const [myTeam, setMyTeam] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      isInitialLoad.current = true;
      const sessionData = await api.checkSession();
      if (sessionData) {
        setLoggedInUser(sessionData.username);
        setTrainerData(sessionData.trainer);
        setMyTeam(sessionData.team);
      }
      setIsLoading(false);
      setTimeout(() => { isInitialLoad.current = false; }, 500);
    };
    checkSession();
  }, []);

  // Save trainer data to cloud when it changes
  useEffect(() => {
    if (isInitialLoad.current || !loggedInUser || !trainerData) return;
    api.saveTrainer(loggedInUser, trainerData);
  }, [loggedInUser, trainerData]);

  // Save team data to cloud when it changes
  useEffect(() => {
    if (isInitialLoad.current || !loggedInUser) return;
    api.saveTeam(loggedInUser, myTeam);
  }, [loggedInUser, myTeam]);

  const handleLogin = async (username: string, pass: string) => {
    setIsLoading(true);
    isInitialLoad.current = true;
    try {
      const data = await api.login(username, pass);
      if (data) {
        setLoggedInUser(username);
        setTrainerData(data.trainer);
        setMyTeam(data.team);
        setCurrentScreen(ScreenName.MyTeam);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
      setTimeout(() => { isInitialLoad.current = false; }, 500);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setLoggedInUser(null);
    setTrainerData(null);
    setMyTeam([]);
    setCurrentScreen(ScreenName.MyTeam); // Or a dedicated login screen
    setIsMenuOpen(false);
  };

  const handleAddPokemonToTeam = (pokemonToAdd: Pokemon) => {
    if (!trainerData) return;
    const getHitDiceCount = (str: string): number => {
      const match = str.match(/^(\d+)d/);
      return match ? parseInt(match[1], 10) : 1;
    };

    const startMoves = pokemonToAdd.moves.start.slice(0, 4);
    const initialPP: Record<string, number> = {};
    for (const moveId of startMoves) {
        const moveDetails = getMoveFromId(moveId);
        if (moveDetails) {
            initialPP[moveDetails.id] = moveDetails.pp;
        }
    }
    
    const finalTrainerData = calculateFinalTrainerData(trainerData);
    const activeTeamCount = myTeam.filter(p => p.isActive).length;

    const newTeamMember: Pokemon = { 
      ...pokemonToAdd, 
      instanceId: `${pokemonToAdd.id}-${Date.now()}`,
      isActive: activeTeamCount < (finalTrainerData.pokeslots || 6),
      currentHp: pokemonToAdd.hp,
      statuses: [],
      currentHitDice: getHitDiceCount(pokemonToAdd.hitDice),
      currentMoves: startMoves,
      currentMovesPP: initialPP,
      isShiny: false,
      currentGender: 'Female',
    };

    setMyTeam(prevTeam => [...prevTeam, newTeamMember]);
  };

  const handleRemovePokemonFromTeam = (instanceId: string) => {
    setMyTeam(myTeam.filter(p => p.instanceId !== instanceId));
  };

  const handleSetPokemonActive = (instanceId: string) => {
    if (!trainerData) return;
    const finalTrainerData = calculateFinalTrainerData(trainerData);
    const activeCount = myTeam.filter(p => p.isActive).length;

    if (activeCount >= (finalTrainerData.pokeslots || 6)) {
        alert('Active team is full!');
        return;
    }

    setMyTeam(team => team.map(p =>
      p.instanceId === instanceId ? { ...p, isActive: true } : p
    ));
  };

  const handleSetPokemonInactive = (instanceId: string) => {
      setMyTeam(team => team.map(p =>
        p.instanceId === instanceId ? { ...p, isActive: false } : p
      ));
  };

  const handleNavigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
    setSelectedPokemonIdFromList(null);
    setIsEditingTrainer(false);
    setIsMenuOpen(false);
    setSheetPokemon(null);
    setIsEditingPokemon(null);
    setShowEvolutionRules(false);
  };

  const handleSelectPokemon = (id: string) => {
    setSelectedPokemonIdFromList(id);
    setIsEditingTrainer(false);
    setSheetPokemon(null);
    setIsEditingPokemon(null);
    setShowEvolutionRules(false);
  };

  const handleBack = () => {
    if(isEditingPokemon) {
      setSheetPokemon(isEditingPokemon);
      setIsEditingPokemon(null);
    } else if (showEvolutionRules) {
      setShowEvolutionRules(false);
    } else if (sheetPokemon) {
      setSheetPokemon(null);
    } else if (isEditingTrainer) {
      setIsEditingTrainer(false);
    } else if (selectedPokemonIdFromList !== null) {
      setSelectedPokemonIdFromList(null);
    } else if (currentScreen !== ScreenName.MyTeam) {
      setCurrentScreen(ScreenName.MyTeam);
    }
  };

  const handleSaveTrainer = (updatedTrainer: Trainer) => {
    setTrainerData(updatedTrainer);
    setIsEditingTrainer(false);
  };

  const handleEditPokemon = (pokemonToEdit: Pokemon) => {
    setSheetPokemon(null);
    setIsEditingPokemon(pokemonToEdit);
  };

  const handleSavePokemon = (updatedPokemon: Pokemon) => {
      setMyTeam(prevTeam => prevTeam.map(p => p.instanceId === updatedPokemon.instanceId ? updatedPokemon : p));
      setIsEditingPokemon(null);
      setSheetPokemon(updatedPokemon);
  };

  const handleUpdatePokemon = (updatedPokemon: Pokemon) => {
    setMyTeam(prevTeam => prevTeam.map(p => p.instanceId === updatedPokemon.instanceId ? updatedPokemon : p));
    if (sheetPokemon?.instanceId === updatedPokemon.instanceId) {
        setSheetPokemon(updatedPokemon);
    }
  };

  const handleTrainerLevelUp = () => {
    if (!trainerData) return;
    setTrainerData(prevTrainer => {
      if (!prevTrainer) return null;
      const nextLevel = prevTrainer.level + 1;
      if (nextLevel > 20) return prevTrainer;
      
      const totalPokemonLevels = myTeam.reduce((sum, p) => sum + p.minLevel, 0);
      const requiredLevels = TRAINER_LEVEL_UP_REQUIREMENTS[nextLevel];
      
      if (requiredLevels && totalPokemonLevels >= requiredLevels) {
        return { ...prevTrainer, level: nextLevel };
      }
      return prevTrainer;
    });
  };

  let title = "Pokedex";
  let showBackButton = false;
  
  const pokemonToShow = selectedPokemonIdFromList !== null
    ? POKEDEX_DATA.find(p => p.id === selectedPokemonIdFromList) || null
    : null;
  
  if (isEditingPokemon) {
    title = `Edit ${isEditingPokemon.name}`;
    showBackButton = true;
  } else if (showEvolutionRules) {
    title = 'Regras de Evolução';
    showBackButton = true;
  } else if (sheetPokemon) {
    title = sheetPokemon.name;
    showBackButton = true;
  } else if (isEditingTrainer) {
    title = 'Criar Treinador';
    showBackButton = true;
  } else if (pokemonToShow) {
    title = pokemonToShow.name;
    showBackButton = true;
  } else {
    title = currentScreen;
    showBackButton = loggedInUser ? currentScreen !== ScreenName.MyTeam : false;
  }

  const renderMainContent = () => {
    if (isLoading) {
      return <div className="flex-grow flex items-center justify-center"><p>Loading...</p></div>;
    }

    if (!loggedInUser || !trainerData) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (isEditingPokemon) {
      return <EditPokemonScreen pokemon={isEditingPokemon} onSave={handleSavePokemon} onCancel={handleBack} />;
    }
    if (showEvolutionRules) {
      return <EvolutionRulesScreen />;
    }
    if (sheetPokemon) {
      const teamMember = myTeam.find(p => p.instanceId === sheetPokemon.instanceId) || sheetPokemon;
      return <PokemonSheetScreen pokemon={teamMember} onEdit={handleEditPokemon} onUpdate={handleUpdatePokemon} />;
    }
    if (pokemonToShow) {
      return <PokemonDetailCard pokemon={pokemonToShow} onShowEvolutionRules={() => setShowEvolutionRules(true)} />;
    }
    if (currentScreen === ScreenName.MyTeam && isEditingTrainer) {
        return <CreateTrainerScreen initialData={trainerData} onSave={handleSaveTrainer} onCancel={() => setIsEditingTrainer(false)} />;
    }

    switch (currentScreen) {
      case ScreenName.Pokedex:
        return <PokedexListScreen onSelectPokemon={handleSelectPokemon} pokedex={POKEDEX_DATA} />;
      case ScreenName.MyTeam:
        return (
          <MyTeamScreen
            trainer={trainerData}
            team={myTeam}
            onAddPokemon={handleAddPokemonToTeam}
            onRemovePokemon={handleRemovePokemonFromTeam}
            onShowDetails={setSheetPokemon}
            onEdit={() => setIsEditingTrainer(true)}
            onSetPokemonActive={handleSetPokemonActive}
            onSetPokemonInactive={handleSetPokemonInactive}
            pokedex={POKEDEX_DATA}
            onTrainerLevelUp={handleTrainerLevelUp}
          />
        );
      case ScreenName.Itemdex: return <ItemdexListScreen />;
      case ScreenName.TMDex: return <TMDexListScreen />;
      case ScreenName.Movedex: return <MovedexListScreen />;
      case ScreenName.Abilitydex: return <AbilitydexListScreen />;
      case ScreenName.Condicoes: return <ConditiondexListScreen />;
      default:
        return <PokedexListScreen onSelectPokemon={handleSelectPokemon} pokedex={POKEDEX_DATA}/>;
    }
  };

  return (
    <div className="min-h-screen bg-pokemon-bg-gradient from-pokemonBgLight to-pokemonBgDark flex flex-col">
      <main className="flex-grow p-2 sm:p-4 md:p-8 flex items-start justify-center overflow-auto">
        <div className="relative w-full max-w-[393px] mx-auto bg-white rounded-3xl shadow-xl flex flex-col h-full md:h-auto overflow-hidden">
          <PokedexHeader
            title={title}
            showBackButton={showBackButton}
            onBack={handleBack}
            onMenuClick={() => setIsMenuOpen(true)}
          />
          <div className="flex-grow overflow-y-auto pt-16">
            {renderMainContent()}
          </div>
          {loggedInUser && (
            <HamburgerMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onNavigate={handleNavigate}
              currentScreen={currentScreen}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
