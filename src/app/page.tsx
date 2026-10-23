import { CanvasHero } from "@/components/CanvasHero/CanvasHero";
import { HeroSwitcher } from "@/components/HeroSwitcher/HeroSwitcher";
import { HomePage } from "@/components/HomePage/HomePage";

export default function Home() {
  /*
    Hero: o canvas com as peças, e o nome como camada de texto.
    O seletor existe enquanto as opções de `/hero/*` estão em comparação.
  */
  return <HomePage hero={<CanvasHero />} extra={<HeroSwitcher />} />;
}
