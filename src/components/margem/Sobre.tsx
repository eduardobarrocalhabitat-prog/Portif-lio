"use client";

import { Fragment, useRef } from "react";

import { about } from "@/data/about";
import { PROJETOS } from "@/data/margem";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./Sobre.module.css";

/* ---------------------------------------------------------------------------
   Seção 2: o manifesto com marginália.

   Uma página de livro: o texto à esquerda e uma margem estreita à direita.
   Duas palavras do texto viram fotos dentro da linha; três notas na margem
   se ligam a uma linha do texto por um fio curvo que se desenha com a
   rolagem. As notas são contagens do próprio acervo, nada estimado.
--------------------------------------------------------------------------- */

const conta = (f: string) => PROJETOS.filter((p) => p.filtro === f).length;

const NOTAS = [
  { ancora: "designer", texto: `${conta("identidade")} marcas` },
  { ancora: "Desenho", texto: `${conta("conteudo")} peças de conteúdo` },
  { ancora: "dois-pontos", texto: `${conta("sites")} sites no ar` },
];

type Token =
  | { w: string; ancora?: string }
  | { foto: string; palavra: string; pos?: string };

/* O texto, palavra por palavra, com as duas fotos no lugar das palavras. */
const TOKENS: Token[] = [
  ..."Sou".split(" ").map((w) => ({ w })),
  { w: "designer", ancora: "designer" },
  ..."de marca e interface, e trabalho de qualquer lugar do Brasil."
    .split(" ")
    .map((w) => ({ w })),
  { w: "Desenho", ancora: "Desenho" },
  ..."marcas para quem cuida de".split(" ").map((w) => ({ w })),
  { foto: "/conteudo/reel-pen.webp", palavra: "gente", pos: "50% 28%" },
  { w: ":", ancora: "dois-pontos" },
  ..."roupa limpa,".split(" ").map((w) => ({ w })),
  { foto: "/tunel/16-pitqueens-017.webp", palavra: "cachorro", pos: "35% 40%" },
  ...", perfume, escola, festa.".split(" ").map((w) => ({ w })),
];

/* Pontuação cola na palavra anterior. */
const cola = (t: Token) => "w" in t && /^[,:.]/.test(t.w);

export function Sobre() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const largo = matchMedia("(min-width: 900px)");
      const fios = Array.from(
        root.querySelectorAll<SVGPathElement>("[data-fio]"),
      );
      const notas = Array.from(
        root.querySelectorAll<HTMLElement>("[data-nota]"),
      );
      const svg = root.querySelector<SVGSVGElement>("[data-fios]")!;
      const margem = root.querySelector<HTMLElement>("[data-margem]")!;

      /* Nota na altura da sua linha; fio do fim da linha até o ponto. */
      const medir = () => {
        if (!largo.matches) {
          notas.forEach((n) => (n.style.top = ""));
          return;
        }
        const base = root.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${base.width} ${base.height}`);
        const palavras = Array.from(
          root.querySelectorAll<HTMLElement>("[data-w]"),
        ).map((w) => w.getBoundingClientRect());
        const topoMargem = margem.getBoundingClientRect().top;

        NOTAS.forEach((n, i) => {
          const a = root
            .querySelector<HTMLElement>(`[data-ancora="${n.ancora}"]`)!
            .getBoundingClientRect();
          const linha = palavras.filter(
            (r) =>
              Math.abs(r.top + r.height / 2 - (a.top + a.height / 2)) <
              a.height * 0.5,
          );
          const fimLinha = Math.max(...linha.map((r) => r.right));
          // A nota desce um pouco abaixo da linha: o fio "desce e sobe".
          const yNota = a.top + a.height * 0.5 + 24;
          notas[i].style.top = `${yNota - topoMargem}px`;
          const ponto = notas[i]
            .querySelector<HTMLElement>("[data-ponto]")!
            .getBoundingClientRect();

          const x0 = fimLinha - base.left + 16;
          const y0 = a.top - base.top + a.height * 0.55;
          const x1 = ponto.left - base.left + ponto.width / 2;
          const y1 = ponto.top - base.top + ponto.height / 2;
          const dx = x1 - x0;
          fios[i].setAttribute(
            "d",
            `M${x0},${y0} C${x0 + dx * 0.4},${y0 + 52} ${x0 + dx * 0.72},${y1 + 26} ${x1},${y1}`,
          );
        });
      };
      medir();
      const ro = new ResizeObserver(medir);
      ro.observe(root);

      if (reduzido) return () => ro.disconnect();

      gsap.from(root.querySelectorAll("[data-w]"), {
        yPercent: 60,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.022,
        scrollTrigger: {
          trigger: root.querySelector("[data-texto]"),
          start: "top 75%",
        },
      });

      // Os fios se desenham com a rolagem; a nota aparece quando o fio chega.
      gsap.set(fios, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(notas, { autoAlpha: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.querySelector("[data-texto]"),
          start: "top 60%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });
      fios.forEach((fio, i) => {
        tl.to(
          fio,
          { strokeDashoffset: 0, duration: 1, ease: "none" },
          i * 0.7,
        ).to(notas[i], { autoAlpha: 1, duration: 0.25 });
      });

      gsap.from(root.querySelectorAll("[data-logo]"), {
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.6,
        ease: "back.out(2.4)",
        stagger: 0.07,
        scrollTrigger: {
          trigger: root.querySelector("[data-logos]"),
          start: "top 88%",
        },
      });

      return () => ro.disconnect();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="sobre"
      className={styles.sobre}
      aria-labelledby="sobre-titulo"
    >
      <svg className={styles.fios} data-fios aria-hidden>
        {NOTAS.map((n) => (
          <path key={n.texto} data-fio pathLength={1} />
        ))}
      </svg>

      <div className={styles.pagina}>
        <div className={styles.coluna}>
          <h2 id="sobre-titulo" className={styles.rotulo}>
            Sobre
          </h2>

          <p className={styles.texto} data-texto>
            {TOKENS.map((t, i) => (
              <Fragment key={i}>
                {i > 0 && !cola(t) ? " " : null}
                {"foto" in t ? (
                  <span className={styles.fotoPalavra} data-w>
                    <span className="srOnly">{t.palavra}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.foto}
                      alt=""
                      loading="lazy"
                      style={{ objectPosition: t.pos }}
                    />
                  </span>
                ) : (
                  <span
                    className={styles.palavra}
                    data-w
                    data-ancora={t.ancora}
                  >
                    {t.w}
                  </span>
                )}
              </Fragment>
            ))}
          </p>

          <ul
            className={styles.logos}
            data-logos
            aria-label={about.companies.label}
          >
            {about.companies.items.map((c) => (
              <li key={c.name} className={styles.logo} data-logo title={c.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.logo ?? ""} alt={c.name} loading="lazy" />
              </li>
            ))}
          </ul>
        </div>

        <ul className={styles.margem} data-margem aria-label="Em números">
          {NOTAS.map((n, i) => (
            <li key={n.texto} className={styles.nota} data-nota>
              <span className={styles.ponto} data-ponto={i} aria-hidden />
              {n.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
