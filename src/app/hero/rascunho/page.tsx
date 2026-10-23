import { SketchHero } from "@/components/SketchHero/SketchHero";
import { HeroSwitcher } from "@/components/HeroSwitcher/HeroSwitcher";
import { HomePage } from "@/components/HomePage/HomePage";

export default function Page() {
  return <HomePage hero={<SketchHero />} extra={<HeroSwitcher />} />;
}
