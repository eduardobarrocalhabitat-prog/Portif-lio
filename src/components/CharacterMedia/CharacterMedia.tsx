import { characterConfig } from "@/config/character";
import styles from "./CharacterMedia.module.css";

type Props = {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A figura atrás das pastas.
 *
 * Era um vídeo em loop, e o vídeo era o maior custo contínuo da página:
 * decodificação a cada quadro, com a hero na tela ou fora dela. Agora é uma
 * imagem parada, e a caixa externa continua a mesma, então a Scene anima o
 * mesmo alvo sem saber o que está dentro.
 *
 * Duas versões pelo `<picture>`, porque um corte só não serve às duas telas:
 * no retrato a composição 16:9 inteira deixaria o personagem minúsculo, então
 * o celular recebe um recorte 9:16 centrado nele. Cada versão tem várias
 * larguras e o navegador escolhe pela densidade da tela.
 *
 * Sem estado de "pronto" e sem fade: a imagem tem fundo branco sobre página
 * branca, então ela pode aparecer aos poucos sem salto nenhum. Isso tira a
 * primeira pintura da dependência do JavaScript hidratar, e some junto a
 * corrida em que o evento de carga chegava antes de alguém ouvir.
 */
export function CharacterMedia({ ref }: Props) {
  const { paisagem, retrato, restScale } = characterConfig;

  return (
    <div
      ref={ref}
      className={styles.root}
      style={{ "--rest-scale": restScale } as React.CSSProperties}
      aria-hidden="true"
    >
      <picture className={styles.frame}>
        <source
          media="(max-aspect-ratio: 1 / 1)"
          srcSet={retrato.srcSet}
          sizes="100vw"
          width={retrato.width}
          height={retrato.height}
        />
        {/*
          `<img>` e não `next/image`: o otimizador está desligado no projeto,
          e sem ele o componente não gera `srcSet`. Aqui as larguras já foram
          preparadas à mão, e é o `<picture>` que troca o recorte por tela.
        */}
        <img
          className={styles.media}
          src={paisagem.src}
          srcSet={paisagem.srcSet}
          sizes="100vw"
          width={paisagem.width}
          height={paisagem.height}
          alt=""
          // É o maior elemento da primeira tela: vem antes de qualquer outra imagem.
          fetchPriority="high"
          decoding="async"
        />
      </picture>
    </div>
  );
}
