// itemData.ts
import { Item } from './types';

export const ITEM_DATA: Item[] = [
	{
		"id": "poke-ball",
		"name": "Poké Ball",
		"type": "pokebola",
		"cost": 200,
		"description": [
			"Permite que um Treinador tente um Teste de Captura para pegar um Pokémon."
		],
		"media": {
			"sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
		}
	},
	{
		"id": "great-ball",
		"name": "Great Ball",
		"type": "pokebola",
		"cost": 600,
		"description": [
			"Permite que um Treinador tente um Teste de Captura para pegar um Pokémon. Reduz a Dificuldade de Captura (DC) em 5."
		],
		"media": {
			"sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png"
		}
	},
    {
		"id": "ultra-ball",
		"name": "Ultra Ball",
		"type": "pokebola",
		"cost": 1200,
		"description": [
			"Permite que um Treinador tente um Teste de Captura para pegar um Pokémon. Reduz a Dificuldade de Captura (DC) em 10."
		],
		"media": {
			"sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png"
		}
	},
    {
		"id": "potion",
		"name": "Potion",
		"type": "cura",
		"cost": 300,
		"description": [
			"Recupera 20 HP de um Pokémon."
		],
		"media": {
			"sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png"
		}
	},
    {
		"id": "super-potion",
		"name": "Super Potion",
		"type": "cura",
		"cost": 700,
		"description": [
			"Recupera 50 HP de um Pokémon."
		],
		"media": {
			"sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png"
		}
	},
    {
		"id": "antidote",
		"name": "Antidote",
		"type": "cura-status",
		"cost": 100,
		"description": [
			"Cura um Pokémon envenenado."
		],
		"media": {
			"sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/antidote.png"
		}
	}
];