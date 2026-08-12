import { AboutSection } from "@/components/AboutSection/AboutSection";
import { Scene } from "@/components/Scene/Scene";
import { ServicesMarquee } from "@/components/ServicesMarquee/ServicesMarquee";
import { SiteNav } from "@/components/SiteNav/SiteNav";
import { WorkSection } from "@/components/WorkSection/WorkSection";
import { about } from "@/data/about";
import { folders } from "@/data/folders";

export default function Home() {
  const total = folders.length + 1;

  return (
    <>
      <h1 className="srOnly">
        Eduardo Barrocal · Design, UI/UX e soluções com IA
      </h1>

      <main>
        {/* Hero: o vídeo, as pastas e o painel que uma pasta abre. */}
        <Scene />

        {/* Transição: o que você faz que não vira pasta. */}
        <ServicesMarquee />

        {/*
          As seções. Cada pasta tem a sua, e o botão "Explorar" do painel leva
          direto para cá. O conteúdo é HTML de verdade — a hero é opaca para
          crawlers e leitores de tela, estas seções não são.
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

      <footer className="srOnly">
        Eduardo Barrocal · WhatsApp {about.contact.whatsapp.label} · e-mail{" "}
        {about.contact.links[0].label}
      </footer>
    </>
  );
}
