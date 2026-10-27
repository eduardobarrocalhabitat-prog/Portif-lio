"use client";

import { useRef } from "react";

import { about } from "@/data/about";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Sobre.module.css";

/* ---------------------------------------------------------------------------
   Empresas com quem ele trabalhou.

   Uma frase grande sobre transitar entre nichos e, embaixo, as empresas.
   As áreas da frase são as das próprias empresas: inovação (inovabra),
   games (Rede Ronaldo Games), educação (Pen Education), marketing (Toth) e
   e-sports (Whido). Nada além do que elas comprovam.
--------------------------------------------------------------------------- */

const FRASE =
  "Já passei por inovação, games, educação, marketing e e-sports. Não importa o nicho: eu desenrolo.";

export function Sobre() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(root.querySelectorAll("[data-w]"), {
        yPercent: 60,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.03,
        scrollTrigger: {
          trigger: root.querySelector("[data-frase]"),
          start: "top 75%",
        },
      });

      gsap.from(root.querySelectorAll("[data-empresa]"), {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: root.querySelector("[data-empresas]"),
          start: "top 85%",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="empresas"
      className={styles.sobre}
      aria-labelledby="empresas-titulo"
    >
      <h2 id="empresas-titulo" className={styles.rotulo}>
        {about.companies.label}
      </h2>

      <p className={styles.frase} data-frase>
        {FRASE.split(" ").map((w, i) => (
          <span key={i}>
            {i > 0 ? " " : null}
            <span className={styles.palavra} data-w>
              {w}
            </span>
          </span>
        ))}
      </p>

      <ul className={styles.empresas} data-empresas>
        {about.companies.items.map((c) => (
          <li key={c.name} className={styles.empresa} data-empresa>
            <span className={styles.placa}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo ?? ""} alt="" loading="lazy" />
            </span>
            <span className={styles.nome}>{c.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
