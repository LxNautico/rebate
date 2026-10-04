# Ping-Pong — nove destinos e golpe manual

Abra `index.html` no navegador. Protótipo independente do universo Queima Queima; sem dependências.

## Versão atual

Mesa em perspectiva vertical, três raias visuais e nove pontos laterais de chegada. A raquete se move continuamente. Cada devolução manual vale um ponto; errar a posição ou o momento encerra a sequência. O oponente sempre devolve nesta etapa. Sets e saques alternados continuam no roteiro.

## Teclado

- ←/→ ou A/D: movimentar a raquete; segurar mantém o movimento.
- 1–9: selecionar o destino da devolução, da extrema esquerda à extrema direita. A seleção permanece até ser alterada.
- ↑: rebater quando a bola chega perto da raquete. A indicação “↑ REBATA” ajuda a aprender o momento.
- Segurar ← ou → e pressionar ↑: acrescentar efeito para esse lado. Enquanto ↑ está pressionada, a movimentação lateral fica suspensa.
- “Devolver reto”: limpar a seleção de destino; o golpe segue a posição lateral da recepção.
- Espaço: iniciar/continuar. P ou Escape: pausar/continuar. Trocar de aba ou sair da janela pausa a partida.

Números definem destino, e setas laterais combinadas com ↑ definem curva. Exemplo: destino 9 com ↑ devolve para a extrema direita sem curva; destino 9 com → + ↑ acrescenta curva para a direita.

## Celular

Use a barra “Sua raquete” para se posicionar. Toque em um dos nove destinos e use o botão de rebatida sem efeito; ou deslize para cima na área de gesto. Um deslize diagonal escolhe um destino relativo à posição da raquete e acrescenta efeito lateral. Nesta versão os destinos são limitados à mesa: deslizes excessivos ainda não mandam a bola para fora.

## Limites deste experimento

A rebatida tem tolerância de posição e uma pequena janela de antecipação. O efeito é uma curva visual/lateral que preserva o destino escolhido; ainda não simula rotação física ou quique. Não há sets, oponente falível, força de golpe ou saques manuais. O recorde desta mecânica é salvo numa chave própria, separada da versão de rebatida automática.

## Arquivos

- `index.html`: interface e controles.
- `style.css`: layout responsivo.
- `script.js`: estados, movimento, golpe e projeção.
- `ROTEIRO.md`: evolução proposta.
- `Instrucoes.txt` e `Projeto_incial(rascunho).jpg`: referências originais preservadas.

O campo usa profundidade de 0 (oponente) a 1 (jogador). `project()` transforma coordenadas lógicas em perspectiva; o movimento usa tempo em segundos.

## Ajuste de controles e disputa experimental

Os controles e instruções ficam ao lado da mesa em telas largas; em celular ficam abaixo. Botões ←/→ funcionam ao segurar, e ↖/↑/↗ executam golpes com ou sem efeito. O teclado aceita a combinação das setas nas duas ordens. A preparação do saque tem uma pequena tolerância para combinar as teclas.

Agora você começa sacando. Os saques alternam a cada ponto nesta versão experimental. O oponente tem velocidade limitada e pode deixar a bola passar. O placar é separado das devoluções; a partida termina em cinco pontos com dois de vantagem. Ainda não são as regras finais de sets e saques do tênis de mesa. Um erro concede ponto e abre novo saque, em vez de encerrar imediatamente.

A janela de rebatida foi ampliada para combinar com a indicação visual. O registro de recorde continua medindo devoluções. Estas regras substituem a descrição anterior de sequência encerrada no primeiro erro e oponente infalível.

## Orientação na lateral, mantendo a partida atual

A lateral acompanha o estado da partida com dicas curtas: seu saque, saque do oponente, recepção e momento de rebatida. A opção “Primeira vez? Veja os 4 passos” explica posicionamento, destino, golpe e efeito. As orientações ficam ao lado do tabuleiro; o lembrete do rodapé foi removido. Não há um modo tutorial separado: as dicas não alteram velocidade, nove destinos, efeitos, pontuação ou controles.

## Adversário e ritmo dos pontos

Escolha Fácil, Médio ou Difícil antes de iniciar. A dificuldade fica fixa durante a partida e controla o atraso de reação, a velocidade de deslocamento e a antecipação do adversário. Ele acompanha a posição observada da bola com antecipação parcial, em vez de receber imediatamente o destino exato. A velocidade da bola e os controles do jogador permanecem iguais entre dificuldades.

Um ponto exibe vencedor e motivo por 1,8 segundo, congelando a troca antes do próximo saque ou resultado final. Pausar preserva esse intervalo. Recordes de devoluções usam novas chaves por dificuldade; os registros antigos permanecem preservados. Nove destinos, efeitos, mesa em perspectiva e orientações laterais continuam presentes.

Próxima etapa: representar quique e definir bolas fora pelo contato com a mesa; depois implementar sets e regras completas de saque. O balanceamento das dificuldades ainda precisa de testes jogando.

## Jogar no celular

A página se adapta ao celular na vertical e na horizontal. Na vertical, as dicas ficam ao lado da mesa e os controles de toque ficam num painel compacto abaixo. Arraste a raquete na parte inferior da mesa ou use a barra e os botões de movimento. Toque em 1–9 para escolher destino; Golpear rebate sem efeito e os botões ↖/↗ acrescentam curva. A área de gesto continua disponível.

O pacote `Ping-Pong-celular.zip` contém os arquivos necessários. Extraia todos na mesma pasta. Se o navegador do celular permitir abrir HTML local, abra `index.html`; alguns aplicativos de arquivos mostram apenas uma prévia que não executa JavaScript. Para acesso confiável por link, será necessário hospedar a pasta ou servi-la no computador e conectar os dois dispositivos na mesma rede. Esta entrega não publica o jogo na internet.

O layout e a lógica de toque foram preparados, mas ainda precisam ser conferidos em um aparelho físico.

## Personagens

`img/atletas-sprites.png` é uma folha de seis poses criada a partir de `posicao2.png` como referência: jogador azul de costas e adversário vermelho de frente, cada um com espera e dois golpes laterais. Os personagens ficam fora das bordas da mesa; um pequeno marcador mantém visível o ponto de contato usado pelos controles. Golpes acionam a pose por 0,38 segundo, depois retornam à espera. As raquetes desenhadas continuam como alternativa se a imagem não carregar. As imagens originais foram preservadas. O pacote de celular inclui a pasta img.

## Quique e bola fora

A bola agora cruza a rede, quica no lado de quem recebe e sobe para a rebatida. Um anel destaca o contato com a mesa. O local de quique define bola fora: cair além das bordas laterais concede ponto ao outro jogador. Uma trajetória que sai pela lateral durante o voo e retorna para quicar dentro continua válida.

Os nove destinos numerados permanecem dentro da mesa. No gesto de celular, deslocamento lateral excessivo pode selecionar uma chegada fora, sem limitar o golpe às nove posições. A curva continua preservando a chegada escolhida. Personagens, controles, dificuldades e pausas entre pontos foram mantidos.

Esta etapa é uma aproximação de jogo: ainda há um único quique por trajetória, inclusive no saque. O saque com um quique em cada lado e os sets serão tratados na próxima etapa. Não há simulação completa de rotação física da bola.

## Sets e saques

Antes de iniciar, escolha “3 sets” ou “Rápida”. Na partida em sets, cada set vai a 11 pontos com dois de vantagem; vence quem ganhar dois sets. Na rápida, são cinco pontos com dois de vantagem, sem sets. O placar separa pontos do set e sets vencidos.

O sacador troca a cada dois pontos. Nos sets, após ambos chegarem a dez, a troca ocorre a cada ponto. O jogador inicia o primeiro set; o oponente inicia o segundo; o jogador inicia o terceiro. Há intervalo de três segundos após um set. Pontos e posições reiniciam no próximo set; o total de devoluções continua acumulado.

O saque quica primeiro no lado do sacador e depois no lado de quem recebe, com indicação visual em ambos os contatos. Golpes normais continuam com um quique no lado adversário. Bola fora é avaliada no contato com a mesa. Não há ainda detecção de saque tocando a rede (let), troca visual dos lados ou simulação física completa.

Recordes desta versão ficam separados por formato e dificuldade, sem remover registros anteriores. O pacote para celular foi atualizado com estas regras.

## Seleção de personagens

A lateral oferece Alex e Rafa (homens), Lia e Maya (mulheres), com opções de pele clara e negra. Cada personagem tem seis poses, com visão de costas para o jogador e de frente para o adversário. É possível escolher ambos ou deixar o adversário aleatório, sorteado entre os outros três personagens a cada partida. As escolhas são salvas localmente quando o navegador permite.

O seletor recolhe ao começar a partida e fica bloqueado até o resultado final. A mudança é visual: todos usam as mesmas regras e habilidades. Os uniformes permanecem azul para o jogador e vermelho para o adversário nesta etapa; seleção de cores será a próxima evolução. As imagens originais e o personagem anterior foram preservados, e o pacote de celular inclui as novas folhas de poses.

## Cores dos uniformes

Cada personagem agora permite escolher azul, vermelho, verde ou roxo para a camisa. A prévia acompanha a seleção; as cores são salvas junto aos personagens e ficam fixas durante a partida. Os shorts são azul-marinho em todas as opções; pele, cabelo, raquetes e habilidades não dependem da cor escolhida.

Os dois lados podem usar a mesma cor; nesse caso, a seleção mostra um aviso. As folhas `img/*-uniforms.png` contêm as seis poses em quatro cores, com transparência. As folhas anteriores foram preservadas como alternativa caso um arquivo novo não carregue. A seleção de cores é compatível com adversário aleatório e foi incluída no pacote de celular.

## Correção de recortes dos uniformes

As folhas geradas tinham fragmentos de poses vizinhas dentro de algumas células: pés da linha anterior e raquetes laterais. `sprite-masks.js` fornece contornos individuais para as 96 poses. O desenho usa esses contornos como recorte tanto nas prévias quanto na partida, mantendo o tamanho e a posição originais. Nenhuma imagem original foi alterada. O pacote de celular inclui esse novo arquivo obrigatório.

## Sons da partida

O botão “Som” no placar liga ou silencia efeitos curtos de saque, rebatida, quique e ponto ganho/perdido. A preferência fica salva neste navegador. Os sons são sintetizados em `audio.js`, sem arquivos externos ou música contínua. O áudio é ativado por interação com o jogador, respeitando o bloqueio automático dos navegadores. Falta de suporte a áudio ou armazenamento não impede a partida. A orientação visual permanece disponível ao silenciar.

## Torcida

Pontos ganhos por você tocam palmas com um coro sintetizado semelhante a “êêê”. Bolas fora de qualquer lado tocam uma reação “uuuuh”, substituindo o som normal do ponto nesse evento. São aproximações sonoras geradas por ruído e filtros de voz, não gravações humanas. As reações duram cerca de um segundo e seguem o botão Som e sua preferência salva.

### Ajuste da torcida

As palmas agora têm seis batidas espaçadas por 250 ms, em vez de trinta batidas rápidas. O coro de “uuuuh” dura 1,5 segundo, com volume maior e filtros menos estreitos. A ajuda “Primeira vez? Veja os 4 passos” inclui botões para ouvir palmas e bola fora sem depender de provocar esses eventos na partida. O “uuuuh” continua reservado a quiques fora da mesa, não a toda bola que passa da raquete.

## Gravações de torcida

A torcida sintetizada foi substituída pelos arquivos fornecidos: `songs/aplausos.m4a` para pontos ganhos pelo jogador e `songs/uuuuuuuuuuuu.m4a` para bolas que quicam fora da mesa. A reprodução mantém a velocidade original e volume de 75%. Uma reação substitui a anterior, evitando sobreposição. Silenciar, pausar ou sair da aba interrompe as gravações. Os sons de saque, rebatida e quique continuam sintetizados.

Os botões de teste na ajuda usam as mesmas gravações da partida. A pasta songs é obrigatória e está incluída no pacote para celular. O suporte ao M4A depende do navegador utilizado.

## Resultado e ranking local

O resultado final mostra placar por set/rodada, total de devoluções, maior sequência em uma troca, erros do adversário e seus erros separados em posição, tempo e bola fora. “Jogar novamente” inicia nova partida; “Trocar personagem” abre a seleção e oferece um botão para começar com as novas escolhas.

O ranking fica à esquerda em computador e após os controles em celular. Guarda somente partidas concluídas, com até dez resultados por formato e dificuldade. Ordenação: vitória primeiro, depois total de devoluções, depois maior sequência. Cada linha identifica o personagem escolhido. São resultados locais deste navegador, não um ranking online. Se o armazenamento estiver bloqueado, o ranking funciona apenas enquanto a página estiver aberta.

`results.js` controla a apresentação e o armazenamento do ranking. O pacote para celular inclui esse novo arquivo.

## Entrada obrigatória pela seleção

A escolha de personagem agora ocupa uma tela de entrada visível em computador e celular. Na primeira visita, “Você” começa sem personagem e a partida fica bloqueada até uma escolha válida. Uniforme e adversário podem ser ajustados antes de “Entrar na mesa”. Preferências existentes continuam pré-selecionadas, mas a tela de entrada aparece para confirmação. Teclado e botões também respeitam a exigência de personagem. “Trocar personagem” no resultado retorna a essa tela.

## Desafios curtos

O painel junto ao ranking mostra três metas: dez devoluções numa partida, cinco rebatidas seguidas na mesma troca e vencer um set no modo melhor de três. Progresso reinicia a cada partida; conquistas já obtidas ficam salvas no navegador. Os desafios acompanham o jogo sem alterar regras ou conceder vantagens. O botão “Devolver reto” foi renomeado para “Mira reta”, com explicação de que apenas limpa a escolha de destino.

`challenges.js` é obrigatório e está incluído no pacote atual de celular. Um backup anterior a esta etapa foi salvo em backups.

## Ações de pausa

Ao pausar, “Continuar” preserva a partida, “Recomeçar partida” inicia do zero com as escolhas atuais (adversário aleatório é sorteado novamente), e “Desistir e sair” descarta a partida e retorna à seleção. Partidas descartadas não entram no ranking nem atualizam o recorde de devoluções. Conquistas já obtidas continuam salvas. As ações aparecem somente durante a pausa.

### Formato e dificuldade antes de jogar

Os seletores de formato (3 sets/Rápida) e dificuldade agora ficam na tela de entrada, junto aos personagens, antes de “Entrar na mesa”. Durante a partida, o placar mostra um resumo dessas escolhas. Para mudar de formato após iniciar, pause e use “Desistir e sair”; isso retorna à configuração completa. As escolhas ficam bloqueadas enquanto a partida está ativa para preservar suas regras e o ranking.

### Personagens loiros, ruivos e uniforme branco
- Léo e Nina (loiros), Caio e Íris (ruivos), disponíveis para Você e Adversário, inclusive sorteio aleatório.
- Branco acrescentado às cores dos oito personagens, com seis poses por combinação. Todos continuam com as mesmas habilidades.
- Recortes por pose excluem fragmentos dos sprites vizinhos; as folhas brancas dos personagens anteriores têm enquadramento próprio.
- Validação: sintaxe JavaScript e conferência automatizada das 240 combinações de personagem, uniforme e pose. Conferir aparência também no navegador e celular.


### Personalidade dos adversários
- Alex equilibrado; Rafa atacante; Lia estratégica; Maya defensiva; Léo imprevisível; Nina sagaz; Caio provocativo; Íris técnica.
- Descrição na escolha de personagens; adversário aleatório revela o estilo ao iniciar. Você continua controlando livremente seus golpes, sem bônus automáticos por personagem.
- Estilos alteram destinos, curvas e ritmo dos golpes do adversário. Nina acompanha movimento, Léo evita repetir destinos, Caio pode arriscar uma bola fora e provoca entre pontos.
- Dificuldade mantém reação e velocidade de deslocamento, além da chance de decisões táticas. Saques ficam dentro da mesa e com ritmo normal.
- Implementação em personalities.js. Validação automatizada: 2.400 saques válidos, padrões de ataque e defesa, variação, leitura de movimento e integração de início, saque, devolução, pausa e reinício. Equilíbrio ainda precisa ser avaliado jogando no navegador e celular.


### Torneio local
- Escolha Partida avulsa ou Torneio na preparação. Torneio sorteia três rivais distintos, excluindo seu personagem: quartas, semifinal e final.
- Regras, dificuldade, personagem e uniforme do jogador permanecem entre rodadas. Vitória revela o próximo rival; derrota elimina. Reiniciar mantém o rival da rodada; desistir descarta o torneio.
- Vencer as três rodadas salva um troféu neste navegador (até 50 registros). Recarregar a página descarta um torneio em andamento. Cada rodada concluída continua participando do ranking local.
- Verificadas automaticamente progressão, rivais distintos, reinício, eliminação, conquista e partida avulsa. Layout e equilíbrio devem ser conferidos jogando.


### Retomar torneios e galeria
- Progresso local salvo ao iniciar e avançar: rodada, rivais, personagem, uniforme, modo e dificuldade. Ao abrir novamente, Continuar torneio retoma a rodada com placar zerado.
- Começar outro descarta o progresso salvo. Derrota, título ou desistência do torneio removem o salvamento. Voltar à seleção entre rodadas permite retomá-lo mais tarde; partida avulsa não apaga esse progresso.
- Galeria mostra os troféus existentes com personagem, dificuldade, modo e data. Dados continuam locais a este navegador.
- Testadas gravação e leitura de rodada, retomada dos mesmos rivais, preservação de troféus anteriores, conclusão, derrota e validação de dados.


### Primeira revisão de equilíbrio
- Ritmo cresce com a sequência da troca atual, voltando ao inicial a cada ponto; não acelera mais por devoluções acumuladas na partida inteira.
- Nina observa velocidade com suavização baseada no tempo, consistente em 30, 60 e 120 quadros por segundo.
- Atalhos de jogo não interceptam setas e números enquanto selects e inputs recebem foco.
- Teste reproduzível: node Ping-Pong/tests/balance.cjs. Foram comparadas 72.000 devoluções e 72.000 saques dos oito personagens nas três dificuldades. Isso verifica decisões e limites, não taxas de vitória contra pessoas.
- Teste manual sugerido: partidas rápidas contra Maya, Alex, Rafa e Nina no fácil, depois no médio; repetir no celular. Anotar adversário, placar, conforto de movimentação, clareza do momento de golpear e se a velocidade parece justa. Conferir gesto, barra, botões, pausa, rotação da tela e retomada de torneio.


### Apresentação: primeira etapa
- Rebatida com inclinação e impulso visual discreto do sprite; preparação de saque com destaque dourado no marcador do sacador.
- Entrada suave de avisos de ponto e resultado; cores distintas para ponto ganho, perdido e bola fora. Vitória e título de torneio com moldura dourada; campeão recebe fundo especial.
- Preferência do sistema por movimento reduzido desativa as animações. Controles, colisões, física, ritmo e intervalos permanecem iguais.
- Sintaxe JavaScript e testes de equilíbrio aprovados. Aparência das animações precisa ser conferida no navegador e celular.


### Reações entre pontos
- Vencedor comemora com pose lateral e impulso discreto; perdedor reage com inclinação breve. Caio tem gesto mais expressivo acompanhando sua provocação.
- Reações duram 1,2 segundo dentro do intervalo existente e ficam congeladas na pausa. Preferência por movimento reduzido mantém poses estáticas.
- Campeão de torneio aparece de frente, com seu uniforme escolhido, ao lado do troféu. Exibição compacta em telas baixas.
- Sintaxe e testes de equilíbrio aprovados; conferir apresentação visual durante partidas.


### Desafios e quadras desbloqueáveis
- Verde clássica disponível desde o início. Azul arena: torneios vencidos com dois personagens distintos. Roxa noturna: dez devoluções numa mesma troca. Terracota: vencer uma partida no médio.
- Quadras escolhidas na preparação; apenas cores mudam. Progresso e escolha salvos localmente. Troféus existentes e resultados ainda presentes no ranking contam para o progresso histórico.
- Verificados limiares, personagens distintos, vitória no médio, persistência e reaproveitamento de resultados.

