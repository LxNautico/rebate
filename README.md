# Rebate!

Jogo arcade independente de raquete, com quadra em perspectiva vertical, oito personagens e nove destinos. A integração ao Queima-Queima continua adiada.

## Jogar

[Abra o Rebate!](https://lxnautico.github.io/rebate/). A página começa na apresentação automática dos personagens, com quadras e uniformes variados. Clique em Jogar para escolher personagem, uniforme, modalidade, competição, dificuldade, quadra e lado.

- ← → ou A/D: mover. 1–9: destino da bola.
- ↑: golpear no lado inferior; ↓ no superior. Combine com uma seta lateral para curva.
- No celular, toque na sua metade para indicar para onde correr. Use Golpear, Efeito ou o gesto na direção do lado escolhido.
- Mira reta limpa o destino; não rebate. P ou Escape pausa. Espaço prepara o especial na Arena; fora da partida, abre as escolhas ou continua.
- Pausa oferece continuar, reiniciar e desistir. Fechar a seleção permite voltar a explorar a página.

Partida rápida até cinco pontos ou melhor de três sets até onze, sempre com dois de vantagem. Saques alternam a cada dois pontos; em 10 × 10, a cada ponto.

## Competições e modalidades

Partida avulsa, torneio de três rodadas ou Copa Mundial com dezesseis países, grupos e eliminatórias. Todos os rivais são controlados pelo computador. Torneio e Copa guardam o progresso entre rodadas; retomar reinicia a partida atual com placar zerado.

Clássico usa golpes comuns. Arena oferece velocidade, Chuva de bolas de cinco segundos e oito especiais próprios dos personagens. O adversário também usa poderes. [Regras da Arena](docs/ARENA.md).

Arena musical é opcional: quiques tocam notas, mas somente suas devoluções no lado adversário compõem a sequência; saques não contam. As três melodias originais liberam uma dança conjunta depois do ponto, uma vez por partida, com Pular. [Sequências musicais](docs/ARENA-MUSICAL.md).

## Personagens e progresso

Força, Agilidade e Técnica têm efeitos reais e aparecem nas extremidades da quadra. Partidas concluídas rendem XP salvo por personagem; aumentos valem na partida seguinte. Desistir e reiniciar não concede XP descartado. [Atributos](docs/ATRIBUTOS.md).

Histórias aparecem após vitórias de sets e partidas, com Continuar e Pular. Capítulos vistos não se repetem automaticamente. A galeria na seleção permite reler histórias e finais. Campeões de torneio ou Copa recebem uma cena final ilustrada e animada junto ao troféu. [Histórias e finais](docs/HISTORIAS-PERSONAGENS.md).

Rankings separados por Clássico/Arena, regra de pontuação e dificuldade. Desafios, troféus, atributos e quadras ficam no navegador e endereço usados; não há contas nem sincronização entre aparelhos.

Quadra verde livre; azul exige títulos com dois personagens diferentes; roxa exige dez devoluções na mesma troca; terracota exige vitória no Médio. O botão i na escolha da quadra informa requisitos e progresso.

## Verificar e distribuir

Execute `node tests/run.cjs`: confere sintaxe, referências de arquivos, IDs de interface e todas as suítes automatizadas. Isso não substitui testar visual, som e resposta de toque no aparelho.

Pacote atual: `Ping-Pong-celular-ranking.zip`. Extraia tudo junto; index.html, JavaScript, CSS, img e songs são necessários. [Acesso pelo celular](docs/ACESSO-CELULAR.md).

[Estado da versão consolidada](docs/VERSAO-ESTAVEL.md). Backups ficam em backups; não são publicados. ROTEIRO.md, Instrucoes.txt e docs/HISTORICO-README.md são registros históricos e podem conter propostas antigas.
