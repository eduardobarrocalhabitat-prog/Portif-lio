"use client";

import { useRef } from "react";

import { useAbrir } from "@/components/margem/ViewerHost";
import { useEmpilha } from "@/components/ml/empilha";
import { SITES_NO_AR } from "@/data/ml";
import styles from "./Sites.module.css";

/* ---------------------------------------------------------------------------
   Sites no ar.

   O mesmo empilhamento dos projetos, com a forma de um site: a captura
   aparece inteira, de ponta a ponta, numa moldura de navegador com o
   endereço; ao lado, o número, o resumo, a ferramenta e dois botões, um
   para navegar no site aqui mesmo e outro para abrir em outra aba.
--------------------------------------------------------------------------- */

export function Sites() {
  const rootRef = useRef<HTMLElement>(null);
  const abrir = useAbrir();

  useEmpilha(rootRef);

  return (
    <section
      ref={rootRef}
      id="sites"
      className={styles.secao}
      aria-labelledby="sites-titulo"
    >
      <div className={styles.cabeca}>
        <h2 id="sites-titulo" className={styles.titulo}>
          SITES.
        </h2>
        <p className={`rotulo ${styles.rotulo}`}>[ No ar ]</p>
      </div>

      {SITES_NO_AR.map((s, i) => (
        <article key={s.url} className={styles.site} data-case>
          <div className={styles.palco} data-palco>
            <button
              type="button"
              className={styles.janela}
              onClick={() =>
                abrir({ title: s.nome, cover: s.foto, source: s.abrir.source })
              }
              aria-label={`Navegar no site ${s.nome}`}
            >
              <span className={styles.barra} aria-hidden>
                <span className={styles.pontos}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.endereco}>{s.dominio}</span>
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.foto} alt="" loading="lazy" />
            </button>

            <div className={styles.info}>
              <p className={styles.numero} aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.nome}>{s.titulo}</h3>
              <p className={styles.tags}>{s.stack}</p>
              <div className={styles.botoes}>
                <button
                  type="button"
                  className="btnCreme"
                  onClick={() =>
                    abrir({
                      title: s.nome,
                      cover: s.foto,
                      source: s.abrir.source,
                    })
                  }
                >
                  Navegar aqui
                </button>
                <a
                  className="btnEscuro"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir o site
                  <svg className={styles.seta} viewBox="0 0 20 20" aria-hidden>
                    <path d="M6 14 14 6M7.5 6H14v6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
