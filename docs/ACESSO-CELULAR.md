# Versão celular e acesso por link

O jogo é estático: não precisa de servidor de banco de dados ou instalação de dependências. O pacote atual é `Ping-Pong-celular-ranking.zip`.

## Publicar

Extraia o pacote e publique seu conteúdo em uma hospedagem de páginas estáticas. `index.html` deve ficar na raiz do endereço publicado, junto dos arquivos JavaScript, CSS, `img/` e `songs/`. Preserve nomes e caminhos; enviar apenas index.html não funciona.

Abra o endereço publicado no navegador do celular. A hospedagem e o endereço público ainda precisam ser definidos; nenhum link público foi criado nesta etapa.

## Conferir no aparelho

- Escolha personagens, regras e dificuldade; feche a seleção e reabra pelo botão amarelo Jogar.
- Confira barra de posição, movimento por botões, destinos, golpe e gesto diagonal.
- Teste som após tocar na tela, pausa ao trocar de aplicativo, orientação vertical e horizontal.
- Confira comemorações, troféus e retomada do torneio após recarregar.

Progresso fica no navegador e no endereço utilizado. Dados do jogo aberto como arquivo local ou em outro endereço não aparecem automaticamente no link publicado.

## Escolher o lado

Na preparação, escolha Embaixo (↑) ou Em cima (↓). No lado superior, deslize para baixo para golpear e arraste a região superior da mesa para se posicionar. Esquerda e direita continuam seguindo os lados da tela; destinos 1–9 também seguem da esquerda para direita. O torneio preserva o lado escolhido. Regras e pontuação não mudam.

## GitHub Pages

1. Crie um repositório para o jogo e envie os arquivos extraídos do pacote, com index.html na raiz. Não envie backups nem ZIPs para esse repositório de distribuição.
2. Abra Settings → Pages → Build and deployment → Source: Deploy from a branch.
3. Selecione a branch main e a pasta / (root); salve.
4. Aguarde a publicação e abra o endereço exibido na página Pages no celular.

O arquivo .nojekyll acompanha o pacote. Nenhum repositório foi criado ou publicado automaticamente.

Referência: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
