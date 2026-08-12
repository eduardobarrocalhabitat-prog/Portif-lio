"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Toca o vídeo enquanto ele está na faixa central da tela, e pausa quando sai.
 *
 * O motivo é o celular. O `pointerenter` que faz o vídeo rodar no desktop
 * também dispara no toque, mas o `pointerleave` vem junto quando o dedo sai:
 * na prática era preciso segurar o dedo em cima para ver qualquer coisa se
 * mexer. Ninguém descobre isso sozinho.
 *
 * Faixa central e não a tela inteira: com `-25%` em cima e embaixo, a peça só
 * toca quando está de fato sendo olhada. Isso mantém no máximo uma fileira
 * rodando de cada vez, o que importa quando cada reel tem dezenas de MB e o
 * aparelho decodifica todos em paralelo.
 *
 * A pausa devolve o vídeo ao começo, porque o cartão é uma prévia curta: voltar
 * a uma peça e pegá-la no meio parece defeito.
 */
export function useAutoPlayInView<T extends HTMLVideoElement>() {
  const ref = useRef<T>(null);
  /*
    Quem chama precisa saber quando o gancho está no comando. Sem isso, tirar o
    mouse de uma peça pausaria um vídeo que continua bem no meio da tela: o
    ponteiro desfazendo o que a rolagem pediu.

    É um ref e não um estado porque só é lido dentro de manipulador de evento.
    Como estado, cada peça re-renderizaria a cada entrada e saída da tela.
  */
  const noComando = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Quem pediu menos movimento fica com o poster parado.
    if (reducedMotion) {
      video.pause();
      return;
    }

    /*
      Respeita a economia de dados do aparelho. Um reel de 30 MB baixado sem
      ninguém ter pedido é justamente o que essa opção existe para evitar.
    */
    const conexao = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conexao?.saveData) return;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        noComando.current = entrada.isIntersecting;
        if (entrada.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      noComando.current = false;
    };
  }, [reducedMotion]);

  return { ref, noComando };
}
