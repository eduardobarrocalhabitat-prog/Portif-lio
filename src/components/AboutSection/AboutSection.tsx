"use client";

import { useRef } from "react";

import Image from "next/image";

import { ContactIcon } from "@/components/ContactIcon/ContactIcon";
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

      {/*
        A prova social vem depois das frentes de trabalho e antes do contato:
        primeiro o que ele faz, depois quem já confiou, e só então o convite.
        Invertida, a lista de nomes vira enfeite.
      */}
      <section className={styles.companies} aria-labelledby="empresas-titulo">
        <h3 id="empresas-titulo" className={styles.companiesTitle} data-reveal>
          {about.companies.label}
        </h3>

        <ul className={styles.logos}>
          {about.companies.items.map((company) => (
            <li key={company.name} className={styles.logo} data-reveal>
              {company.logo ? (
                /*
                  `alt` vazio de propósito: o nome vem escrito logo abaixo, no
                  mesmo cartão. Repetir aqui faria o leitor de tela anunciar a
                  empresa duas vezes seguidas.
                */
                <Image
                  className={styles.logoImagem}
                  src={company.logo}
                  alt=""
                  // Sete quadrados iguais; o enquadramento é do arquivo.
                  width={448}
                  height={448}
                />
              ) : (
                /*
                  Sem arquivo, o nome sozinho segura o cartão. Não é "imagem
                  faltando": quando o arquivo chegar, ele entra por cima e o
                  nome continua onde está.
                */
                <span className={styles.semLogo} aria-hidden="true" />
              )}

              <span className={styles.logoNome}>{company.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.contact} data-reveal>
        <div>
          <h3>{about.contact.label}</h3>
          <p>{about.contact.body}</p>
        </div>

        {/*
          Só as marcas. O texto de cada canal mora no rodapé, e aqui o que
          importa é a fileira ser lida de relance.

          O WhatsApp continua na frente e com peso próprio, preenchido e com o
          nome ao lado do ícone: quatro botões idênticos devolveriam a decisão
          para quem chegou, e é ali que ele responde.

          Cada link carrega `aria-label` e `title`. O primeiro dá nome a quem
          usa leitor de tela ou teclado, o segundo revela o destino no mouse.
          Ícone sem nenhum dos dois é adivinhação.
        */}
        <ul className={styles.links}>
          <li>
            <a
              className={styles.primary}
              href={about.contact.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp, ${about.contact.whatsapp.label}`}
              title={about.contact.whatsapp.label}
            >
              <ContactIcon name={about.contact.whatsapp.icon} />
              WhatsApp
            </a>
          </li>

          {about.contact.links.map((link) => {
            const email = link.href.startsWith("mailto:");
            return (
              <li key={link.label}>
                <a
                  className={styles.iconLink}
                  href={link.href}
                  // mailto abre o cliente de e-mail; o resto sai para outra aba.
                  target={email ? undefined : "_blank"}
                  rel={email ? undefined : "noreferrer"}
                  aria-label={email ? `E-mail, ${link.label}` : link.label}
                  title={link.label}
                >
                  <ContactIcon name={link.icon} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
