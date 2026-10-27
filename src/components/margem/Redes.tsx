"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useAbrir } from "@/components/margem/ViewerHost";
import {
  FILTROS_REDES,
  MENSAGEM,
  whatsapp,
  REDES,
  type GrupoRede,
  type PecaRede,
} from "@/data/margem";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Redes.module.css";

/* ---------------------------------------------------------------------------
   Redes sociais.

   Post, carrossel, story e reel, cada um na proporção em que foi feito, numa
   parede de colunas que andam em velocidades diferentes com a rolagem. Os
   reels tocam mudos quando entram na tela (um loop curto, não o vídeo
   inteiro); o clique abre com som. No fim, a chamada direta: muita gente
   procura o Eduardo para as redes.
--------------------------------------------------------------------------- */

/* Quanto cada coluna anda, em px, de uma ponta à outra da seção. */
const DESLOCAMENTO = [50, 140, 80, 170];

const alturaRelativa = (ratio: string) => {
  const [w, h] = ratio.split("/").map(Number);
  return h / w;
};

/* Cada peça vai para a coluna mais baixa: as colunas terminam quase juntas. */
function distribuir(pecas: PecaRede[], n: number) {
  const cols: PecaRede[][] = Array.from({ length: n }, () => []);
  const alturas = new Array(n).fill(0);
  for (const p of pecas) {
    const i = alturas.indexOf(Math.min(...alturas));
    cols[i].push(p);
    alturas[i] += alturaRelativa(p.ratio) + 0.25;
  }
  return cols;
}

export function Redes() {
  const rootRef = useRef<HTMLElement>(null);
  const [filtro, setFiltro] = useState<GrupoRede | "tudo">("tudo");
  const [colunas, setColunas] = useState(4);
  const abrir = useAbrir();

  useEffect(() => {
    const q = [
      matchMedia("(min-width: 1100px)"),
      matchMedia("(min-width: 760px)"),
    ];
    const medir = () => setColunas(q[0].matches ? 4 : q[1].matches ? 3 : 2);
    medir();
    q.forEach((m) => m.addEventListener("change", medir));
    return () => q.forEach((m) => m.removeEventListener("change", medir));
  }, []);

  const lista =
    filtro === "tudo" ? REDES : REDES.filter((p) => p.grupo === filtro);
  const cols = useMemo(() => distribuir(lista, colunas), [lista, colunas]);

  // A altura da parede muda com o filtro: os pins e paralaxes de baixo medem de novo.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [filtro, colunas]);

  /* Paralaxe por coluna e entrada das peças. */
  useGSAP(
    () => {
      const root = rootRef.current!;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const parede = root.querySelector("[data-parede]");

      root.querySelectorAll<HTMLElement>("[data-coluna]").forEach((col, i) => {
        const d =
          DESLOCAMENTO[i % DESLOCAMENTO.length] * (colunas < 3 ? 0.4 : 1);
        gsap.fromTo(
          col,
          { y: d },
          {
            y: -d,
            ease: "none",
            scrollTrigger: {
              trigger: parede,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      const pecas = root.querySelectorAll<HTMLElement>("[data-peca]");
      gsap.set(pecas, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(pecas, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
          }),
      });
    },
    { scope: rootRef, dependencies: [colunas], revertOnUpdate: true },
  );

  /* Os reels tocam enquanto estão na tela e param quando saem. */
  useEffect(() => {
    const root = rootRef.current!;
    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const economia = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    if (reduzido || economia) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          const v = target as HTMLVideoElement;
          if (isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35 },
    );
    root.querySelectorAll("video").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [cols]);

  const abrirPeca = (p: PecaRede) =>
    abrir({
      title: p.detalhe ? `${p.cliente} · ${p.detalhe}` : p.cliente,
      cover: p.foto,
      source: p.abrir,
    });

  return (
    <section
      ref={rootRef}
      id="redes"
      className={styles.redes}
      aria-labelledby="redes-titulo"
    >
      <div className={styles.topo}>
        <h2 id="redes-titulo" className={styles.titulo}>
          Redes sociais
        </h2>
        <div className={styles.lado}>
          <p className={styles.texto}>
            Conteúdo que segura o dedo no feed. Post, carrossel, story e reel
            para a sua marca aparecer todo dia e virar conversa.
          </p>
          <div
            className={styles.filtros}
            role="group"
            aria-label="Filtrar por formato"
          >
            {FILTROS_REDES.map((f) => (
              <button
                key={f.id}
                type="button"
                className={styles.filtro}
                aria-pressed={filtro === f.id}
                onClick={() => setFiltro(f.id)}
              >
                {f.rotulo}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={styles.parede}
        data-parede
        style={{ "--n": colunas } as React.CSSProperties}
      >
        {cols.map((col, i) => (
          <div key={i} className={styles.coluna} data-coluna>
            {col.map((p) => (
              <figure key={p.foto} className={styles.peca} data-peca>
                <button
                  type="button"
                  className={styles.quadro}
                  style={{ aspectRatio: p.ratio.replace("/", " / ") }}
                  onClick={() => abrirPeca(p)}
                  aria-label={`Abrir ${p.formato.toLowerCase()}: ${p.cliente}${p.detalhe ? `, ${p.detalhe}` : ""}`}
                >
                  {p.previa ? (
                    <video
                      src={p.previa}
                      poster={p.foto}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.foto} alt="" loading="lazy" decoding="async" />
                  )}
                  <span
                    className={styles.selo}
                    data-video={Boolean(p.previa)}
                    aria-hidden
                  >
                    {p.previa ? (
                      <svg viewBox="0 0 12 12">
                        <path d="M3 2l7 4-7 4z" />
                      </svg>
                    ) : null}
                    {p.formato}
                  </span>
                </button>
                <figcaption className={styles.legenda}>
                  <span className={styles.cliente}>{p.cliente}</span>
                  {p.detalhe ? (
                    <span className={styles.detalhe}>{p.detalhe}</span>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.chamada}>
        <p>Sua marca aparece pouco nas redes?</p>
        <a
          className="pillDark"
          href={whatsapp(MENSAGEM.redes)}
          target="_blank"
          rel="noreferrer"
        >
          Quero conteúdo para as minhas redes
        </a>
      </div>
    </section>
  );
}
