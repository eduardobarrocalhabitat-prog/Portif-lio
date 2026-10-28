"use client";

import { Fragment, useRef } from "react";

import { gsap, useGSAP } from "@/lib/motion";

/**
 * Texto que acende letra por letra com a rolagem: cada letra vai de 0,1 a 1
 * de opacidade, em ordem.
 *
 * Com `gatilho` (o texto preso da seção), o trecho é medido na referência:
 * [inicio, fim] em px de 1440, escalados pela largura. Sem ele, e sempre no
 * celular, a frase acende enquanto passa pelo meio da tela: começa quando o
 * topo dela chega a 75% da altura e termina quando o pé chega a 45%.
 */
export function Acende({
  texto,
  className,
  gatilho,
  inicio,
  fim,
}: {
  texto: string;
  className?: string;
  /** Seletor do elemento cuja posição dirige a animação no desktop. */
  gatilho?: string;
  /** Distância do topo do gatilho ao topo da tela no começo e no fim, em px de 1440. */
  inicio?: number;
  fim?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const letras = el.querySelectorAll("[data-l]");
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const u = () => window.innerWidth / 1440;
      const acender = (scrollTrigger: ScrollTrigger.Vars) =>
        gsap.fromTo(
          letras,
          { opacity: 0.1 },
          { opacity: 1, ease: "none", stagger: 1, scrollTrigger },
        );

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (gatilho && inicio !== undefined && fim !== undefined)
          acender({
            trigger: el.closest(gatilho),
            start: () => `top ${inicio * u()}px`,
            end: () => `top ${fim * u()}px`,
            scrub: true,
            invalidateOnRefresh: true,
          });
        else
          acender({
            trigger: el,
            start: "top 75%",
            end: "bottom 45%",
            scrub: true,
          });
      });
      mm.add("(max-width: 767px)", () => {
        acender({
          trigger: el,
          start: "top 75%",
          end: "bottom 45%",
          scrub: true,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const palavras = texto.split(" ");
  return (
    <p ref={ref} className={className} aria-label={texto}>
      {palavras.map((p, i) => (
        <Fragment key={i}>
          <span
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
            aria-hidden
          >
            {Array.from(p).map((c, j) => (
              <span key={j} data-l>
                {c}
              </span>
            ))}
          </span>
          {i < palavras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
