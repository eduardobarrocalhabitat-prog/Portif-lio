"use client";

import { useRef, useState } from "react";

import { METODO } from "@/data/margem";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Metodo.module.css";

/* ---------------------------------------------------------------------------
   Seção 3: como uma marca nasce aqui.

   Uma tira de filme com a mesma marca em quatro estados, tirados do manual
   da AND Academy. A seção fica presa por 2,6 telas; a rolagem desliza a tira
   para o quadro ativo passar pelo centro, sem sobrar vazio nas pontas, e a
   régua embaixo enche junto.
--------------------------------------------------------------------------- */

export function Metodo() {
  const rootRef = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(0);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const tira = root.querySelector<HTMLElement>("[data-tira]")!;
      const fio = root.querySelector<HTMLElement>("[data-fio]")!;
      const quadros = Array.from(
        root.querySelectorAll<HTMLElement>("[data-quadro]"),
      );

      // Quanto a tira pode andar: até o último quadro encostar na borda direita.
      const curso = () => Math.max(0, tira.scrollWidth - window.innerWidth);
      // O quadro i no centro, limitado às pontas.
      const xDe = (i: number) => {
        const q = quadros[i];
        const centro = q.offsetLeft + q.offsetWidth / 2 - window.innerWidth / 2;
        return -Math.min(curso(), Math.max(0, centro));
      };

      const estado = { p: 0 };
      gsap.to(estado, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.6}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const n = quadros.length - 1;
          const pos = estado.p * n;
          const i = Math.floor(pos);
          const f = pos - i;
          const x = i >= n ? xDe(n) : xDe(i) + (xDe(i + 1) - xDe(i)) * f;
          tira.style.transform = `translate3d(${x}px, 0, 0)`;
          fio.style.transform = `scaleX(${estado.p})`;
          const atual = Math.round(pos);
          setAtivo(atual);
          quadros.forEach(
            (q, k) => (q.style.opacity = k === atual ? "1" : "0.72"),
          );
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="metodo"
      className={styles.metodo}
      aria-labelledby="metodo-titulo"
    >
      <div className={styles.topo}>
        <h2 id="metodo-titulo" className={styles.titulo}>
          Como uma marca nasce aqui
        </h2>
        <p className={styles.legenda}>AND Academy, do conceito à aplicação.</p>
      </div>

      <div className={styles.janela}>
        <div className={styles.tira} data-tira>
          {METODO.map((m, i) => (
            <figure key={m.rotulo} className={styles.quadro} data-quadro>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.foto}
                alt={`AND Academy, ${m.rotulo.toLowerCase()}: página do manual`}
                loading="lazy"
              />
              <figcaption className="srOnly">
                {String(i + 1).padStart(2, "0")} {m.rotulo}. {m.frase}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className={styles.regua} aria-hidden>
        <div className={styles.trilho}>
          <span className={styles.cheio} data-fio />
        </div>
        <ol className={styles.etapas}>
          {METODO.map((m, i) => (
            <li
              key={m.rotulo}
              className={styles.etapa}
              data-ativo={i === ativo}
            >
              <span className={styles.marca} />
              <span className={styles.nome}>
                {String(i + 1).padStart(2, "0")} {m.rotulo}
              </span>
              <span className={styles.frase}>{m.frase}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
