// evolutionData.ts
import { Evolution } from './types.ts';

export const EVOLUTION_DATA: Evolution[] = [
    {
        "from": "bulbasaur",
        "to": "ivysaur",
        "conditions": [
            {
                "type": "level",
                "value": 6
            }
        ],
        "effects": [
            {
                "type": "asi",
                "value": 6
            }
        ]
    },
    {
        "from": "ivysaur",
        "to": "venusaur", // Dados para Venusaur não fornecidos, usando como placeholder
        "conditions": [
            {
                "type": "level",
                "value": 10
            }
        ],
        "effects": [
            {
                "type": "asi",
                "value": 6
            }
        ]
    },
    {
        "from": "charmander",
        "to": "charmeleon", // Dados para Charmeleon não fornecidos, usando como placeholder
        "conditions": [
            {
                "type": "level",
                "value": 6
            }
        ],
        "effects": [
            {
                "type": "asi",
                "value": 6
            }
        ]
    }
];