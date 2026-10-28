import { Suave } from "@/components/margem/Suave";
import { ViewerHost } from "@/components/margem/ViewerHost";
import { Chamada } from "@/components/ml/Chamada";
import { Dock } from "@/components/ml/Dock";
import { Empresas } from "@/components/ml/Empresas";
import { Hero } from "@/components/ml/Hero";
import { OQueFaco } from "@/components/ml/OQueFaco";
import { Projetos } from "@/components/ml/Projetos";
import { Redes } from "@/components/ml/Redes";
import { Rodape } from "@/components/ml/Rodape";
import { Sites } from "@/components/ml/Sites";
import { CASES, IA } from "@/data/ml";
import { Sobre } from "@/components/ml/Sobre";

/*
  Réplica da estrutura de marcuslorenzet.com com o conteúdo do Eduardo:
  abertura, o que eu faço, marcas, redes, sites, soluções de IA, empresas, sobre, chamada e rodapé.
*/
export default function Home() {
  return (
    <ViewerHost>
      <main>
        <Hero />
        <OQueFaco />
        <Projetos
          id="projetos"
          titulo="MARCAS."
          rotulo="[ Identidade visual ]"
          cases={CASES}
          depois={{ href: "#redes", label: "Redes" }}
        />
        <Redes />
        <Sites />
        {/* Só aparece quando os cases de IA estiverem em src/data/ml.ts. */}
        {IA.length > 0 && (
          <Projetos
            id="ia"
            titulo="IA."
            rotulo="[ Soluções de IA ]"
            cases={IA}
            depois={{ href: "#empresas", label: "Empresas" }}
          />
        )}
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
