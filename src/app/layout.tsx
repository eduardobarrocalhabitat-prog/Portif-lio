import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

/* Só o contador de páginas do visualizador usa. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  /*
    Troque pelo domínio final antes de publicar. Sem `metadataBase`, qualquer
    imagem de compartilhamento vira caminho relativo — e aí o card do WhatsApp
    e do LinkedIn não resolve a URL e não mostra nada.
  */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Eduardo Barrocal · Marcas e interfaces",
  description:
    "Identidade visual, conteúdo e sites de Eduardo Barrocal. Manuais de marca, peças para redes e sites no ar.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Eduardo Barrocal · Marcas e interfaces",
    description: "Desenho marcas e as telas onde elas vivem.",
    images: ["/media/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f0eb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
