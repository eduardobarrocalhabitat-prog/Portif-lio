"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { ArticleBlock } from "@/data/folders";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Viewer.module.css";

/* ---------------------------------------------------------------------------
   Uma casca, três fontes.

   `document` — as páginas do manual já rasterizadas em WebP, empilhadas numa
   rolagem contínua. Ninguém lê um manual de marca do começo ao fim: escaneia
   com o olho. Rolar acompanha esse gesto, e no celular deslizar é o que a mão
   já ia fazer. O PDF em si não é servido — os seis somavam 261 MB e as páginas
   somam 6 MB, e só o que chega perto da viewport é baixado.

   `article` — caso que não tem tela. Automação boa é invisível por definição,
   então o que sobra para mostrar é a história: o problema, o que foi feito, e
   o número que mudou.

   `site` — o próprio site dentro de uma moldura de navegador. Alguns
   servidores recusam ser embutidos (`X-Frame-Options`, `frame-ancestors`) e
   não há como detectar isso de fora: um iframe bloqueado dispara `load` igual.
   Por isso o link de abrir em nova aba fica sempre visível.
--------------------------------------------------------------------------- */

/**
 * `document` recebe a lista de páginas, e não pasta + contagem, porque as três
 * coisas que ele mostra têm origens diferentes: as páginas de um manual são
 * numeradas, os slides de um carrossel têm nome próprio, e uma imagem solta é
 * uma lista de um item só. Uma lista atende as três sem caso especial.
 */
export type ViewerSource =
  | {
      kind: "document";
      pages: string[];
      label: string;
      /**
       * Como se anda entre as páginas. Um manual é documento: rola para baixo,
       * porque a pessoa escaneia a sequência. Um carrossel é carrossel: anda
       * para o lado, porque é assim que ele foi feito e é assim que quem o viu
       * no feed espera navegar.
       */
      axis?: "x" | "y";
    }
  | { kind: "article"; blocks: ArticleBlock[]; label: string }
  | { kind: "site"; url: string; label: string };

type Props = {
  title: string;
  source: ViewerSource;
  /** Capa, usada no cartão de abertura quando o site não embute bem. */
  cover?: string;
  onClose: () => void;
};

export function Viewer({ title, source, cover, onClose }: Props) {
  const [entered, setEntered] = useState(false);
  const [page, setPage] = useState(1);
  const [siteLoaded, setSiteLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const touch = useMediaQuery("(max-width: 900px), (pointer: coarse)");
  const reducedMotion = usePrefersReducedMotion();

  const kind = source.kind;
  const totalPages = source.kind === "document" ? source.pages.length : 0;
  const horizontal = source.kind === "document" && source.axis === "x";
  /** Proporção da página, medida da primeira imagem que carrega. */
  const [ratio, setRatio] = useState<number | null>(null);

  /** Leva a uma tela específica. Só o eixo x precisa disso: no y a pessoa rola. */
  const irPara = (n: number) => {
    const el = readerRef.current;
    if (!el || !horizontal) return;
    const alvo = Math.min(totalPages, Math.max(1, n));
    el.scrollTo({
      left: (alvo - 1) * el.clientWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    document.body.dataset.viewerOpen = "true";
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      // Setas só no carrossel: no manual elas já rolam a leitura sozinhas.
      if (!horizontal) return;
      if (event.key === "ArrowRight") irPara(page + 1);
      if (event.key === "ArrowLeft") irPara(page - 1);
    };
    window.addEventListener("keydown", onKeyDown);

    const frame = requestAnimationFrame(() => setEntered(true));

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
      delete document.body.dataset.viewerOpen;
    };
    // `irPara` e `page` entram porque as setas dependem de onde a leitura está.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, horizontal, page, totalPages]);

  /* O contador segue a rolagem. As páginas têm todas o mesmo tamanho, então
     basta uma divisão — nada de observer por página. */
  useEffect(() => {
    const el = readerRef.current;
    if (!el || kind !== "document" || totalPages < 1) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const total = horizontal ? el.scrollWidth : el.scrollHeight;
        const posicao = horizontal ? el.scrollLeft : el.scrollTop;
        const passo = total / totalPages;
        const atual = Math.floor((posicao + passo * 0.5) / passo) + 1;
        setPage(Math.min(totalPages, Math.max(1, atual)));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [kind, totalPages, horizontal]);

  return (
    <div
      className={styles.root}
      data-entered={entered}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} · ${source.label}`}
    >
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />

      <div
        className={styles.window}
        data-fit={kind}
        data-axis={horizontal ? "x" : undefined}
        style={
          ratio ? ({ "--doc-ratio": String(ratio) } as React.CSSProperties) : undefined
        }
      >
        <header className={styles.bar}>
          {kind === "site" ? (
            <span className={styles.dots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          ) : null}

          <span className={styles.identity}>
            <span className={styles.name}>{title}</span>
            <span className={styles.meta}>
              {source.kind === "site"
                ? stripProtocol(source.url)
                : source.label}
            </span>
          </span>

          {/* Contador só faz sentido com mais de uma página. */}
          {source.kind === "document" && totalPages > 1 ? (
            <span className={styles.counter} aria-live="polite">
              {page} / {totalPages}
            </span>
          ) : null}

          {source.kind === "site" ? (
            <a
              className={styles.open}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir
            </a>
          ) : null}

          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7l10 10M17 7L7 17" />
            </svg>
          </button>
        </header>

        {source.kind === "document" ? (
          <div className={styles.readerWrap}>
            <div
              ref={readerRef}
              className={styles.reader}
              data-single={totalPages === 1}
              data-axis={horizontal ? "x" : "y"}
            >
              {source.pages.map((src, i) => (
                <span key={src} className={styles.sheet}>
                  <Image
                    className={styles.pageImage}
                    src={src}
                    alt={
                      totalPages > 1
                        ? `${title}, tela ${i + 1} de ${totalPages}`
                        : title
                    }
                    fill
                    sizes="(max-width: 900px) 100vw, 1180px"
                    /* Só a primeira sai na frente; o resto carrega ao chegar
                       perto da viewport, que é o padrão do next/image. */
                    priority={i === 0}
                    onLoad={(event) => {
                      if (ratio) return;
                      const img = event.currentTarget;
                      if (img.naturalWidth && img.naturalHeight) {
                        setRatio(img.naturalWidth / img.naturalHeight);
                      }
                    }}
                  />
                </span>
              ))}
            </div>

            {/* Só no carrossel: com o mouse não dá para rolar de lado. */}
            {horizontal && totalPages > 1 ? (
              <>
                <button
                  type="button"
                  className={`${styles.nav} ${styles.prev}`}
                  onClick={() => irPara(page - 1)}
                  disabled={page === 1}
                  aria-label="Tela anterior"
                >
                  <Chevron />
                </button>
                <button
                  type="button"
                  className={`${styles.nav} ${styles.next}`}
                  onClick={() => irPara(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Próxima tela"
                >
                  <Chevron />
                </button>
              </>
            ) : null}
          </div>
        ) : source.kind === "article" ? (
          <div className={styles.article}>
            <div className={styles.prose}>
              {source.blocks.map((block, i) => (
                <ArticlePart key={i} block={block} />
              ))}
            </div>
          </div>
        ) : touch ? (
          <div className={styles.handoff}>
            {cover ? (
              <span className={styles.handoffCover}>
                <Image
                  src={cover}
                  alt=""
                  fill
                  sizes="90vw"
                  className={styles.handoffImage}
                />
              </span>
            ) : null}

            <p className={styles.handoffText}>
              O site abre melhor em uma aba própria.
            </p>

            <a
              className={styles.handoffButton}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir o site
            </a>
          </div>
        ) : (
          <div className={styles.stage}>
            <iframe
              className={styles.frame}
              src={source.url}
              title={`${title} · ${source.label}`}
              onLoad={() => setSiteLoaded(true)}
            />
            <div
              className={styles.loading}
              data-done={siteLoaded}
              aria-hidden={siteLoaded}
            >
              <span className={styles.spinner} />
              <span className={styles.loadingText}>Carregando o site</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticlePart({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h":
      return <h3 className={styles.articleHeading}>{block.text}</h3>;
    case "p":
      return <p className={styles.articleText}>{block.text}</p>;
    case "stat":
      return (
        <p className={styles.stat}>
          <strong>{block.value}</strong>
          <span>{block.label}</span>
        </p>
      );
    case "image":
      return (
        <figure className={styles.articleFigure}>
          <Image
            src={block.src}
            alt={block.caption ?? ""}
            width={1400}
            height={788}
            sizes="(max-width: 900px) 100vw, 720px"
          />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
  }
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
