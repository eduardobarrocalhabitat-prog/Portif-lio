"use client";

import { useEffect, useState } from "react";

/**
 * Começa em `false` para que o SSR e o primeiro paint sejam iguais; o valor
 * real chega no primeiro efeito, antes de qualquer animação começar.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}
