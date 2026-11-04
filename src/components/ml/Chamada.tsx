"use client";

import { useRef } from "react";

import { COLUNAS_CHAMADA, CONTATO, PECAS_CHAMADA_CELULAR } from "@/data/ml";
import { gsap, useGSAP } from "@/lib/motion";
import { WhatsAppIcone } from "@/components/ml/WhatsApp";
import styles from "./Chamada.module.css";

/* ---------------------------------------------------------------------------
   Chamada final (o "Let's build something together." da referência).

   Medido: o fundo mais fundo da paleta (--rgb-bg3), presa por ~1250px; título em Urbanist 72/74,
   peso 600; dois botões de 52px lado a lado. Em volta, quatro colunas de
   peças que sobem enquanto a seção está presa, cada uma na sua velocidade,
   sem nunca passar por trás da frase.
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
      root.querySelectorAll<HTMLElement>("[data-sobe]").forEach((el) => {
        const sobe = Number(el.dataset.sobe);
        gsap.to(el, {
          y: () => -sobe * u(),
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
        {COLUNAS_CHAMADA.map((c) => (
          <div
            key={c.x}
            className={styles.coluna}
            data-sobe={c.sobe}
            aria-hidden
            style={
              {
                "--x": c.x,
                "--y": c.y,
                "--w": c.w,
                opacity: c.op,
              } as React.CSSProperties
            }
          >
            {c.fotos.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
        ))}

        {PECAS_CHAMADA_CELULAR.map((f) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f.src}
            className={styles.movel}
            src={f.src}
            alt=""
            loading="lazy"
            aria-hidden
            style={
              {
                "--mx": f.x,
                "--my": f.y,
                "--mw": f.w,
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
              <WhatsAppIcone />
              Chamar no WhatsApp
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
