import type { Metadata } from "next";

/*
  Opções de hero em teste. Ficam fora dos buscadores e saem do projeto quando
  uma delas for escolhida.
*/
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HeroOptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
