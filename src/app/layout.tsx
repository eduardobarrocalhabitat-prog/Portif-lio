import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Urbanist } from "next/font/google";
import "./globals.css";

/*
  As duas famílias medidas na referência (marcuslorenzet.com): Plus Jakarta
  Sans no corpo e nos títulos, Urbanist em algumas frases e no rodapé.
*/
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
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
  themeColor: "#11100d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${urbanist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
