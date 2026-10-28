import { ENTREGAS } from "@/data/ml";
import styles from "./Empresas.module.css";

/* ---------------------------------------------------------------------------
   Nicho não importa (o RESULTS SPEAK LOUDER da referência).

   Medido: título de 264/237.6, peso 700, −10px, centralizado e preso; cards de
   480×480 em x=480, de 900 em 900px, subindo por cima dele; fundo
   rgba(21,20,16,0.98) com desfoque de 8px, raio 6; número de 80/96; texto de
   24/28.8; assinatura com quadrado de 56px, nome de 22px e cargo de 14px.

   No lugar de depoimentos, o que o Eduardo entregou para cada empresa: não há
   depoimento real, e depoimento inventado não entra.
--------------------------------------------------------------------------- */

export function Empresas() {
  return (
    <section
      id="empresas"
      className={styles.secao}
      aria-labelledby="empresas-titulo"
    >
      <div className={styles.preso}>
        <p className="rotulo">[ Empresas ]</p>
        <h2
          id="empresas-titulo"
          className={styles.titulo}
          aria-label="Nicho não importa"
        >
          <span aria-hidden>NICHO</span>
          <span aria-hidden>NÃO</span>
          <span aria-hidden>IMPORTA</span>
        </h2>
      </div>

      <ol className={styles.cards}>
        {ENTREGAS.map((e, i) => (
          <li key={e.empresa} className={styles.card}>
            <p className={styles.numero} aria-hidden>
              {i + 1}
            </p>
            <p className={styles.texto}>{e.texto}</p>
            <div className={styles.assina}>
              <span className={styles.logo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.logo} alt="" loading="lazy" />
              </span>
              <span>
                <span className={styles.nome}>{e.empresa}</span>
                <span className={styles.area}>{e.area}</span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
