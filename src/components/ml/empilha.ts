"use client";

import type { RefObject } from "react";

import { gsap, useGSAP } from "@/lib/motion";

/**
 * Cases empilhados: cada bloco `[data-case]` fica preso e, quando o próximo
 * sobe, o `[data-palco]` dele encolhe de 1 para 0,8. Só no desktop.
 */
export function useEmpilha(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!matchMedia("(min-width: 768px)").matches) return;
      const blocos = gsap.utils.toArray<HTMLElement>("[data-case]");
      blocos.forEach((bloco, i) => {
        const proximo = blocos[i + 1];
        if (!proximo) return;
        gsap.to(bloco.querySelector("[data-palco]"), {
          scale: 0.8,
          ease: "none",
          scrollTrigger: {
            trigger: proximo,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    },
    { scope: rootRef },
  );
}
