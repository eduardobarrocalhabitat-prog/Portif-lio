"use client";

import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { about } from "@/data/about";
import { folders } from "@/data/folders";
import { useGSAP } from "@/lib/motion";
import styles from "./SiteNav.module.css";

const SECTIONS = [
  { id: "sobre", label: "Sobre" },
  ...folders.map((folder) => ({ id: folder.id, label: folder.label })),
];

/*
  O botão da barra vai para o WhatsApp, que é onde ele responde. Sai do mesmo
  lugar que a seção de contato, para os dois nunca divergirem.
*/
const CONTATO = about.contact.whatsapp.href;

/**
 * A barra do topo.
 *
 * Ela sempre existe, inclusive sobre a hero: uma página que abre sem nenhum
 * ponto de apoio deixa a pessoa sem saber de quem é o site nem para onde ir.
 * O que muda com a rolagem é o peso, não a presença. Sobre a hero ela é só
 * tipografia no ar, para não competir com a cena; passada a hero, ganha vidro
 * e um fio de borda, porque aí ela precisa se separar do conteúdo que corre
 * por baixo.
 *
 * No retrato os links de seção não cabem na mesma linha do nome, e espremer
 * seria pior do que mover: eles descem para uma pílula na base, onde ainda por
 * cima ficam no alcance do polegar. A barra do topo fica com identidade e
 * contato.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useGSAP(() => {
    // O vidro entra quando a primeira seção encosta na viewport.
    ScrollTrigger.create({
      trigger: "#sobre",
      start: "top 76%",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
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

  const links = SECTIONS.map((section) => (
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
  ));

  return (
    <>
      <header className={styles.bar} data-scrolled={scrolled}>
        <a className={styles.brand} href="#topo">
          Eduardo Barrocal
          <span>Design · UI/UX · IA</span>
        </a>

        {/* Some no retrato, onde vira a pílula da base. */}
        <nav className={styles.sections} aria-label="Seções">
          <ul className={styles.list}>{links}</ul>
        </nav>

        <a
          className={styles.contact}
          href={CONTATO}
          target="_blank"
          rel="noreferrer"
        >
          Falar comigo
        </a>
      </header>

      {/*
        Só no retrato. Aparece junto com o vidro da barra, pelo mesmo motivo:
        sobre a hero as pastas já são a navegação, e uma pílula ali seria uma
        segunda proposta competindo com elas.
      */}
      <nav
        className={styles.pill}
        data-visible={scrolled}
        aria-label="Seções"
        aria-hidden={!scrolled}
        inert={!scrolled || undefined}
      >
        <ul className={styles.list}>{links}</ul>
      </nav>
    </>
  );
}
