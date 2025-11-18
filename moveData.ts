// moveData.ts
import { Move } from './types';

export const MOVE_DATA: Move[] = [
    {
      "id": "absorb",
      "name": "Absorver",
      "type": "planta",
      "power": ["str", "dex"],
      "time": "1 ação",
      "pp": 15,
      "duration": "instantanea",
      "range": "CaC",
      "description": [
        "Você tenta absorver um pouco da saúde de um alvo. Faça um ataque corpo a corpo. Se acertar, a criatura sofre 1d4 + MOD_MAIOR de dano do tipo planta. Metade do dano causado é restaurada pelo usuário."
      ],
      "lvl1": "1d4+ MOD_MAIOR",
      "lvl5": "2d4+ MOD_MAIOR",
      "lvl10": "1d12+ MOD_MAIOR",
      "lvl17": "4d4+ MOD_MAIOR"
    },
    {
      "id": "accelerock",
      "name": "Acelerar Rocha",
      "type": "pedra",
      "power": ["dex"],
      "time": "1 ação_bonus",
      "pp": 15,
      "duration": "instantanea",
      "range": "CaC",
      "description": [
        "Você colide com um alvo em alta velocidade. Como uma ação bônus, você pode se mover imediatamente até 3m (10ft) e fazer um ataque corpo a corpo contra uma criatura ao alcance sem provocar ataque de oportunidade, causando 1d4 de dano do tipo pedra se acertar."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 1d6 no nível 5, 1d10 no nível 10 e 1d12 no nível 17."
    },
    {
      "id": "acid",
      "name": "Ácido",
      "type": "veneno",
      "power": ["dex"],
      "time": "1 ação",
      "pp": 15,
      "duration": "instantanea",
      "range": "pessoal (cone de 9m / 30ft)",
      "description": [
        "Você cria um fluxo de ácido quente em um cone de 9m (30ft), centrado em você. Criaturas pegas no cone devem fazer uma Salvaguarda de DES, sofrendo 1d6 + MOD_MAIOR de dano do tipo veneno em caso de falha, e metade em caso de sucesso."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 1d12 no nível 5, 2d8 no nível 10 e 4d6 no nível 17."
    },
    {
      "id": "acid-armor",
      "name": "Armadura Ácida",
      "type": "veneno",
      "power": ["con"],
      "time": "1 ação",
      "pp": 10,
      "duration": "1 minuto, concentração",
      "range": "pessoal",
      "description": [
        "Você é cercado por um escudo de ácido espesso pela duração. Durante este tempo, sua CA aumenta em 2, e qualquer criatura que o atinja com um ataque corpo a corpo deve ser bem-sucedida em uma Salvaguarda de CON ou sofrer 1d6 de dano do tipo veneno."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 2d6 no nível 10"
    },
    {
      "id": "acid-spray",
      "name": "Jato Ácido",
      "type": "veneno",
      "power": ["dex", "con"],
      "time": "1 ação",
      "pp": 10,
      "duration": "1 minuto",
      "range": "9m (30ft)",
      "description": [
        "Você cospe um jato de fluido ácido que trabalha para derreter a defesa de uma criatura. Faça um ataque à distância contra um alvo, causando 1d6 + MOD_MAIOR de dano do tipo veneno se acertar. Se acertar, o alvo deve fazer uma Salvaguarda de CON contra sua CD de Movimento. Em caso de falha, a CA do alvo é reduzida em 1 pela duração. Esta redução pode ser acumulada em uma criatura, até um máximo de -3 na sua CA."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 1d12 no nível 5, 2d8 no nível 10 e 4d6 no nível 17."
    },
    {
      "id": "acrobatics",
      "name": "Acrobacia",
      "type": "voador",
      "power": ["dex"],
      "time": "1 ação",
      "pp": 5,
      "duration": "instantanea",
      "range": "CaC",
      "description": [
        "Você ataca um alvo com destreza acrobática. Faça um ataque corpo a corpo, causando 3d6 + MOD_MAIOR de dano do tipo voador se acertar. Se você estiver segurando um item ao ativar este movimento, o dano é reduzido pela metade."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 3d8 no nível 5, 6d6 no nível 10 e 7d8 no nível 17."
    },
    {
      "id": "acupressure",
      "name": "Acupressão",
      "type": "normal",
      "power": "nenhum",
      "time": "1 ação",
      "pp": 20,
      "duration": "1 minuto",
      "range": "pessoal",
      "description": [
        "Você aplica pressão em diferentes pontos de estresse no seu corpo, aumentando uma habilidade aleatória pela duração. Ao ativar este movimento, role um d6 e ganhe o seguinte bônus baseado no resultado. Quando ativado em turnos subsequentes, qualquer efeito anterior termina.",
        {
          "type": "tabela",
          "cabecalhos": ["d6", "Efeito"],
          "linhas": [
            ["1", "+1 para rolagens de ataque"],
            ["2", "+2 para rolagens de dano"],
            ["3", "+10 Pontos de Vida temporários"],
            ["4", "+1 para Salvaguardas"],
            ["5", "Margem de Acerto Crítico +1"],
            ["6", "+1 na Classe de Armadura"]
          ]
        }
      ]
    },
    {
      "id": "aerial-ace",
      "name": "Ás Aéreo",
      "type": "voador",
      "power": ["dex"],
      "time": "1 ação",
      "pp": 5,
      "duration": "instantanea",
      "range": "CaC",
      "description": [
        "Você mergulha em uma criatura com tanta velocidade que é impossível para ela evitar. Este movimento tem acerto garantido, causando 1d6 + MOD_MAIOR de dano do tipo voador, a menos que o alvo esteja no estágio invulnerável de movimentos como Voar (Fly), Cavar (Dig), Quicar (Bounce), Mergulhar (Dive), etc."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 1d10 no nível 5, 2d8 no nível 10 e 5d4 no nível 17."
    },
    {
      "id": "aeroblast",
      "name": "Jato de Ar",
      "type": "voador",
      "power": ["str", "dex"],
      "time": "1 ação",
      "pp": 5,
      "duration": "instantanea",
      "range": "pessoal (linha de 15m / 50ft)",
      "description": [
        "Você dispara um poderoso vórtex de ar que estraçalha as criaturas. Qualquer criatura pega em uma linha de 15m (50ft), 1.5m (5ft) de largura, deve fazer uma Salvaguarda de DES contra sua CD de Movimento, sofrendo 3d10 + MOD_MAIOR de dano do tipo voador em caso de falha, e metade em caso de sucesso."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 6d6 no nível 5, 8d6 no nível 10 e 7d12 no nível 17."
    },
    {
      "id": "after-you",
      "name": "Depois de Você",
      "type": "normal",
      "power": "nenhum",
      "time": "1 ação_bonus",
      "pp": 3,
      "duration": "instantanea",
      "range": "15m (50ft)",
      "description": [
        "Como uma ação bônus, escolha uma criatura ao alcance que ainda não tenha agido na rodada atual. O alvo deve agir imediatamente agora, e retorna à ordem de iniciativa normal na próxima rodada."
      ]
    },
    {
      "id": "agility",
      "name": "Agilidade",
      "type": "psíquico",
      "power": "nenhum",
      "time": "1 ação_bonus",
      "pp": 15,
      "duration": "1 minuto, concentração",
      "range": "pessoal",
      "description": [
        "Você aprimora suas habilidades e sente uma onda de velocidade percorrer suas veias. Aumente sua velocidade de movimento em 6m (20ft) pela duração. Aplicável a qualquer tipo de movimento que a criatura possua."
      ]
    },
    {
      "id": "air-cutter",
      "name": "Cortador de Ar",
      "type": "voador",
      "power": ["dex"],
      "time": "1 ação",
      "pp": 15,
      "duration": "instantanea",
      "range": "9m (30ft)",
      "description": [
        "Você cria uma rajada de vento afiada como navalha para golpear uma criatura. Faça um ataque à distância contra uma criatura, causando 1d10 + MOD_MAIOR de dano do tipo voador se acertar. Este movimento causa um acerto crítico em 19 e 20."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 2d8 no nível 5, 5d4 no nível 10 e 4d8 no nível 17."
    },
    {
      "id": "air-slash",
      "name": "Golpe Aéreo",
      "type": "voador",
      "power": ["dex"],
      "time": "1 ação",
      "pp": 10,
      "duration": "instantanea",
      "range": "9m (30ft)",
      "description": [
        "Você golpeia uma criatura com uma lâmina de ar afiada. Faça um ataque à distância contra uma criatura, causando 1d12 + MOD_MAIOR de dano do tipo voador se acertar. Em uma rolagem de ataque natural de 15 ou mais, o alvo estremece."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 2d8 no nível 5, 2d12 no nível 10 e 6d6 no nível 17."
    },
    {
      "id": "ally-switch",
      "name": "Troca de Aliado",
      "type": "psíquico",
      "power": "nenhum",
      "time": "1 ação",
      "pp": 10,
      "duration": "instantanea",
      "range": "15m (50ft)",
      "description": [
        "Você usa um estranho poder psíquico para se teleportar e a uma criatura voluntária ao alcance, trocando de lugar no campo de batalha."
      ]
    },
    {
      "id": "amnesia",
      "name": "Amnésia",
      "type": "psíquico",
      "power": "nenhum",
      "time": "1 ação_bonus",
      "pp": 10,
      "duration": "1 minuto",
      "range": "pessoal",
      "description": [
        "Sua mente se eleva a um novo nível de foco. Adicione +2 a qualquer salvaguarda que você fizer durante a duração, mas selecione um de seus movimentos que não seja Amnésia. Você esquece esse movimento e não pode usá-lo pela duração."
      ]
    },
    {
      "id": "anchor-shot",
      "name": "Tiro de Âncora",
      "type": "metal",
      "power": ["str", "dex"],
      "time": "1 ação",
      "pp": 15,
      "duration": "instantanea",
      "range": "6m (20ft)",
      "description": [
        "Você tenta enredar um alvo com sua corrente de âncora enquanto ataca. Escolha um alvo dentro do alcance e faça um ataque à distância contra essa criatura, causando 2d6 + MOD_MAIOR de dano do tipo metal se acertar. Se acertar, o alvo fica impedido (restrained) e não pode fugir ou ser trocado. O alvo pode fazer uma Salvaguarda de FOR contra sua CD de Movimento no início de cada um de seus turnos para tentar se libertar da corrente."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 2d8 no nível 5, 4d6 no nível 10 e 6d6 no nível 17."
    },
    {
      "id": "ancient-power",
      "name": "Poder Antigo",
      "type": "pedra",
      "power": ["str", "dex"],
      "time": "1 ação",
      "pp": 3,
      "duration": "instantanea",
      "range": "CaC",
      "description": [
        "Você ataca com um poder interno desconhecido. Faça uma rolagem de ataque corpo a corpo contra uma criatura, causando 1d10 + MOD_MAIOR de dano do tipo pedra se acertar. Em uma rolagem de ataque natural de 19 ou 20, todos os seus valores de atributo aumentam em 1 enquanto você permanecer na batalha. Este movimento pode ser acumulado para um máximo de +5 em todos os valores de atributo."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 2d8 no nível 5, 5d4 no nível 10 e 4d8 no nível 17."
    },
    {
      "id": "apple-acid",
      "name": "Ácido de Maçã",
      "type": "planta",
      "power": ["dex", "cha"],
      "time": "1 ação",
      "pp": 3,
      "duration": "instantanea",
      "range": "pessoal (cone de 4.5m / 15ft)",
      "description": [
        "Você encharca a área com o ácido de maçãs azedas. Os alvos na área devem fazer uma Salvaguarda de DES. Uma criatura sofre 1d10 + MOD_MAIOR de dano do tipo planta em caso de falha, metade em caso de sucesso. Toda criatura que falhar na salvaguarda também sofre -2 nas Salvaguardas de DES ou CON até o final do encontro ou até ser retirada. Este efeito pode ser acumulado até três vezes na mesma criatura."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 2d8 no nível 5, 5d4 no nível 10 e 4d8 no nível 17."
    },
    {
      "id": "aqua-cutter",
      "name": "Cortador Aquático",
      "type": "água",
      "power": ["str", "dex"],
      "time": "1 ação",
      "pp": 10,
      "duration": "instantanea",
      "range": "CaC",
      "description": [
        "Você expele água pressurizada para cortar o alvo como uma lâmina. Faça um ataque corpo a corpo, causando 1d12 + MOD_MAIOR de dano do tipo água se acertar. Este ataque causa um acerto crítico em rolagens de ataque natural de 19 ou 20."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 2d8 no nível 5, 2d12 no nível 10 e 6d6 no nível 17."
    },
    {
      "id": "aqua-jet",
      "name": "Jato d'Água",
      "type": "água",
      "power": ["dex"],
      "time": "1 ação_bonus",
      "pp": 15,
      "duration": "instantanea",
      "range": "CaC",
      "description": [
        "Você avança sobre uma criatura com velocidade incrível. Escolha um alvo a até 3m (10ft) de você. Uma explosão de água o impulsiona em direção a essa criatura, evitando todos os ataques de oportunidade. Faça um ataque corpo a corpo contra essa criatura, causando 1d4 de dano do tipo água se acertar."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 1d6 no nível 5, 1d10 no nível 10 e 1d12 no nível 17."
    },
    {
      "id": "aqua-ring",
      "name": "Anel Aquático",
      "type": "água",
      "power": "nenhum",
      "time": "1 ação_bonus",
      "pp": 5,
      "duration": "1 minuto, concentração",
      "range": "pessoal",
      "description": [
        "Você se cerca com um véu de água curativa. No final de cada um de seus turnos, enquanto mantiver a concentração, recupere um número de pontos de vida igual ao seu bônus de proficiência."
      ]
    },
    {
      "id": "aqua-step",
      "name": "Passo Aquático",
      "type": "água",
      "power": ["str"],
      "time": "1 ação",
      "pp": 5,
      "duration": "instantanea",
      "range": "CaC",
      "description": [
        "Você avança sobre seu alvo com passos de dança fluidos. Faça um ataque corpo a corpo, causando 2d6 + MOD_MAIOR de dano do tipo água se acertar. No final do seu turno, independentemente de ter acertado, sua velocidade de movimento aumenta em 3m (10ft) até o final do seu próximo turno."
      ],
      "higherLevels": "O dado de dano para este movimento muda para 2d8 no nível 5, 4d6 no nível 10 e 6d6 no nível 17."
    }
]
