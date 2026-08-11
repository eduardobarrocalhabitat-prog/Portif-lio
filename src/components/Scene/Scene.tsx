"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CharacterMedia } from "@/components/CharacterMedia/CharacterMedia";
import { Folder, type FolderHandle } from "@/components/Folder/Folder";
import { FolderShape } from "@/components/Folder/FolderShape";
import { Panel } from "@/components/Panel/Panel";
import { characterConfig } from "@/config/character";
import { folders } from "@/data/folders";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DUR, EASE, REVEAL, gsap } from "@/lib/motion";
import styles from "./Scene.module.css";

/** Usados só se os raios não puderem ser lidos do CSS. */
const FALLBACK_PANEL_RADIUS = 24;
const FALLBACK_FOLDER_RADIUS = 16;

/**
 * Altura do painel por tipo de conteúdo. Uma pilha de reels 9:16 é quase o
 * dobro da altura de uma de capas 16:9 — painel de tamanho único deixaria vão
 * morto num caso e barra de rolagem no outro. No retrato o CSS ignora isto e
 * usa a viewport inteira.
 */
const PANEL_HEIGHT = {
  brands: "min(600px, 82vh)",
  gallery: "min(660px, 84vh)",
  sites: "min(600px, 82vh)",
  cases: "min(600px, 82vh)",
} as const;

export function Scene() {
  const reducedMotion = usePrefersReducedMotion();

  const [activeId, setActiveId] = useState<string | null>(null);
  /** Incrementado quando a viewport muda de tamanho com um painel aberto. */
  const [geometryToken, setGeometryToken] = useState(0);

  const active = activeId
    ? (folders.find((folder) => folder.id === activeId) ?? null)
    : null;

  const sceneRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<HTMLDivElement>(null);
  const morphGlassRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handlesRef = useRef(new Map<string, FolderHandle>());
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  /** Distingue "abriu agora" de "remediu depois de um resize". */
  const freshOpenRef = useRef(true);

  const registerHandles = useMemo(
    () =>
      new Map(
        folders.map((folder) => [
          folder.id,
          (handle: FolderHandle | null) => {
            if (handle) handlesRef.current.set(folder.id, handle);
            else handlesRef.current.delete(folder.id);
          },
        ]),
      ),
    [],
  );

  const handleOpen = useCallback((id: string) => {
    if (timelineRef.current) return;
    freshOpenRef.current = true;
    setActiveId(id);
  }, []);

  const handleClose = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) {
      setActiveId(null);
      return;
    }
    timeline.reverse();
  }, []);

  /**
   * "Explorar" não é "Fechar".
   *
   * Fechar reverte a timeline: a pasta volta para a mesa. Explorar é ir
   * embora, então a saída é outra — o painel dissolve enquanto a página já
   * está viajando. Reverter aqui dava dois problemas: a pasta encolhia para
   * um ponto do qual a página já tinha rolado para longe, e a rolagem só
   * começava 1,4 s depois, tempo suficiente para qualquer toque no trackpad
   * cancelar um scroll suave — na prática o botão parecia não funcionar.
   */
  const handleExplore = useCallback(() => {
    const target = activeId;
    const overlay = overlayRef.current;
    if (!target || !overlay) return;

    // Solta o scroll antes de pedir a rolagem, senão ela sai num documento travado.
    delete document.body.dataset.panelOpen;

    /*
      Remover o atributo não aplica o estilo na hora — o navegador só recalcula
      quando alguém precisa do resultado. Sem este flush, a rolagem sairia
      contra um body ainda em `overflow: hidden` e não teria o que rolar.
    */
    void document.body.offsetHeight;

    const section = document.getElementById(target);

    /*
      Navegação por âncora, e não `scrollIntoView` puro.

      É o caminho nativo do navegador para chegar a uma seção: respeita o
      `scroll-margin-top` dela, sobrevive a interrupção, e deixa o endereço
      refletir onde a pessoa está — quem recarregar volta para a seção, e o
      botão "voltar" retorna para a hero. De quebra, dá para ver se o botão
      funcionou só olhando a URL.

      Se o hash já for esse, o navegador ignora o pedido; nesse caso vamos na
      mão.
    */
    if (window.location.hash !== `#${target}`) {
      window.location.hash = target;
    } else {
      section?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }

    /*
      Verificação de chegada, não de movimento. A versão anterior conferia se a
      página tinha saído do lugar — o que dava por bom um scroll que começou e
      morreu no meio do caminho.
    */
    window.setTimeout(() => {
      const alvoEl = document.getElementById(target);
      if (!alvoEl) return;
      const margem = Number.parseFloat(
        getComputedStyle(alvoEl).scrollMarginTop || "0",
      );
      if (Math.abs(alvoEl.getBoundingClientRect().top - margem) > 40) {
        alvoEl.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }, 420);

    gsap.to(overlay, {
      opacity: 0,
      duration: reducedMotion ? 0 : 0.26,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(overlay, { clearProps: "opacity" });
        setActiveId(null);
        // O foco viaja junto, senão o teclado continua lá em cima.
        section?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
      },
    });
  }, [activeId, reducedMotion]);

  /* ----------------------------------------------------------------------
     A timeline.

     Uma só, construída na abertura porque depende da geometria da pasta que
     foi clicada, e revertida no fechamento — o fechamento não é uma segunda
     animação, é a mesma andando para trás. Isso garante que abrir e fechar
     nunca divirjam quando algum passo mudar.
  ---------------------------------------------------------------------- */
  useIsomorphicLayoutEffect(() => {
    if (!activeId) return;

    const morph = morphRef.current;
    const glass = morphGlassRef.current;
    const content = contentRef.current;
    const scrim = scrimRef.current;
    const character = characterRef.current;
    const handle = handlesRef.current.get(activeId);
    const surface = handle?.surface;
    const body = handle?.body;
    const contents = handle?.contents;

    if (
      !morph ||
      !glass ||
      !content ||
      !scrim ||
      !character ||
      !surface ||
      !body ||
      !contents
    ) {
      return;
    }

    const context = gsap.context(() => {
      // Mede o repouso do painel antes de qualquer coisa inline interferir.
      gsap.set(morph, { clearProps: "width,height,x,y,borderRadius" });
      const target = morph.getBoundingClientRect();
      // Lidos do CSS em vez de fixados aqui: o breakpoint usa outros raios e a
      // timeline precisa sair e pousar exatamente nos valores de repouso.
      const targetRadius =
        Number.parseFloat(getComputedStyle(morph).borderTopLeftRadius) ||
        FALLBACK_PANEL_RADIUS;

      // O corpo da pasta, não o botão inteiro: a aba é o que sobra de fora e
      // ela sai junto com a pasta. O retângulo já inclui hover e idle, então o
      // painel nasce exatamente onde o olho do usuário está.
      const origin = body.getBoundingClientRect();
      const originRadius =
        Number.parseFloat(getComputedStyle(body).borderTopLeftRadius) ||
        FALLBACK_FOLDER_RADIUS;

      const others = folders
        .filter((folder) => folder.id !== activeId)
        .map((folder) => handlesRef.current.get(folder.id)?.root)
        .filter((node): node is HTMLDivElement => Boolean(node));

      // Dois grupos: o texto entra em ordem de leitura, as peças caem em
      // ordem aleatória. Em ambos o stagger é `amount` e não `each`, então a
      // pasta de 3 peças e a de 9 assentam no mesmo tempo.
      const items = content.querySelectorAll("[data-panel-item]");
      const pieces = content.querySelectorAll("[data-panel-piece]");

      gsap.set(morph, { visibility: "visible" });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: EASE.glass },
        onReverseComplete: () => {
          surface.focus({ preventScroll: true });
          setActiveId(null);
        },
      });

      timeline
        // 1. o conteúdo da pasta sai primeiro — ela fica vazia por um instante
        .to(
          contents,
          {
            opacity: 0,
            scale: 0.94,
            y: -10,
            duration: DUR.objectOut,
            ease: EASE.react,
          },
          0,
        )
        // 2. as irmãs assentam e recuam
        .to(
          others,
          {
            opacity: 0,
            scale: 0.88,
            y: 18,
            duration: 0.44,
            ease: EASE.react,
            stagger: { each: 0.045, from: "random" },
          },
          0,
        )
        .to(
          chromeRef.current,
          { opacity: 0, y: -10, duration: 0.4, ease: EASE.react },
          0,
        )
        // 3. o fundo desfoca e a cena recua
        .to(
          scrim,
          { opacity: 1, duration: DUR.scrim, ease: "power2.inOut" },
          0.12,
        )
        .to(
          character,
          {
            scale: characterConfig.restScale * 1.07,
            opacity: 0.6,
            duration: DUR.morph,
          },
          0.12,
        )
        // 4. a casca da pasta entrega o lugar ao morph, que já está por baixo
        .to(surface, { opacity: 0, duration: 0.28, ease: "power2.inOut" }, 0.14)
        // 5. pasta -> painel: posição, tamanho e raio no mesmo easing
        .fromTo(
          morph,
          {
            x: origin.left - target.left,
            y: origin.top - target.top,
            width: origin.width,
            height: origin.height,
            borderRadius: originRadius,
          },
          {
            x: 0,
            y: 0,
            width: target.width,
            height: target.height,
            borderRadius: targetRadius,
            duration: DUR.morph,
          },
          0.14,
        )
        // Começa antes de a casca sumir: as duas se cruzam e o vidro nunca
        // "aparece", ele assume.
        .to(glass, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.06)
        // 6. o conteúdo entra quando já há painel para recebê-lo
        .to(content, { opacity: 1, duration: 0.34, ease: "power2.out" }, 0.4)
        .fromTo(
          items,
          { opacity: 0, y: REVEAL.travel },
          {
            opacity: 1,
            y: 0,
            duration: REVEAL.duration,
            ease: EASE.react,
            stagger: { amount: 0.26 },
          },
          0.5,
        )
        // 7. e por último as peças caem na mesa, tortas e fora de ordem
        .fromTo(
          pieces,
          {
            opacity: 0,
            y: REVEAL.travel + 14,
            rotate: (index: number) => (index % 2 ? 1 : -1) * (7 + index * 1.6),
          },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: REVEAL.duration,
            ease: EASE.react,
            stagger: { amount: REVEAL.staggerAmount, from: "random" },
          },
          0.56,
        );

      timeline.timeScale(reducedMotion ? 6 : 1);
      timelineRef.current = timeline;

      if (freshOpenRef.current) {
        freshOpenRef.current = false;
        timeline.play();
        closeRef.current?.focus({ preventScroll: true });
      } else {
        // Reconstrução após resize: assume o estado aberto sem reanimar.
        timeline.progress(1);
      }
    }, sceneRef);

    return () => {
      context.revert();
      timelineRef.current = null;
    };
  }, [activeId, geometryToken, reducedMotion]);

  /* ----------------------------------------------------------------------
     Esc, trava de scroll e remedição em resize — só enquanto há painel.
  ---------------------------------------------------------------------- */
  useEffect(() => {
    if (!activeId) return;

    document.body.dataset.panelOpen = "true";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    const size = { w: window.innerWidth, h: window.innerHeight };
    let debounce = 0;

    const onResize = () => {
      // A barra de endereço do celular dispara resize sem mudar o layout útil.
      const dw = Math.abs(window.innerWidth - size.w);
      const dh = Math.abs(window.innerHeight - size.h);
      if (dw < 2 && dh < 80) return;

      size.w = window.innerWidth;
      size.h = window.innerHeight;

      window.clearTimeout(debounce);
      debounce = window.setTimeout(
        () => setGeometryToken((token) => token + 1),
        160,
      );
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(debounce);
      delete document.body.dataset.panelOpen;
    };
  }, [activeId, handleClose]);

  /* ----------------------------------------------------------------------
     Parallax do ponteiro.

     Escreve duas CSS vars na cena e deixa o CSS distribuir por profundidade —
     uma escrita por frame no total, em vez de uma por pasta.
  ---------------------------------------------------------------------- */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reducedMotion) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const setX = gsap.quickSetter(hero, "--pointer-x", "px");
    const setY = gsap.quickSetter(hero, "--pointer-y", "px");
    const state = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onPointerMove = (event: PointerEvent) => {
      state.targetX = (event.clientX / window.innerWidth - 0.5) * 34;
      state.targetY = (event.clientY / window.innerHeight - 0.5) * 26;
    };

    const tick = () => {
      const dx = state.targetX - state.x;
      const dy = state.targetY - state.y;
      if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;

      state.x += dx * 0.055;
      state.y += dy * 0.055;
      setX(state.x);
      setY(state.y);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      gsap.ticker.remove(tick);
    };
  }, [reducedMotion]);

  return (
    <div ref={sceneRef} data-open={activeId !== null}>
      {/* O recorte é global: uma vez para todas as pastas. */}
      <FolderShape />

      <section ref={heroRef} id="topo" className={styles.hero}>
        <div className={styles.backdrop} aria-hidden="true">
          <span className={`${styles.blob} ${styles.blobA}`} />
          <span className={`${styles.blob} ${styles.blobB}`} />
          <span className={`${styles.blob} ${styles.blobC}`} />
          <span className={`${styles.blob} ${styles.blobD}`} />
          <span className={styles.grain} />
        </div>

        <CharacterMedia ref={characterRef} />

        <div ref={chromeRef} className={styles.chrome}>
          <p className={styles.wordmark}>
            Eduardo Barrocal
            <span>Design · UI/UX · IA</span>
          </p>
          <p className={styles.hint}>Toque em uma pasta</p>
        </div>

        <div className={styles.field}>
          {folders.map((folder) => (
            <Folder
              key={folder.id}
              ref={registerHandles.get(folder.id)}
              definition={folder}
              disabled={activeId !== null}
              reducedMotion={reducedMotion}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </section>

      {/*
        O painel é overlay de página, não parte da hero: fixo na viewport, ele
        continua centralizado independentemente de onde o scroll esteja.
      */}
      <div
        ref={overlayRef}
        className={styles.overlay}
        data-open={activeId !== null}
      >
        {/* Decorativo: clicar fora fecha, mas Esc e o botão são os caminhos
            acessíveis — por isso fica fora da árvore de acessibilidade. */}
        <div
          ref={scrimRef}
          className={styles.scrim}
          aria-hidden="true"
          onClick={handleClose}
        />

        <div
          ref={morphRef}
          className={styles.morph}
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-title"
          aria-hidden={!active}
          style={
            active
              ? ({
                  "--tint": `var(--tint-${active.tint})`,
                  "--h-desk": PANEL_HEIGHT[active.panel.content.kind],
                } as React.CSSProperties)
              : undefined
          }
        >
          <div
            ref={morphGlassRef}
            className={styles.morphGlass}
            aria-hidden="true"
          />
          <div ref={contentRef} className={styles.morphContent}>
            <div className={styles.morphStage}>
              {active ? (
                <Panel
                  definition={active}
                  onClose={handleClose}
                  onExplore={handleExplore}
                  closeRef={closeRef}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
