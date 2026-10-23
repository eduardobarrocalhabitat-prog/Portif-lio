"use client";

import { useEffect, useRef, useState } from "react";

import { about } from "@/data/about";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE, gsap, useGSAP } from "@/lib/motion";
import styles from "./SketchHero.module.css";

/* ---------------------------------------------------------------------------
   Opção "Rascunho".

   Um site dele numa janela de navegador, e uma divisória entre o rascunho e a
   tela pronta. O rascunho não é desenhado à mão: sai da própria captura, por
   detecção de bordas (Sobel), então é o traço daquele layout e não de um
   layout genérico. A divisória segue o ponteiro, pode ser arrastada no toque
   e anda com as setas do teclado.
--------------------------------------------------------------------------- */

const SITES = [
  {
    name: "as7 Comunicação",
    host: "as7.framer.website",
    src: "/sites/as7.webp",
  },
  {
    name: "MKZ Canaã",
    host: "mkzcanaabuffet.com.br",
    src: "/sites/mkz-canaa.webp",
  },
];

/** Traço a partir da imagem: tinta onde há borda, papel onde não há. */
function sketchOf(img: HTMLImageElement): string {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const src = ctx.getImageData(0, 0, w, h).data;

  const lum = new Float32Array(w * h);
  for (let i = 0, p = 0; i < lum.length; i++, p += 4) {
    lum[i] = 0.299 * src[p] + 0.587 * src[p + 1] + 0.114 * src[p + 2];
  }

  const out = ctx.createImageData(w, h);
  const o = out.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let mag = 0;
      if (x > 0 && y > 0 && x < w - 1 && y < h - 1) {
        const gx =
          -lum[i - w - 1] -
          2 * lum[i - 1] -
          lum[i + w - 1] +
          lum[i - w + 1] +
          2 * lum[i + 1] +
          lum[i + w + 1];
        const gy =
          -lum[i - w - 1] -
          2 * lum[i - w] -
          lum[i - w + 1] +
          lum[i + w - 1] +
          2 * lum[i + w] +
          lum[i + w + 1];
        mag = Math.min(1, Math.hypot(gx, gy) / 260);
      }
      // Papel #f7f8fa, tinta #1f2533; a borda decide a mistura.
      const p = i * 4;
      o[p] = 247 - mag * (247 - 31);
      o[p + 1] = 248 - mag * (248 - 37);
      o[p + 2] = 250 - mag * (250 - 51);
      o[p + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  return canvas.toDataURL("image/webp", 0.85);
}

export function SketchHero() {
  const rootRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [site, setSite] = useState(0);
  const [sketches, setSketches] = useState<Record<string, string>>({});
  const [split, setSplit] = useState(100);
  const reducedMotion = usePrefersReducedMotion();
  const splitTween = useRef<gsap.core.Tween | null>(null);
  /** Depois que a pessoa mexe, a divisória é dela. */
  const touched = useRef(false);

  /* Gera o traço de cada site uma vez, fora do caminho do primeiro quadro. */
  useEffect(() => {
    let cancel = false;
    for (const s of SITES) {
      const img = new Image();
      img.decoding = "async";
      img.src = s.src;
      img.onload = () => {
        const run = () => {
          if (cancel) return;
          const url = sketchOf(img);
          setSketches((prev) => ({ ...prev, [s.src]: url }));
        };
        if ("requestIdleCallback" in window)
          requestIdleCallback(run, { timeout: 800 });
        else setTimeout(run, 50);
      };
    }
    return () => {
      cancel = true;
    };
  }, []);

  const animateSplit = (to: number, duration: number, delay = 0) => {
    splitTween.current?.kill();
    const state = { v: split };
    splitTween.current = gsap.to(state, {
      v: to,
      duration: reducedMotion ? 0 : duration,
      delay: reducedMotion ? 0 : delay,
      ease: "power3.inOut",
      onUpdate: () => setSplit(state.v),
    });
  };

  /* Quando o traço do site atual fica pronto, a tela "se pinta" por cima dele. */
  const ready = Boolean(sketches[SITES[site].src]);
  useEffect(() => {
    if (!ready || touched.current) return;
    animateSplit(48, 1.8, 0.4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, site]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = rootRef.current!;
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
          0.3,
        )
        .from(windowRef.current, { autoAlpha: 0, y: 40, duration: 0.9 }, 0.2);
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  const setFromPointer = (clientX: number) => {
    const r = windowRef.current!.getBoundingClientRect();
    splitTween.current?.kill();
    setSplit(gsap.utils.clamp(0, 100, ((clientX - r.left) / r.width) * 100));
  };

  const s = SITES[site];
  const sketch = sketches[s.src];

  return (
    <section
      ref={rootRef}
      id="topo"
      className={styles.hero}
      aria-labelledby="hero-titulo"
    >
      <div className={styles.head}>
        <h1
          id="hero-titulo"
          className={styles.title}
          aria-label="Eduardo Barrocal"
        >
          {["Eduardo", "Barrocal"].map((word) => (
            <span key={word} className={styles.word} aria-hidden>
              {Array.from(word).map((c, i) => (
                <span key={i} className={styles.mask}>
                  <span data-letter>{c}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className={styles.aside}>
          <p className={styles.lede} data-rise>
            Do rascunho à interface no ar. Desenho a marca, o layout e entrego a
            tela funcionando.
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
            <a className={styles.secondary} href="#sites">
              Ver sites
            </a>
          </div>
        </div>
      </div>

      <div ref={windowRef} className={styles.window}>
        <div className={styles.chrome}>
          <span className={styles.dots} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.url}>{s.host}</span>
          <div className={styles.tabs} role="group" aria-label="Site mostrado">
            {SITES.map((item, i) => (
              <button
                key={item.src}
                type="button"
                aria-pressed={i === site}
                onClick={() => {
                  if (i === site) return;
                  touched.current = false;
                  setSplit(100);
                  setSite(i);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div
          className={styles.viewport}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse" && e.buttons === 0) return;
            touched.current = true;
            setFromPointer(e.clientX);
          }}
          onPointerDown={(e) => {
            touched.current = true;
            setFromPointer(e.clientX);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.final}
            src={s.src}
            alt={`Página inicial do site ${s.name}`}
            draggable={false}
          />

          {sketch ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.sketch}
              src={sketch}
              alt=""
              draggable={false}
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            />
          ) : (
            <div
              className={styles.sketchWait}
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
              aria-hidden
            />
          )}

          <span className={`${styles.tag} ${styles.tagLeft}`} aria-hidden>
            Rascunho
          </span>
          <span className={`${styles.tag} ${styles.tagRight}`} aria-hidden>
            No ar
          </span>

          <div
            className={styles.divider}
            style={{ left: `${split}%` }}
            role="slider"
            tabIndex={0}
            aria-label="Divisória entre o rascunho e o site pronto"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(split)}
            aria-valuetext={`${Math.round(split)}% em rascunho`}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 20 : 5;
              if (e.key === "ArrowLeft")
                animateSplit(Math.max(0, split - step), 0.25);
              else if (e.key === "ArrowRight")
                animateSplit(Math.min(100, split + step), 0.25);
              else return;
              touched.current = true;
              e.preventDefault();
            }}
          >
            <span className={styles.knob} aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
