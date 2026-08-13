"use client";

import { useEffect, useImperativeHandle, useRef } from "react";

import { FolderIcon } from "@/components/FolderIcon/FolderIcon";
import type { FolderDefinition } from "@/data/folders";
import { DUR, EASE, gsap, useGSAP } from "@/lib/motion";
import styles from "./Folder.module.css";

/** O que a Scene precisa alcançar para montar a timeline de abertura. */
export type FolderHandle = {
  readonly root: HTMLDivElement | null;
  /** O corpo da pasta — é o retângulo de onde o painel nasce. */
  readonly body: HTMLSpanElement | null;
  /** Tudo que precisa sair de cena antes de a pasta expandir. */
  readonly contents: HTMLSpanElement | null;
  readonly surface: HTMLButtonElement | null;
};

type Props = {
  definition: FolderDefinition;
  /** Verdadeiro quando um painel está aberto: a pasta para de aceitar input. */
  disabled: boolean;
  reducedMotion: boolean;
  onOpen: (id: string) => void;
  ref?: React.Ref<FolderHandle>;
};

export function Folder({
  definition,
  disabled,
  reducedMotion,
  onOpen,
  ref,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const contentsRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const hoverRef = useRef<gsap.core.Timeline | null>(null);

  const locked = Boolean(definition.comingSoon);

  useImperativeHandle(
    ref,
    () => ({
      get root() {
        return rootRef.current;
      },
      get body() {
        return bodyRef.current;
      },
      get contents() {
        return contentsRef.current;
      },
      get surface() {
        return surfaceRef.current;
      },
    }),
    [],
  );

  /* ----------------------------------------------------------------------
     Idle. Vive em `.drift`, que mais nada toca — por isso o movimento
     contínuo nunca briga com hover, press ou parallax.
     Amplitude bem menor que a das bolhas: pasta é objeto com peso, deve
     assentar, não flutuar.
  ---------------------------------------------------------------------- */
  useGSAP(
    () => {
      const drift = driftRef.current;
      if (!drift || reducedMotion) return;

      const { depth, phase } = definition;
      const amp = 3.5 + depth * 4;

      const oscillators = [
        gsap.to(drift, {
          x: amp * 0.7,
          duration: 7.1 + depth * 1.3,
          ease: EASE.breathe,
          yoyo: true,
          repeat: -1,
        }),
        gsap.to(drift, {
          y: -amp,
          duration: 5.3 + depth * 0.9,
          ease: EASE.breathe,
          yoyo: true,
          repeat: -1,
        }),
        gsap.to(drift, {
          rotation: 1.1 * (depth > 0.55 ? 1 : -1),
          duration: 9.7,
          ease: EASE.breathe,
          yoyo: true,
          repeat: -1,
        }),
      ];

      oscillators.forEach((tween, i) => tween.totalTime(phase + i * 1.37));
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  /* ----------------------------------------------------------------------
     Hover: a pasta levanta, ganha brilho e o loop começa a rodar dentro dela.
     Toca `.surface` (transform) e opacidades — nunca as propriedades que a
     timeline de abertura usa, então as duas coexistem sem overwrite.
  ---------------------------------------------------------------------- */
  useGSAP(
    () => {
      const timeline = gsap
        .timeline({
          paused: true,
          defaults: { duration: DUR.hover, ease: EASE.react },
        })
        .to(surfaceRef.current, { scale: 1.055, y: -12 }, 0)
        .to(glowRef.current, { opacity: 1 }, 0);

      /*
        Uma pasta pode não ter loop (`preview.src: null`), e aí o <video> nem é
        renderizado. Sem esta guarda o GSAP avisa "target null not found" a cada
        montagem — não quebra nada, mas polui o console e some no meio de um
        aviso que importe.
      */
      if (previewRef.current) {
        timeline.to(previewRef.current, { opacity: 1, duration: 0.5 }, 0.04);
      }

      hoverRef.current = timeline;
    },
    { scope: rootRef, dependencies: [locked] },
  );

  // Painel aberto: recolhe o hover e para o loop, que ninguém está vendo.
  useEffect(() => {
    if (!disabled) return;
    hoverRef.current?.reverse();
    previewRef.current?.pause();
  }, [disabled]);

  const setHover = (active: boolean) => {
    if (disabled) return;

    const timeline = hoverRef.current;
    if (timeline) {
      if (active) timeline.play();
      else timeline.reverse();
    }

    const preview = previewRef.current;
    if (!preview) return;
    if (active) void preview.play().catch(() => {});
    else preview.pause();
  };

  const setPressed = (pressed: boolean) => {
    if (disabled) return;
    gsap.to(pressRef.current, {
      scale: pressed ? 0.968 : 1,
      duration: pressed ? 0.16 : 0.6,
      ease: pressed ? EASE.react : EASE.settle,
    });
  };

  /** Pasta anunciada e vazia: recusa a abertura sem parecer quebrada. */
  const nudge = () => {
    gsap.to(pressRef.current, {
      keyframes: { x: [0, -6, 6, -3.5, 3.5, 0] },
      duration: 0.42,
      ease: "sine.out",
    });
  };

  const handleClick = () => {
    if (disabled) return;
    if (locked) {
      nudge();
      return;
    }
    onOpen(definition.id);
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-tint={definition.tint}
      data-soon={locked}
      style={
        {
          "--x-d": definition.desktop.x,
          "--y-d": definition.desktop.y,
          "--size-d": definition.desktop.size,
          "--x-m": definition.mobile.x,
          "--y-m": definition.mobile.y,
          "--size-m": definition.mobile.size,
          "--depth": definition.depth,
        } as React.CSSProperties
      }
    >
      <div className={styles.parallax}>
        <div ref={driftRef} className={styles.drift}>
          <span ref={glowRef} className={styles.glow} aria-hidden="true" />

          <div ref={pressRef} className={styles.press}>
            <button
              ref={surfaceRef}
              type="button"
              className={styles.surface}
              aria-label={
                locked
                  ? `${definition.label}, em breve`
                  : `Abrir ${definition.label}`
              }
              aria-disabled={locked || undefined}
              tabIndex={disabled ? -1 : 0}
              /*
                Hover só para quem tem ponteiro que passa por cima.

                No toque o `pointerenter` dispara igual, e a animação de hover
                sobe a pasta 12px e a aumenta 5,5%: cerca de 16px na borda de
                baixo, com o dedo ainda encostado. Quando o dedo levanta, o
                ponto de soltura pode já estar fora do botão, e aí o navegador
                entrega o `click` ao ancestral em vez de ao botão. O segundo
                toque funciona porque a pasta já está parada na posição de
                hover, e é assim que isso vira "só abre com dois toques".

                Não reproduzi em oito cenários de toque emulado, mas hover é
                estado de ponteiro que paira, e paira ninguém faz com o dedo:
                rodar essa animação no toque só pode atrapalhar.
              */
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setHover(true);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setHover(false);
                setPressed(false);
              }}
              onPointerDown={() => setPressed(true)}
              onPointerUp={() => setPressed(false)}
              onPointerCancel={() => setPressed(false)}
              onFocus={() => setHover(true)}
              onBlur={() => setHover(false)}
              onClick={handleClick}
            >
              {/*
                Sombra e vidro são irmãos, com o mesmo recorte. A sombra não
                pode ser um ancestral do vidro: `filter` num ancestral cria um
                Backdrop Root e o `backdrop-filter` passaria a amostrar o vazio.
              */}
              <span className={styles.shadow} aria-hidden="true" />
              <span className={styles.glass} aria-hidden="true" />

              <span ref={bodyRef} className={styles.body}>
                <span ref={contentsRef} className={styles.contents}>
                  {/* Abaixo do vídeo: o loop cobre o verniz ao entrar. */}
                  <span className={styles.sheen} aria-hidden="true" />

                  {definition.preview.src ? (
                    <video
                      ref={previewRef}
                      className={styles.preview}
                      src={definition.preview.src}
                      poster={definition.preview.poster ?? undefined}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      disablePictureInPicture
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  ) : null}

                  <span className={styles.meta}>
                    <FolderIcon name={definition.icon} />
                    <span className={styles.label}>{definition.label}</span>
                    <span className={styles.count}>{definition.count}</span>
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
