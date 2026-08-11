import type { NextConfig } from "next";

/** Um ano. Os arquivos de mídia são versionados pelo nome, nunca editados. */
const IMMUTABLE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  images: {
    /*
      Otimizador desligado, de propósito.

      Todo asset em `public/` já é WebP no tamanho de exibição: as páginas de
      manual saíram do PDF assim, as peças de Conteúdo foram convertidas, e as
      capas de reel vieram do ffmpeg. Média de 64 KB.

      Ligado, cada imagem vira uma chamada `/_next/image` que roda uma função
      serverless para reconverter o arquivo. Essa função não roda na borda: ela
      roda na região do projeto. Da América do Sul isso é ida e volta até os
      Estados Unidos mais a transcodificação, e abrir um manual dispara vinte
      de uma vez. É o que fazia o site publicado arrastar enquanto o local
      voava — no local o servidor só lê do disco.

      Desligado, cada imagem é um arquivo estático servido pela borda: sem
      função, sem partida a frio, e sem consumir a cota de transformações.

      O preço é não ter redimensionamento automático por tela. Com 64 KB por
      arquivo e carregamento sob demanda, é troca barata. Se um dia entrar aqui
      um asset pesado e não preparado, o certo é prepará-lo, não religar isto.
    */
    unoptimized: true,
  },

  // Cabeçalho sem função aqui além de anunciar o stack.
  poweredByHeader: false,

  async headers() {
    return [
      {
        /*
          Vídeos, posters, capas, páginas de manual: nada aqui muda sem mudar
          de nome.

          `conteudo` estava de fora, e é a pasta maior — 53 MB, com os três
          reels. Sem esta linha eles revalidavam a cada visita.
        */
        source: "/:folder(media|marcas|conteudo)/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
    ];
  },
};

export default nextConfig;
