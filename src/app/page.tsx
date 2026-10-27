import { Fecho } from "@/components/margem/Fecho";
import { Indice } from "@/components/margem/Indice";
import { Metodo } from "@/components/margem/Metodo";
import { Nav } from "@/components/margem/Nav";
import { Redes } from "@/components/margem/Redes";
import { Sobre } from "@/components/margem/Sobre";
import { Suave } from "@/components/margem/Suave";
import { Tunel } from "@/components/margem/tunel/Tunel";
import { ViewerHost } from "@/components/margem/ViewerHost";

/*
  A estrutura do site da Margem com o conteúdo do Eduardo: o túnel de
  trabalhos, as redes sociais, o manifesto com marginália, o método, o índice e o fecho.
*/
export default function Home() {
  return (
    <ViewerHost>
      <Nav />
      <main>
        <Tunel />
        {/* Logo depois do túnel: muita gente chega procurando redes sociais. */}
        <Redes />
        <Sobre />
        <Metodo />
        <Indice />
        <Fecho />
      </main>
      {/* Por último: os pins das seções já existem quando a rolagem suave nasce. */}
      <Suave />
    </ViewerHost>
  );
}
