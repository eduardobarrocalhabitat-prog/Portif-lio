"use client";

import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { folders } from "@/data/folders";
import { useGSAP } from "@/lib/motion";
import styles from "./SiteNav.module.css";

const SECTIONS = [
  { id: "sobre", label: "Sobre" },
  ...folders.map((folder) => ({ id: folder.id, label: folder.label })),
];

/**
 * Barra que só existe depois da hero. Numa página de seis telas, sem ela a
 * pessoa fica refém do scroll para trocar de assunto.
 */
export function SiteNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useGSAP(() => {
    // Aparece quando a primeira seção encosta na viewport, some ao voltar.
    ScrollTrigger.create({
      trigger: "#sobre",
      start: "top 76%",
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    });

    SECTIONS.forEach(({ id }) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) setActive(id);
        },
      });
    });
  }, {});

  return (
    <nav
      className={styles.nav}
      data-visible={visible}
      aria-label="Seções"
      // Fora da ordem de tabulação enquanto está fora de vista.
      aria-hidden={!visible}
      inert={!visible || undefined}
    >
      <a className={styles.home} href="#topo" aria-label="Voltar ao topo">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 15.5V4.5M5.2 9.3L10 4.5l4.8 4.8" />
        </svg>
      </a>

      <ul className={styles.list}>
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={styles.link}
              data-active={active === section.id}
              aria-current={active === section.id ? "true" : undefined}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
