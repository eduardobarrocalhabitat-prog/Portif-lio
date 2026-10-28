import { Suave } from "@/components/margem/Suave";
import { ViewerHost } from "@/components/margem/ViewerHost";
import { Chamada } from "@/components/ml/Chamada";
import { Dock } from "@/components/ml/Dock";
import { Empresas } from "@/components/ml/Empresas";
import { Hero } from "@/components/ml/Hero";
import { OQueFaco } from "@/components/ml/OQueFaco";
import { Projetos } from "@/components/ml/Projetos";
import { Rodape } from "@/components/ml/Rodape";
import { Sobre } from "@/components/ml/Sobre";

/*
  Réplica da estrutura de marcuslorenzet.com com o conteúdo do Eduardo:
  abertura, o que eu faço, projetos, empresas, sobre, chamada e rodapé.
*/
export default function Home() {
  return (
    <ViewerHost>
      <main>
        <Hero />
        <OQueFaco />
        <Projetos />
        <Empresas />
        <Sobre />
        <Chamada />
      </main>
      <Rodape />
      <Dock />
      {/* Por último: os pins já existem quando a rolagem suave nasce. */}
      <Suave />
    </ViewerHost>
  );
}
