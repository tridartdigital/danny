# Danny: Ecos da Reforma — edição ilustrada 0.2

Capítulo jogável de terror e investigação em português. Danny explora Santa Névoa, recupera três selos tributários e enfrenta uma presença que recua diante da lanterna.

## Jogar sem instalar

Abra `dist/danny.html` no navegador. Esse arquivo de aproximadamente 5 MB inclui código, cenários, personagem e fontes. Não depende de conexão ou servidor. Depois de atualizar o projeto, gere uma nova cópia com `npm run build`.

O arquivo independente é testado no Chromium após carregamento HTTP, bloqueando requisições adicionais e desativando a rede. A política do navegador neste ambiente impede validar diretamente URLs `file://`. O progresso depende do armazenamento local permitido pelo navegador.

## Executar o projeto

Requer Node.js 20 ou superior, validado com Node 24. Não há dependências de produção.

```sh
cd /workspace/danny
npm start
```

O servidor escuta em `0.0.0.0:3000` ou na porta configurada por `PORT`. A aplicação de desenvolvimento não exige compilação. O build apenas empacota a versão independente.

## Controles

- A/D ou setas: andar; E: interagir; F: lanterna; I ou J: evidências; Esc: pausar/fechar.
- Em dispositivos móveis, use os controles na tela; também existem controles de toque no modo de tela cheia.
- Use o botão Tela cheia para ampliar o jogo. O áudio é opcional e ativado no cabeçalho.
- Leia a carta na estrada e vá à direita. Investigue Arquivo Municipal, Câmara dos Ecos e Posto da Última Luz.
- Os documentos contêm as respostas aos enigmas de CBS, IBS e IS.
- Abra o inventário para examinar novamente uma evidência recuperada.
- Encare a presença com a lanterna acesa para afastá-la. Ao perder a lucidez, Danny volta à entrada conservando os registros.
- Com os três selos, use a saída à direita do último local.
- O progresso anterior continua compatível e fica em `localStorage`, na chave `danny-ecos-v1`.

## Direção de arte

A versão 0.2 substitui a arte geométrica por quatro cenários ilustrados originais e uma personagem detalhada com quatro quadros de caminhada. As imagens foram geradas para este projeto; não foram extraídas de Silver Pines ou das capturas de referência.

- `assets/art/scenes.png`: atlas 2×2 de exterior, arquivo, registro e posto. Cada cenário é recortado em tempo de execução.
- `assets/art/danny.png`: folha transparente com quatro poses laterais. O renderizador detecta as margens transparentes e mantém escala e linha do chão comuns.
- `src/renderer.js`: composição em Canvas 1280×720, luz da lanterna, sombras de contato, chuva, partículas, névoa, silhuetas de primeiro plano e presença.
- Câmera móvel acompanha Danny. O inventário apresenta evidências em uma grade e a inspeção usa uma folha de papel envelhecida.
- Fontes locais sob OFL; licenças em `assets/fonts`. Nenhuma requisição externa durante o jogo.

É um capítulo piloto com quatro locais e final, não um jogo comercial completo. Os cenários usam pinturas estáticas com efeitos sobrepostos; a personagem usa animação por quadros, não um esqueleto 3D.

## Validação

```sh
npm ci
npm test
npm run build
npm run test:browser
```

A dependência de desenvolvimento Playwright é usada apenas na validação de navegador. O teste usa `/usr/bin/chromium` quando disponível; também aceita `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Em outra máquina, instale o navegador com `npx playwright install chromium`.

`npm run test:browser` inicia e encerra seu próprio servidor na porta 3197 (alterável com `TEST_PORT`). Verifica a jornada completa, resposta incorreta e nova tentativa, inventário, inspeção, final, salvamento, áudio, lanterna, pausa, tela cheia, controles móveis e versão independente. Capturas ficam em `test-results/` (ignorado pelo Git).

## Conteúdo tributário

Ficção educativa sobre as linhas gerais da EC 132/2023 e da LC 214/2025. Simplifica conceitos, não calcula tributos e não substitui legislação atualizada ou orientação profissional. O ano de 2026 é apresentado como fase de testes; a transição do consumo se estende até 2033.
