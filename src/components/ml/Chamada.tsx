"use client";

import { useRef } from "react";

import { CONTATO, FLUTUANDO } from "@/data/ml";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Chamada.module.css";

/* ---------------------------------------------------------------------------
   Chamada final (o "Let's build something together." da referência).

   Medido: fundo rgb(14,14,11), presa por ~1250px; título em Urbanist 72/74,
   peso 600; dois botões de 52px lado a lado. As imagens em volta sobem, cada
   uma na sua velocidade e opacidade, enquanto a seção está presa: as mais
   lentas e apagadas parecem mais longe.
--------------------------------------------------------------------------- */

const PRESA = 1250;

export function Chamada() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      /* No celular as peças ficam paradas, emoldurando a frase. */
      if (!matchMedia("(min-width: 768px)").matches) return;
      const u = () => window.innerWidth / 1440;
      root.querySelectorAll<HTMLElement>("[data-v]").forEach((el) => {
        const v = Number(el.dataset.v);
        gsap.to(el, {
          y: () => -(v / 400) * PRESA * u(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${PRESA * u()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className={styles.secao}
      aria-labelledby="chamada-titulo"
    >
      <div className={styles.preso}>
        {FLUTUANDO.map((f) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f.src}
            className={`${styles.flutua} ${f.m ? "" : styles.soDesktop}`}
            src={f.src}
            alt=""
            loading="lazy"
            data-v={f.v}
            style={
              {
                "--x": f.x,
                "--y": f.y,
                "--w": f.w,
                "--mx": f.m?.x,
                "--my": f.m?.y,
                "--mw": f.m?.w,
                opacity: f.op,
              } as React.CSSProperties
            }
          />
        ))}

        <div className={styles.centro}>
          <h2 id="chamada-titulo" className={styles.titulo}>
            Vamos construir algo juntos.
          </h2>
          <div className={styles.botoes}>
            <a
              className="btnCreme"
              href={CONTATO.orcamento}
              target="_blank"
              rel="noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="avatar" src="/media/eduardo-avatar.webp" alt="" />
              Orçamento
            </a>
            <a className="btnEscuro" href="#projetos">
              Ver os projetos
              <svg className={styles.seta} viewBox="0 0 20 20" aria-hidden>
                <path d="M3 10h13M10.5 4.5 16 10l-5.5 5.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
