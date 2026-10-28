"use client";

import { useEffect, useRef } from "react";

import { Acende } from "@/components/ml/Acende";
import { useAbrir } from "@/components/margem/ViewerHost";
import { SUBINDO } from "@/data/ml";
import styles from "./OQueFaco.module.css";

/* ---------------------------------------------------------------------------
   O que eu faço.

   Medido: a seção tem 3464px de altura em 1440 e prende o bloco de texto; a
   frase de 72/72, peso 600, acende entre 300 e 2100 px de rolagem da página
   (topo da seção a 600px e a −1200px do topo da tela). Os quadros de 384×384
   sobem no ritmo normal, por cima do texto, nas colunas x=112, 528 e 944.
--------------------------------------------------------------------------- */

const COLUNAS = [112, 528, 944];

export function OQueFaco() {
  const rootRef = useRef<HTMLElement>(null);
  const abrir = useAbrir();

  /* Os reels tocam mudos enquanto o quadro está na tela. */
  useEffect(() => {
    const root = rootRef.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach(({ target, isIntersecting }) => {
          const v = target as HTMLVideoElement;
          if (isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.3 },
    );
    root.querySelectorAll("video").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="o-que-faco"
      className={styles.secao}
      aria-labelledby="faco-titulo"
    >
      <div className={styles.preso}>
        <p id="faco-titulo" className={`rotulo ${styles.rotulo}`}>
          [ O que eu faço ]
        </p>
        <Acende
          className={styles.frase}
          gatilho="section"
          inicio={600}
          fim={-1200}
          texto="Marcas, conteúdo e sites para empresas que querem ser lembradas, não só vistas."
        />
        <p className={styles.sub}>
          da inovação aos e-sports, com 6 empresas no currículo.
        </p>
      </div>

      {SUBINDO.map(({ peca, col, top }) => (
        <button
          key={peca.foto}
          type="button"
          className={styles.quadro}
          style={{ "--x": COLUNAS[col], "--y": top } as React.CSSProperties}
          onClick={() =>
            abrir({
              title: peca.detalhe
                ? `${peca.cliente} · ${peca.detalhe}`
                : peca.cliente,
              cover: peca.foto,
              source: peca.abrir,
            })
          }
          aria-label={`Abrir ${peca.formato.toLowerCase()}: ${peca.cliente}`}
        >
          {/* O fundo é a própria peça, desfocada: a peça fica inteira no meio. */}
          <span
            className={styles.fundo}
            style={{ backgroundImage: `url(${peca.foto})` }}
            aria-hidden
          />
          {peca.previa ? (
            <video
              src={peca.previa}
              poster={peca.foto}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={peca.foto} alt="" loading="lazy" />
          )}
        </button>
      ))}
    </section>
  );
}
