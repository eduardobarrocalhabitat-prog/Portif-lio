/* ---------------------------------------------------------------------------
   A silhueta da pasta, como recorte.

   Existe porque aba e corpo como dois elementos separados não têm conserto:
   cada um carrega o próprio `backdrop-filter`, e onde eles se sobrepõem o
   vidro é composto duas vezes — a emenda aparece como um degrau de tom sobre
   qualquer fundo escuro. Com um recorte só, não há emenda para aparecer.

   `clipPathUnits="objectBoundingBox"` deixa o caminho em frações de 0 a 1, ou
   seja, ele acompanha qualquer tamanho de pasta sem recalcular nada. O preço é
   que os arcos são esticados junto com a caixa; na proporção 1,22:1 daqui a
   diferença entre os raios não é perceptível.

   Renderize UMA vez na página — o id é global.
--------------------------------------------------------------------------- */

export const FOLDER_CLIP_ID = "folder-silhouette";

export function FolderShape() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      /*
        `position: absolute` não é capricho.

        Este SVG só carrega uma definição e mede 0x0, mas `svg` é `display:
        inline` por padrão, e elemento inline gera uma linha de texto mesmo
        vazio: a altura da linha vira espaço de verdade no fluxo. Isso empurrava
        a página INTEIRA 21px para baixo, e a hero começava 21px abaixo do topo.
        O efeito visível era uma faixa branca entre a barra do topo e o vídeo.

        Fora do fluxo, ele não mede nada e não empurra nada.
      */
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        <clipPath id={FOLDER_CLIP_ID} clipPathUnits="objectBoundingBox">
          <path
            d="
              M 0.075,0
              L 0.400,0
              C 0.435,0 0.450,0.020 0.462,0.050
              L 0.500,0.130
              C 0.515,0.160 0.535,0.170 0.575,0.170
              L 0.925,0.170
              C 0.965,0.170 1.000,0.205 1.000,0.260
              L 1.000,0.910
              C 1.000,0.965 0.965,1.000 0.925,1.000
              L 0.075,1.000
              C 0.035,1.000 0.000,0.965 0.000,0.910
              L 0.000,0.090
              C 0.000,0.035 0.035,0.000 0.075,0.000
              Z
            "
          />
        </clipPath>
      </defs>
    </svg>
  );
}
