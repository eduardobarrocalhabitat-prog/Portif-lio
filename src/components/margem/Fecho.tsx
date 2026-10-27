"use client";

import { useRef } from "react";

import { about } from "@/data/about";
import fotos from "@/data/tunel.json";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Fecho.module.css";

/* ---------------------------------------------------------------------------
   Seção 5: a frase, o contato e o rodapé.

   No lugar do depoimento de cliente da Margem entra uma frase do próprio
   Eduardo: não há depoimento real, e depoimento inventado não entra. Em volta,
   peças flutuando em profundidade, eco do túnel: as de perto grandes e
   nítidas, as de longe pequenas e desfocadas, cada uma andando com a rolagem
   na proporção da sua profundidade.
--------------------------------------------------------------------------- */

/* Pelo nome, não pelo número: a numeração das paredes muda se a lista mudar. */
const foto = (nome: string) =>
  fotos.find((f) => f.src.endsWith(`-${nome}.webp`))!.src;

/* x, y em % da seção; p = profundidade (1 perto, 0 longe); w em vw. */
const FLUTUANTES = [
  { src: foto("lavae-015"), x: 6, y: 10, p: 0.9, w: 16 },
  { src: foto("sura-community-day"), x: 78, y: 6, p: 0.7, w: 11 },
  { src: foto("extra-osgi"), x: 34, y: 2, p: 0.25, w: 7 },
  { src: foto("business-place-012"), x: 60, y: 20, p: 0.35, w: 9 },
  { src: foto("key-visual-academia"), x: 86, y: 38, p: 0.95, w: 13 },
  { src: foto("pitqueens-016"), x: 2, y: 44, p: 0.45, w: 10 },
  { src: foto("extra-fran-souza"), x: 20, y: 30, p: 0.15, w: 6 },
  { src: foto("elva-garden-story"), x: 70, y: 64, p: 0.55, w: 8 },
  { src: foto("as7"), x: 8, y: 74, p: 0.75, w: 14 },
  { src: foto("extra-layover"), x: 46, y: 80, p: 0.2, w: 7 },
  { src: foto("and-academy-017"), x: 80, y: 82, p: 0.85, w: 15 },
  { src: foto("campo-mourao"), x: 28, y: 66, p: 0.3, w: 8 },
  { src: foto("lc-perfumes"), x: 56, y: 44, p: 0.1, w: 5 },
  { src: foto("extra-sustentabilidade-em-blocos"), x: 92, y: 58, p: 0.2, w: 6 },
];

const LINKS = [
  {
    label: "LinkedIn",
    href: about.contact.links.find((l) => l.icon === "linkedin")!.href,
  },
  {
    label: "Behance",
    href: about.contact.links.find((l) => l.icon === "behance")!.href,
  },
  {
    label: "E-mail",
    href: about.contact.links.find((l) => l.icon === "email")!.href,
  },
];

export function Fecho() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const frase = root.querySelector("[data-frase]");

      root.querySelectorAll<HTMLElement>("[data-flutua]").forEach((el) => {
        const p = Number(el.dataset.flutua);
        gsap.fromTo(
          el,
          { y: 160 * p },
          {
            y: -160 * p,
            ease: "none",
            scrollTrigger: {
              trigger: frase,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // O nome sobe por baixo com a rolagem.
      gsap.fromTo(
        root.querySelector("[data-nome]"),
        { yPercent: 60 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.querySelector("[data-rodape]"),
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  const email = about.contact.links.find((l) => l.icon === "email")!;

  return (
    <section
      ref={rootRef}
      id="contato"
      className={styles.fecho}
      aria-labelledby="contato-titulo"
    >
      <div className={styles.palco} data-frase>
        {FLUTUANTES.map((f) => (
          <div
            key={f.src}
            className={styles.flutua}
            data-flutua={f.p}
            style={
              {
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: `${f.w}vw`,
                opacity: 0.45 + f.p * 0.55,
                filter:
                  f.p < 0.6 ? `blur(${((0.6 - f.p) / 0.6) * 6}px)` : undefined,
                zIndex: Math.round(f.p * 10),
              } as React.CSSProperties
            }
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.src} alt="" loading="lazy" />
          </div>
        ))}

        <blockquote className={styles.frase}>
          <p>
            Comecei desenhando marcas e descobri que o desenho só termina quando
            ele roda.
          </p>
          <footer>Eduardo Barrocal</footer>
        </blockquote>
      </div>

      <footer className={styles.rodape} data-rodape>
        <div className={styles.colunas}>
          <div className={styles.chamada}>
            <h2 id="contato-titulo">Tem uma marca para desenhar?</h2>
            <a
              className={`pillDark ${styles.grande}`}
              href={about.contact.whatsapp.href}
              target="_blank"
              rel="noreferrer"
            >
              Chamar no WhatsApp
            </a>
          </div>

          <address className={styles.endereco}>
            <a href={email.href}>{email.label}</a>
            <span>{about.contact.whatsapp.label}</span>
            <span>Brasil · trabalho remoto</span>
          </address>

          <ul className={styles.redes}>
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.nomeJanela} aria-hidden>
          <p className={styles.nome} data-nome>
            Eduardo Barrocal
          </p>
        </div>
      </footer>
    </section>
  );
}
