"use client";

import { useRef } from "react";

import { WorkGrid } from "@/components/WorkGrid/WorkGrid";
import type { FolderDefinition } from "@/data/folders";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE, REVEAL, gsap, useGSAP } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WorkSection.module.css";

type Props = {
  definition: FolderDefinition;
  /** Posição na sequência, mostrada como 01 / 04. */
  index: number;
  total: number;
};

export function WorkSection({ definition, index, total }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { panel, label, id, tint } = definition;

  /*
    Mesma entrada do teaser, e pelo mesmo motivo: `amount` no lugar de `each`,
    para uma seção de 3 peças e uma de 9 assentarem no mesmo tempo. O que muda
    é o gatilho — lá foi o clique, aqui é a seção chegar na viewport.
  */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion) return;

      const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!targets.length) return;

      gsap.set(targets, { opacity: 0, y: REVEAL.travel });

      ScrollTrigger.batch(targets, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: REVEAL.duration,
            ease: EASE.react,
            stagger: { amount: REVEAL.staggerAmount },
          }),
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={rootRef}
      id={id}
      className={styles.section}
      style={{ "--tint": `var(--tint-${tint})` } as React.CSSProperties}
      aria-labelledby={`${id}-title`}
    >
      <header className={styles.head}>
        <p className={styles.index} data-reveal>
          <span className={styles.dot} />
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          <span className={styles.kicker}>{panel.kicker}</span>
        </p>

        {/* tabIndex −1: o botão "Explorar" manda o foco para cá ao rolar. */}
        <h2
          id={`${id}-title`}
          className={styles.title}
          tabIndex={-1}
          data-reveal
        >
          {label}
        </h2>

        <p className={styles.blurb} data-reveal>
          {panel.blurb}
        </p>
      </header>

      <WorkGrid content={panel.content} />
    </section>
  );
}
