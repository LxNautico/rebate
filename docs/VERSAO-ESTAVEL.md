# Rebate! — versão consolidada em 06/10/2026

Projeto independente publicado no GitHub Pages. Integração ao Queima-Queima adiada.

## Implementado

- Apresentação automática com oito personagens, quatro quadras e cinco uniformes.
- Nove destinos, movimento lateral, teclado e toque que indica para onde correr; escolha dos dois lados da mesa.
- Saques alternados, curvas, faltas, rápida até cinco ou três sets até onze, com dois de vantagem.
- Oito estilos de adversário, três dificuldades, pausa, reinício e desistência.
- Torneio de três rodadas e Copa Mundial de dezesseis países; salvamento entre partidas e bandeiras junto à quadra.
- Arena: velocidade, Chuva de bolas ajustada por dificuldade e oito poderes individuais.
- Arena musical opcional: três sequências das suas devoluções, sem saques; dança conjunta depois do ponto, cinco segundos e Pular, uma por partida.
- Atributos reais, barras, XP por personagem e crescimento limitado aplicado na próxima partida.
- Sons gravados e sintetizados, tutorial, orientação e informação de desbloqueio das quadras.
- Ranking local, desafios, troféus, recompensas, histórias e oito finais visuais.
- Movimento reduzido e texto descritivo das cenas; escolhas só abrem ao clicar em Jogar.

## Validação

`node tests/run.cjs` executa as suítes de física/estilos, Copa, Arena, poderes, atributos, música/áudio, histórias, apresentação, finais e recuperação do desenho, além de sintaxe e vínculos da interface. Inclui 72.000 devoluções e 72.000 saques simulados e 200 Copas completas. Simulações não medem taxas de vitória humanas.

O usuário confirmou as três melodias depois da correção para contar somente suas devoluções. Também aprovou apresentação e finais durante o desenvolvimento. Conferir novamente no aparelho: corrida por toque, controles com os dois lados, volume musical, dança/Pular, pausas ao trocar de aplicativo e leitura dos resultados. Essa conferência física não foi concluída automaticamente nesta consolidação.

## Limites conhecidos

- Progresso local ao navegador e origem; não há multiplayer, contas ou sincronização.
- Retomar competição reinicia a partida atual, sem restaurar uma bola em andamento.
- Ranking mantém dez resultados por categoria; galeria mantém até cinquenta troféus.
- Evolução: até 10 XP por atributo/partida, 40 XP por ponto e até 15 pontos adicionais por atributo. Rivais usam perfil inicial.
- Rankings anteriores foram preservados, apesar das mudanças de balanceamento.
- Efeitos são arcade; parentes nos finais são figuras ilustradas.
- Áudio depende da interação inicial; falhas de áudio não devem parar o jogo.
- Valores de poderes e movimento ainda podem ser ajustados conforme testes humanos.

## Distribuição e backup

Pacote atual: Ping-Pong-celular-ranking.zip. Backup consolidado: backups/Rebate-consolidado-2026-10-06_*.zip. Inclui jogo, imagens, sons, testes e documentação; exclui backups anteriores, ZIPs e arquivos temporários de revisão. Não apaga backups antigos. O pacote de distribuição exclui os vídeos de referência.

Próximos trabalhos são ajustes apontados pelo teste no aparelho e manutenção; novas funcionalidades podem ser planejadas após essa conferência.
