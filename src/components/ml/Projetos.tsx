"use client";

import { useRef } from "react";

import { useAbrir } from "@/components/margem/ViewerHost";
import { useEmpilha } from "@/components/ml/empilha";
import { CASES } from "@/data/ml";
import styles from "./Projetos.module.css";

/* ---------------------------------------------------------------------------
   Projetos (o FEATURED. da referência): as quatro marcas. Os sites têm a
   seção deles logo depois.

   Medido: título de 144/129.6, peso 700, −4px; cada case é uma tela presa
   (sticky) com 972px de passo; card de 594×594 em x=110; número de 72px a
   24px acima do card; título de 32/38.4; tags de 18/21.6 e "Próximo projeto"
   alinhados ao pé do card. Quando o próximo case sobe, o anterior encolhe de
   1 para 0,8 em torno do centro da tela.
--------------------------------------------------------------------------- */

export function Projetos() {
  const rootRef = useRef<HTMLElement>(null);
  const abrir = useAbrir();

  useEmpilha(rootRef);

  return (
    <section
      ref={rootRef}
      id="projetos"
      className={styles.secao}
      aria-labelledby="projetos-titulo"
    >
      <div className={styles.cabeca}>
        <h2 id="projetos-titulo" className={styles.titulo}>
          PROJETOS.
        </h2>
        <p className={`rotulo ${styles.rotulo}`}>[ Cases ]</p>
      </div>

      {CASES.map((c, i) => (
        <article key={c.titulo} className={styles.case} data-case>
          <div className={styles.palco} data-palco>
            <button
              type="button"
              className={styles.card}
              onClick={() =>
                abrir({
                  title: c.abrir.title,
                  cover: c.foto,
                  source: c.abrir.source,
                })
              }
              aria-label={`Abrir ${c.abrir.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.foto} alt="" loading="lazy" />
            </button>

            <p className={styles.numero} aria-hidden>
              {i + 1}
            </p>
            <h3 className={styles.nome}>{c.titulo}</h3>
            <p className={styles.tags}>{c.tags}</p>
            <a
              className={styles.proximo}
              href={i < CASES.length - 1 ? undefined : "#sites"}
              onClick={(e) => {
                if (i < CASES.length - 1) {
                  e.preventDefault();
                  const alvo = e.currentTarget.closest("[data-case]")
                    ?.nextElementSibling as HTMLElement | null;
                  alvo?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              role={i < CASES.length - 1 ? "button" : undefined}
              tabIndex={0}
            >
              {i < CASES.length - 1 ? "Próximo projeto" : "Sites"}
              <svg viewBox="0 0 20 20" aria-hidden>
                <path d="M10 3v13M4.5 10.5 10 16l5.5-5.5" />
              </svg>
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
