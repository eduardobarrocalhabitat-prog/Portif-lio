# Portfólio

Next.js 16 (App Router) · React 19 · GSAP 3 (ScrollTrigger) · Three.js · Lenis · CSS Modules.

```bash
npm run dev     # http://localhost:3000
npm run build
```

A estrutura vem do site de estúdio "Margem" (túnel de trabalhos, manifesto com
marginália, método, índice e fecho), com o conteúdo do Eduardo. A seção de
redes sociais é dele: muita gente o procura por isso.

---

## Onde mexer

| Quero mudar | Arquivo |
| --- | --- |
| Os 4 cases do túnel e a tira do método | [src/data/margem.ts](src/data/margem.ts) |
| As peças, marcas e sites (de onde as seções saem) | [src/data/folders.ts](src/data/folders.ts) |
| Contatos e empresas | [src/data/about.ts](src/data/about.ts) |
| As fotos das paredes do túnel | `public/tunel/` + [src/data/tunel.json](src/data/tunel.json) |
| A seção de redes sociais | [src/components/margem/Redes.tsx](src/components/margem/Redes.tsx) |
| O túnel em si (Three.js) | [src/components/margem/tunel/cena.ts](src/components/margem/tunel/cena.ts) |
| A linha do tempo do túnel | [src/components/margem/tunel/Tunel.tsx](src/components/margem/tunel/Tunel.tsx) |
| Cores, fonte e margens | [src/app/globals.css](src/app/globals.css) |

## A página

```
#topo      hero + túnel: 78 fotos nas paredes, 4 destaques que viram case (preso por 11 telas)
#redes     posts, carrosséis, stories e reels, com os reels tocando na tela
#empresas  a frase sobre transitar entre nichos e as 6 empresas
#metodo    a AND Academy do conceito à aplicação (preso por 2,6 telas)
#marcas    todas as marcas, com a capa seguindo o cursor
#sites     os sites no ar, em palco alternado (cresce sozinho com mais sites)
#contato   a frase, o contato e o nome de borda a borda
```

Não há ano em lugar nenhum e não há depoimento de cliente: data errada é pior
que ausente, e depoimento inventado não entra. O "24 projetos" da abertura é
a contagem do próprio acervo.

## Acrescentar um site

Um item novo em `folders.ts`, na pasta "sites": `name`, `stack`, `url`,
`status: "live"`, `image` (captura 16:10 em `public/sites/`) e, se quiser,
`resumo` (uma linha sobre o case). A seção de sites se ajusta sozinha.

## Reels

Na seção de redes cada reel toca um loop curto e mudo (`*-previa.mp4`, 8 s,
480 px, ~500 KB); o vídeo inteiro só baixa quando a pessoa abre. Para um reel
novo, gere a prévia e aponte `previa` no item em `folders.ts`:

```bash
ffmpeg -ss 1 -t 8 -i reel.mp4 -vf "scale=480:-2,fps=30" -an -c:v libx264 \
  -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart reel-previa.mp4
```

## Trocar uma foto do túnel

As paredes usam as imagens de `public/tunel/` (até 900px, WebP), e o
`tunel.json` guarda a largura e a altura de cada uma, que viram a proporção do
plano. Ao acrescentar ou trocar uma foto, gere de novo o JSON:

```bash
for f in public/tunel/*.webp; do ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height -of csv=p=0:s=x "$f"; done
```

Os quatro destaques ficam em `public/destaques/` (16:9, 2000px).

## Ordem de inicialização

A rolagem suave (`Suave`) vem por último na página: os pins do túnel e do
método precisam existir antes do Lenis nascer, senão ele guarda a altura antiga
e a página trava no meio. Quando as fontes carregam, os pins medem de novo.

## Acessibilidade

`prefers-reduced-motion`: sem Lenis, sem cursor movendo a câmera, sem
suavização e sem entradas animadas; o túnel continua respondendo ao scroll.
O índice abre com teclado (a faixa terracota aparece no foco), e o visualizador
fecha com Esc.
