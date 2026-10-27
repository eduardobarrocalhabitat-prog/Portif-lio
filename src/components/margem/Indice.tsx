"use client";

import { useRef, useState } from "react";

import { useAbrir } from "@/components/margem/ViewerHost";
import { MARCAS, type Projeto } from "@/data/margem";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Indice.module.css";

/* ---------------------------------------------------------------------------
   Todas as marcas.

   Uma tabela tipográfica, só de marcas: os sites têm seção própria logo
   abaixo, e as peças de conteúdo estão em Redes. No hover (e no foco pelo
   teclado) a linha inteira vira preta de borda a borda e a capa segue o
   cursor, girada de leve. Clicar abre o manual.
--------------------------------------------------------------------------- */

const paginasDe = (p: Projeto) =>
  p.abrir.kind === "document" ? p.abrir.pages.length : 0;

export function Indice() {
  const rootRef = useRef<HTMLElement>(null);
  const fotoRef = useRef<HTMLDivElement>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const abrir = useAbrir();
  const segue = useRef<{
    x: (v: number) => void;
    y: (v: number) => void;
  } | null>(null);

  useGSAP(
    () => {
      const el = fotoRef.current!;
      segue.current = {
        x: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" }),
      };
    },
    { scope: rootRef },
  );

  const mostrar = (p: Projeto, e?: { clientX: number; clientY: number }) => {
    const el = fotoRef.current!;
    if (foto !== p.foto) {
      setFoto(p.foto);
      gsap.to(el, {
        rotate: gsap.utils.random(-5, 5),
        duration: 0.5,
        ease: "power3.out",
      });
    }
    gsap.to(el, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "power3.out" });
    if (e && segue.current) {
      segue.current.x(e.clientX + 140);
      segue.current.y(e.clientY - el.offsetHeight / 2);
    }
  };

  const esconder = () =>
    gsap.to(fotoRef.current, {
      scale: 0.6,
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.in",
    });

  return (
    <section
      ref={rootRef}
      id="marcas"
      className={styles.indice}
      aria-labelledby="marcas-titulo"
    >
      <div className={styles.topo}>
        <h2 id="marcas-titulo" className={styles.titulo}>
          Todas as marcas
        </h2>
      </div>

      <ul className={styles.linhas} onMouseLeave={esconder}>
        {MARCAS.map((p) => (
          <li key={p.cliente}>
            <button
              type="button"
              className={styles.linha}
              onMouseEnter={(e) => mostrar(p, e)}
              onMouseMove={(e) => mostrar(p, e)}
              onFocus={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mostrar(p, {
                  clientX: r.left + r.width * 0.55,
                  clientY: r.top + r.height / 2,
                });
              }}
              onBlur={esconder}
              onClick={() =>
                abrir({ title: p.cliente, cover: p.foto, source: p.abrir })
              }
            >
              <span className={styles.faixa} aria-hidden />
              <span className={styles.cliente}>{p.cliente}</span>
              <span className={styles.disciplina}>{p.disciplina}</span>
              <span className={styles.tipo}>{paginasDe(p)} páginas</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.mini} src={p.foto} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.total}>{MARCAS.length} marcas</p>

      <div ref={fotoRef} className={styles.foto} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {foto ? <img src={foto} alt="" /> : null}
      </div>
    </section>
  );
}
