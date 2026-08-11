import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Vocabulário de movimento compartilhado — mantém o ritmo coeso entre peças. */
export const EASE = {
  /** Curva do morph da bolha: sai devagar, chega devagar. */
  glass: "power3.inOut",
  /** Resposta a input direto (hover, press). */
  react: "power3.out",
  /** Respiração contínua do idle. */
  breathe: "sine.inOut",
  /** Volta do press. */
  settle: "elastic.out(1, 0.6)",
} as const;

/**
 * Entrada de card validada na tese: `amount` e não `each`, para 3 e 9 itens
 * assentarem no mesmo tempo. Vale no teaser do painel e nas seções.
 */
export const REVEAL = {
  duration: 0.5,
  travel: 20,
  staggerAmount: 0.42,
} as const;

export const DUR = {
  hover: 0.42,
  objectOut: 0.3,
  morph: 0.78,
  content: 0.5,
  /* Perto de `morph` de propósito: se o véu fecha muito antes, sobra um
     instante de tela lavada com a bolha ainda pequena no meio. */
  scrim: 0.7,
} as const;

export { gsap, useGSAP };
