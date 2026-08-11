import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
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
  title: "Eduardo Barrocal · Design, UI/UX e soluções com IA",
  description:
    "Identidade visual, design de interface e soluções com IA. Marcas, imagens, vídeos e sites de Eduardo Barrocal.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Eduardo Barrocal · Design, UI/UX e soluções com IA",
    description:
      "Identidade visual, design de interface e soluções com IA.",
    images: ["/media/stage-poster.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
