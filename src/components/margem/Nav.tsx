"use client";

import { useEffect, useState } from "react";

import styles from "./Nav.module.css";

const LINKS = [
  { href: "#projetos", label: "Projetos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

/**
 * Nome no canto e três pílulas. Some ao rolar para baixo (passada meia tela)
 * e volta ao rolar para cima; quando volta no meio da página, traz um véu
 * off-white atrás, para nunca cobrir título, filtro ou nota.
 */
export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [veil, setVeil] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const half = window.innerHeight * 0.5;
        if (Math.abs(y - last) < 4) return;
        setHidden(y > half && y > last);
        setVeil(y > half);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={styles.nav} data-hidden={hidden} data-veil={veil}>
      <a className={styles.name} href="#topo">
        Eduardo Barrocal
      </a>
      <nav aria-label="Seções">
        <ul className={styles.pills}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a className={styles.pill} href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
