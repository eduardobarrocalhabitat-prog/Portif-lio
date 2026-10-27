"use client";

import { useRef } from "react";

import { useAbrir } from "@/components/margem/ViewerHost";
import { SITES } from "@/data/margem";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Sites.module.css";

/* ---------------------------------------------------------------------------
   Sites no ar.

   Um palco alternado: cada site é uma linha grande, com a captura numa
   moldura de navegador de um lado e o texto do outro, trocando de lado a cada
   linha. Feito para crescer: um site novo é um item a mais nos dados, e a
   seção se ajusta sozinha.

   "Navegar aqui" abre o site dentro do visualizador, num iframe; "Abrir o
   site" vai para uma aba nova.
--------------------------------------------------------------------------- */

export function Sites() {
  const rootRef = useRef<HTMLElement>(null);
  const abrir = useAbrir();

  useGSAP(
    () => {
      const root = rootRef.current!;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      root.querySelectorAll<HTMLElement>("[data-site]").forEach((linha) => {
        const janela = linha.querySelector("[data-janela]");
        const tela = linha.querySelector("[data-tela]");
        const textos = linha.querySelectorAll("[data-texto]");

        // A moldura abre de baixo para cima; o texto entra depois, em escada.
        gsap
          .timeline({
            scrollTrigger: { trigger: linha, start: "top 78%", once: true },
          })
          .fromTo(
            janela,
            { clipPath: "inset(18% 0% 0% 0% round 10px)", y: 40 },
            {
              clipPath: "inset(0% 0% 0% 0% round 10px)",
              y: 0,
              duration: 1,
              ease: "power3.out",
            },
          )
          .from(
            textos,
            {
              y: 24,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.25,
          );

        // A captura anda dentro da moldura com a rolagem: a página "desce".
        gsap.fromTo(
          tela,
          { yPercent: 0 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: linha,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="sites"
      className={styles.sites}
      aria-labelledby="sites-titulo"
    >
      <div className={styles.topo}>
        <h2 id="sites-titulo" className={styles.titulo}>
          Sites no ar
        </h2>
        <p className={styles.conta}>
          {SITES.length} {SITES.length === 1 ? "site" : "sites"} · quer o seu no
          ar?
        </p>
      </div>

      <ol className={styles.lista}>
        {SITES.map((s, i) => (
          <li
            key={s.url}
            className={styles.linha}
            data-site
            data-lado={i % 2 ? "direita" : "esquerda"}
          >
            <button
              type="button"
              className={styles.janela}
              data-janela
              onClick={() =>
                abrir({
                  title: s.nome,
                  cover: s.foto,
                  source: { kind: "site", url: s.url, label: s.stack },
                })
              }
              aria-label={`Navegar no site ${s.nome} aqui dentro`}
            >
              <span className={styles.barra} aria-hidden>
                <span className={styles.pontos}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.url}>{s.dominio}</span>
              </span>
              <span className={styles.visor}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.foto} alt="" loading="lazy" data-tela />
              </span>
            </button>

            <div className={styles.texto}>
              <p className={styles.numero} data-texto>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.nome} data-texto>
                {s.nome}
              </h3>
              {s.resumo ? (
                <p className={styles.resumo} data-texto>
                  {s.resumo}
                </p>
              ) : null}
              <p className={styles.meta} data-texto>
                <span className={styles.noAr} aria-hidden />
                No ar · {s.stack}
              </p>
              <div className={styles.acoes} data-texto>
                <button
                  type="button"
                  className="pillDark"
                  onClick={() =>
                    abrir({
                      title: s.nome,
                      cover: s.foto,
                      source: { kind: "site", url: s.url, label: s.stack },
                    })
                  }
                >
                  Navegar aqui
                </button>
                <a
                  className={styles.externo}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir o site ↗
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
