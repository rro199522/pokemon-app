// conditionData.ts
import { Condition } from './types';

export const CONDITION_DATA: Condition[] = [
    {
        "id": "queimado",
        "name": "Queimado",
        "description": "Um Pokémon queimado perde 1/16 de seu HP máximo no final de cada turno. O dano de seus ataques físicos é reduzido pela metade."
    },
    {
        "id": "congelado",
        "name": "Congelado",
        "description": "Um Pokémon congelado não pode atacar ou usar movimentos. A condição pode ser curada se o Pokémon for atingido por um movimento do tipo Fogo."
    },
    {
        "id": "paralisado",
        "name": "Paralisado",
        "description": "A Velocidade de um Pokémon paralisado é reduzida em 50%. Há 25% de chance de que ele não consiga se mover em seu turno."
    },
    {
        "id": "envenenado",
        "name": "Envenenado",
        "description": "Um Pokémon envenenado perde 1/8 de seu HP máximo no final de cada turno. A quantidade de dano pode aumentar em casos de envenenamento grave."
    },
    {
        "id": "adormecido",
        "name": "Adormecido",
        "description": "Um Pokémon adormecido não pode atacar ou usar movimentos por um número variável de turnos (geralmente de 1 a 3)."
    },
    {
        "id": "confuso",
        "name": "Confuso",
        "description": "Um Pokémon confuso tem 50% de chance de se atacar, causando dano a si mesmo, em vez de executar o movimento selecionado."
    },
    {
        "id": "apaixonado",
        "name": "Apaixonado",
        "description": "Um Pokémon apaixonado tem 50% de chance de não atacar um Pokémon do sexo oposto pelo qual está atraído."
    }
];