import { Acende } from "@/components/ml/Acende";
import styles from "./OQueFaco.module.css";

/* ---------------------------------------------------------------------------
   O que eu faço.

   A frase de 72/72, peso 600, fica presa no meio da tela por 700px de
   rolagem e acende enquanto o topo da seção vai de 600px a −600px do topo
   da tela: termina de acender pouco antes de soltar. As peças que
   subiam por cima dela agora têm seção própria, Redes, depois das marcas.
--------------------------------------------------------------------------- */

export function OQueFaco() {
  return (
    <section
      id="o-que-faco"
      className={styles.secao}
      aria-labelledby="faco-titulo"
    >
      <div className={styles.preso}>
        <p id="faco-titulo" className={`rotulo ${styles.rotulo}`}>
          [ O que eu faço ]
        </p>
        <Acende
          className={styles.frase}
          gatilho="section"
          inicio={600}
          fim={-600}
          texto="Marcas, conteúdo e sites para empresas que querem ser lembradas, não só vistas."
        />
        <p className={styles.sub}>
          da inovação aos e-sports, com 6 empresas no currículo.
        </p>
      </div>
    </section>
  );
}
