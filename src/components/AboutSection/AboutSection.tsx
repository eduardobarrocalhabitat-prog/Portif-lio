"use client";

import { useRef } from "react";

import { about } from "@/data/about";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE, REVEAL, gsap, useGSAP } from "@/lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutSection.module.css";

export function AboutSection({ index, total }: { index: number; total: number }) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

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
      id="sobre"
      className={styles.section}
      aria-labelledby="sobre-title"
    >
      <header className={styles.head}>
        <p className={styles.index} data-reveal>
          <span className={styles.dot} />
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          <span className={styles.kicker}>{about.kicker}</span>
        </p>

        <h2 id="sobre-title" className={styles.title} data-reveal>
          {about.title}
        </h2>

        <p className={styles.lede} data-reveal>
          {about.lede}
        </p>
      </header>

      <div className={styles.body}>
        <div className={styles.prose}>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} data-reveal>
              {paragraph}
            </p>
          ))}
        </div>

        <dl className={styles.facts}>
          {about.facts.map((fact) => (
            <div key={fact.label} className={styles.fact} data-reveal>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className={styles.services}>
        {about.services.map((service) => (
          <li key={service.title} className={styles.service} data-reveal>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
          </li>
        ))}
      </ul>

      <div className={styles.contact} data-reveal>
        <div>
          <h3>{about.contact.label}</h3>
          <p>{about.contact.body}</p>
        </div>

        <ul className={styles.links}>
          {about.contact.links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
