"use client";

import { useRef, useState } from "react";

import { about } from "@/data/about";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE, gsap, useGSAP } from "@/lib/motion";
import styles from "./FormatsHero.module.css";

/* ---------------------------------------------------------------------------
   Opção "Formatos".

   Um designer de marca e interface entrega a mesma ideia em muitos formatos.
   A frase troca o que ele desenha, e o artboard ao lado muda de proporção
   junto, como quem redimensiona um frame: 16:9 do manual, 16:10 do site, 9:16
   do reel, 4:5 do carrossel, 4:3 do key visual. Cada formato mostra uma peça
   real dele naquele formato.
--------------------------------------------------------------------------- */

type Format = {
  word: string;
  ratio: [number, number];
  /** Medida do arquivo de design, o que o rótulo mostra. */
  size: string;
  src: string;
  piece: string;
  to: "marcas" | "conteudo" | "sites";
};

const FORMATS: Format[] = [
  {
    word: "marcas",
    ratio: [16, 9],
    size: "1920 × 1080",
    src: "/marcas/lavae-laundry/capa.webp",
    piece: "Lavaê",
    to: "marcas",
  },
  {
    word: "sites",
    ratio: [16, 10],
    size: "1440 × 900",
    src: "/sites/as7.webp",
    piece: "as7 Comunicação",
    to: "sites",
  },
  {
    word: "reels",
    ratio: [9, 16],
    size: "1080 × 1920",
    src: "/conteudo/reel-campo.webp",
    piece: "Campo Capital",
    to: "conteudo",
  },
  {
    word: "carrosséis",
    ratio: [4, 5],
    size: "1080 × 1350",
    src: "/conteudo/pen-essa-crianca-01.webp",
    piece: "Pen Education",
    to: "conteudo",
  },
  {
    word: "key visuals",
    ratio: [4, 3],
    size: "1440 × 1080",
    src: "/conteudo/key-visual-academia.webp",
    piece: "Academia",
    to: "conteudo",
  },
];

const TEMPO = 3.2;

export function FormatsHero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  /** Quem clica num formato assume o controle; a troca automática para. */
  const manual = useRef(false);
  const goRef = useRef<(i: number) => void>(() => {});

  useGSAP(
    () => {
      const root = rootRef.current!;
      const stage = stageRef.current!;
      const frame = frameRef.current!;
      const words = root.querySelectorAll<HTMLElement>("[data-word]");
      const images = root.querySelectorAll<HTMLElement>("[data-shot]");
      let current = 0;

      /* O frame cabe no palco na proporção pedida, pelo lado que limitar. */
      const sizeFor = (f: Format) => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        const r = f.ratio[0] / f.ratio[1];
        return w / h > r
          ? { width: h * r, height: h }
          : { width: w, height: w / r };
      };

      gsap.set(frame, sizeFor(FORMATS[0]));
      gsap.set(words, { yPercent: 110 });
      gsap.set(words[0], { yPercent: 0 });
      gsap.set(images, { autoAlpha: 0 });
      gsap.set(images[0], { autoAlpha: 1 });

      const ro = new ResizeObserver(() =>
        gsap.set(frame, sizeFor(FORMATS[current])),
      );
      ro.observe(stage);

      const go = (next: number) => {
        if (next === current) return;
        const prev = current;
        current = next;
        setActive(next);
        const d = reducedMotion ? 0 : 1;

        gsap.to(words[prev], {
          yPercent: -110,
          duration: 0.55 * d,
          ease: EASE.pan,
        });
        gsap.fromTo(
          words[next],
          { yPercent: 110 },
          { yPercent: 0, duration: 0.65 * d, ease: EASE.react, delay: 0.1 * d },
        );
        // O frame é redimensionado como na ferramenta: as alças acompanham a borda.
        gsap.to(frame, {
          ...sizeFor(FORMATS[next]),
          duration: 0.85 * d,
          ease: "power3.inOut",
        });
        gsap.to(images[prev], { autoAlpha: 0, duration: 0.35 * d });
        gsap.fromTo(
          images[next],
          { autoAlpha: 0, scale: 1.08 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.9 * d,
            ease: EASE.react,
            delay: 0.25 * d,
          },
        );
      };
      goRef.current = go;

      if (reducedMotion) return () => ro.disconnect();

      /* Entrada: o nome, a frase, e o frame desenhado a partir de um ponto. */
      gsap
        .timeline({ defaults: { ease: EASE.react } })
        .from(root.querySelectorAll("[data-letter]"), {
          yPercent: 110,
          duration: 0.8,
          stagger: 0.03,
        })
        .from(
          root.querySelectorAll("[data-rise]"),
          { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.08 },
          0.35,
        )
        .from(
          frame,
          { width: 24, height: 24, duration: 1, ease: "power3.inOut" },
          0.2,
        )
        .from(
          root.querySelectorAll("[data-chip]"),
          { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.05 },
          0.9,
        );

      // A primeira troca espera a entrada terminar; depois, uma a cada TEMPO.
      let timer = gsap.delayedCall(TEMPO + 1, function tick() {
        if (!manual.current) go((current + 1) % FORMATS.length);
        timer = gsap.delayedCall(TEMPO, tick);
      });

      const io = new IntersectionObserver(([e]) =>
        e.isIntersecting ? timer.resume() : timer.pause(),
      );
      io.observe(root);

      return () => {
        ro.disconnect();
        io.disconnect();
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  const f = FORMATS[active];

  return (
    <section
      ref={rootRef}
      id="topo"
      className={styles.hero}
      aria-labelledby="hero-titulo"
    >
      <div className={styles.copy}>
        <p className={styles.name} data-rise>
          Eduardo Barrocal
        </p>

        <h1
          id="hero-titulo"
          className={styles.title}
          aria-label="Desenho marcas, sites, reels, carrosséis e key visuals"
        >
          <span className={styles.line} aria-hidden>
            {Array.from("Desenho").map((c, i) => (
              <span key={i} className={styles.mask}>
                <span data-letter>{c}</span>
              </span>
            ))}
          </span>
          <span className={`${styles.line} ${styles.swap}`} aria-hidden>
            {FORMATS.map((item) => (
              <span key={item.word} className={styles.word} data-word>
                {item.word}
              </span>
            ))}
          </span>
        </h1>

        <p className={styles.lede} data-rise>
          A mesma ideia, do manual de identidade ao site no ar, no formato em
          que ela vai ser vista.
        </p>

        <div className={styles.actions} data-rise>
          <a
            className={styles.primary}
            href={about.contact.whatsapp.href}
            target="_blank"
            rel="noreferrer"
          >
            Falar no WhatsApp
          </a>
          <a className={styles.secondary} href="#marcas">
            Ver trabalhos
          </a>
        </div>
      </div>

      <div className={styles.side}>
        <div ref={stageRef} className={styles.stage}>
          <a
            ref={frameRef}
            href={`#${f.to}`}
            className={styles.frame}
            aria-label={`${f.piece}, ${f.word}. Ir para a seção`}
          >
            <span className={styles.frameName} aria-hidden>
              {f.piece} / {f.ratio[0]}:{f.ratio[1]}
            </span>
            {FORMATS.map((item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.src}
                src={item.src}
                alt=""
                data-shot
                draggable={false}
              />
            ))}
            <i data-h="tl" />
            <i data-h="tr" />
            <i data-h="bl" />
            <i data-h="br" />
            <span className={styles.dims} aria-hidden>
              {f.size}
            </span>
          </a>
        </div>

        <div className={styles.chips} role="group" aria-label="Formatos">
          {FORMATS.map((item, i) => (
            <button
              key={item.word}
              type="button"
              className={styles.chip}
              data-chip
              aria-pressed={i === active}
              onClick={() => {
                manual.current = true;
                goRef.current(i);
              }}
            >
              <span
                className={styles.chipShape}
                style={{ aspectRatio: `${item.ratio[0]} / ${item.ratio[1]}` }}
                aria-hidden
              />
              {item.ratio[0]}:{item.ratio[1]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
