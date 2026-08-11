"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * A cena precisa medir e posicionar o morph antes do paint; no servidor não há
 * layout para medir. Esta troca evita o aviso do React sem mudar o timing no
 * cliente, que é onde o efeito realmente importa.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
