import type { NextConfig } from "next";

/** Um ano. Os arquivos de mídia são versionados pelo nome, nunca editados. */
const IMMUTABLE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  images: {
    // AVIF primeiro: costuma sair ~30% menor que WebP nas capas de marca.
    formats: ["image/avif", "image/webp"],
    // O maior uso real é ~380px de largura; 1920 cobre 3x de DPR com folga.
    deviceSizes: [390, 640, 828, 1080, 1280, 1920],
  },

  // Cabeçalho sem função aqui além de anunciar o stack.
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Vídeos, poster, capas e PDFs: nada aqui muda sem mudar de nome.
        source: "/:folder(media|marcas)/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
    ];
  },
};

export default nextConfig;
