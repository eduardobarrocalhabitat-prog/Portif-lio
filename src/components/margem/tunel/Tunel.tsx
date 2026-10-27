"use client";

import { useRef } from "react";

import { useAbrir } from "@/components/margem/ViewerHost";
import { DESTAQUES, PROJETOS, paginas } from "@/data/margem";
import { gsap, useGSAP } from "@/lib/motion";
import { DESTAQUE_Z, FIM_Z, criarCena } from "./cena";
import styles from "./Tunel.module.css";

/* ---------------------------------------------------------------------------
   Seção 1: a hero e o túnel de trabalhos.

   A seção fica presa por 11 alturas de tela. O scroll leva a câmera para
   dentro do corredor; perto de cada destaque, a foto sai da parede, cobre a
   tela e vira a abertura do case. Depois do quarto, "Quatro de N." e o
   caminho para o índice.
--------------------------------------------------------------------------- */

/* Comprimento do túnel em alturas de tela. Era 11: longo demais, parecia lento. */
const TELAS = 8;

/* O primeiro case fica aberto por volta de 1,2 tela de rolagem dentro do túnel. */
function irParaOPrimeiroCase() {
  const alvo = window.innerHeight * 1.2;
  const lenis = (
    window as Window & {
      __lenis?: { scrollTo: (y: number, o?: object) => void };
    }
  ).__lenis;
  if (lenis) lenis.scrollTo(alvo, { duration: 1.6 });
  else window.scrollTo({ top: alvo, behavior: "smooth" });
}

export function Tunel() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const abrir = useAbrir();

  useGSAP(
    () => {
      const root = rootRef.current!;
      const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cena = criarCena(
        canvasRef.current!,
        DESTAQUES.map((d) => d.foto),
        { reduzido },
      );
      const { estado } = cena;
      const barra = root.querySelector<HTMLElement>("[data-progresso]");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate() {
          cena.invalidar();
          if (barra) barra.style.transform = `scaleX(${this.progress()})`;
        },
      });

      // 1. A hero sobe e some.
      tl.to(
        root.querySelectorAll("[data-hero]"),
        { y: -30, autoAlpha: 0, duration: 0.9 },
        0,
      );

      // 2. Cada destaque: viagem, puxar, texto, segurar, sair, atravessar.
      let z = 6;
      DESTAQUES.forEach((_, k) => {
        const zk = DESTAQUE_Z[k];
        const itens = root.querySelectorAll(`[data-caso="${k}"] [data-item]`);
        const nevoa = root.querySelector(`[data-caso="${k}"] [data-nevoa]`);
        gsap.set([...itens, nevoa], { autoAlpha: 0 });

        tl.to(estado, { camZ: zk + 10, duration: (z - (zk + 10)) / 9 });
        tl.addLabel(`c${k}`);
        tl.to(
          estado.puxar[k],
          { v: 1, duration: 1.3, ease: "power2.inOut" },
          `c${k}`,
        );
        tl.to(
          estado,
          { camZ: () => cena.cobrir(k), duration: 1.3, ease: "power2.inOut" },
          `c${k}`,
        );
        tl.to(nevoa, { autoAlpha: 1, duration: 0.45 });
        tl.fromTo(
          itens,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
          "<",
        );
        tl.to({}, { duration: 1 });
        tl.to([...itens, nevoa], { autoAlpha: 0, y: -12, duration: 0.3 });
        tl.to(estado, { camZ: zk - 0.6, duration: 0.9, ease: "power2.in" });
        tl.set(estado.puxar[k], { v: 0 });
        z = zk - 0.6;
      });

      // 3. O fim do corredor.
      tl.to(estado, { camZ: FIM_Z, duration: (z - FIM_Z) / 9 });
      const fim = root.querySelectorAll("[data-fim] > *");
      gsap.set(fim, { autoAlpha: 0 });
      tl.fromTo(
        fim,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 },
      );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * TELAS}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .add(tl);

      return () => cena.destruir();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="topo"
      className={styles.tunel}
      aria-label="Trabalhos em destaque"
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden />

      {/* A hero, por cima do começo do túnel. */}
      <p className={styles.frase} data-hero>
        <span>
          Design que faz o cliente
          <br />
          parar, lembrar e chamar.
        </span>
      </p>

      <h1 className={styles.marca} data-hero>
        Eduardo
        <br />
        Barrocal
      </h1>

      {/*
        O túnel parece uma tela parada à primeira vista. O aviso é um botão de
        verdade: clicar rola até o primeiro case.
      */}
      <button
        type="button"
        className={styles.dica}
        data-hero
        onClick={irParaOPrimeiroCase}
      >
        <span className={styles.seta} aria-hidden>
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </span>
        Role para ver os projetos
      </button>

      <div className={styles.rotulos} data-hero>
        <span />
        <span className={styles.rotulo}>
          Brasil · {PROJETOS.length} projetos entregues
        </span>
      </div>

      {/* As aberturas dos quatro cases. */}
      {DESTAQUES.map((d, k) => (
        <div key={d.cliente} className={styles.caso} data-caso={k}>
          <div className={styles.nevoa} data-nevoa aria-hidden />
          <p className={styles.contador} data-item>
            {String(k + 1).padStart(2, "0")} /{" "}
            {String(DESTAQUES.length).padStart(2, "0")}
          </p>
          <div className={styles.base}>
            <div className={styles.texto}>
              <p className={styles.meta} data-item>
                {d.disciplina}
              </p>
              <h2 className={styles.cliente} data-item>
                {d.cliente}
              </h2>
              <p className={styles.resumo} data-item>
                {d.resumo}
              </p>
            </div>
            <button
              type="button"
              className="pillDark"
              data-item
              onClick={() =>
                abrir({
                  title: d.cliente,
                  cover: d.foto,
                  source: {
                    kind: "document",
                    pages: paginas(d.manual.dir, d.manual.pages),
                    label: d.disciplina,
                  },
                })
              }
            >
              Ver o projeto completo →
            </button>
          </div>
        </div>
      ))}

      {/* O fim do corredor provoca, e leva ao resto do trabalho. */}
      <div className={styles.fim} data-fim>
        <p className={styles.pergunta}>
          Seu projeto é lembrado
          <br />
          ou só visto?
        </p>
        <nav className={styles.atalhos} aria-label="Ver mais trabalhos">
          <a className="pillDark" href="#redes">
            Ver redes sociais
          </a>
          <a className="pillDark" href="#marcas">
            Ver todas as marcas
          </a>
          <a className="pillDark" href="#sites">
            Ver sites
          </a>
        </nav>
      </div>

      <div className={styles.progresso} aria-hidden>
        <span data-progresso />
      </div>
    </section>
  );
}
