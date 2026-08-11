"use client";

import { useEffect, useState } from "react";

/**
 * Começa em `false` para que o SSR e o primeiro paint sejam iguais.
 * Os componentes que dependem disso só montam depois de uma interação, então
 * o valor real já chegou quando eles aparecem.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setMatches(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
