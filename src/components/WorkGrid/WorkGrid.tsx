"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { Viewer, type ViewerSource } from "@/components/Viewer/Viewer";
import { useAutoPlayInView } from "@/hooks/useAutoPlayInView";
import type {
  BrandItem,
  CaseItem,
  GalleryItem,
  PanelContent,
  SiteItem,
} from "@/data/folders";
import styles from "./WorkGrid.module.css";

/* ---------------------------------------------------------------------------
   O acervo. Um layout por tipo de peça, todos em grade limpa.

   Aqui não há ângulo nem sobreposição: a pilha jogada é o convite lá em cima,
   esta seção é onde a pessoa compara e procura. Cada item leva `data-reveal`,
   e a seção escalona a entrada quando ela chega na viewport.
--------------------------------------------------------------------------- */

export function WorkGrid({ content }: { content: PanelContent }) {
  switch (content.kind) {
    case "brands":
      return <BrandGrid items={content.items} />;
    case "gallery":
      return <Gallery items={content.items} />;
    case "sites":
      return <SiteGrid items={content.items} />;
    case "cases":
      return <CaseGrid items={content.items} />;
  }
}

/**
 * Estado do visualizador, com o gatilho guardado para devolver o foco.
 * Três grades precisam exatamente disso, então mora num lugar só.
 */
function useViewer<T>() {
  const [open, setOpen] = useState<T | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const openFrom = useCallback(
    (item: T) => (event: React.MouseEvent<HTMLButtonElement>) => {
      triggerRef.current = event.currentTarget;
      setOpen(item);
    },
    [],
  );

  return { open, close, openFrom };
}

/* -------------------------------------------------------------------------
   Marcas
------------------------------------------------------------------------- */

function BrandGrid({ items }: { items: BrandItem[] }) {
  const { open, close, openFrom } = useViewer<BrandItem>();

  return (
    <>
      <ul className={styles.brands}>
        {items.map((item) => (
          <li key={item.name} className={styles.brand} data-reveal>
            <button
              type="button"
              className={styles.card}
              disabled={!item.document}
              aria-label={
                item.document
                  ? `${item.name}, abrir ${item.document.label.toLowerCase()}`
                  : item.name
              }
              onClick={openFrom(item)}
            >
              <span className={styles.tile} style={{ aspectRatio: "16 / 9" }}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 92vw, (max-width: 1240px) 45vw, 380px"
                    className={styles.media}
                  />
                ) : (
                  <span className={styles.monogram} aria-hidden="true">
                    {initials(item.name)}
                  </span>
                )}
              </span>

              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemMeta}>
                {item.year ? `${item.category} · ${item.year}` : item.category}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open?.document ? (
        <Viewer
          title={open.name}
          source={{
            kind: "document",
            label: open.document.label,
            // As páginas do manual são numeradas: `001.webp`, `002.webp`...
            pages: Array.from(
              { length: open.document.pages },
              (_, i) =>
                `${open.document!.dir}/${String(i + 1).padStart(3, "0")}.webp`,
            ),
          }}
          cover={open.image}
          onClose={close}
        />
      ) : null}
    </>
  );
}

/* -------------------------------------------------------------------------
   Conteúdo — colunas, cada peça na proporção em que foi feita.
   Imagem e vídeo dividem a mesma grade: é assim que eles saem, misturados
   numa mesma campanha. A única diferença é que um deles roda no hover.
------------------------------------------------------------------------- */

function Gallery({ items }: { items: GalleryItem[] }) {
  const { open, close, openFrom } = useViewer<GalleryItem>();

  /** A capa é o primeiro slide; `slides` traz o carrossel inteiro. */
  const paginas = open ? (open.slides ?? (open.image ? [open.image] : [])) : [];

  return (
    <>
      <div className={styles.gallery}>
        {items.map((item) => (
          <GalleryPiece key={item.title} item={item} onOpen={openFrom(item)} />
        ))}
      </div>

      {open && paginas.length > 0 ? (
        <Viewer
          title={open.title}
          source={{
            kind: "document",
            label: open.kind,
            pages: paginas,
            // Carrossel anda para o lado; imagem solta não tem para onde ir.
            axis: paginas.length > 1 ? "x" : "y",
          }}
          cover={open.image}
          onClose={close}
        />
      ) : null}
    </>
  );
}

function GalleryPiece({
  item,
  onOpen,
}: {
  item: GalleryItem;
  onOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  /*
    O vídeo roda sozinho enquanto a peça está no meio da tela. O ponteiro
    continua valendo por cima disso: no desktop, passar o mouse numa peça que
    está na borda da tela ainda a faz tocar.
  */
  const { ref: videoRef, noComando } = useAutoPlayInView<HTMLVideoElement>();
  const slides = item.slides?.length ?? (item.image ? 1 : 0);

  const setPlaying = (playing: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    // O ponteiro só manda parar se a rolagem não estiver mandando tocar.
    if (!playing && noComando.current) return;
    if (playing) void video.play().catch(() => {});
    else video.pause();
  };

  const superficie = (
    <>
      <span
        className={styles.tile}
        style={{ aspectRatio: item.ratio.replace("/", " / ") }}
      >
        {item.video ? (
          <video
            ref={videoRef}
            className={styles.media}
            src={item.video}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(max-width: 900px) 45vw, 360px"
            className={styles.media}
          />
        ) : (
          <GlyphImage />
        )}

        {item.video ? <GlyphPlayBadge /> : null}
        {slides > 1 ? <span className={styles.slides}>{slides}</span> : null}
        <span className={styles.chip}>{item.kind}</span>
      </span>
      <span className={styles.itemName}>{item.title}</span>
    </>
  );

  return (
    <figure
      className={styles.shot}
      data-reveal
      onPointerEnter={() => setPlaying(true)}
      onPointerLeave={() => setPlaying(false)}
    >
      {/* Peça em vídeo ainda não abre: o loop no card já é a prévia, e não há
          versão web dos originais para mostrar em tamanho grande. */}
      {slides > 0 && !item.video ? (
        <button
          type="button"
          className={styles.card}
          aria-label={
            slides > 1
              ? `${item.title}, abrir carrossel de ${slides} telas`
              : `${item.title}, ver em tamanho grande`
          }
          onClick={onOpen}
        >
          {superficie}
        </button>
      ) : (
        superficie
      )}
    </figure>
  );
}

/* -------------------------------------------------------------------------
   Sites — moldura de navegador
------------------------------------------------------------------------- */

function SiteGrid({ items }: { items: SiteItem[] }) {
  const { open, close, openFrom } = useViewer<SiteItem>();

  return (
    <>
      <ul className={styles.sites}>
        {items.map((item) => {
          const live = item.status === "live" && Boolean(item.url);

          const inner = (
            <>
              <span className={styles.chrome} aria-hidden="true">
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.url}>
                  {item.url ? stripProtocol(item.url) : "em construção"}
                </span>
              </span>

              <span className={styles.shot16} style={{ aspectRatio: "16 / 10" }}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 90vw, 520px"
                    className={styles.media}
                  />
                ) : (
                  <GlyphGlobe />
                )}
              </span>

              <span className={styles.siteFoot}>
                <span>
                  <span className={styles.itemName}>{item.name}</span>
                  {/* Sem ano, mostra só a stack: data errada é pior que ausente. */}
                  <span className={styles.itemMeta}>
                    {item.year ? `${item.stack} · ${item.year}` : item.stack}
                  </span>
                </span>
                {live ? null : (
                  <span className={styles.badge}>Em construção</span>
                )}
              </span>
            </>
          );

          return (
            <li key={item.name} className={styles.site} data-reveal>
              {live ? (
                <button
                  type="button"
                  className={styles.siteCard}
                  aria-label={`${item.name}, abrir o site`}
                  onClick={openFrom(item)}
                >
                  {inner}
                </button>
              ) : (
                <span className={styles.siteCard} data-static>
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {open?.url ? (
        <Viewer
          title={open.name}
          source={{ kind: "site", url: open.url, label: open.stack }}
          cover={open.image}
          onClose={close}
        />
      ) : null}
    </>
  );
}

/* -------------------------------------------------------------------------
   Casos de IA

   Nem todo caso tem tela — automação boa é invisível. Por isso o card mostra
   o que o caso resolve, e o que abre depende do que existe: o site, ou a
   história.
------------------------------------------------------------------------- */

function CaseGrid({ items }: { items: CaseItem[] }) {
  const { open, close, openFrom } = useViewer<CaseItem>();

  const source: ViewerSource | null =
    open?.detail?.kind === "site"
      ? { kind: "site", url: open.detail.url, label: open.tags.join(" · ") }
      : open?.detail?.kind === "article"
        ? {
            kind: "article",
            blocks: open.detail.blocks,
            label: open.tags.join(" · "),
          }
        : null;

  return (
    <>
      <ul className={styles.cases}>
        {items.map((item) => {
          const inner = (
            <>
              <span className={styles.tile} style={{ aspectRatio: "16 / 10" }}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 90vw, 420px"
                    className={styles.media}
                  />
                ) : (
                  <GlyphSpark />
                )}
              </span>

              <span className={styles.caseBody}>
                <span className={styles.itemName}>{item.title}</span>
                <span className={styles.caseSummary}>{item.summary}</span>

                <span className={styles.tags}>
                  {item.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                  {item.status === "wip" ? (
                    <span className={styles.badge}>Em produção</span>
                  ) : null}
                </span>
              </span>
            </>
          );

          return (
            <li key={item.title} className={styles.case} data-reveal>
              {item.detail ? (
                <button
                  type="button"
                  className={styles.caseCard}
                  aria-label={`${item.title}, ${
                    item.detail.kind === "site" ? "abrir o site" : "ler o caso"
                  }`}
                  onClick={openFrom(item)}
                >
                  {inner}
                </button>
              ) : (
                <span className={styles.caseCard} data-static>
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {open && source ? (
        <Viewer
          title={open.title}
          source={source}
          cover={open.image}
          onClose={close}
        />
      ) : null}
    </>
  );
}

/* -------------------------------------------------------------------------
   Placeholders — no lugar e na proporção certos enquanto o asset não existe
------------------------------------------------------------------------- */

function GlyphImage() {
  return (
    <svg className={styles.glyph} viewBox="0 0 48 48" aria-hidden="true">
      <rect x="8" y="12" width="32" height="24" rx="3" />
      <circle cx="17.5" cy="20.5" r="2.6" />
      <path d="M10 33l8.6-9 5.4 6 4.4-4.6 9.6 9.6" />
    </svg>
  );
}

/** Some quando o vídeo roda: no hover a peça já se explica sozinha. */
function GlyphPlayBadge() {
  return (
    <span className={styles.playBadge} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M9 7.5l8 4.5-8 4.5z" />
      </svg>
    </span>
  );
}

function GlyphGlobe() {
  return (
    <svg className={styles.glyph} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="13" />
      <path d="M24 11c3.5 3.6 5.3 8 5.3 13s-1.8 9.4-5.3 13c-3.5-3.6-5.3-8-5.3-13S20.5 14.6 24 11Z" />
      <path d="M11.8 20h24.4M11.8 28h24.4" />
    </svg>
  );
}

function GlyphSpark() {
  return (
    <svg className={styles.glyph} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M20 7.5c0 6.9 5.6 12.5 12.5 12.5C25.6 20 20 25.6 20 32.5 20 25.6 14.4 20 7.5 20 14.4 20 20 14.4 20 7.5Z" />
      <path d="M34.5 27c0 3.6 2.9 6.5 6.5 6.5-3.6 0-6.5 2.9-6.5 6.5 0-3.6-2.9-6.5-6.5-6.5 3.6 0 6.5-2.9 6.5-6.5Z" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
