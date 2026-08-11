"use client";

import Image from "next/image";
import { useRef } from "react";

import type { PanelContent } from "@/data/folders";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./PanelTeaser.module.css";

/* ---------------------------------------------------------------------------
   A variante "Mesa": as peças caem sobre a mesa quando a pasta abre.

   É uma amostra, não o acervo — no máximo cinco peças, sobrepostas e tortas.
   O ângulo que aqui convida vira ruído num grid denso, então a seção lá
   embaixo mostra tudo em grade limpa. Pilha chama, arquivo organiza.
--------------------------------------------------------------------------- */

/**
 * Cinco peças no desktop, três no retrato. Não é preferência: cinco reels 9:16
 * empilhados não cabem em 390px e vazam pelas duas bordas do painel.
 */
const MAX_PIECES = { wide: 5, narrow: 3 } as const;
const NARROW = "(max-width: 900px), (max-aspect-ratio: 1 / 1)";

/**
 * Como cada peça cai. Autoral e determinístico — "aleatório de verdade" produz
 * tanto arranjo ruim quanto bom, e ninguém revisa o que muda a cada render.
 *
 * `height` é fração da altura da mesa; a largura sai da proporção da peça e a
 * sobreposição sai da largura. Tudo proporcional de propósito: uma capa de
 * marca 16:9 é três vezes mais larga que um reel 9:16, e qualquer número fixo
 * — de posição ou de margem — acertaria um tipo de pasta e erraria o outro.
 */
const PILE = [
  { height: 0.8, drop: "9%", rotate: -8, z: 2 },
  { height: 0.95, drop: "0%", rotate: 5, z: 4 },
  { height: 0.83, drop: "11%", rotate: -4, z: 3 },
  { height: 0.92, drop: "3%", rotate: 9, z: 5 },
  { height: 0.78, drop: "13%", rotate: -6, z: 1 },
];

/**
 * Peça larga tem que vir mais baixa, senão cinco delas não cabem na mesa.
 * É o mesmo motivo por trás de `PILE` ser proporcional.
 */
const HEIGHT_BY_KIND = {
  brands: 0.6,
  gallery: 0.78,
  sites: 0.6,
  cases: 0.6,
} as const;

type Piece = {
  key: string;
  /** Numérica, e não "16 / 9": o CSS precisa dela para calcular a margem. */
  ratio: number;
  video?: string;
  poster?: string;
  image?: string;
};

function toPieces(content: PanelContent): Piece[] {
  switch (content.kind) {
    case "brands":
      return content.items.map((item) => ({
        key: item.name,
        // As capas das marcas são todas 16:9.
        ratio: 16 / 9,
        image: item.image,
      }));
    case "gallery":
      return content.items.map((item) => {
        const [w, h] = item.ratio.split("/").map(Number);
        return {
          key: item.title,
          ratio: w / h,
          image: item.image,
          video: item.video,
          poster: item.poster,
        };
      });
    case "sites":
      return content.items.map((item) => ({
        key: item.name,
        ratio: 16 / 10,
        image: item.image,
      }));
    case "cases":
      return content.items.map((item) => ({
        key: item.title,
        ratio: 16 / 10,
        image: item.image,
      }));
  }
}

type Props = {
  content: PanelContent;
  /** Quantas peças existem ao todo, para a chamada do botão. */
  total: number;
  exploreLabel: string;
  onExplore: () => void;
};

export function PanelTeaser({ content, total, exploreLabel, onExplore }: Props) {
  const narrow = useMediaQuery(NARROW);
  const pieces = toPieces(content).slice(
    0,
    narrow ? MAX_PIECES.narrow : MAX_PIECES.wide,
  );
  const hidden = total - pieces.length;

  const heightScale = HEIGHT_BY_KIND[content.kind];

  return (
    <div className={styles.teaser}>
      <div
        className={styles.pile}
        style={
          {
            /*
              A mesa mede a peça mais alta desta pasta, não a altura de
              referência. Sem isto, uma pasta de capas 16:9 — que ocupam 60%
              da referência — reservava 40% de vão morto embaixo da pilha.
            */
            "--fill": 0.95 * heightScale + 0.15,
          } as React.CSSProperties
        }
      >
        {pieces.map((piece, index) => {
          const spot = PILE[index];

          return (
            <PileCard
              key={piece.key}
              piece={piece}
              spot={spot}
              heightScale={heightScale}
              /* Marcado à parte da casca: o texto entra em ordem de leitura,
                 as peças caem em ordem aleatória. */
              data-panel-piece
            />
          );
        })}
      </div>

      <div className={styles.actions} data-panel-item>
        <button type="button" className={styles.explore} onClick={onExplore}>
          {exploreLabel}
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 4v11M5.2 10.2L10 15l4.8-4.8" />
          </svg>
        </button>

        {hidden > 0 ? (
          <span className={styles.rest}>
            +{hidden} {hidden === 1 ? "peça" : "peças"} na seção completa
          </span>
        ) : null}
      </div>
    </div>
  );
}

function PileCard({
  piece,
  spot,
  heightScale,
  ...rest
}: {
  piece: Piece;
  spot: (typeof PILE)[number];
  heightScale: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const setPlaying = (playing: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) void video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div
      className={styles.card}
      style={
        {
          top: spot.drop,
          zIndex: spot.z,
          // O CSS deriva altura, largura e sobreposição destes dois.
          "--h-frac": spot.height * heightScale,
          "--ratio": piece.ratio,
        } as React.CSSProperties
      }
      {...rest}
    >
      {/* Camada externa: GSAP na entrada. Interna: CSS no hover. Nunca as duas
          no mesmo transform. */}
      <div
        className={styles.face}
        style={
          {
            "--tilt": `${spot.rotate}deg`,
            aspectRatio: piece.ratio,
          } as React.CSSProperties
        }
        onPointerEnter={() => setPlaying(true)}
        onPointerLeave={() => setPlaying(false)}
      >
        {piece.video ? (
          <video
            ref={videoRef}
            className={styles.media}
            src={piece.video}
            poster={piece.poster}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : piece.image ? (
          <Image
            src={piece.image}
            alt=""
            fill
            sizes="300px"
            className={styles.media}
          />
        ) : null}

      </div>
    </div>
  );
}
