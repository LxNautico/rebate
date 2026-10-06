# Histórias dos personagens — proposta para revisão

Estas biografias ficcionais foram aprovadas e implementadas em cards. Idades, alturas, famílias e títulos fazem parte da narrativa. País de origem é parte da história; a bandeira representada na Copa continua sendo escolha do jogador. Títulos biográficos não contam como troféus conquistados no jogo.

## Alex — o equilíbrio aprendido

**Ficha:** 28 anos; 1,80 m; brasileiro; estilo equilibrado. Dois títulos regionais na história.

**Vida pessoal:** casado com Helena, pai de Bia, de cinco anos. Gosta de cozinhar e consertar bicicletas. Foi o irmão mais velho que o apresentou às quadras do bairro.

**Trajetória:** tentava vencer todo ponto com força. Depois de uma derrota importante, aprendeu a esperar a oportunidade certa. Hoje ajuda iniciantes a encontrar seu ritmo.

**Final proposto:** Alex chega a um almoço de família com o troféu. Bia coloca uma medalha feita de papel no pescoço dele. Ele sorri: “Essa vai ficar junto das outras.”

## Rafa — velocidade com propósito

**Ficha:** 25 anos; 1,85 m; brasileiro; atacante. Um título estadual na história.

**Vida pessoal:** solteiro, sem filhos. Mora perto da mãe, Sônia, que acompanha seus jogos. Gosta de correr e tocar percussão com os amigos.

**Trajetória:** começou usando uma raquete emprestada. Sua velocidade chamou atenção, mas ele precisou aprender que atacar também exige escolher o momento.

**Final proposto:** Rafa entrega o troféu à mãe na arquibancada. Mais tarde, comemora tocando com os amigos; o troféu repousa ao lado do instrumento.

## Lia — cada ponto conta uma ideia

**Ficha:** 30 anos; 1,70 m; portuguesa; estrategista. Três títulos de clubes na história.

**Vida pessoal:** casada com Miguel, sem filhos. Gosta de xadrez e jardinagem. Aprendeu a observar jogadas acompanhando o avô, António.

**Trajetória:** era subestimada por não depender da força. Transformou leitura de jogo e mudanças de direção em sua assinatura. Ainda guarda um caderno com os primeiros esquemas.

**Final proposto:** Lia encontra o avô em um jardim, coloca o troféu ao lado de um tabuleiro de xadrez e senta para jogar. Ele diz: “Agora me mostra a próxima ideia.”

## Maya — ninguém vence sozinho

**Ficha:** 29 anos; 1,76 m; brasileira; defensora. Dois títulos municipais na história.

**Vida pessoal:** casada com André, mãe de Lucas, de sete anos. Gosta de caminhar e cuidar de uma horta comunitária.

**Trajetória:** começou a treinar em horários curtos entre trabalho e família. Sua persistência virou habilidade: chega a bolas que parecem perdidas e faz o rival tentar mais uma vez.

**Final proposto:** Maya ajoelha para abraçar Lucas ao lado do troféu. A cena muda para a horta, onde a família planta uma muda para marcar a conquista.

## Léo — coragem para experimentar

**Ficha:** 23 anos; 1,82 m; brasileiro; imprevisível. Um título universitário na história.

**Vida pessoal:** solteiro, sem filhos. Gosta de fotografia e de explorar trilhas. Tem uma irmã mais nova, Luiza, que costuma filmar suas tentativas de jogadas novas.

**Trajetória:** passou muito tempo tentando copiar atletas famosos. Encontrou seu estilo quando começou a misturar movimentos e aceitar que algumas experiências dariam errado.

**Final proposto:** Léo e Luiza observam o pôr do sol de um mirante. Ele fotografa o troféu; ela vira a câmera para registrar os dois rindo de uma foto que saiu torta.

## Nina — enxergar antes de correr

**Ficha:** 26 anos; 1,68 m; brasileira; sagaz. Dois títulos de circuitos locais na história.

**Vida pessoal:** solteira, sem filhos. Gosta de quebra-cabeças e de desenhar. Sua tia, Rosa, foi a primeira pessoa a incentivá-la a competir.

**Trajetória:** treinava observando os pés e a postura dos rivais. Aprendeu a antecipar possibilidades, mas também a mudar de plano quando a bola surpreende.

**Final proposto:** Nina visita a tia e entrega um desenho das duas na primeira quadra. Elas colocam o desenho ao lado do novo troféu e escolhem um quebra-cabeça para montar.

## Caio — alegria também é estratégia

**Ficha:** 27 anos; 1,79 m; brasileiro; provocativo. Um título de circuito regional na história.

**Vida pessoal:** solteiro, sem filhos. Gosta de dançar e organizar encontros com os amigos. É próximo da avó, Celina, que sempre o lembra de respeitar os adversários.

**Trajetória:** seus gestos e ousadia atraíam a torcida, mas já custaram partidas. Aprendeu a provocar com humor e comemorar sem diminuir ninguém.

**Final proposto:** Caio começa sua comemoração diante da torcida. A avó entra na cena e o convida para dançar. Ele deixa o troféu de lado para acompanhá-la; os amigos aplaudem.

## Íris — precisão construída com paciência

**Ficha:** 24 anos; 1,72 m; brasileira; técnica. Um título de duplas na história.

**Vida pessoal:** solteira, sem filhos. Gosta de música e dança. Mantém amizade com Joana, sua primeira parceira de duplas.

**Trajetória:** repetia os fundamentos até parecerem naturais. Uma derrota por excesso de cautela ensinou que técnica também serve para arriscar com confiança.

**Final proposto:** Íris e Joana voltam à primeira quadra. Colocam o troféu no banco e trocam algumas bolas antes de terminar a tarde com uma pequena dança de comemoração.

## Cards implementados

- Card 1: ficha técnica na primeira passagem.
- Card 2: vida pessoal na passagem seguinte.
- Card 3: trajetória na próxima passagem.
- Final exclusivo: conquista de torneio ou Copa, junto do troféu.
- Gatilhos: vitória de set e avanço entre partidas; partidas rápidas também avançam a sequência entre rodadas.
- Botões Continuar e Pular; o jogo aguarda a leitura, sem bola em movimento.
- Evitar repetir cards já vistos; galeria permite reler. Definir depois se a preferência de pular vale só para aquela sessão.
- Começar com texto e sprites existentes; ilustrações e cenas animadas podem ser produzidas depois que as histórias forem aprovadas.

## Apresentação automática implementada

A página abre diretamente na apresentação. Jogar abre a seleção; fechar com X, sem partida ativa, retorna às trocas entre Alex/Rafa, Lia/Maya, Léo/Nina e Caio/Íris. Os pares alternam a cada oito segundos. Usa animação do próprio jogo, sem vídeo ou som automático. Jogar abre a seleção e iniciar uma partida encerra a apresentação. Pausa e resultado não são substituídos pela demonstração. Preferência por movimento reduzido mostra uma cena estática. A apresentação não altera pontuação, conquistas, salvamentos ou energia.

Os capítulos são exibidos em ordem após vitórias de sets e partidas, até os três capítulos por personagem. Continuar e Pular registram a passagem como vista; a galeria permite reler. O jogo aguarda a leitura e prepara o próximo saque somente depois de fechar o card. O final narrado aparece junto do troféu, ao conquistar torneio ou Copa. A galeria também oferece acesso aos finais, inclusive antes de conquistá-los. Não há preferência permanente para pular toda a história nesta versão.

Teste: `node tests/stories.cjs`.

A apresentação também alterna as quatro quadras e as cinco cores de uniforme, com cores diferentes para os dois atletas. Exibe inclusive quadras ainda bloqueadas como prévia; isso não as desbloqueia nem modifica as escolhas da partida.

## Finais visuais implementados

As oito cenas ilustradas usam os sprites do atleta e desenhos leves de cenários, familiares e objetos. Aparecem junto ao troféu e na galeria ao abrir Final. O texto completo permanece disponível. Os cenários representam as histórias; parentes são figuras ilustradas, sem novos retratos realistas. Animações repetem pequenos movimentos e respeitam a preferência de movimento reduzido com uma composição estática. Não há vídeo, áudio automático, novo resultado ou alteração das conquistas.

Teste: `node tests/endings.cjs`, com oito cenas, cinco uniformes, seis momentos e movimento reduzido.
