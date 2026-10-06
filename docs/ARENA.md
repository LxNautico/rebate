# Rebate! Arena

Escolha a modalidade Clássico ou Arena antes de iniciar uma partida avulsa, torneio ou Copa Mundial. Competições guardam a escolha ao avançar e retomar; partidas salvas antigas usam Clássico.

Na Arena, cada devolução carrega 20 de energia, até 100. A energia permanece entre pontos e sets, mas reinicia em cada partida. Com a barra cheia, pressione Espaço ou toque em Golpe especial durante a troca. A próxima devolução bem executada acelera a bola em 35%, com bola e rastro laranja. Ativar novamente cancela a preparação sem gastar energia. Não funciona no saque. Após um ponto, é preciso ativar novamente; a energia permanece.

O adversário também carrega energia e usa o especial automaticamente ao completar cinco devoluções. Posicionamento, direção e curva continuam necessários. A habilidade não rebate automaticamente.

Rankings e recordes separam Clássico e Arena, preservando resultados antigos no Clássico. Esta primeira versão contém o especial de velocidade; poderes por personagem ficam para uma próxima etapa.

Validação: `node tests/arena.cjs`. Os testes usam interface simulada; conferir aparência e controles no computador e celular.

No celular, o botão especial fica imediatamente abaixo dos controles de golpe, dentro do mesmo painel. As barras compactas aparecem depois do botão, antes do ranking.

## Chuva de bolas

Escolha Chuva de bolas no painel, carregue 100 de energia, ative o botão amarelo ou Espaço e acerte uma devolução. A escolha fica travada enquanto o golpe estiver preparado. O especial de velocidade continua disponível; nesta versão o adversário usa apenas velocidade.

A troca normal é suspensa durante a disputa de cinco segundos. Várias bolas amarelas seguem ao rival. Dois personagens auxiliares entram correndo e defendem junto com ele; as bolas devolvidas para você são azuis. Use posicionamento e golpes normais, incluindo destino e curva. Cada golpe devolve uma bola; não há defesa automática. As faixas azuis mostram os destinos das recepções.

Ao final, bolas ainda em trânsito são descartadas sem contar como erro. Compara-se a proporção de bolas defendidas sobre oportunidades concluídas de cada lado. Empate favorece quem ativou (você). O resultado vale um único ponto normal, podendo encerrar set ou partida. Os auxiliares saem em uma animação de 0,6 segundo antes da contagem do ponto; não há novas bolas nesse intervalo.

A energia é consumida ao começar; a Chuva não recarrega energia durante si mesma. Devoluções contam para estatísticas e desafios da Arena. Pausar congela o cronômetro; reiniciar ou desistir remove as bolas e auxiliares. Funciona nos dois lados da mesa, em partida, torneio e Copa.

Teste adicional: `node tests/rain.cjs` cobre ativação, auxiliares, devoluções, ponto único, empate, pausa, reinício, desistência, lados e simulação a 30/60/120 FPS. Conferir aparência e dificuldade no celular.

## Ritmo da Chuva por dificuldade

Fácil: novas bolas a cada 0,55 s, limite de cinco em circulação e velocidade 0,85. Médio: 0,45 s, seis bolas e velocidade 1. Difícil: 0,40 s, sete bolas e velocidade 1,10. A disputa permanece com cinco segundos em todos os níveis. Uma bola sua enviada para fora conta como erro seu; perder uma devolução interrompe a sequência dos desafios.
