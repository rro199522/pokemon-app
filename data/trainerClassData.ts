// data/trainerClassData.ts

export const TRAINER_LEVEL_TABLE = [
  // Level Prof. Features Pokeslots Max SR
  { level: 1, prof: '+2', features: 'Starter Pokemon, Specialization', pokeslots: 3, maxSr: 2 },
  { level: 2, prof: '+2', features: 'Trainer Path', pokeslots: 3, maxSr: 2 },
  { level: 3, prof: '+2', features: 'Control Upgrade', pokeslots: 3, maxSr: 5 },
  { level: 4, prof: '+2', features: 'Ability Score Improvement', pokeslots: 3, maxSr: 5 },
  { level: 5, prof: '+3', features: 'Trainer Path Feature, Pokeslot', pokeslots: 4, maxSr: 5 },
  { level: 6, prof: '+3', features: 'Control Upgrade', pokeslots: 4, maxSr: 8 },
  { level: 7, prof: '+3', features: 'Specialization', pokeslots: 4, maxSr: 8 },
  { level: 8, prof: '+3', features: 'Ability Score Improvement, Control Upgrade', pokeslots: 4, maxSr: 10 },
  { level: 9, prof: '+4', features: 'Trainer Path Feature', pokeslots: 4, maxSr: 10 },
  { level: 10, prof: '+4', features: "Trainer's Resolve, Pokeslot", pokeslots: 5, maxSr: 10 },
  { level: 11, prof: '+4', features: 'Control Upgrade', pokeslots: 5, maxSr: 12 },
  { level: 12, prof: '+4', features: 'Ability Score Improvement', pokeslots: 5, maxSr: 12 },
  { level: 13, prof: '+5', features: 'Pokemon Tracker', pokeslots: 5, maxSr: 12 },
  { level: 14, prof: '+5', features: 'Control Upgrade', pokeslots: 5, maxSr: 14 },
  { level: 15, prof: '+5', features: 'Trainer Path Feature, Pokeslot', pokeslots: 6, maxSr: 14 },
  { level: 16, prof: '+5', features: 'Ability Score Improvement', pokeslots: 6, maxSr: 14 },
  { level: 17, prof: '+6', features: 'Control Upgrade', pokeslots: 6, maxSr: 15 },
  { level: 18, prof: '+6', features: 'Specialization', pokeslots: 6, maxSr: 15 },
  { level: 19, prof: '+6', features: 'Epic Boon', pokeslots: 6, maxSr: 15 },
  { level: 20, prof: '+6', features: 'Master Trainer', pokeslots: 6, maxSr: 15 },
];

export const CLASS_FEATURES: Record<string, string> = {
    'Starter Pokemon': "A trainer must begin with any single unevolved Pokemon of Species Rating (SR) 1/2 or lower with the base stats in its stat block. This Pokemon starts with a nature and non-hidden ability of the player's choice.",
    'Specialization': "At levels 1, 7, and 18, you may choose a specialization, granting bonuses depending on the type of Pokemon you train.",
    'Trainer Path': "At the 2nd level, depending on your long term goals, choose a Trainer Path.",
    'Control Upgrade': "The maximum SR of a Pokémon you can control increases. See the Trainer Level Table for specific values.",
    'Ability Score Improvement': "You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.",
    'Pokeslot': "The number of Pokémon you can carry in your party increases by one.",
    "Trainer's Resolve": "By the time you reach 10th level, you have had your fair share of experience in difficult battles and have emerged victorious and strong. You are now immune to being frightened, and may choose a second saving throw to become proficient in.",
    'Pokemon Tracker': "At level 13, you have already spent countless hours in the wild, searching for Pokémon high and low. Once per long rest you may search for Pokémon in the nearby area. You learn a list of wild Pokémon that can be found in the nearby area. Additionally, you gain Expertise in Animal Handling.",
    'Epic Boon': "You gain an Epic Boon feat or another feat of your choice for which you qualify.",
    'Master Trainer': "You have finally achieved the title of Master Trainer. Your Pokémon are at peak fighting performance. When you or your Pokémon fail a saving throw, you may choose to succeed instead. This feature can be used twice per long rest.",
    'Trainer Path Feature': "You gain a feature from your chosen Trainer Path."
};

export const TRAINER_LEVEL_UP_REQUIREMENTS: { [level: number]: number } = {
  2: 3,
  3: 6,
  4: 9,
  5: 12,
  6: 20,
  7: 24,
  8: 28,
  9: 32,
  10: 36,
  11: 50,
  12: 55,
  13: 60,
  14: 65,
  15: 70,
  16: 90,
  17: 96,
  18: 102,
  19: 108,
  20: 114,
};