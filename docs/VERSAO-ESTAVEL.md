# Versão estável local — 2026-10-04

Projeto independente. A integração ao Queima-Queima fica adiada. O nome Ping-Pong permanece provisório.

## Funcionalidades prontas

- Mesa em perspectiva vertical, três raias visuais, nove destinos e movimento lateral contínuo.
- Golpes manuais, curvas laterais, faltas por bola fora e saques alternados.
- Partida rápida até cinco ou melhor de três sets até onze, sempre com dois pontos de vantagem.
- Oito personagens, cinco uniformes, estilos próprios dos adversários e três dificuldades.
- Teclado, botões, barra e gestos para celular; pausa, reinício e desistência.
- Sons, orientação contextual, reações entre pontos e apresentação do campeão.
- Ranking local, desafios, torneio de três rodadas, retomada por rodada e galeria de troféus.
- Quatro cores de quadra, três desbloqueadas por conquistas.

## Validação e limites

O usuário validou jogabilidade, torneio e apresentação durante o desenvolvimento. Testes automatizados de decisões cobrem 72.000 devoluções e 72.000 saques, além de leitura de movimento em 30, 60 e 120 FPS. Essas verificações não substituem testes visuais em diferentes navegadores e aparelhos nem medem taxas de vitória humanas.

- Dados são locais ao navegador e origem. Outro aparelho ou endereço não compartilha progresso; limpar dados pode apagá-lo.
- Retomar um torneio reinicia a rodada com placar zerado, sem restaurar uma bola em andamento.
- Até cinquenta troféus são mantidos; ranking conserva dez resultados por categoria.
- Efeitos são curvas de uma simulação arcade, sem rotação física completa.
- Não há multiplayer, contas ou sincronização online. Recompensas mudam somente cores.
- Sons dependem da interação inicial e das permissões do navegador.

## Distribuição

Use `Ping-Pong-celular-ranking.zip`, extraindo todo o conteúdo junto. O antigo `Ping-Pong-celular.zip` não representa a versão atual.

Backup em `backups/Ping-Pong-estavel-*.zip`, criado antes da revisão documental. Inclui código, assets, testes e referências originais; exclui outros ZIPs e a pasta de backups. O pacote de distribuição contém o jogo e documentação atualizada; vídeo e rascunho ficam no projeto e no backup.

## Próximas decisões

Escolher nome e identidade próprios; continuar coletando observações de jogadores; avaliar novos desafios e cosméticos. Nenhuma integração ao Queima-Queima nesta etapa.
