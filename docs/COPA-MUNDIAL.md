# Rebate! — Copa Mundial

Escolha Copa Mundial, país, personagem, uniforme, lado, regras e dificuldade na preparação. Não é uma competição online: todos os rivais são controlados pelo computador.

## Participantes

Brasil, Portugal, Argentina, Uruguai, Estados Unidos, Canadá, México, França, Alemanha, Espanha, Itália, Reino Unido, Japão, China, Coreia do Sul e Austrália.

Os dezesseis países usam os oito personagens existentes. Cada país recebe um representante no sorteio; seu país usa o personagem escolhido. Habilidades dependem do personagem e da dificuldade, sem bônus de nacionalidade.

As duas extremidades da quadra exibem bandeira, país, personagem e identificação de Você ou Adversário. As identificações acompanham o lado escolhido e ficam fora da área de jogo.

## Formato

- Quatro grupos de quatro países; todos se enfrentam uma vez. Você joga três partidas.
- Vitória vale três pontos, derrota zero; não há empate em partidas.
- Os dois primeiros de cada grupo avançam. Desempates: saldo, placar marcado e ordem do sorteio inicial. Saldo considera pontos em partida rápida e sets em melhor de três.
- Quartas: A1 × B2, C1 × D2, B1 × A2, D1 × C2. Depois semifinal e final.
- Derrota no grupo não elimina imediatamente; derrota nas eliminatórias encerra sua participação.

As demais partidas da rodada são simuladas. Os países têm as mesmas chances nessa simulação, sem favorecer um país real. Tabelas e histórico das eliminatórias ficam no painel da Copa.

## Retomada e conquistas

O progresso é salvo ao começar e depois de cada partida. Continuar Copa retoma a mesma partida com placar zerado, mantendo país, rivais, personagem, cores, modo, dificuldade e lado. Recarregar não retoma uma bola em andamento. Desistir descarta a Copa; voltar à seleção permite retomá-la depois. Começar outra Copa substitui o progresso da anterior.

O título concede um troféu mundial na galeria, identificado pelo país e personagem. Troféus antigos são preservados; títulos mundiais também contam para o desafio de campeões com personagens diferentes. Dados permanecem locais ao navegador e endereço.

## Validação

Execute `node tests/world-cup.cjs`, `node tests/world-cup-ui.cjs` e `node tests/balance.cjs`. Cobertura: 200 Copas completas, grupos sem duplicatas, calendário, classificação, eliminação, chave de 4/2/1 partidas, retomada, pontuação rápida/sets, troféu e convivência com os modos anteriores. Testes de interface usam elementos simulados; conferir visualmente bandeiras, tabelas e botões no navegador e celular.
