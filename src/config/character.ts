/* ---------------------------------------------------------------------------
   A figura atrás das pastas.

   Uma imagem parada: o personagem sozinho sobre branco. O vídeo que existia
   aqui saiu por desempenho, e com ele o interruptor imagem/vídeo e o
   placeholder vetorial, que só serviam à fase em que o vídeo não existia.

   Duas versões, trocadas pelo <picture> do CharacterMedia:
   · paisagem: a composição 16:9 inteira, para telas mais largas que altas;
   · retrato: um recorte 9:16 centrado no personagem, para telas em pé. Com a
     16:9 inteira num celular, a figura ficaria minúscula.

   Tudo sai de um PNG de 3840x2160 com 3,2 MB. A maior largura pesa 71 KB,
   porque quase tudo na imagem é branco liso. Para trocar a imagem, gere as
   mesmas larguras com os mesmos nomes e nada mais precisa mudar.
--------------------------------------------------------------------------- */

const larguras = (base: string, ws: number[]) =>
  ws.map((w) => `${base}-${w}.webp ${w}w`).join(", ");

export const characterConfig = {
  paisagem: {
    /** Para navegador sem suporte a `srcset`: a largura do meio. */
    src: "/media/hero-2560.webp",
    srcSet: larguras("/media/hero", [1280, 1920, 2560, 3840]),
    width: 3840,
    height: 2160,
  },

  retrato: {
    /**
     * Recorte x 1289..2504 da origem, altura inteira. O personagem ocupa de
     * 40% a 58% da largura original, então sobra folga dos dois lados.
     */
    srcSet: larguras("/media/hero-retrato", [640, 960, 1215]),
    width: 1215,
    height: 2160,
  },

  /** Escala de repouso da camada. A Scene parte dela ao abrir um painel. */
  restScale: 1,
} as const;
