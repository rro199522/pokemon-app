
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PokedexHeader } from './components/PokedexHeader.tsx';
import { ScreenName, Pokemon, Trainer, Move, Item, Ability, Condition, TM } from './types.ts';
import PokedexListScreen from './components/PokedexListScreen.tsx';
import { PokemonDetailCard } from './components/PokemonDetailCard.tsx';
import { POKEDEX_DATA } from './pokedexData.ts';
import { HamburgerMenu } from './components/HamburgerMenu.tsx';
import MyTeamScreen from './components/MyTeamScreen.tsx';
import ItemdexListScreen from './components/ItemdexListScreen.tsx';
import TMDexListScreen from './components/TMDexListScreen.tsx';
import MovedexListScreen from './components/MovedexListScreen.tsx';
import AbilitydexListScreen from './components/AbilitydexListScreen.tsx';
import ConditiondexListScreen from './components/ConditiondexListScreen.tsx';
import CreateTrainerScreen from './components/CreateTrainerScreen.tsx';
import PokemonSheetScreen from './components/PokemonSheetModal.tsx';
import EditPokemonScreen from './components/EditPokemonScreen.tsx';
import ImportDataScreen from './components/ImportDataScreen.tsx';
import { MOVE_DATA } from './moveData.ts';
import { TM_DATA } from './tmData.ts';
import { ITEM_DATA } from './itemData.ts';
import { ABILITY_DATA } from './abilityData.ts';
import { CONDITION_DATA } from './conditionData.ts';
import EvolutionRulesScreen from './components/EvolutionRulesScreen.tsx';
import { TRAINER_LEVEL_UP_REQUIREMENTS } from './data/trainerClassData.ts';
import { calculateFinalTrainerData } from './utils/trainerUtils.ts';
import * as api from './data/api.ts';

// --- CUSTOM HOOK: DATA PERSISTENCE ---
const useGameData = () => {
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);
  const [myTeam, setMyTeam] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
        try {
            const appData = await api.loadAppData();
            setTrainerData(appData.trainer);
            setMyTeam(appData.team);
        } catch (e) {
            console.error("Failed to load data", e);
        } finally {
            setIsLoading(false);
            // Prevent immediate save on load
            setTimeout(() => { isInitialLoad.current = false; }, 1000);
        }
    };
    loadData();
  }, []);

  // Save Data (Debounced slightly by nature of React updates, but direct here)
  useEffect(() => {
    if (isInitialLoad.current || isLoading || !trainerData) return;
    
    const saveData = async () => {
        await api.saveAppData({ trainer: trainerData, team: myTeam });
    };
    saveData();
  }, [trainerData, myTeam, isLoading]);

  return { trainerData, setTrainerData, myTeam, setMyTeam, isLoading };
};

// --- MAIN COMPONENT ---
function App() {
  // Data State (Persisted User Data)
  const { trainerData, setTrainerData, myTeam, setMyTeam, isLoading } = useGameData();

  // App Data State (Importable)
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>(POKEDEX_DATA);
  const [allMoves, setAllMoves] = useState<Move[]>(MOVE_DATA);
  const [allItems, setAllItems] = useState<Item[]>(ITEM_DATA);
  const [allAbilities, setAllAbilities] = useState<Ability[]>(ABILITY_DATA);
  const [allConditions, setAllConditions] = useState<Condition[]>(CONDITION_DATA);
  const [allTMs, setAllTMs] = useState<TM[]>(TM_DATA);

  // UI State
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.MyTeam);
  const [selectedPokemonIdFromList, setSelectedPokemonIdFromList] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Modal/Editing State
  const [sheetPokemon, setSheetPokemon] = useState<Pokemon | null>(null);
  const [isEditingPokemon, setIsEditingPokemon] = useState<Pokemon | null>(null);
  const [isEditingTrainer, setIsEditingTrainer] = useState(false);
  const [showEvolutionRules, setShowEvolutionRules] = useState(false);

  // --- ACTIONS ---

  const handleImportData = useCallback((type: string, data: any[]) => {
    switch (type) {
      case 'pokemon':
        setAllPokemon(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = data.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        break;
      case 'moves':
        setAllMoves(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newItems = data.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        break;
      case 'items':
        setAllItems(prev => {
          const existingIds = new Set(prev.map(i => i.id));
          const newItems = data.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        break;
      case 'abilities':
        setAllAbilities(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const newItems = data.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        break;
      case 'conditions':
        setAllConditions(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newItems = data.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        break;
      case 'tms':
        setAllTMs(prev => {
           const existingIds = new Set(prev.map(t => t.id));
           const newItems = data.filter(item => !existingIds.has(item.id));
           return [...prev, ...newItems];
        });
        break;
    }
  }, []);

  const getMoveFromId = useCallback((moveId: string | number): Move | undefined => {
      if (typeof moveId === 'number') {
          const tm = allTMs.find(t => t.id === moveId);
          if (!tm) return undefined;
          return allMoves.find(m => m.id === tm.move);
      }
      return allMoves.find(m => m.id === moveId);
  }, [allMoves, allTMs]);


  const handleAddPokemonToTeam = useCallback((pokemonToAdd: Pokemon) => {
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
    
    // Recalculate only when needed
    const finalTrainerData = calculateFinalTrainerData(trainerData);
    const activeTeamCount = myTeam.filter(p => p.isActive).length;
    const pokeslots = finalTrainerData.pokeslots || 6;

    const newTeamMember: Pokemon = { 
      ...pokemonToAdd, 
      instanceId: `${pokemonToAdd.id}-${Date.now()}`,
      isActive: activeTeamCount < pokeslots,
      currentHp: pokemonToAdd.hp,
      statuses: [],
      currentHitDice: getHitDiceCount(pokemonToAdd.hitDice),
      currentMoves: startMoves,
      currentMovesPP: initialPP,
      isShiny: false,
      currentGender: 'Female', // Default, editable later
      isFavorite: false
    };

    setMyTeam(prev => [...prev, newTeamMember]);
  }, [trainerData, myTeam, getMoveFromId]);

  const handleRemovePokemonFromTeam = useCallback((instanceId: string) => {
    setMyTeam(prev => prev.filter(p => p.instanceId !== instanceId));
  }, []);

  const handleSetPokemonActive = useCallback((instanceId: string) => {
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
  }, [trainerData, myTeam]);

  const handleSetPokemonInactive = useCallback((instanceId: string) => {
      setMyTeam(team => team.map(p =>
        p.instanceId === instanceId ? { ...p, isActive: false } : p
      ));
  }, []);

  const handleNavigate = useCallback((screen: ScreenName) => {
    setCurrentScreen(screen);
    // Reset overlays
    setSelectedPokemonIdFromList(null);
    setIsEditingTrainer(false);
    setIsMenuOpen(false);
    setSheetPokemon(null);
    setIsEditingPokemon(null);
    setShowEvolutionRules(false);
  }, []);

  const handleSelectPokemon = useCallback((id: string) => {
    setSelectedPokemonIdFromList(id);
    setIsEditingTrainer(false);
    setSheetPokemon(null);
    setIsEditingPokemon(null);
    setShowEvolutionRules(false);
  }, []);

  const handleBack = useCallback(() => {
    if(isEditingPokemon) {
      setSheetPokemon(isEditingPokemon); // Return to sheet
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
  }, [isEditingPokemon, showEvolutionRules, sheetPokemon, isEditingTrainer, selectedPokemonIdFromList, currentScreen]);

  const handleSaveTrainer = useCallback((updatedTrainer: Trainer) => {
    setTrainerData(updatedTrainer);
    setIsEditingTrainer(false);
  }, []);

  const handleEditPokemon = useCallback((pokemonToEdit: Pokemon) => {
    setSheetPokemon(null);
    setIsEditingPokemon(pokemonToEdit);
  }, []);

  const handleSavePokemon = useCallback((updatedPokemon: Pokemon) => {
      setMyTeam(prevTeam => prevTeam.map(p => p.instanceId === updatedPokemon.instanceId ? updatedPokemon : p));
      setIsEditingPokemon(null);
      setSheetPokemon(updatedPokemon);
  }, []);

  const handleUpdatePokemon = useCallback((updatedPokemon: Pokemon) => {
    // Optimistic update for the team state
    setMyTeam(prevTeam => prevTeam.map(p => p.instanceId === updatedPokemon.instanceId ? updatedPokemon : p));
    
    // If we are viewing this pokemon, update the view too
    if (sheetPokemon?.instanceId === updatedPokemon.instanceId) {
        setSheetPokemon(updatedPokemon);
    }
  }, [sheetPokemon]);

  const handleTrainerLevelUp = useCallback(() => {
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
  }, [trainerData, myTeam]);

  // --- RENDER HELPERS ---

  const pokemonToShow = useMemo(() => 
    selectedPokemonIdFromList !== null
      ? allPokemon.find(p => p.id === selectedPokemonIdFromList) || null
      : null
  , [selectedPokemonIdFromList, allPokemon]);

  // Title Logic
  let title: string = currentScreen;
  let showBackButton = currentScreen !== ScreenName.MyTeam;

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
  }

  const renderMainContent = () => {
    if (isLoading || !trainerData) {
      return (
          <div className="flex-grow flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-semibold">Carregando dados...</p>
          </div>
      );
    }

    if (isEditingPokemon) {
      return <EditPokemonScreen pokemon={isEditingPokemon} onSave={handleSavePokemon} onCancel={handleBack} />;
    }
    if (showEvolutionRules) {
      return <EvolutionRulesScreen />;
    }
    if (sheetPokemon) {
      // Always find the most up-to-date version of the pokemon from the team array
      const teamMember = myTeam.find(p => p.instanceId === sheetPokemon.instanceId) || sheetPokemon;
      return <PokemonSheetScreen 
                pokemon={teamMember} 
                onEdit={handleEditPokemon} 
                onUpdate={handleUpdatePokemon} 
                allMoves={allMoves}
                allTMs={allTMs}
                allAbilities={allAbilities}
             />;
    }
    if (pokemonToShow) {
      return <PokemonDetailCard pokemon={pokemonToShow} onShowEvolutionRules={() => setShowEvolutionRules(true)} />;
    }
    if (currentScreen === ScreenName.MyTeam && isEditingTrainer) {
        return <CreateTrainerScreen initialData={trainerData} onSave={handleSaveTrainer} onCancel={() => setIsEditingTrainer(false)} />;
    }

    switch (currentScreen) {
      case ScreenName.Pokedex:
        return <PokedexListScreen onSelectPokemon={handleSelectPokemon} pokedex={allPokemon} />;
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
            pokedex={allPokemon}
            moves={allMoves}
            tms={allTMs}
            onTrainerLevelUp={handleTrainerLevelUp}
          />
        );
      case ScreenName.Itemdex: return <ItemdexListScreen items={allItems} />;
      case ScreenName.TMDex: return <TMDexListScreen tms={allTMs} />;
      case ScreenName.Movedex: return <MovedexListScreen moves={allMoves} />;
      case ScreenName.Abilitydex: return <AbilitydexListScreen abilities={allAbilities} />;
      case ScreenName.Condicoes: return <ConditiondexListScreen conditions={allConditions} />;
      case ScreenName.ImportData: return <ImportDataScreen onImport={handleImportData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-pokemon-bg-gradient from-pokemonBgLight to-pokemonBgDark flex flex-col">
      <main className="flex-grow p-2 sm:p-4 md:p-8 flex items-center justify-center overflow-y-auto">
        <div className="relative w-full max-w-[393px] min-h-[800px] mx-auto bg-white rounded-3xl shadow-xl flex flex-col h-full overflow-hidden border-4 border-gray-800/10 shrink-0">
          
          {/* Header stays absolute at top */}
          <PokedexHeader
            title={title}
            showBackButton={showBackButton}
            onBack={handleBack}
            onMenuClick={() => setIsMenuOpen(true)}
          />

          {/* Main Content - Grows to fill remaining space, scrolls independently */}
          <div className="flex-grow overflow-y-auto pb-4 scrollbar-hide bg-white mt-16">
            {renderMainContent()}
          </div>
          
          <HamburgerMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onNavigate={handleNavigate}
            currentScreen={currentScreen}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
