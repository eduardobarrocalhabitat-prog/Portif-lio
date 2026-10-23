"use client";

import { useEffect, useRef } from "react";

import { about } from "@/data/about";
import styles from "./ServicesMarquee.module.css";

/* ---------------------------------------------------------------------------
   A faixa de serviços, entre a hero e o Sobre.

   As seções mostram artefatos; esta faixa mostra o que você faz que não vira
   artefato. É deliberadamente de baixa hierarquia — textura de transição, não
   manchete: quem está descendo a página passa por ela e absorve a amplitude
   sem parar para ler.

   O truque é banal e é o certo: a lista aparece duas vezes e a trilha anda
   metade da própria largura. Quando a animação reinicia, a segunda cópia está
   exatamente onde a primeira estava — a emenda não existe. Só `transform`
   anima, então isso roda no compositor e não custa layout.

   A segunda cópia é `aria-hidden`: para quem usa leitor de tela, a lista é
   uma só.
--------------------------------------------------------------------------- */

export function ServicesMarquee() {
  const bandRef = useRef<HTMLElement>(null);

  /*
    Fora da tela, a faixa para. A animação é barata por quadro, mas corre a
    visita inteira, e quem está lendo o Sobre ou olhando as marcas não a vê.

    O atributo é escrito direto no elemento, sem estado: entrar e sair da tela
    não tem por que re-renderizar a lista.
  */
  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const observer = new IntersectionObserver(([entrada]) => {
      band.dataset.parado = String(!entrada.isIntersecting);
    });
    observer.observe(band);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={bandRef} className={styles.band} aria-label="Serviços">
      <div className={styles.track}>
        <ul className={styles.list}>
          {about.marquee.map((item) => (
            <li key={item} className={styles.item}>
              <span className={styles.dot} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <ul className={styles.list} aria-hidden="true">
          {about.marquee.map((item) => (
            <li key={item} className={styles.item}>
              <span className={styles.dot} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
