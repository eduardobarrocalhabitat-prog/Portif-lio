import type { IconName } from "@/components/FolderIcon/FolderIcon";

export type Tint = "lilac" | "peach" | "mint" | "sky";

/* ---------------------------------------------------------------------------
   Conteúdo dos painéis.

   Quatro pastas, e não é coincidência serem quatro: a fileira do desktop e a
   grade 2×2 do celular são desenhadas para esse número. Três delas espelham as
   pernas da narrativa — identidade, UI/UX e IA — e a quarta é a produção que
   sustenta as outras.

   Cada pasta guarda um tipo diferente de trabalho, então cada uma abre num
   layout diferente: a casca do painel é a mesma, o miolo não. O `kind` é o que
   o PanelTeaser e o WorkGrid usam para escolher o layout.

   Em todos os itens o asset é opcional. Sem ele, o layout desenha um
   placeholder tintado no lugar exato e com a proporção certa. Caminhos são
   locais (`/media/...`, `/marcas/...`), servidos de `public/`.
--------------------------------------------------------------------------- */

export type BrandItem = {
  name: string;
  /** O que foi entregue. Sai do próprio documento, não é suposição. */
  category: string;
  year?: string;
  /** Capa 16:9 — a foto "01" de cada pasta de marca. */
  image?: string;
  /**
   * O documento que abre ao clicar na capa.
   *
   * Não é o PDF: são as páginas dele rasterizadas em WebP, numeradas a partir
   * de `001.webp` dentro de `dir`. Os seis manuais somavam 261 MB em PDF e
   * somam 6 MB assim, e o leitor carrega só o que entra na tela.
   */
  document?: { label: string; dir: string; pages: number };
};

/**
 * Proporção da peça. O layout em colunas respeita cada uma.
 * Não force uma peça para a proporção mais próxima: `object-fit: cover` corta,
 * e cortar uma peça gráfica é estragá-la. Se chegar um formato novo, some ele
 * aqui.
 */
export type GalleryRatio = "1/1" | "4/5" | "3/4" | "4/3" | "16/9" | "9/16";

export type GalleryItem = {
  title: string;
  kind: string;
  ratio: GalleryRatio;
  /** Capa do card. Clicar abre ela em tamanho grande. */
  image?: string;
  /**
   * O carrossel inteiro, em ordem, com a capa como primeira. Quando existe,
   * clicar abre todas as telas na mesma leitura por rolagem dos manuais — é o
   * mesmo componente, só muda a lista.
   */
  slides?: string[];
  /** Quando existe, a peça é um vídeo mudo que roda sob o ponteiro. */
  video?: string;
  poster?: string;
};

export type SiteItem = {
  name: string;
  stack: string;
  /** Opcional pelo mesmo motivo do ano das marcas: data errada é pior que ausente. */
  year?: string;
  url?: string;
  status: "live" | "wip";
  /** Captura da home, proporção 16:10. */
  image?: string;
};

/* ---------------------------------------------------------------------------
   Casos de IA.

   O formato precisa ser elástico porque o trabalho é: um caso pode ser um site
   que dá para abrir, um app com telas, ou uma automação que não tem tela
   nenhuma e só existe como história. Por isso `detail` é uma união, e não um
   punhado de campos opcionais que cada caso preencheria pela metade.
--------------------------------------------------------------------------- */

export type ArticleBlock =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "stat"; value: string; label: string }
  | { type: "image"; src: string; caption?: string };

export type CaseDetail =
  | { kind: "site"; url: string }
  | { kind: "article"; blocks: ArticleBlock[] };

export type CaseItem = {
  title: string;
  /** Uma linha: o que o caso resolve, não que tecnologia usa. */
  summary: string;
  tags: string[];
  image?: string;
  status: "live" | "wip";
  detail?: CaseDetail;
};

export type PanelContent =
  | { kind: "brands"; items: BrandItem[] }
  | { kind: "gallery"; items: GalleryItem[] }
  | { kind: "sites"; items: SiteItem[] }
  | { kind: "cases"; items: CaseItem[] };

export type FolderDefinition = {
  id: string;
  label: string;
  /** Linha curta na etiqueta, à direita do nome. */
  count: string;
  icon: IconName;
  tint: Tint;

  /** Pasta anunciada, mas ainda sem conteúdo: não abre. */
  comingSoon?: boolean;

  /**
   * Fora do site inteiro: some da cena, do menu e das seções. A definição
   * continua aqui, inteira. Para trazer de volta, apague esta linha na pasta.
   */
  hidden?: boolean;

  /**
   * O loop que roda dentro da pasta no hover. Fica parado e invisível em
   * repouso — a pasta fechada é branca, como no rascunho —, e só toca
   * enquanto o ponteiro está em cima.
   */
  preview: {
    src: string | null;
    poster: string | null;
  };

  /**
   * Centro da pasta, em % da cena. O CSS troca o par no breakpoint.
   *
   * O `size` do retrato tem teto em px de propósito: em `38vw` puro, um
   * tablet 768×1024 desenha pastas de 292px enquanto as linhas continuam em
   * 56%/82% da altura — as duas fileiras se encontram e as etiquetas somem.
   */
  desktop: { x: string; y: string; size: string };
  mobile: { x: string; y: string; size: string };

  /** Profundidade do parallax. Numa fileira, mantenha os valores próximos. */
  depth: number;
  /** Desencontra o idle para as pastas não respirarem juntas. */
  phase: number;

  /*
    Sem CTA: a seção da pasta JÁ é o acervo completo. Um botão "ver tudo"
    apontando para a própria tela em que a pessoa está é ruído.
  */
  panel: {
    kicker: string;
    title: string;
    blurb: string;
    content: PanelContent;
  };
};

/*
  TODO: as peças de Conteúdo e os casos de IA ainda apontam para o mesmo clipe
  de placeholder, para o efeito ficar visível. Troque pelos arquivos reais — e
  aí `public/media/preview-placeholder.mp4` pode sair do repositório.
*/
const PLACEHOLDER = "/media/preview-placeholder.mp4";
const PLACEHOLDER_PREVIEW = { src: PLACEHOLDER, poster: null };

const MOBILE_SIZE = "clamp(118px, 38vw, 186px)";
const DESKTOP_SIZE = "clamp(148px, 13.6vw, 208px)";

/*
  As coordenadas não são escritas à mão: elas vêm da quantidade de pastas
  visíveis. Antes eram oito valores fixos, e esconder uma pasta deixava um
  buraco na fileira que só se via rodando o site.

  Desktop: fileira única, vão constante de 18,6% e o conjunto centrado.
  Retrato: duas colunas; se sobrar uma pasta sozinha na última fileira, ela
  vai para o meio em vez de ficar encostada na esquerda.
*/
const VAO = 18.6;
const COLUNAS_RETRATO = [28, 72];

type FolderSource = Omit<FolderDefinition, "desktop" | "mobile">;

function posicionar(fontes: FolderSource[]): FolderDefinition[] {
  const largura = (fontes.length - 1) * VAO;
  const fileiras = Math.ceil(fontes.length / COLUNAS_RETRATO.length);
  // Com uma fileira só, 56%/82% deixaria tudo colado no topo da cena.
  const alturas = fileiras === 1 ? [70] : [56, 82];

  return fontes.map((fonte, i) => {
    const fileira = Math.floor(i / COLUNAS_RETRATO.length);
    const naFileira = fontes.length - fileira * COLUNAS_RETRATO.length;
    const sozinha = naFileira === 1;

    return {
      ...fonte,
      desktop: {
        x: `${(50 - largura / 2 + i * VAO).toFixed(1)}%`,
        y: "77%",
        size: DESKTOP_SIZE,
      },
      mobile: {
        x: `${sozinha ? 50 : COLUNAS_RETRATO[i % COLUNAS_RETRATO.length]}%`,
        y: `${alturas[Math.min(fileira, alturas.length - 1)]}%`,
        size: MOBILE_SIZE,
      },
    };
  });
}

const fontes: FolderSource[] = [
  {
    id: "marcas",
    label: "Marcas",
    count: "06",
    icon: "tag",
    tint: "peach",
    preview: PLACEHOLDER_PREVIEW,
    depth: 0.5,
    phase: 0,
    panel: {
      kicker: "Identidade",
      title: "Marcas",
      blurb:
        "Naming, identidade visual e os sistemas que seguram tudo isso de pé depois que o logo fica pronto.",
      /*
        A ordem daqui é a ordem em tudo: nas cinco peças da pilha do painel e
        na grade da seção. A pilha mostra as cinco primeiras — hoje o Toth é
        quem fica de fora dela.

        TODO: `year` está de fora porque eu não sei o ano de nenhuma delas —
        data errada é pior do que data ausente.
      */
      content: {
        kind: "brands",
        items: [
          {
            name: "Lavaê",
            category: "Manual de identidade visual",
            image: "/marcas/lavae-laundry/capa.webp",
            document: {
              dir: "/marcas/lavae-laundry/paginas",
              pages: 16,
              label: "Manual de identidade",
            },
          },
          {
            name: "AND Academy",
            category: "Manual de identidade visual",
            image: "/marcas/and-academy/capa.webp",
            document: {
              dir: "/marcas/and-academy/paginas",
              pages: 20,
              label: "Manual de identidade",
            },
          },
          {
            name: "Business Place",
            category: "Manual de identidade visual",
            image: "/marcas/business-place/capa.webp",
            document: {
              dir: "/marcas/business-place/paginas",
              pages: 16,
              label: "Manual de identidade",
            },
          },
          {
            name: "Pitqueens",
            category: "Manual de identidade visual",
            image: "/marcas/pitqueens/capa.webp",
            document: {
              dir: "/marcas/pitqueens/paginas",
              pages: 18,
              label: "Manual de identidade",
            },
          },
          {
            name: "Campo Mourão",
            category: "Manual de identidade visual",
            image: "/marcas/campo-mourao/capa.webp",
            document: {
              dir: "/marcas/campo-mourao/paginas",
              pages: 10,
              label: "Manual de identidade",
            },
          },
          {
            name: "Toth",
            category: "Pitch deck",
            image: "/marcas/toth/capa.webp",
            document: {
              dir: "/marcas/toth/paginas",
              pages: 15,
              label: "Pitch deck",
            },
          },
        ],
      },
    },
  },
  {
    id: "conteudo",
    label: "Conteúdo",
    count: "16",
    icon: "image",
    tint: "lilac",
    preview: PLACEHOLDER_PREVIEW,
    depth: 0.62,
    phase: 1.9,
    panel: {
      kicker: "Peças e social",
      title: "Conteúdo",
      blurb:
        "Post, banner, carrossel e reel. As peças que fazem a marca aparecer todo dia: parado e em movimento, na mesma grade.",
      /*
        Imagem e vídeo dividem a mesma grade de propósito: é assim que eles
        saem, misturados numa mesma campanha. Quem tem `video` roda sob o
        ponteiro; o resto é imagem parada. A única diferença no dado é esse
        campo.

        Os três reels ainda não estão aqui: os originais somam 1,3 GB (um deles
        tem 5 minutos e 990 MB) e precisam ser reencodados para a web antes de
        entrar. Quando entrarem, é só acrescentar `video` no item.

        A ordem alterna proporções de propósito: o layout é em colunas, e três
        peças 3:4 seguidas empilham desalinhado.
      */
      content: {
        kind: "gallery",
        items: [
          {
            title: "Lavaê · nova unidade",
            kind: "Post",
            ratio: "3/4",
            image: "/conteudo/lavae-nova-unidade.webp",
          },
          {
            title: "HUB CNA · de olho no futuro",
            kind: "Carrossel",
            ratio: "4/5",
            image: "/conteudo/hub-cna-futuro.webp",
          },
          {
            title: "Campo Capital · a sua safra",
            kind: "Reel",
            ratio: "9/16",
            video: "/conteudo/reel-campo.mp4",
            poster: "/conteudo/reel-campo.webp",
          },
          {
            title: "Elva Garden · story",
            kind: "Story",
            ratio: "9/16",
            image: "/conteudo/elva-garden-story.webp",
          },
          {
            title: "Bar do Cuscuz",
            kind: "Post",
            ratio: "3/4",
            image: "/conteudo/bar-do-cuscuz.webp",
          },
          {
            title: "Key visual · academia",
            kind: "Key visual",
            ratio: "4/3",
            image: "/conteudo/key-visual-academia.webp",
          },
          {
            title: "HUB CNA · o agro e a tecnologia",
            kind: "Carrossel",
            ratio: "4/5",
            image: "/conteudo/hub-cna-agro.webp",
          },
          {
            title: "Sura · community day",
            kind: "Post",
            ratio: "3/4",
            image: "/conteudo/sura-community-day.webp",
          },
          {
            title: "Gemini",
            kind: "Reel",
            ratio: "9/16",
            video: "/conteudo/reel-0722.mp4",
            poster: "/conteudo/reel-0722.webp",
          },
          {
            title: "Pen Education · essa criança",
            kind: "Carrossel",
            ratio: "4/5",
            image: "/conteudo/pen-essa-crianca-01.webp",
            slides: [
              "/conteudo/pen-essa-crianca-01.webp",
              "/conteudo/pen-essa-crianca-02.webp",
              "/conteudo/pen-essa-crianca-03.webp",
              "/conteudo/pen-essa-crianca-04.webp",
              "/conteudo/pen-essa-crianca-05.webp",
              "/conteudo/pen-essa-crianca-06.webp",
              "/conteudo/pen-essa-crianca-07.webp",
              "/conteudo/pen-essa-crianca-08.webp",
            ],
          },
          {
            title: "Lugares que mudam o olhar",
            kind: "Post",
            ratio: "3/4",
            image: "/conteudo/lugares-ver-o-mundo.webp",
          },
          {
            title: "LC Perfumes",
            kind: "Post",
            ratio: "3/4",
            image: "/conteudo/lc-perfumes.webp",
          },
          {
            title: "Pen Education · 5 minutos",
            kind: "Vídeo",
            ratio: "9/16",
            video: "/conteudo/reel-pen.mp4",
            poster: "/conteudo/reel-pen.webp",
          },
          {
            title: "Pen Education · eu me viro sozinha",
            kind: "Carrossel",
            ratio: "4/5",
            image: "/conteudo/pen-eu-me-viro-01.webp",
            slides: [
              "/conteudo/pen-eu-me-viro-01.webp",
              "/conteudo/pen-eu-me-viro-02.webp",
              "/conteudo/pen-eu-me-viro-03.webp",
              "/conteudo/pen-eu-me-viro-04.webp",
              "/conteudo/pen-eu-me-viro-05.webp",
              "/conteudo/pen-eu-me-viro-06.webp",
              "/conteudo/pen-eu-me-viro-07.webp",
              "/conteudo/pen-eu-me-viro-08.webp",
            ],
          },
          {
            title: "Elva Garden",
            kind: "Post",
            ratio: "3/4",
            image: "/conteudo/elva-garden.webp",
          },
          {
            title: "Sura · deck guide",
            kind: "Deck",
            ratio: "3/4",
            image: "/conteudo/sura-deck-guide.webp",
          },
        ],
      },
    },
  },
  {
    id: "sites",
    label: "Sites",
    count: "02",
    icon: "globe",
    tint: "sky",
    preview: PLACEHOLDER_PREVIEW,
    depth: 0.62,
    phase: 3.7,
    panel: {
      kicker: "Interface",
      title: "Sites",
      blurb:
        "Interfaces que foram ao ar. Clicar abre o site aqui dentro, navegável, sem sair da página.",
      /*
        Os dois estão no ar e os dois aceitam ser abertos dentro do
        visualizador: testei carregando cada um num iframe de verdade, porque
        cabeçalho limpo não basta, muito site quebra o enquadramento por
        JavaScript.

        `stack` saiu de checagem, não de suposição: a as7 declara Framer no
        próprio HTML, e o MKZ carrega GSAP em onze requisições com um script
        só, que é o retrato de um estático feito à mão.

        `year` está de fora nos dois porque eu não sei as datas.

        Aqui havia três cartões "em construção" que eu mesmo tinha escrito para
        o layout aparecer. Saíram: sem URL e sem data de estreia, eles só
        prometiam trabalho que ninguém pode conferir. Se algum for real e
        estiver a caminho, é uma entrada de volta.
      */
      content: {
        kind: "sites",
        items: [
          {
            name: "as7 Comunicação",
            stack: "Framer",
            url: "https://as7.framer.website/",
            status: "live",
            image: "/sites/as7.webp",
          },
          {
            name: "MKZ Canaã",
            stack: "Estático · GSAP",
            url: "https://mkzcanaabuffet.com.br/",
            status: "live",
            image: "/sites/mkz-canaa.webp",
          },
        ],
      },
    },
  },
  {
    id: "ia",
    label: "IA",
    count: "03",
    icon: "spark",
    tint: "mint",
    /*
      Escondida até existir caso real. Os três casos abaixo são exemplos de
      formato, escritos para o layout ficar visível, e publicar isso seria
      anunciar trabalho que não aconteceu. Troque o conteúdo e apague esta
      linha: a fileira se reorganiza sozinha para quatro pastas de novo.
    */
    hidden: true,
    preview: PLACEHOLDER_PREVIEW,
    depth: 0.5,
    phase: 5.4,
    panel: {
      kicker: "Soluções com IA",
      title: "IA",
      blurb:
        "Automação, assistente e integração. Nem todo caso tem tela. Quando não tem, ele vira história.",
      /*
        ⚠️ ESCADA, NÃO ACERVO. Estes três casos existem para demonstrar os
        formatos possíveis, não para serem publicados: um caso com site que
        abre, um caso sem tela que vira artigo, e um caso ainda em produção.
        Troque tudo por trabalho real antes de publicar — descrição de caso
        que não aconteceu é promessa falsa.
      */
      content: {
        kind: "cases",
        items: [
          {
            title: "Assistente de atendimento",
            summary:
              "Responde as dúvidas repetidas do time comercial direto na conversa, com a base de conhecimento da empresa.",
            tags: ["Assistente", "RAG", "WhatsApp"],
            status: "wip",
            detail: {
              kind: "article",
              blocks: [
                { type: "h", text: "O problema" },
                {
                  type: "p",
                  text: "Metade das mensagens que chegavam ao comercial eram as mesmas seis perguntas. Cada uma custava alguns minutos de alguém que deveria estar vendendo.",
                },
                { type: "stat", value: "6", label: "perguntas concentravam metade do volume" },
                { type: "h", text: "O que foi feito" },
                {
                  type: "p",
                  text: "Um assistente ligado à base de conhecimento da empresa, que responde no mesmo canal e escala para uma pessoa quando não tem certeza. A parte que mais importa é essa: saber a hora de sair da frente.",
                },
              ],
            },
          },
          {
            title: "Automação de relatórios",
            summary:
              "Transforma exportação bruta em relatório pronto, com o texto da análise já escrito.",
            tags: ["Automação", "n8n", "LLM"],
            status: "wip",
            detail: {
              kind: "article",
              blocks: [
                { type: "h", text: "O problema" },
                {
                  type: "p",
                  text: "O relatório mensal era montado à mão: exportar, limpar, colar no template, escrever a leitura. Um dia de trabalho todo mês, sempre igual.",
                },
                { type: "stat", value: "1 dia → 10 min", label: "por ciclo de relatório" },
                { type: "h", text: "O que foi feito" },
                {
                  type: "p",
                  text: "Um fluxo que puxa os dados, monta o documento no formato de sempre e escreve a primeira versão da análise. A pessoa revisa em vez de redigir.",
                },
              ],
            },
          },
          {
            title: "Painel de métricas",
            summary:
              "Interface que lê os números e explica o que mudou, em vez de só desenhar o gráfico.",
            tags: ["Produto", "Next.js", "LLM"],
            status: "wip",
          },
        ],
      },
    },
  },
];

/**
 * As pastas que o site desenha. Quem some por `hidden` não chega aqui, então
 * cena, menu e seções ficam coerentes sem cada um precisar filtrar de novo.
 */
export const folders: FolderDefinition[] = posicionar(
  fontes.filter((fonte) => !fonte.hidden),
);

/**
 * Achata o conteúdo em pares legíveis. Disponível para qualquer lugar que
 * precise do acervo em texto puro, sem depender de um layout.
 */
export function describeContent(
  content: PanelContent,
): { label: string; value: string }[] {
  switch (content.kind) {
    case "brands":
      return content.items.map((item) => ({
        label: item.name,
        value: item.year ? `${item.category} · ${item.year}` : item.category,
      }));
    case "gallery":
      return content.items.map((item) => ({
        label: item.title,
        value: item.kind,
      }));
    case "sites":
      return content.items.map((item) => ({
        label: item.name,
        value: `${item.stack} · ${item.year} · ${
          item.status === "live" ? "no ar" : "em construção"
        }`,
      }));
    case "cases":
      return content.items.map((item) => ({
        label: item.title,
        value: item.summary,
      }));
  }
}

/**
 * Até três capas da pasta, para as peças que espiam da pasta fechada.
 *
 * Todos os quatro tipos de conteúdo guardam a capa no mesmo campo, então uma
 * leitura só serve para os quatro. Quem não tem imagem simplesmente não entra,
 * e uma pasta sem nenhuma capa fica sem peças em vez de mostrar buraco.
 */
export function coversOf(content: PanelContent): string[] {
  return (content.items as { image?: string }[])
    .map((item) => item.image)
    .filter((src): src is string => Boolean(src))
    .slice(0, 3);
}
