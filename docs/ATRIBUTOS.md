# Atributos e evolução

Força, Agilidade e Técnica são valores de 0 a 100, mostrados fora da quadra nas duas extremidades. A seleção também informa os valores. Perfis iniciais somam 180 pontos: Alex 60/60/60; Rafa 80/55/45; Lia 45/55/80; Maya 45/70/65; Léo 60/75/45; Nina 45/80/55; Caio 75/60/45; Íris 35/60/85.

Força multiplica a velocidade normal do golpe por 0,8 + 0,4 × valor/100. Agilidade multiplica a velocidade de deslocamento por 0,85 + 0,3 × valor/100. Técnica ajusta curvas comuns e a tolerância lateral de contato, de 0,065 a 0,085 da largura lógica da mesa. Poderes mantêm suas trajetórias próprias; força também influencia sua velocidade. Saques não recebem bônus. Estilos táticos do adversário permanecem.

No celular, tocar na própria metade indica o destino; o atleta corre até ele com sua agilidade. Teclado cancela o destino de toque ao mover lateralmente. As barras acompanham o lado escolhido e permanecem fixas durante a partida.

Cada devolução rende 1 XP de força; defender bola que cruzou mais de 30% da largura rende 2 XP de agilidade; usar curva ou alcançar sequência de três rende 1 XP de técnica. Cada atributo ganha no máximo 10 XP por partida concluída, vencendo ou perdendo. A cada 40 XP, sobe um ponto, até 15 pontos adicionais por atributo. Ganhos são salvos por personagem no navegador e passam a valer na próxima partida. O resultado informa XP, progresso e antes/depois. Desistir e reiniciar não concedem a experiência descartada.

O adversário usa o perfil inicial do personagem, ajustado pela dificuldade e seu estilo; sua evolução local não fortalece os rivais. Copa e torneio usam os novos valores na rodada seguinte. Rankings existentes são preservados; esta mudança de física significa que resultados antigos não representam exatamente o mesmo balanceamento.

Validação: `node tests/attributes.cjs`, além dos testes de Arena, poderes, histórias e Copa. Avaliar principalmente a resposta do toque no celular e os valores de balanceamento antes de consolidar a versão estável.
