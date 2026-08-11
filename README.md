# Portfólio — pastas interativas

Next.js 16 (App Router) · React 19 · GSAP 3 · CSS Modules.

```bash
npm run dev     # http://localhost:3000
npm run build
```

---

## Trocar o still pelo vídeo (e voltar)

Uma linha, em [src/config/character.ts](src/config/character.ts):

```ts
mode: "video",   // ou "image"
```

Nada mais muda. Cena, timeline, geometria e responsividade são idênticas nos
dois modos porque os dois renderizam a mesma caixa (`.media`). O modo `image`
sem `image.src` cai num placeholder vetorial embutido, então a fase 1 é
navegável antes de existir qualquer asset.

O mesmo arquivo controla enquadramento (`fit`, `objectPosition`), escala de
repouso e o feather das bordas.

---

## Onde mexer

| Quero mudar | Arquivo |
| --- | --- |
| Pastas, peças, textos dos painéis e das seções | [src/data/folders.ts](src/data/folders.ts) |
| A seção "Sobre mim" | [src/data/about.ts](src/data/about.ts) |
| O loop que roda dentro de cada pasta | `preview` em [src/data/folders.ts](src/data/folders.ts) |
| Os glifos das pastas | [src/components/FolderIcon/FolderIcon.tsx](src/components/FolderIcon/FolderIcon.tsx) |
| Ritmo das animações | [src/lib/motion.ts](src/lib/motion.ts) |
| A timeline de abrir/fechar | [src/components/Scene/Scene.tsx](src/components/Scene/Scene.tsx) |
| A pilha jogada dentro do painel | [src/components/PanelTeaser/](src/components/PanelTeaser/) |
| As grades das seções | [src/components/WorkGrid/](src/components/WorkGrid/) |
| Desenho e material da pasta | [src/components/Folder/Folder.module.css](src/components/Folder/Folder.module.css) |
| Cores e tipografia | [src/app/globals.css](src/app/globals.css) |

Cada pasta traz um par de coordenadas `desktop` e `mobile` — fileira de quatro
no desktop, grade 2×2 no celular. O CSS troca entre eles no breakpoint; não há
JS de layout nem listener de resize envolvido.

Marcar uma pasta com `comingSoon: true` faz ela recusar a abertura com um
tranco, em vez de abrir um painel vazio.

---

## A página

```
hero          o vídeo, as quatro pastas, e o painel que uma pasta abre
faixa         os serviços que não viram pasta
01 Sobre      quem escreve isso aqui
02 Marcas     ┐
03 Conteúdo   │ uma seção por pasta, com todas as peças
04 Sites      │
05 IA         ┘
```

Três pastas espelham as pernas da narrativa — identidade, UI/UX e IA — e a
quarta, Conteúdo, é a produção que sustenta as outras. São quatro porque a
fileira do desktop e a grade 2×2 do celular são desenhadas para esse número:
cinco quebraria as duas.

**Clicar numa pasta abre um painel; o painel é um convite, não o acervo.**
Ele mostra até cinco peças jogadas sobre a mesa (três no retrato — cinco reels
9:16 não cabem em 390px) e um botão *Explorar*, que fecha o painel revertendo a
mesma timeline e leva para a seção completa.

A bagunça fica só no teaser. A seção usa grade alinhada, porque a pilha existe
para chamar e o arquivo existe para comparar: o ângulo que convida em cinco
peças vira ruído em vinte.

Cada item tem o asset opcional. Sem ele, o layout desenha um placeholder no
lugar e na proporção certos — dá para avaliar composição e ritmo antes de os
arquivos existirem. Caminhos são locais, servidos de `public/`.

**Clicar num card abre o [Viewer](src/components/Viewer/Viewer.tsx)** — uma
casca, três fontes. Nas marcas ele lê o manual; nos casos de IA sem tela, o
artigo; nos sites, o próprio site dentro de uma moldura de navegador.

O manual é um leitor de imagens, não de PDF, e rola em vez de paginar:
ninguém lê um manual de marca do começo ao fim, escaneia — e no celular
deslizar é o que a mão já ia fazer. Cada página é uma caixa de proporção fixa,
então a barra de rolagem nasce no tamanho certo e nada salta enquanto as
imagens chegam. Só o que está perto da viewport é baixado: abrir um manual de
16 páginas e rolar até a metade custou 274 KB.

Caso de IA sem tela abre em **artigo** — o problema, o que foi feito, e o
número que mudou. Automação boa é invisível por definição; o que sobra para
mostrar é a história.

O site entra num `<iframe>`. Alguns servidores recusam ser embutidos
(`X-Frame-Options`, `frame-ancestors`) e não há como detectar isso de fora — um
iframe bloqueado dispara `load` igual. Por isso o link de abrir em nova aba
fica sempre visível ali: para site, sair da página é ação normal, ao contrário
de sair de um manual. Em tela de toque o iframe não embute bem, e o
visualizador entrega a capa e um botão em vez de fingir que embutiu.

Um site só vira clicável com `status: "live"` e uma `url` em
[folders.ts](src/data/folders.ts). Enquanto estiver `"wip"`, o card aparece com
o selo "Em construção" e não leva a lugar nenhum.

**As seções não têm CTA.** A seção da pasta já é o acervo completo; um botão
"ver tudo" apontando para a própria tela em que a pessoa está é ruído. As
pastas mostram amostra, as seções mostram tudo — não há terceiro destino.

---

## Como está montado

**Uma camada, um dono.** Nenhum elemento recebe `transform` de duas fontes,
então idle, hover, press e parallax nunca se sobrescrevem:

```
.root         posição (a Scene usa no recuo das irmãs)
  .parallax   deslocamento pelo ponteiro, via CSS var
    .drift    idle do GSAP
      .press  feedback de toque
        .surface  hover (levanta + escala) + o botão
```

**O idle** são osciladores de período diferente somados; o offset por pasta
impede que elas respirem em uníssono.

**Uma entrada só, dois gatilhos.** Card entra com `translateY 20px + opacity`
em `power3.out 0.5s`, escalonado por `stagger.amount` e não `each` — a duração
total é fixa, então a pasta de 3 peças e a de 9 assentam no mesmo tempo. No
painel o gatilho é o clique; na seção é o ScrollTrigger. Os números moram em
`REVEAL`, em [src/lib/motion.ts](src/lib/motion.ts).

**O loop só roda no hover.** Em repouso a pasta é branca e o vídeo está
pausado e invisível — quatro vídeos tocando ao mesmo tempo sem ninguém olhar
não se paga.

**Abrir e fechar são a mesma timeline.** O fechamento é `.reverse()`, não uma
segunda animação — os dois não têm como divergir quando algum passo mudar.
A sequência: o conteúdo da pasta sai → as irmãs assentam e recuam → o fundo
desfoca → a casca da pasta entrega o lugar ao morph → pasta vira painel
(posição, tamanho e raio no mesmo easing) → o conteúdo entra escalonado.

**O morph** nasce no retângulo exato do *corpo* da pasta clicada (a aba é o que
sobra de fora e sai junto), medido no clique — já com hover e idle aplicados,
então ele começa onde o olho do usuário está. Os raios de saída e de chegada
são lidos do CSS, não fixados no JS, para o breakpoint não desalinhar nada.

---

## Duas armadilhas que o código evita de propósito

**`will-change: opacity` mata o `backdrop-filter`.** Qualquer ancestral com
`opacity`, `filter`, `mask` ou `contain: paint` cria um *Backdrop Root*, e o
vidro passa a amostrar o vazio. Por isso as camadas só declaram
`will-change: transform`, e a opacidade é animada no próprio elemento que
carrega o filtro — nunca no pai dele.

**O painel não reflui durante o morph.** `.morphContent` acompanha a caixa
animada só para recortar; quem segura o conteúdo é `.morphStage`, fixo em
`--w`/`--h` desde o primeiro frame. Sem isso, cada frame da expansão dispararia
um layout do painel inteiro.

No mesmo espírito: o personagem não leva um `filter: blur()` animado (caro, é
recalculado por frame). Quem desfoca é o véu por cima, com o blur constante e
só a opacidade animando.

---

## Acessibilidade

Esc e o botão fecham; o foco vai para o botão de fechar ao abrir e volta para a
pasta de origem ao fechar. As pastas saem da ordem de tabulação enquanto há
painel aberto. `prefers-reduced-motion` desliga idle, parallax e o drift do
fundo, e colapsa a timeline. O conteúdo dos painéis também existe em HTML plano
fora da tela, para crawlers e leitores de tela.

---

## Assets

| Arquivo | O que é |
| --- | --- |
| `public/media/stage.mp4` | O fundo. 2560×1440, 9s, 60fps, 2,4 MB. Traz a cena inteira composta — sala, piso, letreiro e personagem. |
| `public/media/stage-poster.jpg` | Primeiro frame do vídeo, 130 KB. É o LCP da página: sem ele a hero abre em branco até o primeiro frame decodificar. |
| `public/media/preview-placeholder.mp4` | Placeholder dos loops das pastas. Sai do repositório assim que os loops reais entrarem. |
| `public/marcas/<slug>/capa.webp` | A foto `01` de cada pasta de marca, reamostrada para 1400px. Todas 16:9. |
| `public/marcas/<slug>/paginas/NNN.webp` | As páginas do manual, rasterizadas. Numeradas a partir de `001`. |

`public/` inteiro pesa **12,3 MB**. Já pesou 287.

### Os manuais não são servidos como PDF

Os seis PDFs somavam **261 MB** — 98% do peso do site. Nenhum truque de
front-end conserta um arquivo de 72 MB: o visualizador ia esperar o download.

Então eles não são servidos. Cada PDF foi rasterizado em páginas WebP de
1500px, 95 páginas ao todo, **6 MB no lugar de 261**. O leitor carrega só a
página na tela e a seguinte, então abrir um manual custa ~40 KB em vez de
dezenas de megabytes. De quebra, o "só ver" deixa de ser um atalho escondido:
o arquivo original nunca chega ao navegador.

A rasterização roda o pdf.js **dentro do Chrome headless**, usando o canvas do
próprio navegador — assim não é preciso canvas nativo compilado, e o projeto
não ganha dependência nenhuma (o `pdfjs-dist` fica fora dele, só na ferramenta).

Uma armadilha que custou uma rodada: sem apontar `wasmUrl`, `cMapUrl` e
`standardFontDataUrl`, o pdf.js falha **em silêncio** em imagens JPEG2000 e em
cores ICC/CMYK — que é o recheio de qualquer manual de marca — e devolve a
página em branco sem erro nenhum. Três dos seis saíram brancos na primeira
tentativa. Por isso o script mede o contraste de cada página renderizada e
acusa as que saírem chapadas, em vez de confiar no "deu certo".

Para reprocessar quando um manual mudar, o script está descrito acima; o
essencial é: servir `build/`, `wasm/`, `cmaps/` e `standard_fonts/` do
`pdfjs-dist` por HTTP, renderizar cada página num `<canvas>` e exportar em
`toDataURL("image/webp", 0.82)`.

### As capas e o poster

As capas vieram como PNG de 3840px somando 19,3 MB e saíram em 0,24 MB — 80×
menos, sem diferença visível num card de 380px. O `sharp` que faz isso já vem
com o Next, não é dependência nova:

```bash
npx sharp-cli -i original.png -o capa.webp resize 1400 -- webp -q 82
```

O poster do vídeo foi extraído sem ffmpeg: Chrome headless carrega o vídeo,
busca o frame e desenha num `<canvas>`. Um `.webm` ainda vale quando houver
ffmpeg à mão — costuma sair 30–40% menor que o mp4:

```bash
ffmpeg -i public/media/stage.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an public/media/stage.webm
```

Depois é só apontar `video.webmSrc` em `src/config/character.ts`.

### Sobre o vidro em cima de um fundo colorido

O `backdrop-filter` das pastas usa `saturate(58%)`, e não um valor acima de
100% como é praxe em vidro. O fundo é grama muito saturada: saturar o backdrop
puxava a pasta inteira para um verde-amarelado e ela deixava de ler como
branca. O raio do blur também é modesto (13px) porque, perto das bordas de um
elemento pequeno, o filtro tem menos pixels para amostrar e desenha uma moldura
clara visível. Os três números estão comentados em
[Folder.module.css](src/components/Folder/Folder.module.css) — são o botão de
gosto entre "mais transparente" e "mais leitosa".
