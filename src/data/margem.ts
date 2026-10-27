import { folders, type GalleryItem } from "@/data/folders";

/* ---------------------------------------------------------------------------
   O conteúdo do site, na estrutura da Margem.

   Os fatos vêm do material do Eduardo: nome, categoria e páginas de cada
   manual, e os resumos dos cases saem do que está escrito nos próprios
   manuais. Não há ano em lugar nenhum: data errada é pior que data ausente.
--------------------------------------------------------------------------- */

export type Destaque = {
  cliente: string;
  disciplina: string;
  /** Duas linhas no máximo. Só o que o manual mostra. */
  resumo: string;
  /** 16:9, 1920px ou mais. */
  foto: string;
  manual: { dir: string; pages: number };
};

/* A ordem é a dele. */
export const DESTAQUES: Destaque[] = [
  {
    cliente: "AND Academy",
    disciplina: "Manual de identidade visual · 20 páginas",
    resumo:
      "Qualificação inteligente para o trânsito. Uma estrela de quatro pontas guia o símbolo, o pattern e os ícones.",
    foto: "/destaques/and-academy.webp",
    manual: { dir: "/marcas/and-academy/paginas", pages: 20 },
  },
  {
    cliente: "Lavaê",
    disciplina: "Manual de identidade visual · 16 páginas",
    resumo:
      "Lavanderia self-service. Gotas no acento e quatro azuis com nome de lavagem: sabão, piscina, enxágue, limpeza.",
    foto: "/destaques/lavae.webp",
    manual: { dir: "/marcas/lavae-laundry/paginas", pages: 16 },
  },
  {
    cliente: "Business Place",
    disciplina: "Manual de identidade visual · 16 páginas",
    resumo:
      "Um ecossistema que conecta negócios. O B vira pino de localização: conexões estratégicas no lugar certo.",
    foto: "/destaques/business-place.webp",
    manual: { dir: "/marcas/business-place/paginas", pages: 16 },
  },
  {
    cliente: "Pitqueens",
    disciplina: "Manual de identidade visual · 18 páginas",
    resumo:
      "A marca nasceu de duas pitbulls, Skadi e Maeve. O coração vira cauda, e o roxo e o rosa fazem o resto.",
    foto: "/destaques/pitqueens.webp",
    manual: { dir: "/marcas/pitqueens/paginas", pages: 18 },
  },
];

export const paginas = (dir: string, count: number) =>
  Array.from(
    { length: count },
    (_, i) => `${dir}/${String(i + 1).padStart(3, "0")}.webp`,
  );

/* ---------------------------------------------------------------------------
   Método: a AND Academy do conceito à aplicação, com as páginas do próprio
   manual. É a marca cujo manual mostra o processo inteiro.
--------------------------------------------------------------------------- */

export const METODO = [
  {
    rotulo: "Conceito",
    frase: "Antes do traço, o porquê: o que a marca precisa dizer.",
    foto: "/marcas/and-academy/paginas/005.webp",
  },
  {
    rotulo: "Construção",
    frase: "Geometria até a forma se sustentar sozinha.",
    foto: "/marcas/and-academy/paginas/006.webp",
  },
  {
    rotulo: "Sistema",
    frase: "Cor, letra e regra para a marca andar sem mim.",
    foto: "/marcas/and-academy/paginas/010.webp",
  },
  {
    rotulo: "Aplicação",
    frase: "Fachada, tela, crachá: onde a marca trabalha.",
    foto: "/marcas/and-academy/paginas/019.webp",
  },
];

/* ---------------------------------------------------------------------------
   Índice: todos os projetos, a partir dos mesmos dados das seções antigas.
--------------------------------------------------------------------------- */

export type Filtro = "identidade" | "conteudo" | "sites";

export type Abrir =
  | { kind: "document"; pages: string[]; label: string; axis?: "x" | "y" }
  | { kind: "site"; url: string; label: string }
  | { kind: "video"; src: string; poster?: string; label: string };

export type Projeto = {
  cliente: string;
  disciplina: string;
  filtro: Filtro;
  /** A foto que segue o cursor. */
  foto: string;
  abrir: Abrir;
};

/*
  "Lavaê · nova unidade": o cliente vem antes do ponto. Quando o título começa
  pelo formato ("Key visual · academia"), o cliente é o que vem depois.
*/
function separar(g: GalleryItem): { cliente: string; detalhe?: string } {
  const [antes, ...resto] = g.title.split(" · ");
  if (resto.length && antes.toLowerCase() === g.kind.toLowerCase()) {
    const c = resto.join(" · ");
    return { cliente: c.charAt(0).toUpperCase() + c.slice(1) };
  }
  const detalhe = resto.join(" · ");
  // "Elva Garden · story" num Story: o detalhe só repetiria o selo.
  const repete = detalhe.toLowerCase() === g.kind.toLowerCase();
  return { cliente: antes, detalhe: detalhe && !repete ? detalhe : undefined };
}

function peca(g: GalleryItem): Projeto | null {
  const foto = g.image ?? g.poster;
  if (!foto) return null;
  const { cliente, detalhe } = separar(g);
  const disciplina = detalhe ? `${g.kind}, ${detalhe}` : g.kind;
  const abrir: Abrir = g.video
    ? { kind: "video", src: g.video, poster: g.poster, label: g.kind }
    : {
        kind: "document",
        pages: g.slides ?? [foto],
        label: g.kind,
        axis: g.slides ? "x" : undefined,
      };
  return { cliente, disciplina, filtro: "conteudo", foto, abrir };
}

function montar(): Projeto[] {
  const marcas: Projeto[] = [];
  const conteudo: Projeto[] = [];
  const sites: Projeto[] = [];
  for (const folder of folders) {
    const c = folder.panel.content;
    if (c.kind === "brands") {
      for (const b of c.items) {
        if (!b.image || !b.document) continue;
        marcas.push({
          cliente: b.name,
          disciplina: b.category,
          filtro: "identidade",
          foto: b.image,
          abrir: {
            kind: "document",
            pages: paginas(b.document.dir, b.document.pages),
            label: b.document.label,
          },
        });
      }
    } else if (c.kind === "gallery") {
      for (const g of c.items) {
        const p = peca(g);
        if (p) conteudo.push(p);
      }
    } else if (c.kind === "sites") {
      for (const s of c.items) {
        if (!s.image || !s.url) continue;
        sites.push({
          cliente: s.name,
          disciplina: `Site, ${s.stack}`,
          filtro: "sites",
          foto: s.image,
          abrir: { kind: "site", url: s.url, label: "Site no ar" },
        });
      }
    }
  }
  // Marca primeiro, depois site, depois o conteúdo do dia a dia.
  return [...marcas, ...sites, ...conteudo];
}

export const PROJETOS = montar();

/* ---------------------------------------------------------------------------
   Redes sociais: as peças de conteúdo, na proporção em que foram feitas.
   Muita gente chega até o Eduardo por causa delas, então elas têm seção
   própria, além das linhas no índice.
--------------------------------------------------------------------------- */

export type GrupoRede = "videos" | "carrosseis" | "posts";

export type PecaRede = {
  cliente: string;
  /** "Reel", "Carrossel · 8 telas", "Post". */
  formato: string;
  detalhe?: string;
  /** "3/4", "9/16"... vira o aspect-ratio do quadro. */
  ratio: string;
  foto: string;
  /** Loop mudo para tocar na parede. */
  previa?: string;
  grupo: GrupoRede;
  abrir: Abrir;
};

export const FILTROS_REDES: { id: GrupoRede | "tudo"; rotulo: string }[] = [
  { id: "tudo", rotulo: "Tudo" },
  { id: "videos", rotulo: "Reels e vídeos" },
  { id: "carrosseis", rotulo: "Carrosséis" },
  { id: "posts", rotulo: "Posts e stories" },
];

function montarRedes(): PecaRede[] {
  const out: PecaRede[] = [];
  for (const folder of folders) {
    const c = folder.panel.content;
    if (c.kind !== "gallery") continue;
    for (const g of c.items) {
      const foto = g.image ?? g.poster;
      if (!foto) continue;
      const { cliente, detalhe } = separar(g);
      const grupo: GrupoRede = g.video
        ? "videos"
        : g.slides
          ? "carrosseis"
          : "posts";
      const formato = g.slides
        ? `${g.kind} · ${g.slides.length} telas`
        : g.kind;
      const abrir: Abrir = g.video
        ? { kind: "video", src: g.video, poster: g.poster, label: g.kind }
        : {
            kind: "document",
            pages: g.slides ?? [foto],
            label: g.kind,
            axis: g.slides ? "x" : undefined,
          };
      out.push({
        cliente,
        formato,
        detalhe,
        ratio: g.ratio,
        foto,
        previa: g.previa,
        grupo,
        abrir,
      });
    }
  }
  return out;
}

export const REDES = montarRedes();

/* ---------------------------------------------------------------------------
   Marcas e sites, cada um na sua seção.
--------------------------------------------------------------------------- */

/** O índice mostra só as marcas: os sites têm seção própria. */
export const MARCAS = PROJETOS.filter((p) => p.filtro === "identidade");

export type SiteCase = {
  nome: string;
  stack: string;
  url: string;
  /** "as7.framer.website", sem protocolo nem barra. */
  dominio: string;
  /** Captura 16:10. */
  foto: string;
  resumo?: string;
};

/*
  Para acrescentar um site: um item novo em `folders.ts`, na pasta "sites",
  com `url`, `image` (captura 16:10 em /public/sites) e, se quiser, `resumo`.
  A seção se ajusta sozinha à quantidade.
*/
function montarSites(): SiteCase[] {
  const out: SiteCase[] = [];
  for (const folder of folders) {
    const c = folder.panel.content;
    if (c.kind !== "sites") continue;
    for (const s of c.items) {
      if (!s.url || !s.image) continue;
      out.push({
        nome: s.name,
        stack: s.stack,
        url: s.url,
        dominio: s.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        foto: s.image,
        resumo: s.resumo,
      });
    }
  }
  return out;
}

export const SITES = montarSites();
