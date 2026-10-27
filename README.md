# Portfólio

Next.js 16 (App Router) · React 19 · GSAP 3 (ScrollTrigger) · Three.js · Lenis · CSS Modules.

```bash
npm run dev     # http://localhost:3000
npm run build
```

A estrutura vem do site de estúdio "Margem" (túnel de trabalhos, manifesto com
marginália, método, índice e fecho), com o conteúdo do Eduardo.

---

## Onde mexer

| Quero mudar | Arquivo |
| --- | --- |
| Os 4 cases do túnel, a tira do método e o índice | [src/data/margem.ts](src/data/margem.ts) |
| As peças, marcas e sites (de onde o índice sai) | [src/data/folders.ts](src/data/folders.ts) |
| Contatos e empresas | [src/data/about.ts](src/data/about.ts) |
| As fotos das paredes do túnel | `public/tunel/` + [src/data/tunel.json](src/data/tunel.json) |
| O túnel em si (Three.js) | [src/components/margem/tunel/cena.ts](src/components/margem/tunel/cena.ts) |
| A linha do tempo do túnel | [src/components/margem/tunel/Tunel.tsx](src/components/margem/tunel/Tunel.tsx) |
| Cores, fonte e margens | [src/app/globals.css](src/app/globals.css) |

## A página

```
#topo      hero + túnel: 78 fotos nas paredes, 4 destaques que viram case (preso por 11 telas)
#sobre     manifesto com fotos no lugar de palavras e notas na margem
#metodo    a AND Academy do conceito à aplicação (preso por 2,6 telas)
#projetos  todos os projetos, com filtro e a foto seguindo o cursor
#contato   a frase, o contato e o nome de borda a borda
```

Não há ano em lugar nenhum e não há depoimento de cliente: data errada é pior
que ausente, e depoimento inventado não entra. As notas do "Sobre" e o "24
projetos" são contagens do próprio acervo.

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
