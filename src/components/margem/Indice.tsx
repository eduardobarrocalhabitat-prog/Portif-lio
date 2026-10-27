"use client";

import { useRef, useState } from "react";

import { useAbrir } from "@/components/margem/ViewerHost";
import {
  FILTROS,
  PROJETOS,
  ROTULO_FILTRO,
  type Filtro,
  type Projeto,
} from "@/data/margem";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Indice.module.css";

/* ---------------------------------------------------------------------------
   Seção 4: todos os projetos.

   Uma tabela tipográfica. No hover (e no foco pelo teclado) a linha inteira
   vira terracota de borda a borda e a foto do projeto segue o cursor, girada
   de leve. Clicar abre o manual, o carrossel, o vídeo ou o site.
--------------------------------------------------------------------------- */

export function Indice() {
  const rootRef = useRef<HTMLElement>(null);
  const fotoRef = useRef<HTMLDivElement>(null);
  const [filtro, setFiltro] = useState<Filtro | "todos">("todos");
  const [foto, setFoto] = useState<string | null>(null);
  const abrir = useAbrir();
  const segue = useRef<{
    x: (v: number) => void;
    y: (v: number) => void;
  } | null>(null);

  const lista =
    filtro === "todos" ? PROJETOS : PROJETOS.filter((p) => p.filtro === filtro);

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

  const abrirProjeto = (p: Projeto) =>
    abrir({ title: p.cliente, cover: p.foto, source: p.abrir });

  return (
    <section
      ref={rootRef}
      id="projetos"
      className={styles.indice}
      aria-labelledby="projetos-titulo"
    >
      <div className={styles.topo}>
        <h2 id="projetos-titulo" className={styles.titulo}>
          Todos os projetos
        </h2>
        <div
          className={styles.filtros}
          role="group"
          aria-label="Filtrar projetos"
        >
          {FILTROS.map((f) => (
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

      <ul className={styles.linhas} onMouseLeave={esconder}>
        {lista.map((p) => (
          <li key={`${p.cliente}-${p.disciplina}`}>
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
              onClick={() => abrirProjeto(p)}
            >
              <span className={styles.faixa} aria-hidden />
              <span className={styles.cliente}>{p.cliente}</span>
              <span className={styles.disciplina}>{p.disciplina}</span>
              <span className={styles.tipo}>{ROTULO_FILTRO[p.filtro]}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.mini} src={p.foto} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.total} aria-live="polite">
        {lista.length} de {PROJETOS.length} projetos
      </p>

      <div ref={fotoRef} className={styles.foto} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {foto ? <img src={foto} alt="" /> : null}
      </div>
    </section>
  );
}
