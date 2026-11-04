import { about } from "@/data/about";
import {
  DESTAQUES,
  MENSAGEM,
  REDES,
  SITES,
  paginas,
  whatsapp,
  type Abrir,
} from "@/data/margem";

/* ---------------------------------------------------------------------------
   O conteúdo do Eduardo na estrutura de marcuslorenzet.com.

   Só o conteúdo muda: a estrutura, os tamanhos e o movimento vêm da
   referência, medidos na página rodando. Nada aqui é inventado: no lugar dos
   depoimentos entra o que ele entregou para cada empresa, sem citação.
--------------------------------------------------------------------------- */

export const CONTATO = {
  email: about.contact.links.find((l) => l.icon === "email")!,
  whatsapp: about.contact.whatsapp,
  linkedin: about.contact.links.find((l) => l.icon === "linkedin")!,
  behance: about.contact.links.find((l) => l.icon === "behance")!,
  orcamento: whatsapp(MENSAGEM.geral),
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

/* O que o Eduardo fez em cada empresa, nas palavras dele. */
export const ENTREGAS: Entrega[] = [
  {
    texto:
      "Gestão das redes sociais e do site da Pen Education, com o controle das demandas de comunicação.",
    empresa: "Pen Education",
    area: "Educação",
    logo: logo("Pen Education"),
  },
  {
    texto:
      "Clipagem para a Rede Ronaldo Games e uma solução de IA desenvolvida para a rede.",
    empresa: "Rede Ronaldo Games",
    area: "Games",
    logo: logo("Rede Ronaldo Games"),
  },
  {
    texto:
      "Toda a operação visual da Toth: apresentações, marcas, sites e brand books.",
    empresa: "Toth Innovation Marketing",
    area: "Marketing",
    logo: logo("Toth Innovation Marketing"),
  },
  {
    texto:
      "Eventos audiovisuais com transmissão ao vivo e presencial, e as peças gráficas que comunicavam cada evento.",
    empresa: "inovabra",
    area: "Inovação",
    logo: logo("inovabra"),
  },
];

/* ---- Redes sociais: os reels e as imagens ------------------------------ */

const peca = (foto: string) => REDES.find((r) => r.foto === foto)!;
const grupo = (...fotos: string[]) =>
  fotos.map((f) => peca(`/conteudo/${f}.webp`));

/* Primeiro os três reels, inteiros em 9:16. */
export const REELS = [
  peca("/conteudo/reel-campo.webp"),
  peca("/conteudo/reel-0722.webp"),
  peca("/conteudo/reel-pen.webp"),
];

/* Depois as imagens de quatro em quatro, duas colunas de duas, cada grade
   no espaço de um reel. */
export const GRADES = [
  grupo(
    "lavae-nova-unidade",
    "hub-cna-futuro",
    "pen-essa-crianca-01",
    "lc-perfumes",
  ),
  grupo(
    "sura-community-day",
    "bar-do-cuscuz",
    "pen-eu-me-viro-01",
    "lugares-ver-o-mundo",
  ),
  grupo(
    "hub-cna-agro",
    "key-visual-academia",
    "sura-deck-guide",
    "elva-garden",
  ),
];

/* ---- Soluções de IA ------------------------------------------------------ */

/*
  Os cases chegam do Eduardo. Enquanto a lista estiver vazia, a seção não
  aparece no site.
*/
export const IA: Case[] = [];

/* ---- Peças em volta da chamada final ----------------------------------- */

/*
  Desktop: quatro colunas, duas de cada lado, com as peças empilhadas sem
  encostar uma na outra; o meio fica livre para a frase e os botões. Posição
  e largura em px de 1440, `y` é o topo da coluna quando a seção prende e
  `sobe` é quanto ela sobe enquanto a seção está presa. As de dentro sobem
  mais e ficam mais apagadas: parecem mais longe.
*/
export const COLUNAS_CHAMADA = [
  {
    x: 24,
    w: 140,
    y: -80,
    sobe: 120,
    op: 1,
    fotos: [
      "/conteudo/reel-campo.webp",
      "/conteudo/lc-perfumes.webp",
      "/marcas/and-academy/paginas/017.webp",
      "/conteudo/sura-community-day.webp",
      "/conteudo/pen-eu-me-viro-01.webp",
      "/conteudo/pen-eu-me-viro-03.webp",
    ],
  },
  {
    x: 188,
    w: 116,
    y: 60,
    sobe: 240,
    op: 0.55,
    fotos: [
      "/conteudo/hub-cna-futuro.webp",
      "/conteudo/bar-do-cuscuz.webp",
      "/marcas/business-place/paginas/012.webp",
      "/conteudo/reel-pen.webp",
      "/conteudo/sura-deck-guide.webp",
      "/conteudo/key-visual-academia.webp",
      "/conteudo/pen-essa-crianca-03.webp",
      "/conteudo/pen-eu-me-viro-04.webp",
    ],
  },
  {
    x: 1136,
    w: 116,
    y: -20,
    sobe: 240,
    op: 0.55,
    fotos: [
      "/conteudo/pen-essa-crianca-01.webp",
      "/conteudo/reel-0722.webp",
      "/conteudo/elva-garden.webp",
      "/marcas/lavae-laundry/paginas/015.webp",
      "/conteudo/hub-cna-agro.webp",
      "/conteudo/lugares-ver-o-mundo.webp",
      "/conteudo/pen-essa-crianca-04.webp",
      "/conteudo/pen-eu-me-viro-05.webp",
    ],
  },
  {
    x: 1276,
    w: 140,
    y: 30,
    sobe: 120,
    op: 1,
    fotos: [
      "/conteudo/elva-garden-story.webp",
      "/sites/mkz-canaa.webp",
      "/conteudo/lavae-nova-unidade.webp",
      "/conteudo/pen-essa-crianca-02.webp",
      "/sites/as7.webp",
      "/conteudo/pen-essa-crianca-05.webp",
      "/conteudo/pen-eu-me-viro-06.webp",
    ],
  },
];

/*
  Celular: seis peças paradas em volta da frase, três acima e três abaixo,
  em % da largura (x, w) e da altura (y) da tela.
*/
export const PECAS_CHAMADA_CELULAR = [
  { src: "/conteudo/lc-perfumes.webp", x: 4, y: 3, w: 26 },
  { src: "/conteudo/hub-cna-futuro.webp", x: 33, y: 9, w: 24 },
  { src: "/marcas/and-academy/paginas/017.webp", x: 60, y: 4, w: 36 },
  { src: "/marcas/business-place/paginas/012.webp", x: 4, y: 72, w: 34 },
  { src: "/sites/mkz-canaa.webp", x: 41, y: 78, w: 28 },
  { src: "/conteudo/elva-garden-story.webp", x: 72, y: 66, w: 24 },
];

export const HABILIDADES =
  "Identidade visual, Manual de marca, Social media, Carrossel, Reels, Key visual, Pitch deck, Sites, Framer, Figma, IA.";
