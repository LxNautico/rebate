# Rebate!

Jogo arcade independente de raquete, inspirado no tênis de mesa, com quadra em perspectiva vertical. Cada rival, um novo desafio. A integração ao universo Queima-Queima está adiada.

## Jogar

Abra `index.html` no navegador, escolha personagem, uniforme, quadra, dificuldade e partida avulsa ou torneio. Para celular, use o pacote atual `Ping-Pong-celular-ranking.zip`: extraia todos os arquivos e disponibilize o conteúdo em um servidor acessível ao aparelho.

- ← → ou A/D: mover; 1–9: escolher destino; ↑: golpear.
- Segure uma seta lateral junto de ↑ para dar curva.
- “Mira reta” limpa o destino; não executa o golpe.
- P ou Escape: pausar; Espaço: iniciar ou continuar.
- No celular: botões, barra e gesto para cima ou diagonal. Deslize lateral excessivo pode mandar a bola para fora.

Partida rápida até cinco pontos ou melhor de três sets até onze, com dois de vantagem. Saques alternam a cada dois pontos; em 10 × 10, a cada ponto. O saque quica dos dois lados.

## Progresso

Ranking, desafios, troféus e quadras ficam neste navegador. Torneio tem quartas, semifinal e final contra três rivais distintos. “Continuar torneio” retoma a rodada com placar zerado. Desistir descarta o torneio; voltar à seleção entre rodadas preserva a retomada.

Quadra verde livre. Azul: torneios vencidos com dois personagens diferentes. Roxa: dez devoluções na mesma troca. Terracota: vitória no médio. Resultados anteriores ainda registrados também contam.

## Organização

- `script.js`: partida, controles, projeção e animações.
- `personalities.js`: estilos dos adversários e ritmo das trocas.
- `tournament.js`, `results.js`, `challenges.js`, `rewards.js`: progresso e competições.
- `audio.js`, `sprite-masks.js`, `img/`, `songs/`: sons e apresentação.
- `docs/VERSAO-ESTAVEL.md`: funcionalidades, validação e limitações atuais.
- `docs/HISTORICO-README.md`: registros anteriores, incluindo descrições obsoletas.
- `ROTEIRO.md`: propostas históricas; consulte a versão estável para o estado atual.
- `Instrucoes.txt`, vídeo e rascunho: referências originais preservadas.
- `backups/`: cópias de segurança; ZIP antigo para celular é legado.

## Verificar

Execute `node tests/balance.cjs` na pasta do projeto. Confira sintaxe com `node --check script.js` e o mesmo comando para os demais arquivos JavaScript. Testes de lógica não substituem conferência visual no navegador e celular.

### Explorar e aprender
- Fechar na seleção permite olhar a página; Jogar reabre as escolhas. Personagem continua obrigatório para entrar na partida.
- Tutorial guiado de oito etapas destaca escolhas, regras, quadra, movimento, mira, golpes e progresso. Pode voltar, avançar ou fechar; não inicia partidas automaticamente.
- Avisos de ponto ficam acima do tabuleiro, fora dos personagens, preservando suas reações.


### Passos e comemorações especiais
- Animação visual segmentada das pernas ao deslocar lateralmente; para ao ficar imóvel e congela durante a pausa. Não altera colisões.
- Oito assinaturas visuais: salto, giro acrobático, reverência, balanço, giro surpresa, dois saltos, saudação e dança. Ativadas em vitória de set/partida ou ponto com dez devoluções na troca, dentro do intervalo existente.
- Movimento reduzido preserva poses estáticas. Ajoelhar com braços erguidos e mandar beijos requerem novos sprites; não estão implementados com as poses atuais.
- Verificados trajetórias finitas, deslocamento, parada, reset e sintaxe. Conferir aparência no navegador.


### Poses especiais: Maya e Caio
- Novas folhas geradas com ferramenta integrada de imagem, usando personagens existentes como referência: Maya ajoelha e ergue ambos os braços; Caio leva a mão aos lábios e manda beijos para os dois lados.
- Cinco cores, seis poses por cor, recortes em celebration-frames.js e reprodução em character-motion.js. Aparecem nas comemorações especiais; voltam às poses normais antes do saque.
- Assets: img/maya-celebration.png e img/caio-celebration-v2.png. Prompt: folha transparente 6 colunas × 5 cores, identidade preservada, sequência de ajoelhar/erguer braços ou mandar beijos, sem raquete, corpo completo.
- Reprodução e cores verificadas por teste de lógica. Conferir gestos e enquadramento no navegador/celular.


### Comemorações dos oito personagens
- Alex: salto com punhos erguidos. Rafa: cambalhota. Lia: reverência e aceno. Léo: giro com braços abertos. Nina: dois saltos. Íris: passos de dança e braços erguidos. Maya e Caio mantêm suas comemorações aprovadas.
- Assets novos em img/<personagem>-celebration.png; Íris usa iris-celebration-v3.png. Gerados pela ferramenta integrada com os sprites atuais como referência de identidade, cinco uniformes, corpo inteiro, fundo transparente e poses sequenciais sem raquete. Íris usa três poses alternadas; os demais seis.
- Ativação e duração dos intervalos mantidas; sequências testadas em todas as cores e modo de movimento reduzido. Conferir aparência no navegador.

