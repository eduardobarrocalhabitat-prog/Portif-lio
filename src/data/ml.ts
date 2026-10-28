import { about } from "@/data/about";
import {
  DESTAQUES,
  MENSAGEM,
  PROJETOS,
  REDES,
  SITES,
  paginas,
  whatsapp,
  type Abrir,
} from "@/data/margem";

/* ---------------------------------------------------------------------------
   O conteúdo do Eduardo na estrutura de marcuslorenzet.com.

   Só o conteúdo muda: a estrutura, os tamanhos e o movimento vêm da
   referência, medidos na página rodando. Nada aqui é inventado: os números são
   contagens do acervo, os anos são os que ele informou, e no lugar dos
   depoimentos entra o que ele entregou para cada empresa, sem citação.
--------------------------------------------------------------------------- */

export const CONTATO = {
  email: about.contact.links.find((l) => l.icon === "email")!,
  whatsapp: about.contact.whatsapp,
  linkedin: about.contact.links.find((l) => l.icon === "linkedin")!,
  behance: about.contact.links.find((l) => l.icon === "behance")!,
  orcamento: whatsapp(MENSAGEM.geral),
};

export const NUMEROS = {
  anos: "5+ anos de experiência",
  projetos: `${PROJETOS.length} projetos`,
};

/* ---- Cases: as quatro marcas em destaque -------------------------------- */

export type Case = {
  titulo: string;
  tags: string;
  foto: string;
  abrir: { title: string; source: Abrir };
};

const TITULOS: Record<string, string> = {
  "AND Academy": "Identidade visual para qualificação inteligente no trânsito",
  Lavaê: "Uma lavanderia self-service com uma marca que vem da água",
  "Business Place": "Marca para um ecossistema que conecta negócios",
  Pitqueens: "Uma marca nascida de duas pitbulls, Skadi e Maeve",
};

export const CASES: Case[] = DESTAQUES.map((d) => ({
  titulo: TITULOS[d.cliente] ?? d.cliente,
  tags: d.disciplina.startsWith("Manual")
    ? "Identidade visual, Manual de marca"
    : `Identidade visual, ${d.disciplina.split(" · ")[0]}`,
  foto: d.foto,
  abrir: {
    title: d.cliente,
    source: {
      kind: "document" as const,
      pages: paginas(d.manual.dir, d.manual.pages),
      label: d.disciplina,
    },
  },
}));

/* ---- Sites no ar, com seção própria -------------------------------------- */

export const SITES_NO_AR = SITES.map((s) => ({
  ...s,
  titulo: s.resumo ?? s.nome,
  abrir: {
    title: s.nome,
    source: { kind: "site" as const, url: s.url, label: s.stack },
  },
}));

/* ---- Empresas, no lugar dos depoimentos --------------------------------- */

export type Entrega = {
  texto: string;
  empresa: string;
  area: string;
  logo: string;
};

const logo = (nome: string) =>
  about.companies.items.find((c) => c.name === nome)?.logo ?? "";

/*
  Só o que o acervo comprova. Pen: carrosséis e o vídeo estão em Redes.
  Toth: o pitch deck de 15 páginas está nas marcas. Whido: roteiros de vídeo
  dos campeonatos de Free Fire (CONFIRMAR com o Eduardo antes de publicar).
*/
export const ENTREGAS: Entrega[] = [
  {
    texto:
      "Carrosséis e vídeo para as redes da Pen Education, falando de educação com quem é pai e mãe.",
    empresa: "Pen Education",
    area: "Educação",
    logo: logo("Pen Education"),
  },
  {
    texto:
      "Pitch deck de 15 páginas para a Toth Innovation Marketing apresentar a agência.",
    empresa: "Toth Innovation Marketing",
    area: "Marketing",
    logo: logo("Toth Innovation Marketing"),
  },
  {
    texto:
      "Roteiros de vídeo para explicar formatos e sorteios de campeonatos de Free Fire.",
    empresa: "Whido",
    area: "E-sports",
    logo: logo("Whido"),
  },
];

/* ---- Peças que sobem na seção "O que eu faço" --------------------------- */

const peca = (foto: string) => REDES.find((r) => r.foto === foto)!;
const grupo = (...fotos: string[]) =>
  fotos.map((f) => peca(`/conteudo/${f}.webp`));

/*
  Primeiro os três reels, inteiros em 9:16; depois as imagens de quatro em
  quatro, duas colunas de duas, no mesmo quadro. Coluna (0 esquerda, 1 meio,
  2 direita) e topo no documento da seção, em px de 1440.
*/
export const SUBINDO = [
  { pecas: [peca("/conteudo/reel-campo.webp")], col: 0, top: 1012 },
  { pecas: [peca("/conteudo/reel-0722.webp")], col: 2, top: 1152 },
  { pecas: [peca("/conteudo/reel-pen.webp")], col: 1, top: 1736 },
  {
    pecas: grupo(
      "lavae-nova-unidade",
      "hub-cna-futuro",
      "pen-essa-crianca-01",
      "lc-perfumes",
    ),
    col: 0,
    top: 1900,
  },
  {
    pecas: grupo(
      "sura-community-day",
      "bar-do-cuscuz",
      "pen-eu-me-viro-01",
      "lugares-ver-o-mundo",
    ),
    col: 2,
    top: 2000,
  },
  {
    pecas: grupo(
      "hub-cna-agro",
      "key-visual-academia",
      "sura-deck-guide",
      "elva-garden",
    ),
    col: 1,
    top: 2600,
  },
];

/* ---- Peças flutuando na chamada final ----------------------------------- */

/*
  Posição na tela quando a seção prende, largura, opacidade e velocidade
  (px de subida por 400 px de rolagem), medidas na referência. As imagens são
  do Eduardo; a altura sai da proporção de cada uma.

  `m` é a posição no celular, em % da largura (x, w) e da altura (y) da tela:
  seis peças em volta da frase, três acima e três abaixo, deixando a faixa do
  meio livre. As outras não aparecem no celular.
*/
export const FLUTUANDO = [
  {
    src: "/marcas/and-academy/paginas/017.webp",
    x: 1068,
    y: 156,
    w: 260,
    op: 1,
    v: 33,
    m: { x: 60, y: 4, w: 36 },
  },
  {
    src: "/conteudo/elva-garden-story.webp",
    x: 1038,
    y: 720,
    w: 281,
    op: 1,
    v: 32,
    m: { x: 72, y: 66, w: 24 },
  },
  {
    src: "/marcas/business-place/paginas/012.webp",
    x: 184,
    y: 723,
    w: 275,
    op: 1,
    v: 40,
    m: { x: 4, y: 72, w: 34 },
  },
  {
    src: "/conteudo/lc-perfumes.webp",
    x: 1191,
    y: 323,
    w: 209,
    op: 0.5,
    v: 71,
    m: { x: 4, y: 3, w: 26 },
  },
  { src: "/conteudo/reel-pen.webp", x: 41, y: 280, w: 251, op: 0.5, v: 71 },
  {
    src: "/marcas/lavae-laundry/paginas/015.webp",
    x: 795,
    y: 415,
    w: 283,
    op: 0.5,
    v: 71,
  },
  {
    src: "/conteudo/hub-cna-futuro.webp",
    x: 661,
    y: 94,
    w: 220,
    op: 1,
    v: 71,
    m: { x: 33, y: 9, w: 24 },
  },
  {
    src: "/conteudo/bar-do-cuscuz.webp",
    x: 193,
    y: 582,
    w: 178,
    op: 0.3,
    v: 55,
  },
  { src: "/conteudo/reel-campo.webp", x: 523, y: -66, w: 167, op: 0.3, v: 55 },
  {
    src: "/conteudo/sura-community-day.webp",
    x: 1015,
    y: 570,
    w: 190,
    op: 0.3,
    v: 55,
  },
  {
    src: "/conteudo/key-visual-academia.webp",
    x: 512,
    y: 321,
    w: 200,
    op: 0.65,
    v: 71,
  },
  {
    src: "/conteudo/pen-essa-crianca-01.webp",
    x: 618,
    y: 108,
    w: 227,
    op: 0.52,
    v: 71,
  },
  {
    src: "/sites/mkz-canaa.webp",
    x: 622,
    y: 833,
    w: 196,
    op: 1,
    v: 71,
    m: { x: 41, y: 78, w: 28 },
  },
];

export const HABILIDADES =
  "Identidade visual, Manual de marca, Social media, Carrossel, Reels, Key visual, Pitch deck, Sites, Framer, Figma, IA.";
