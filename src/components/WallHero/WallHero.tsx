"use client";

import { useRef } from "react";

import { about } from "@/data/about";
import { folders } from "@/data/folders";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE, gsap, useGSAP } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WallHero.module.css";

/* ---------------------------------------------------------------------------
   Opção "Parede".

   O acervo inteiro em movimento: três colunas correndo em sentidos
   alternados, cada peça na proporção em que foi feita. A rolagem da página dá
   impulso às colunas; o ponteiro em cima de uma coluna quase a para, para a
   peça poder ser lida.

   As peças saem dos mesmos dados das seções, então peça nova entra aqui sem
   ninguém lembrar.
--------------------------------------------------------------------------- */

type Piece = { src: string; label: string; ratio: string; to: string };

function collect(): Piece[] {
  const out: Piece[] = [];
  for (const folder of folders) {
    const c = folder.panel.content;
    if (c.kind === "brands") {
      for (const b of c.items)
        if (b.image)
          out.push({
            src: b.image,
            label: b.name,
            ratio: "16 / 9",
            to: folder.id,
          });
    } else if (c.kind === "gallery") {
      for (const g of c.items) {
        const src = g.image ?? g.poster;
        if (src)
          out.push({
            src,
            label: g.title,
            ratio: g.ratio.replace("/", " / "),
            to: folder.id,
          });
      }
    } else if (c.kind === "sites") {
      for (const s of c.items)
        if (s.image)
          out.push({
            src: s.image,
            label: s.name,
            ratio: "16 / 10",
            to: folder.id,
          });
    }
  }
  return out;
}

const PIECES = collect();
const COLUMNS = 3;
/* Distribui alternando, para cada coluna misturar marca, conteúdo e site. */
const COLS = Array.from({ length: COLUMNS }, (_, c) =>
  PIECES.filter((_, i) => i % COLUMNS === c),
);
/** Segundos para uma coluna dar a volta. Diferentes, para não marcharem juntas. */
const DURATIONS = [48, 60, 54];

export function WallHero() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current!;
      if (reducedMotion) return;

      const tracks = root.querySelectorAll<HTMLElement>("[data-track]");
      const loops = Array.from(tracks).map((track, i) => {
        // A lista vai duas vezes: andar metade da altura fecha o laço sem emenda.
        const up = i % 2 === 0;
        return gsap.fromTo(
          track,
          { yPercent: up ? 0 : -50 },
          {
            yPercent: up ? -50 : 0,
            duration: DURATIONS[i],
            ease: "none",
            repeat: -1,
          },
        );
      });

      /* Rolar a página dá impulso; o impulso decai sozinho. */
      const boost = { v: 1 };
      const apply = () =>
        loops.forEach((l) => l.timeScale(boost.v * (l.data?.hover ? 0.12 : 1)));
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(
            1,
            7,
            1 + Math.abs(self.getVelocity()) / 250,
          );
          gsap.to(boost, {
            v,
            duration: 0.2,
            overwrite: true,
            onUpdate: apply,
          });
          gsap.to(boost, {
            v: 1,
            duration: 1.2,
            delay: 0.25,
            ease: "power2.out",
            onUpdate: apply,
          });
        },
      });

      /* Ponteiro em cima: a coluna quase para. */
      tracks.forEach((track, i) => {
        const col = track.parentElement!;
        col.addEventListener("pointerenter", (e) => {
          if (e.pointerType !== "mouse") return;
          loops[i].data = { hover: true };
          gsap.to(loops[i], { timeScale: 0.12 * boost.v, duration: 0.5 });
        });
        col.addEventListener("pointerleave", () => {
          loops[i].data = { hover: false };
          gsap.to(loops[i], { timeScale: boost.v, duration: 0.6 });
        });
      });

      /* Entrada: o nome sobe, as colunas chegam de baixo em escada. */
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
          root.querySelectorAll("[data-col]"),
          {
            yPercent: 18,
            autoAlpha: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.1,
        );

      const io = new IntersectionObserver(([e]) =>
        loops.forEach((l) => (e.isIntersecting ? l.resume() : l.pause())),
      );
      io.observe(root);
      return () => io.disconnect();
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={rootRef}
      id="topo"
      className={styles.hero}
      aria-labelledby="hero-titulo"
    >
      <div className={styles.copy}>
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

        <p className={styles.lede} data-rise>
          Desenho marcas e as interfaces onde elas vivem. Ao lado,{" "}
          {PIECES.length} peças reais, do manual de identidade ao site no ar.
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

      <div className={styles.wall} aria-label="Peças do portfólio">
        {COLS.map((col, c) => (
          <div key={c} className={styles.col} data-col>
            <div className={styles.track} data-track>
              {[0, 1].map((copy) =>
                col.map((p) => (
                  <a
                    key={`${copy}-${p.src}`}
                    href={`#${p.to}`}
                    className={styles.piece}
                    style={{ aspectRatio: p.ratio }}
                    aria-hidden={copy === 1 || undefined}
                    tabIndex={copy === 1 ? -1 : undefined}
                    draggable={false}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <span className={styles.label}>{p.label}</span>
                  </a>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
