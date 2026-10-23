# Portfólio

Next.js 16 (App Router) · React 19 · GSAP 3 · CSS Modules.

```bash
npm run dev     # http://localhost:3000
npm run build
```

---

## Onde mexer

| Quero mudar | Arquivo |
| --- | --- |
| A hero: artboards, posições, a ronda do cursor | [src/components/CanvasHero/CanvasHero.tsx](src/components/CanvasHero/CanvasHero.tsx) |
| Peças, textos e ordem das seções de trabalho | [src/data/folders.ts](src/data/folders.ts) |
| A seção "Sobre mim", faixa de serviços e contatos | [src/data/about.ts](src/data/about.ts) |
| Ritmo das animações | [src/lib/motion.ts](src/lib/motion.ts) |
| As grades das seções | [src/components/WorkGrid/](src/components/WorkGrid/) |
| Cores e tipografia | [src/app/globals.css](src/app/globals.css) |

---

## A página

```
hero          o canvas: as peças como artboards, o nome como camada de texto
faixa         os serviços que não viram peça
01 Sobre      quem escreve isso aqui
02 Marcas     ┐
03 Conteúdo   │ uma seção por tipo de trabalho, com todas as peças
04 Sites      ┘
```

### A hero é um canvas de ferramenta de design

As peças reais estão espalhadas como artboards, cada uma com o nome de frame em
cima ("Lavaê / Manual de marca"). Um cursor com a etiqueta "Eduardo" passa de
uma para outra: seleciona, mostra a medida do arquivo, dá um puxão no artboard
e segue, como alguém trabalhando no arquivo ao vivo. O nome dele é a camada de
texto do frame "Início", fixo por cima, e entra sendo selecionado.

Quem visita pode arrastar o canvas (no toque, só de lado: o vertical continua
sendo da página) e clicar num artboard, que leva à seção daquele trabalho.

Para trocar uma peça ou a posição dela, edite `ARTBOARDS`. As coordenadas são
em unidades do quadro, pensadas para um desktop de 1440×836; o quadro inteiro é
escalado para caber em cada tela, e rótulos, bordas e o cursor dividem pela
escala para manter o tamanho na tela. `RONDA` é a ordem em que o cursor passa.

Três camadas, cada uma com um dono, para nada brigar pelo mesmo `transform`:

```
.viewport     recorta e recebe o arraste
  .pan        deslocamento do arraste
    .drift    a respiração lenta do GSAP
      .board  encaixe na tela (escala e posição)
```

Fora da tela a ronda pausa. Com `prefers-reduced-motion`, nada se move: um
artboard fica selecionado com o cursor parado em cima.

### O visualizador

**Clicar num card das seções abre o [Viewer](src/components/Viewer/Viewer.tsx)**,
uma casca para três fontes: o manual, o artigo de um caso sem tela, e o site
dentro de uma moldura de navegador.

O manual é um leitor de imagens, não de PDF, e rola em vez de paginar: ninguém
lê um manual de marca do começo ao fim, escaneia. Só o que está perto da
viewport é baixado.

O site entra num `<iframe>`. Alguns servidores recusam ser embutidos e não há
como detectar isso de fora, por isso o link de abrir em nova aba fica sempre
visível. Um site só vira clicável com `status: "live"` e uma `url` em
[folders.ts](src/data/folders.ts).

---

## Assets

| Arquivo | O que é |
| --- | --- |
| `public/media/og.jpg` | Imagem de compartilhamento, capturada da própria hero em 1200×630. |
| `public/marcas/<slug>/capa.webp` | Capa de cada marca, 1400px, 16:9. |
| `public/marcas/<slug>/paginas/NNN.webp` | As páginas do manual, rasterizadas. Numeradas a partir de `001`. |
| `public/conteudo/`, `public/sites/` | Peças, reels com poster, e capturas dos sites. |

### Os manuais não são servidos como PDF

Os seis PDFs somavam **261 MB**. Cada um foi rasterizado em páginas WebP de
1500px, **6 MB no lugar de 261**, e o leitor carrega só a página na tela e a
seguinte. O arquivo original nunca chega ao navegador.

A rasterização roda o pdf.js dentro do Chrome headless. Sem apontar `wasmUrl`,
`cMapUrl` e `standardFontDataUrl`, ele falha em silêncio em JPEG2000 e em cores
ICC/CMYK e devolve página em branco; por isso o script mede o contraste de cada
página e acusa as que saírem chapadas.

### As capas

Vieram como PNG de 3840px e saem em WebP com o `sharp` que já vem com o Next:

```bash
npx sharp-cli -i original.png -o capa.webp resize 1400 -- webp -q 82
```
