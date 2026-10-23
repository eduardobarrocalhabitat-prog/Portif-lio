import { AboutSection } from "@/components/AboutSection/AboutSection";
import { ServicesMarquee } from "@/components/ServicesMarquee/ServicesMarquee";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { WorkSection } from "@/components/WorkSection/WorkSection";
import { folders } from "@/data/folders";

/**
 * A página inteira, com a hero passada de fora. Existe para as opções de hero
 * em `/hero/*` serem comparadas com o mesmo site embaixo de cada uma.
 */
export function HomePage({
  hero,
  extra,
}: {
  hero: React.ReactNode;
  /** Algo a mais por cima da página, como o seletor de opções. */
  extra?: React.ReactNode;
}) {
  const total = folders.length + 1;

  return (
    <>
      <main>
        {hero}

        {/* Transição: o que você faz que não vira peça. */}
        <ServicesMarquee />

        {/*
          As seções. Cada tipo de trabalho tem a sua, e a hero leva direto
          para cá. O acervo completo mora aqui, em HTML de verdade; a hero
          mostra só uma amostra.
        */}
        <AboutSection index={1} total={total} />

        {folders.map((folder, position) => (
          <WorkSection
            key={folder.id}
            definition={folder}
            index={position + 2}
            total={total}
          />
        ))}
      </main>

      <SiteNav />

      <SiteFooter />

      {extra}
    </>
  );
}
