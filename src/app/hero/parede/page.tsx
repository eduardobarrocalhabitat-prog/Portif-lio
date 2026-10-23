import { WallHero } from "@/components/WallHero/WallHero";
import { HeroSwitcher } from "@/components/HeroSwitcher/HeroSwitcher";
import { HomePage } from "@/components/HomePage/HomePage";

export default function Page() {
  return <HomePage hero={<WallHero />} extra={<HeroSwitcher />} />;
}
