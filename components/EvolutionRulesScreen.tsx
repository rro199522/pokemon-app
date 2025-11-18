import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">{title}</h3>
    <div className="space-y-3 text-gray-700">{children}</div>
  </div>
);

const EvolutionRulesScreen: React.FC = () => {
  return (
    <div className="p-4 md:p-6 animate-fade-in text-base leading-relaxed">
      <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-6">Regras de Evolução e Nível</h2>

      <Section title="Benefícios ao Subir de Nível">
        <p>Quando um Pokémon sobe de nível, ele ganha benefícios. Cada vez que um Pokémon sobe de nível, ele ganha HP igual a uma rolagem de seu dado de vida + seu modificador de CON, retroativo com o aumento nas pontuações de CON.</p>
      </Section>

      <Section title="Novos Movimentos">
        <p>Pokémon não podem conhecer mais de 4 movimentos de uma vez. Toda vez que seu Pokémon sobe de nível, você pode substituir um movimento que ele conhece por qualquer um dos movimentos listados em seu bloco de estatísticas no seu nível atual ou inferior. Nos níveis 2, 6, 10, 14 e 18, seu Pokémon ganha acesso a novos movimentos.</p>
        <p>Após evoluir, um Pokémon mantém todos os movimentos que conhece atualmente, mesmo que seus movimentos conhecidos não estejam mais listados no bloco de estatísticas da forma evoluída. No entanto, ao trocar um movimento ao subir de nível, ele não pode aprender um movimento de suas formas evolutivas anteriores; apenas movimentos de sua forma atual podem ser aprendidos.</p>
      </Section>

      <Section title="Melhoria de Pontos de Habilidade (ASI)">
        <p>Seu Pokémon ganha um número de pontos para alocar em qualquer uma de suas pontuações de habilidade, até um máximo de 20. O número de pontos a alocar depende do número de estágios evolutivos na linha daquele Pokémon:</p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li><strong>1 estágio:</strong> 4 pontos</li>
          <li><strong>2 estágios:</strong> 3 pontos</li>
          <li><strong>3 estágios:</strong> 2 pontos</li>
        </ul>
        <p>Até 2 desses pontos podem ser usados para adquirir um Talento (Feat) em vez disso.</p>
        <p>Isso acontece nos níveis 4, 8, 12 e 16.</p>
      </Section>
      
      <Section title="Aumento de Dano">
        <p>O dano de cada movimento que causa dano aumenta nos níveis 5, 10 e 17, conforme mostrado na descrição do movimento.</p>
      </Section>

      <Section title="STAB (Bônus de Ataque do Mesmo Tipo)">
        <p>STAB é a sigla para "Same-Type Attack Bonus". Quando um Pokémon usa um movimento que possui o mesmo tipo que um de seus próprios tipos, ele recebe um bônus de STAB adicionado às rolagens de dano.</p>
        <p>Quando o STAB se aplica, ele é igual ao Modificador de Poder do Movimento (o bônus de dano baseado no atributo). Isso efetivamente dobra o bônus de dano para movimentos que são do mesmo tipo que o Pokémon que os está usando.</p>
      </Section>

      <Section title="Poder Máximo (Nível 20)">
        <p>No nível 20, seu Pokémon está no auge. Uma pontuação de habilidade de sua escolha para este Pokémon aumenta em 2, até um máximo de 22.</p>
        <p>Se o SR (Nível de Desafio) do Pokémon for 15 ou mais, ele pode aumentar uma pontuação de habilidade até um máximo de 30.</p>
      </Section>

      <Section title="Como a Evolução Funciona">
        <p>Pokémon podem evoluir para uma nova forma assim que atenderem à condição detalhada em seu bloco de estatísticas. Quando um Pokémon evolui, ocorre o seguinte:</p>
        <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Ele mantém suas pontuações de habilidade atuais, mas ganha pontos para distribuir em qualquer uma dessas pontuações. O número de pontos a distribuir é fornecido em seu bloco de estatísticas. Esses pontos não podem ser usados para adquirir talentos, a menos que especificado de outra forma.</li>
            <li>Ele ganha um bônus de HP igual ao dobro do seu nível.</li>
            <li>Ele adquire o dado de vida de sua forma evoluída para aumentar o HP neste nível e para rolagens futuras.</li>
            <li>Ele adquire a CA base de sua forma evoluída, todas as novas proficiências e vulnerabilidades/resistências/imunidades.</li>
            <li>Se perder sua habilidade atual ao evoluir, deve trocar sua habilidade conhecida por qualquer uma das habilidades de sua forma evoluída.</li>
            <li>Ele mantém os movimentos conhecidos que tinha antes da evolução, mas deve aprender todos os movimentos futuros de sua nova lista de movimentos.</li>
            <li>Se o Pokémon receberia outros benefícios neste nível (como ganhar ASI), ele recebe os benefícios após a evolução.</li>
        </ul>
        <p className="mt-4">A evolução pode ser adiada a critério do jogador, mas uma vez que a decisão foi tomada, o Pokémon não pode evoluir até ganhar um nível adicional.</p>
      </Section>
    </div>
  );
};

export default EvolutionRulesScreen;