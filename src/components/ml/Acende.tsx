"use client";

import { Fragment, useRef } from "react";

import { gsap, useGSAP } from "@/lib/motion";

/**
 * Texto que acende letra por letra com a rolagem: cada letra vai de 0,1 a 1
 * de opacidade, em ordem, enquanto o gatilho atravessa o trecho [inicio, fim]
 * (px, medidos numa tela de 1440 e escalados pela largura).
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
  /** Seletor do elemento cuja posição dirige a animação; padrão: o próprio texto. */
  gatilho?: string;
  /** Distância do topo do gatilho ao topo da tela no começo e no fim, em px de 1440. */
  inicio: number;
  fim: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const letras = el.querySelectorAll("[data-l]");
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const u = () => window.innerWidth / 1440;
      gsap.fromTo(
        letras,
        { opacity: 0.1 },
        {
          opacity: 1,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: gatilho ? el.closest(gatilho) : el,
            start: () => `top ${inicio * u()}px`,
            end: () => `top ${fim * u()}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
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
