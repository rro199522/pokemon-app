// pokedexData.ts
import { Pokemon, PokemonType } from './types';
import { calculateWeaknesses } from './weaknessCalculator';

// Raw data without the 'weaknesses' property
const rawPokedexData: Omit<Pokemon, 'weaknesses' | 'weaknesses'>[] = [
  {
      "id": "bulbasaur",
      "name": "Bulbasaur",
      "number": 1,
      "type": [
        "planta",
        "veneno"
      ],
      "size": "minúsculo",
      "sr": 0.5,
      "minLevel": 1,
      "eggGroup": [
        "monstro",
        "planta"
      ],
      "gender": "1:7",
      "description": "O Pokémon Semente. Consegue passar dias sem comer um único bocado. Armazena energia no bulbo em suas costas.",
      "ac": 13,
      "hp": 17,
      "hitDice": "d6",
      "speed": [
        {
          "type": "caminhada",
          "value": 9
        }
      ],
      "attributes": {
        "str": 13,
        "dex": 12,
        "con": 12,
        "int": 6,
        "wis": 10,
        "cha": 10
      },
      "skills": [
        "atletismo",
        "natureza"
      ],
      "savingThrows": [
        "str"
      ],
      "senses": [],
      "abilities": [
        {
          "id": "overgrow",
          "hidden": false
        },
        {
          "id": "chlorophyll",
          "hidden": true
        }
      ],
      "moves": {
        "start": [
          "tackle",
          "growl"
        ],
        "level2": [
          "vine-whip",
          "leech-seed"
        ],
        "level6": [
          "poison-powder",
          "sleep-powder",
          "take-down",
          "razor-leaf"
        ],
        "level10": [
          "sweet-scent",
          "growth",
          "double-edge"
        ],
        "level14": [
          "worry-seed",
          "synthesis"
        ],
        "level18": [
          "seed-bomb"
        ],
        "tm": [
          1,
          6,
          9,
          10,
          11,
          16,
          17,
          20,
          21,
          22,
          27,
          32,
          36,
          42,
          44,
          45,
          48,
          49,
          53,
          75,
          86,
          87,
          88,
          90,
          96,
          100
        ],
        "egg": [
          "amnesia",
          "charm",
          "curse",
          "endure",
          "giga-drain",
          "grass-whistle",
          "grassy-terrain",
          "ingrain",
          "leaf-storm",
          "light-screen",
          "magical-leaf",
          "nature-power",
          "petal-dance",
          "power-whip",
          "safeguard",
          "skull-bash",
          "sludge"
        ]
      },
      "media": {
        "main": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        "mainShiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png",
        "spriteShiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png"
      }
    },
    {
      "id": "ivysaur",
      "name": "Ivysaur",
      "number": 2,
      "type": [
        "planta",
        "veneno"
      ],
      "size": "pequeno",
      "sr": 5,
      "minLevel": 5,
      "eggGroup": [
        "monstro",
        "planta"
      ],
      "gender": "1:7",
      "description": "O Pokémon Semente. O botão em suas costas cresce absorvendo energia. Ele exala um aroma quando está pronto para florescer.",
      "ac": 15,
      "hp": 45,
      "hitDice": "d8",
      "speed": [
        {
          "type": "caminhada",
          "value": 9
        }
      ],
      "attributes": {
        "str": 15,
        "dex": 14,
        "con": 12,
        "int": 6,
        "wis": 12,
        "cha": 10
      },
      "skills": [
        "atletismo",
        "natureza"
      ],
      "savingThrows": [
        "str"
      ],
      "senses": [],
      "abilities": [
        {
          "id": "overgrow",
          "hidden": false
        },
        {
          "id": "chlorophyll",
          "hidden": true
        }
      ],
      "moves": {
        "start": [
          "tackle",
          "growl",
          "leech-seed",
          "vine-whip"
        ],
        "level6": [
          "poison-powder",
          "sleep-powder",
          "take-down"
        ],
        "level10": [
          "razor-leaf",
          "sweet-scent"
        ],
        "level14": [
          "growth",
          "double-edge",
          "worry-seed"
        ],
        "level18": [
          "synthesis",
          "solar-beam"
        ],
        "tm": [
          1,
          6,
          9,
          10,
          11,
          16,
          17,
          20,
          21,
          22,
          27,
          32,
          36,
          42,
          44,
          45,
          48,
          49,
          53,
          75,
          86,
          87,
          88,
          90,
          96,
          100
        ]
      },
      "media": {
        "main": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
        "mainShiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/2.png",
        "spriteShiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/2.png"
      }
    }
  ]

// Dynamically calculate and add weaknesses to each Pokémon
export const POKEDEX_DATA: Pokemon[] = rawPokedexData.map(pokemon => ({
  ...pokemon,
  nature: 'Hardy',
  baseAttributes: { ...pokemon.attributes },
  weaknesses: calculateWeaknesses(pokemon.type as PokemonType[]),
}));