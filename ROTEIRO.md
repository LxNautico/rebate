> Roteiro histórico: várias etapas já foram implementadas. Consulte docs/VERSAO-ESTAVEL.md para o estado atual. Integração ao Queima-Queima adiada.

# Roteiro de evolução — Ping-Pong 3 Raias

## Direção do jogo

Criar um jogo de reflexo, leitura de trajetória e decisão rápida, com partidas curtas e vontade de tentar novamente. Preservar o que já foi aprovado: mesa em perspectiva vertical, layout e movimento da bola. Desenvolver isoladamente e integrar ao universo Queima Queima depois de estabilizar a experiência.

O formato inicial recomendado é um arcade de sobrevivência: manter a bola em jogo, construir sequências e superar o próprio resultado. Uma disputa contra um oponente que pode errar pode vir como outro modo, sem substituir essa base.

## Etapa 1 — Tornar a primeira partida clara e satisfatória

Próxima entrega recomendada.

- Tutorial curto dentro da primeira partida: começar devagar, mostrar a raia de chegada e ensinar uma troca de posição.
- Oferecer Treino (sem eliminação) e Arcade (três vidas). Preservar a regra de um erro como opção Desafio, com recorde separado.
- Dar feedback de rebatida: pequena animação da raquete, brilho e som discreto com botão para silenciar. Não depender de som ou cor para explicar o resultado.
- Ao errar, deixar a bola passar e mostrar qual era a raia correta antes de retomar ou encerrar.
- Mostrar velocidade e sequência. No resultado, explicar devoluções, maior sequência e motivo do fim.
- Conferir o campo e os controles em celular: raquete, bola e botões precisam caber confortavelmente na tela.

Critério de conclusão: um jogador novo entende os controles e o erro sem explicação externa; consegue reiniciar rapidamente; pausa e toque funcionam em celular. Os modos têm regras e recordes próprios.

## Etapa 2 — Criar desafio com ritmo

- Substituir sorteios totalmente livres por padrões: repetir uma raia, alternar lados, percorrer esquerda-centro-direita e combinar diagonais.
- Aumentar a dificuldade por blocos de devoluções, com tempo mínimo para reagir. Evitar exigir duas mudanças de raia em um intervalo impossível.
- Introduzir padrões gradualmente e oferecer breves intervalos entre blocos.
- Usar uma sequência consistente de velocidades e padrões em cada dificuldade para permitir comparar resultados.
- No Treino, permitir escolher velocidade e manter a indicação de chegada.

Critério de conclusão: o jogo exige decisões além de permanecer numa raia, mas cada bola continua alcançável pelos controles. Validar com pessoas jogando, além de simulações.

## Etapa 3 — Dar motivos para melhorar

- Manter devoluções como medida básica; acrescentar combo e bônus por sequência, com regras visíveis.
- Definir metas locais: completar 10 devoluções, acertar alternâncias e concluir uma rodada sem perder vidas.
- Salvar melhores resultados por modo e dificuldade, versão das regras e preferências de som.
- Criar poucas conquistas relacionadas à habilidade. Evitar recompensar apenas tempo gasto.
- Oferecer rodadas curtas com objetivos definidos, além da sobrevivência contínua.

Critério de conclusão: o jogador entende como melhorar o resultado e tem uma próxima meta clara. Alterações de pontuação não misturam recordes de regras incompatíveis.

## Etapa 4 — Construir identidade no universo Queima Queima

- Escolher nome final e uma apresentação coerente com o universo, preservando a legibilidade da mesa aprovada.
- Introduzir personagens e adversários com padrões próprios, começando por poucos bem diferenciados.
- Criar uma pequena campanha piloto, por exemplo cinco fases, antes de ampliar o conteúdo.
- Explorar uma bola em chamas como recompensa visual de combo; efeitos não devem ocultar a trajetória ou a raia.
- Considerar desafios de atenção e memória como modos opcionais: por exemplo, reduzir a ajuda visual após ensinar um padrão. Não mudar a regra principal sem avisar.

Critério de conclusão: a identidade visual e os objetivos lembram o universo, e cada fase acrescenta uma diferença perceptível de jogabilidade.

## Etapa 5 — Preparar a integração mantendo a versão independente

Observação do projeto atual: a central em `QQeGanhe/index.html` abre outros jogos por links para suas próprias pastas, como `quebra-quebra/index.html` e `jogobitcoin/index.html`. O Quebra-Quebra já oferece retorno à central e seleção de idioma. Esse padrão é um ponto de partida para integrar o Ping-Pong; ainda não foi feita uma auditoria dos sistemas compartilhados.

- Separar configuração, regras, desenho, entrada de controles e armazenamento quando a expansão justificar isso.
- Definir um resultado de partida com identificador do jogo, versão das regras, modo, dificuldade, pontos, devoluções, maior sequência e duração. Identificadores precisam ser estáveis; datas e textos não devem definir a identidade de um modo.
- Manter textos preparados para tradução e alinhar a seleção de idioma com o sistema existente.
- Permitir configurar o link de retorno à central; a cópia independente deve continuar funcionando sem esse destino.
- Verificar na etapa de integração como a central trata progresso, conquistas, ranking e identidade. Criar um adaptador apenas para os serviços que de fato existem; não assumir um sistema compartilhado.
- Preservar os recordes locais e definir uma migração explícita, caso a origem ou as chaves de armazenamento mudem.

Critério de conclusão: o mesmo jogo funciona sozinho e dentro do universo, sem depender da central para iniciar uma partida.

## Etapa 6 — Integrar e publicar

- Colocar uma versão estável em uma pasta própria do universo e acrescentar seu cartão na central.
- Adicionar retorno à central, traduções e, quando aplicável, registro dos resultados nos serviços existentes.
- Conferir caminhos de arquivos, cache e funcionamento offline de acordo com a configuração real de publicação.
- Validar teclado, toque, pausa ao trocar de aba, reinício, sons, desempenho e armazenamento indisponível.
- Fazer uma rodada de testes com jogadores e corrigir dificuldades de compreensão antes da publicação.

Critério de conclusão: o jogador entra pela central, joga, registra seu progresso conforme as regras escolhidas e volta à central sem perder a experiência.

## Ideias para depois

Disputa por pontos com adversário falível, cosméticos, desafio diário e ranking online. Multiplayer vem por último: exige sincronização, infraestrutura e regras próprias para latência. Ranking competitivo também exige validação de resultados; pontuação enviada apenas pelo navegador não é confiável.

## Ordem de trabalho

Implementar uma etapa por vez e jogar antes de avançar. A primeira evolução deve ser tutorial, feedback e modos Treino/Arcade, com ajuste para celular. Depois, melhorar padrões e dificuldade. Campanha e integração só entram quando a mecânica estiver consistente.

Este documento é uma proposta de evolução; não indica que as funcionalidades futuras já estejam implementadas.

## Experimento implementado — nove destinos e rebatida manual

A primeira evolução de controles já permite movimento contínuo da raquete, nove destinos numerados, golpe manual com ↑ e curva com ←/→ + ↑. No celular há barra de posição, botões de destino e área de gesto. Preservamos a mesa em perspectiva e o modo de sequência para avaliar o controle antes de implementar a disputa.

Próxima avaliação: conforto para selecionar destinos durante a troca, velocidade de movimento, tolerância de posição, janela de golpe e gesto no celular. Depois: oponente falível, disputa por pontos, saques alternados e sets. Efeitos físicos, quique e bolas para fora vêm após estabilizar esses controles.
