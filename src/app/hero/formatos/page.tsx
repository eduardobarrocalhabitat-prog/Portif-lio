import { FormatsHero } from "@/components/FormatsHero/FormatsHero";
import { HeroSwitcher } from "@/components/HeroSwitcher/HeroSwitcher";
import { HomePage } from "@/components/HomePage/HomePage";

export default function Page() {
  return <HomePage hero={<FormatsHero />} extra={<HeroSwitcher />} />;
}
