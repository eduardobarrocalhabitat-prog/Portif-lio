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
  title: "Eduardo Barrocal · Designer de marcas, redes sociais e sites",
  description:
    "Marcas, conteúdo para redes e sites que fazem o cliente lembrar de você. Veja os projetos e peça seu orçamento pelo WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Eduardo Barrocal · Designer de marcas, redes sociais e sites",
    description: "Design que faz o cliente parar, lembrar e chamar.",
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
