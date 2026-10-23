import { AboutSection } from "@/components/AboutSection/AboutSection";
import { CanvasHero } from "@/components/CanvasHero/CanvasHero";
import { ServicesMarquee } from "@/components/ServicesMarquee/ServicesMarquee";
import { SiteFooter } from "@/components/SiteFooter/SiteFooter";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { WorkSection } from "@/components/WorkSection/WorkSection";
import { folders } from "@/data/folders";

export default function Home() {
  const total = folders.length + 1;

  return (
    <>
      <main>
        {/* Hero: o canvas com as peças, e o nome como camada de texto. */}
        <CanvasHero />

        {/* Transição: o que você faz que não vira peça. */}
        <ServicesMarquee />

        {/*
          As seções. Cada tipo de trabalho tem a sua, e os artboards do canvas
          levam direto para cá. O acervo completo mora aqui, em HTML de
          verdade; a hero mostra só uma amostra.
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
    </>
  );
}
