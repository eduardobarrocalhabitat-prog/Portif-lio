"use client";

import { useRef, useState } from "react";

import { about } from "@/data/about";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASE, gsap, useGSAP } from "@/lib/motion";
import styles from "./CanvasHero.module.css";

/* ---------------------------------------------------------------------------
   A hero é um canvas de ferramenta de design.

   As peças dele estão espalhadas como artboards, com o nome de frame em cima,
   e um cursor com a etiqueta "Eduardo" passa de uma para outra selecionando
   cada uma, como alguém trabalhando no arquivo ao vivo. O nome dele é a
   camada de texto do frame "Início", fixo por cima do canvas.

   Quem visita pode arrastar o canvas e clicar num artboard, que leva à seção
   daquele trabalho.

   Coordenadas: tudo dentro do quadro é escrito em unidades do quadro, pensado
   para um desktop de 1440×836. O quadro inteiro é escalado e deslocado para
   caber na tela; rótulos, bordas e o cursor dividem pelo `--s` para manter o
   tamanho na tela, como numa ferramenta de verdade.
--------------------------------------------------------------------------- */

type Artboard = {
  id: string;
  src: string;
  /** Nome de frame, como apareceria na ferramenta: "Marca / Peça". */
  name: string;
  /** Tamanho do arquivo de design, o que o rótulo da seleção mostra. */
  size: [number, number];
  x: number;
  y: number;
  w: number;
  /** A seção que o clique abre. */
  to: "marcas" | "conteudo" | "sites";
};

const ARTBOARDS: Artboard[] = [
  {
    id: "as7",
    src: "/sites/as7.webp",
    name: "as7 Comunicação / Site",
    size: [1440, 900],
    x: 1180,
    y: 402,
    w: 470,
    to: "sites",
  },
  {
    id: "elva",
    src: "/conteudo/elva-garden-story.webp",
    name: "Elva Garden / Story",
    size: [1080, 1920],
    x: 1690,
    y: 372,
    w: 190,
    to: "conteudo",
  },
  {
    id: "campo",
    src: "/conteudo/reel-campo.webp",
    name: "Campo Capital / Reel",
    size: [1080, 1920],
    x: 1180,
    y: 742,
    w: 190,
    to: "conteudo",
  },
  {
    id: "lavae",
    src: "/marcas/lavae-laundry/capa.webp",
    name: "Lavaê / Manual de marca",
    size: [1920, 1080],
    x: 1400,
    y: 742,
    w: 420,
    to: "marcas",
  },
  {
    id: "hub",
    src: "/conteudo/hub-cna-futuro.webp",
    name: "HUB CNA / Carrossel",
    size: [1080, 1350],
    x: 1850,
    y: 732,
    w: 240,
    to: "conteudo",
  },
  {
    id: "mkz",
    src: "/sites/mkz-canaa.webp",
    name: "MKZ Canaã / Site",
    size: [1440, 900],
    x: 1400,
    y: 1022,
    w: 400,
    to: "sites",
  },
  {
    id: "pit",
    src: "/marcas/pitqueens/capa.webp",
    name: "Pitqueens / Manual de marca",
    size: [1920, 1080],
    x: 600,
    y: 1052,
    w: 380,
    to: "marcas",
  },
  {
    id: "kv",
    src: "/conteudo/key-visual-academia.webp",
    name: "Academia / Key visual",
    size: [1440, 1080],
    x: 320,
    y: 712,
    w: 300,
    to: "conteudo",
  },
  {
    id: "toth",
    src: "/marcas/toth/capa.webp",
    name: "Toth / Pitch deck",
    size: [1920, 1080],
    x: 1930,
    y: 1052,
    w: 360,
    to: "marcas",
  },
  {
    id: "and",
    src: "/marcas/and-academy/capa.webp",
    name: "AND Academy / Manual de marca",
    size: [1920, 1080],
    x: 1910,
    y: 392,
    w: 380,
    to: "marcas",
  },
  {
    id: "lc",
    src: "/conteudo/lc-perfumes.webp",
    name: "LC Perfumes / Post",
    size: [1080, 1440],
    x: 820,
    y: 40,
    w: 240,
    to: "conteudo",
  },
  {
    id: "campom",
    src: "/marcas/campo-mourao/capa.webp",
    name: "Campo Mourão / Manual de marca",
    size: [1920, 1080],
    x: 240,
    y: 240,
    w: 380,
    to: "marcas",
  },
  {
    id: "sura",
    src: "/conteudo/sura-community-day.webp",
    name: "Sura / Post",
    size: [1080, 1440],
    x: 2150,
    y: 742,
    w: 240,
    to: "conteudo",
  },
];

/** A ronda do cursor. Alterna formato e tipo de trabalho. */
const RONDA = ["lavae", "elva", "as7", "mkz", "campo", "hub"];

const heightOf = (a: Artboard) => Math.round((a.w * a.size[1]) / a.size[0]);

/** Retrato: o frame do nome vai para o topo. Igual à media query do CSS. */
const NARROW =
  "(max-width: 759px), (max-width: 1023px) and (orientation: portrait)";

/** O arraste não pode levar o quadro para o vazio. */
const LIMITE = { x: 640, y: 420 };

export function CanvasHero() {
  const heroRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [selected, setSelected] = useState<string | null>(null);
  const [nameSize, setNameSize] = useState("");
  const [explored, setExplored] = useState(false);
  /** Arrastar não pode virar clique no artboard onde o gesto terminou. */
  const dragged = useRef(false);

  useGSAP(
    () => {
      const hero = heroRef.current!;
      const viewport = viewportRef.current!;
      const pan = panRef.current!;
      const drift = driftRef.current!;
      const board = boardRef.current!;
      const frame = frameRef.current!;
      const name = nameRef.current!;
      const selection = selectionRef.current!;
      const cursor = cursorRef.current!;

      /* ---- Encaixe do quadro na tela -------------------------------- */

      const fit = () => {
        const vw = viewport.clientWidth;
        const vh = viewport.clientHeight;
        // Celular e tablet em pé: o mesmo critério do CSS.
        const narrow = matchMedia(NARROW).matches;
        let s: number;
        let x: number;
        let y: number;

        if (narrow) {
          // No celular o frame do nome ocupa o topo e o canvas aparece embaixo dele.
          s = gsap.utils.clamp(0.5, 0.72, vw / 600);
          const base = frame.offsetTop + frame.offsetHeight + 56;
          x = vw * 0.04 - 1170 * s;
          y = base - 742 * s;
        } else {
          s = gsap.utils.clamp(0.62, 1.25, Math.min(vw / 1440, vh / 836));
          // O primeiro artboard encosta logo à direita do frame do nome.
          const right = frame.offsetLeft + frame.offsetWidth;
          x = right + 60 * s - 1150 * s;
          y = vh / 2 - 750 * s;
        }

        gsap.set(board, { x, y, scale: s, transformOrigin: "0 0" });
        board.style.setProperty("--s", String(s));
      };

      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(viewport);
      ro.observe(frame);

      /* ---- Arraste --------------------------------------------------- */

      const panX = gsap.quickTo(pan, "x", { duration: 0.5, ease: EASE.react });
      const panY = gsap.quickTo(pan, "y", { duration: 0.5, ease: EASE.react });
      let start: { x: number; y: number; px: number; py: number } | null = null;

      const onDown = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest("[data-frame]")) return;
        start = {
          x: e.clientX,
          y: e.clientY,
          px: Number(gsap.getProperty(pan, "x")),
          py: Number(gsap.getProperty(pan, "y")),
        };
        dragged.current = false;
      };
      const onMove = (e: PointerEvent) => {
        if (!start) return;
        const dx = e.clientX - start.x;
        // No toque o vertical é da rolagem da página: o canvas só anda de lado.
        const dy = e.pointerType === "mouse" ? e.clientY - start.y : 0;
        if (!dragged.current && Math.hypot(dx, dy) < 6) return;
        if (!dragged.current) {
          dragged.current = true;
          viewport.dataset.dragging = "";
          setExplored(true);
        }
        panX(gsap.utils.clamp(-LIMITE.x, LIMITE.x, start.px + dx));
        panY(gsap.utils.clamp(-LIMITE.y, LIMITE.y, start.py + dy));
      };
      const onUp = () => {
        start = null;
        delete viewport.dataset.dragging;
      };

      viewport.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);

      /* ---- Medida do nome, para a seleção da camada de texto ---------- */

      const r = name.getBoundingClientRect();
      setNameSize(`${Math.round(r.width)} × ${Math.round(r.height)}`);

      const cleanup = () => {
        ro.disconnect();
        viewport.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      const byId = (id: string) => ARTBOARDS.find((a) => a.id === id)!;
      const boxOf = (a: Artboard) => ({
        left: a.x,
        top: a.y,
        width: a.w,
        height: heightOf(a),
      });

      /* ---- Menos movimento: tudo no lugar, um artboard selecionado ---- */

      if (reducedMotion) {
        const a = byId(RONDA[0]);
        gsap.set(selection, { ...boxOf(a), autoAlpha: 1 });
        gsap.set(cursor, {
          x: a.x + a.w * 0.62,
          y: a.y + heightOf(a) * 0.7,
          autoAlpha: 1,
        });
        setSelected(a.id);
        return cleanup;
      }

      /* ---- Abertura --------------------------------------------------- */

      const boards = board.querySelectorAll("[data-artboard]");
      const letters = name.querySelectorAll("[data-letter]");
      const intro = gsap.timeline({ defaults: { ease: EASE.react } });

      intro
        .from(boards, {
          autoAlpha: 0,
          scale: 0.9,
          duration: 0.7,
          stagger: { amount: 0.6, from: "start" },
        })
        .from(frame, { autoAlpha: 0, y: 16, duration: 0.6 }, 0.15)
        .from(letters, { yPercent: 110, duration: 0.8, stagger: 0.035 }, 0.35)
        // A camada de texto é selecionada: caixa, alças e a medida.
        .fromTo(
          hero.querySelector("[data-name-selection]"),
          { autoAlpha: 0, scale: 1.04 },
          { autoAlpha: 1, scale: 1, duration: 0.35 },
          1.15,
        )
        .to(
          hero.querySelector("[data-name-selection]"),
          { autoAlpha: 0, duration: 0.3 },
          2.6,
        )
        .from(
          hero.querySelectorAll("[data-rise]"),
          { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.08 },
          1.25,
        )
        /*
          `fromTo`, e não `from`: a dica tem transição de opacidade no CSS, e
          um `from` montado de novo (o modo estrito monta duas vezes) lê o
          valor no meio da transição como destino e termina invisível.
        */
        .fromTo(
          hero.querySelector("[data-hint]"),
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          2.2,
        );

      /* ---- A ronda do cursor ----------------------------------------- */

      const first = byId(RONDA[0]);
      gsap.set(cursor, {
        x: first.x + first.w + 220,
        y: first.y + heightOf(first) + 260,
      });
      gsap.set(selection, { ...boxOf(first), autoAlpha: 0 });

      const ronda = gsap.timeline({ repeat: -1, delay: 2.4 });
      ronda.to(cursor, { autoAlpha: 1, duration: 0.3 });

      for (const id of RONDA) {
        const a = byId(id);
        const h = heightOf(a);
        ronda
          .to(cursor, {
            x: a.x + a.w * 0.62,
            y: a.y + h * 0.7,
            duration: 1.1,
            ease: EASE.pan,
          })
          .add(() => setSelected(id))
          .to(
            selection,
            { ...boxOf(a), duration: 0.32, ease: EASE.react },
            "<0.85",
          )
          .to(selection, { autoAlpha: 1, duration: 0.18 }, "<")
          // Um toque de "arrastar" o artboard, e volta: alguém mexendo no arquivo.
          .to(
            hero.querySelector(`[data-artboard="${id}"]`),
            { x: 14, y: -8, duration: 0.35, ease: EASE.pan },
            "+=0.5",
          )
          .to(
            cursor,
            { x: `+=14`, y: `-=8`, duration: 0.35, ease: EASE.pan },
            "<",
          )
          .to(selection, { x: 14, y: -8, duration: 0.35, ease: EASE.pan }, "<")
          .to(
            hero.querySelectorAll(`[data-artboard="${id}"]`),
            { x: 0, y: 0, duration: 0.45, ease: EASE.pan },
            "+=0.5",
          )
          .to(
            cursor,
            { x: `-=14`, y: `+=8`, duration: 0.45, ease: EASE.pan },
            "<",
          )
          .to(selection, { x: 0, y: 0, duration: 0.45, ease: EASE.pan }, "<")
          .to(selection, { autoAlpha: 0, duration: 0.2 }, "+=0.5")
          .add(() => setSelected(null));
      }

      /* ---- Deriva: o quadro respira devagar, como câmera parada na mão -- */

      // Camada própria: o arraste mexe no `pan`, a deriva aqui, e um não desfaz o outro.
      gsap.to(drift, {
        x: 18,
        y: -12,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Fora da tela, nada disso precisa rodar.
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) ronda.resume();
        else ronda.pause();
      });
      io.observe(hero);

      return () => {
        cleanup();
        io.disconnect();
      };
    },
    { scope: heroRef, dependencies: [reducedMotion] },
  );

  const selectedBoard = ARTBOARDS.find((a) => a.id === selected);

  return (
    <section
      ref={heroRef}
      id="topo"
      className={styles.hero}
      aria-labelledby="hero-titulo"
    >
      <div ref={viewportRef} className={styles.viewport}>
        <div ref={panRef} className={styles.pan}>
          <div ref={driftRef} className={styles.drift}>
            <div className={styles.dots} aria-hidden />
            <div ref={boardRef} className={styles.board}>
              {ARTBOARDS.map((a) => (
                <a
                  key={a.id}
                  href={`#${a.to}`}
                  className={styles.artboard}
                  data-artboard={a.id}
                  data-selected={selected === a.id}
                  style={{
                    left: a.x,
                    top: a.y,
                    width: a.w,
                    height: heightOf(a),
                  }}
                  draggable={false}
                  onClick={(e) => {
                    if (dragged.current) e.preventDefault();
                  }}
                  aria-label={`${a.name}. Ir para ${a.to === "conteudo" ? "Conteúdo" : a.to === "sites" ? "Sites" : "Marcas"}`}
                >
                  <span className={styles.frameName} aria-hidden>
                    {a.name}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.src} alt="" draggable={false} decoding="async" />
                </a>
              ))}

              <div ref={selectionRef} className={styles.selection} aria-hidden>
                <i data-h="tl" />
                <i data-h="tr" />
                <i data-h="bl" />
                <i data-h="br" />
                <span className={styles.dims}>
                  {selectedBoard
                    ? `${selectedBoard.size[0]} × ${selectedBoard.size[1]}`
                    : ""}
                </span>
              </div>

              <div ref={cursorRef} className={styles.cursor} aria-hidden>
                <svg viewBox="0 0 20 22">
                  <path d="M2 2 L17 11.5 L10 12.8 L6.6 19.6 Z" />
                </svg>
                <span>Eduardo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* O palco só centraliza; o frame é o que se anima. */}
      <div className={styles.stage}>
        <div ref={frameRef} className={styles.frame} data-frame>
          <span className={styles.frameLabel}>Início</span>

          <div className={styles.nameLayer}>
            <h1
              ref={nameRef}
              id="hero-titulo"
              className={styles.name}
              aria-label="Eduardo Barrocal"
            >
              {["Eduardo", "Barrocal"].map((word) => (
                <span key={word} className={styles.word} aria-hidden>
                  {Array.from(word).map((c, i) => (
                    <span key={i} className={styles.letterMask}>
                      <span data-letter>{c}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <span
              className={styles.nameSelection}
              data-name-selection
              aria-hidden
            >
              <i data-h="tl" />
              <i data-h="tr" />
              <i data-h="bl" />
              <i data-h="br" />
              <span className={styles.dims}>{nameSize}</span>
            </span>
          </div>

          <p className={styles.lede} data-rise>
            Desenho marcas e as interfaces onde elas vivem, do manual de
            identidade ao site no ar.
          </p>

          <div className={styles.actions} data-rise>
            <a
              className={styles.primary}
              href={about.contact.whatsapp.href}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
            </a>
            <a className={styles.secondary} href="#marcas">
              Ver trabalhos
            </a>
          </div>
        </div>
      </div>

      <p className={styles.hint} data-hint data-hidden={explored} aria-hidden>
        <svg viewBox="0 0 24 24">
          <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-1.5v-2a1.5 1.5 0 0 1 3 0V12m0-1v-.5a1.5 1.5 0 0 1 3 0V12m0-.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.6-2.2L4.6 16.4a1.5 1.5 0 0 1 2.3-1.9L8 15.8" />
        </svg>
        Arraste o canvas para ver mais
      </p>
    </section>
  );
}
