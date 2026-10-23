import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Vocabulário de movimento compartilhado — mantém o ritmo coeso entre peças. */
export const EASE = {
  /** Resposta a input direto (hover, press) e entradas. */
  react: "power3.out",
  /** Deslocamento de câmera no canvas da hero: sai e chega devagar. */
  pan: "power2.inOut",
} as const;

/**
 * Entrada de card: `amount` e não `each`, para 3 e 9 itens assentarem no
 * mesmo tempo.
 */
export const REVEAL = {
  duration: 0.5,
  travel: 20,
  staggerAmount: 0.42,
} as const;

export { gsap, useGSAP };
