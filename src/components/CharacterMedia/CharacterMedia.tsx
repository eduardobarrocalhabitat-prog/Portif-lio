"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { characterConfig } from "@/config/character";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./CharacterMedia.module.css";

type Props = {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * O único componente que muda entre a fase 1 (still) e a fase 2 (loop).
 * A caixa externa `.root` e a interna `.media` são idênticas nos dois modos,
 * então a Scene anima o mesmo alvo sem saber o que está dentro.
 */
export function CharacterMedia({ ref }: Props) {
  const { mode } = characterConfig;
  const [ready, setReady] = useState(false);
  /*
    Estável de propósito: os filhos usam isto dentro de um efeito, e uma função
    nova a cada render faria o efeito remontar sem necessidade.
  */
  const revelar = useCallback(() => setReady(true), []);

  return (
    <div
      ref={ref}
      className={styles.root}
      data-ready={ready}
      data-feather={characterConfig.featherEdges}
      style={
        {
          "--fit": characterConfig.fit,
          "--object-position": characterConfig.objectPosition,
          "--rest-scale": characterConfig.restScale,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {mode === "video" ? (
        <VideoCharacter onReady={revelar} />
      ) : (
        <ImageCharacter onReady={revelar} />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function VideoCharacter({ onReady }: { onReady: () => void }) {
  const { video } = characterConfig;
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    /*
      Revelar deixa de depender só do evento.

      `loadeddata` dispara uma vez. Se o arquivo já estava no cache, ele pode
      acontecer antes do React pendurar o manipulador: o evento se perde,
      `data-ready` fica em false para sempre, e o vídeo existe, toca, e está
      invisível. É o "às vezes no F5".

      Não reproduzi em vinte e um carregamentos automatizados, porque a
      automação tem sempre o mesmo tempo e a corrida depende de variação. Mas
      o estado conta a verdade em qualquer instante, enquanto o evento só conta
      no dele, e a checagem custa uma linha.

      `canplay` entra como segunda chance, e `error` também revela: com o
      arquivo quebrado, o poster parado ainda é melhor do que tela vazia.
    */
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();
    el.addEventListener("loadeddata", onReady);
    el.addEventListener("canplay", onReady);
    el.addEventListener("error", onReady);

    const limpar = () => {
      el.removeEventListener("loadeddata", onReady);
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("error", onReady);
    };

    if (reducedMotion) {
      el.pause();
      return limpar;
    }

    // Safari/iOS recusa o autoplay em modo de baixo consumo; nesse caso a
    // primeira interação do usuário é uma permissão válida para dar play.
    const attempt = () => void el.play().catch(() => {});
    attempt();

    window.addEventListener("pointerdown", attempt, { once: true });
    return () => {
      limpar();
      window.removeEventListener("pointerdown", attempt);
    };
  }, [reducedMotion, onReady]);

  return (
    <video
      ref={videoRef}
      className={styles.media}
      width={video.width}
      height={video.height}
      poster={video.poster ?? undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
    >
      {video.webmSrc ? <source src={video.webmSrc} type="video/webm" /> : null}
      <source src={video.src} type="video/mp4" />
    </video>
  );
}

function ImageCharacter({ onReady }: { onReady: () => void }) {
  const { image, alt } = characterConfig;
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // O placeholder vetorial não dispara onLoad, então libera o fade na hora.
    if (!image.src) {
      onReady();
      return;
    }

    // Mesma corrida do vídeo: imagem em cache já chega `complete`, e nesse
    // caso o `onLoad` acontece antes do React estar ouvindo.
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) onReady();
  }, [image.src, onReady]);

  if (!image.src) return <PlaceholderCharacter />;

  return (
    <Image
      ref={imgRef}
      className={styles.media}
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      priority
      sizes="100vw"
      onLoad={onReady}
    />
  );
}

/**
 * Fica no lugar do still enquanto ele não existe, para que a fase 1 seja
 * navegável sem depender de nenhum asset. Mesmo aspecto do vídeo final.
 */
function PlaceholderCharacter() {
  return (
    <svg
      className={styles.media}
      viewBox="0 0 2560 1440"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="figure" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ccd2e2" />
          <stop offset="1" stopColor="#a8b1c8" />
        </linearGradient>
      </defs>
      <rect x="640" y="1108" width="1280" height="24" rx="12" fill="#dde2ed" />
      <circle cx="1280" cy="512" r="132" fill="url(#figure)" />
      <path
        d="M1280 668c-196 0-340 134-372 308l-30 156h804l-30-156c-32-174-176-308-372-308Z"
        fill="url(#figure)"
      />
      <path
        d="M1122 1108l34-148h248l34 148Z"
        fill="#eff2f8"
        stroke="#c3cadb"
        strokeWidth={7}
      />
    </svg>
  );
}
