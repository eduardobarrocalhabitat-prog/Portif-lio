"use client";

import { useEffect, useRef } from "react";

import { useAbrir } from "@/components/margem/ViewerHost";
import { MENSAGEM, whatsapp, type PecaRede } from "@/data/margem";
import { GRADES, REELS } from "@/data/ml";
import styles from "./Redes.module.css";

/* ---------------------------------------------------------------------------
   Redes sociais.

   Mesmo cabeçalho de Marcas e Sites. Embaixo, três colunas de 384px: na
   primeira fileira os reels, inteiros em 9:16 e tocando mudos enquanto
   estão na tela; na segunda, as imagens em grades de 2×2. Cada peça abre no
   visualizador.
--------------------------------------------------------------------------- */

function Peca({ peca }: { peca: PecaRede }) {
  const abrir = useAbrir();
  return (
    <button
      type="button"
      className={styles.peca}
      onClick={() =>
        abrir({
          title: peca.detalhe
            ? `${peca.cliente} · ${peca.detalhe}`
            : peca.cliente,
          cover: peca.foto,
          source: peca.abrir,
        })
      }
      aria-label={`Abrir ${peca.formato.toLowerCase()}: ${peca.cliente}`}
    >
      {peca.previa ? (
        <video
          src={peca.previa}
          poster={peca.foto}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={peca.foto} alt="" loading="lazy" />
      )}
    </button>
  );
}

export function Redes() {
  const rootRef = useRef<HTMLElement>(null);

  /* Os reels tocam mudos enquanto estão na tela. */
  useEffect(() => {
    const root = rootRef.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach(({ target, isIntersecting }) => {
          const v = target as HTMLVideoElement;
          if (isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.3 },
    );
    root.querySelectorAll("video").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="redes"
      className={styles.secao}
      aria-labelledby="redes-titulo"
    >
      <div className={styles.cabeca}>
        <h2 id="redes-titulo" className={styles.titulo}>
          REDES.
        </h2>
        <p className={`rotulo ${styles.rotulo}`}>
          [ Reels, posts e carrosséis ]
        </p>
      </div>

      <div className={styles.colunas}>
        {REELS.map((p) => (
          <div key={p.foto} className={styles.reel}>
            <Peca peca={p} />
          </div>
        ))}
        {GRADES.map((g) => (
          <div key={g[0].foto} className={styles.grade}>
            {g.map((p) => (
              <Peca key={p.foto} peca={p} />
            ))}
          </div>
        ))}
      </div>

      <div className={styles.pe}>
        <p>Conteúdo que faz parar o dedo, com a cara da sua marca.</p>
        <a
          className="btnCreme"
          href={whatsapp(MENSAGEM.redes)}
          target="_blank"
          rel="noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="avatar" src="/media/eduardo-avatar.webp" alt="" />
          Quero conteúdo para as minhas redes
        </a>
      </div>
    </section>
  );
}
