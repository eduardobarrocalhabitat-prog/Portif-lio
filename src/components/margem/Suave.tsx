"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { gsap } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ---------------------------------------------------------------------------
   Rolagem suave (Lenis) ligada ao relógio do GSAP.

   Este componente vem por ÚLTIMO na página de propósito: os efeitos rodam na
   ordem da árvore, então quando ele nasce os pins do túnel e do método já
   existem. Se o Lenis nascesse antes, guardaria a altura antiga da página e
   a rolagem travaria no meio.

   Com menos movimento pedido, não há Lenis: a rolagem é a do sistema.
--------------------------------------------------------------------------- */

export function Suave() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return;
    }

    const lenis = new Lenis({ anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // As fontes mudam a altura do texto; os pins precisam medir de novo.
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      lenis.resize();
    });

    // Visualizador aberto: a página para; fechado, volta.
    const mo = new MutationObserver(() => {
      if (document.body.dataset.viewerOpen === "true") lenis.stop();
      else lenis.start();
    });
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-viewer-open"],
    });

    return () => {
      mo.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
