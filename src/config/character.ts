/* ---------------------------------------------------------------------------
   A camada de mídia atrás das pastas.

   O vídeo atual já traz a cena inteira composta — sala, piso, o letreiro
   "EDUARDO BARROCAL" e o personagem —, então ele é o fundo da página, não um
   elemento sobre um fundo. É por isso que `featherEdges` está desligado: a
   composição tem moldura própria e dissolver as bordas comeria a parede e a
   grama.

   O interruptor da fase 1 -> fase 2 continua valendo:
   `mode: "image"` valida layout, animação e responsividade com um still.
   `mode: "video"` troca SÓ o elemento de mídia por um loop.
   Cena, timeline, geometria e responsividade são idênticas nos dois modos,
   porque os dois renderizam exatamente a mesma caixa (`.media`).
--------------------------------------------------------------------------- */

export type CharacterMode = "image" | "video";

export const characterConfig = {
  mode: "video" as CharacterMode,

  image: {
    /** `null` => usa o placeholder vetorial embutido, útil antes do still final. */
    src: null as string | null,
    width: 2560,
    height: 1440,
  },

  video: {
    src: "/media/stage.mp4",
    /** Opcional: um .webm entra como primeira <source> se você adicionar aqui. */
    webmSrc: null as string | null,
    /**
     * Primeiro frame do vídeo. Sem ele a hero abre em branco até o primeiro
     * frame decodificar, e é a hero que define o LCP da página.
     */
    poster: "/media/stage-poster.jpg" as string | null,
    width: 2560,
    height: 1440,
  },

  /**
   * `cover` porque a composição é feita para sangrar até a borda da tela.
   * Atenção: em retrato o corte lateral é forte e o letreiro do vídeo fica
   * fora de quadro — por isso a Scene reexibe o wordmark abaixo do breakpoint.
   */
  fit: "cover" as "contain" | "cover",

  /** Qual parte sobrevive ao corte. */
  objectPosition: "50% 48%",

  /** Escala de repouso. >1 aproxima. */
  restScale: 1.02,

  /**
   * Desligado: a cena do vídeo já tem enquadramento próprio. Ligue de novo se
   * um dia a mídia voltar a ser um recorte solto sobre o branco da página.
   */
  featherEdges: false,

  alt: "Eduardo Barrocal em uma sala branca com piso de grama",
} as const;
