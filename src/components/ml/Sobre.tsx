import { Acende } from "@/components/ml/Acende";
import { CONTATO, HABILIDADES } from "@/data/ml";
import styles from "./Sobre.module.css";

/* ---------------------------------------------------------------------------
   Sobre.

   Medido: duas frases de 72/72 peso 600 que acendem com a rolagem, a segunda
   numa coluna de ~700px com uma imagem de 384px à direita (x=945); rótulos
   entre colchetes; lista de 14/21; parágrafo em Urbanist 18/27; um fio e, no
   pé, uma linha de 14/21 e o botão escuro de 52px.

   A referência usa fotos pessoais aqui. O Eduardo pediu só trabalhos fora da
   abertura, então as imagens são peças dele, e a faixa de fotos de viagem
   ("About me") não entra.
--------------------------------------------------------------------------- */

export function Sobre() {
  return (
    <section id="sobre" className={styles.secao} aria-labelledby="sobre-titulo">
      <h2 id="sobre-titulo" className="srOnly">
        Sobre
      </h2>

      <Acende
        className={styles.frase1}
        inicio={780}
        fim={80}
        texto="Sou o Eduardo, designer de marca e interface com 5+ anos criando projetos digitais."
      />

      <div className={styles.comeco}>
        <p className="rotulo">[ Como trabalho ]</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.peca1}
          src="/marcas/business-place/paginas/012.webp"
          alt="Business Place, cartões de visita"
          loading="lazy"
        />
        <p className={styles.texto1}>
          Comecei desenhando marcas e descobri que o desenho só termina quando
          roda. Hoje entrego da identidade ao feed e ao site no ar, com o mesmo
          cuidado em cada ponta.
        </p>
      </div>

      <div className={styles.foco}>
        <Acende
          className={styles.frase2}
          inicio={700}
          fim={-350}
          texto="Hoje meu foco é claro: marcas, redes e sites para empresas que querem trabalhar tão bem quanto parecem."
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.peca2}
          src="/marcas/and-academy/paginas/018.webp"
          alt="AND Academy, aplicação da marca"
          loading="lazy"
        />
      </div>

      <div className={styles.melhor}>
        <div>
          <p className="rotulo">[ O que faço de melhor ]</p>
          <p className={styles.lista}>{HABILIDADES}</p>
        </div>
        <p className={styles.texto2}>
          Da marca ao feed e ao site no ar: cuido do projeto inteiro, para você
          não precisar costurar três fornecedores.
        </p>
      </div>

      <div className={styles.pe}>
        <p>
          Trabalhando de qualquer lugar do Brasil, com empresas de inovação,
          games, educação e e-sports.
        </p>
        <a
          className="btnEscuro"
          href={CONTATO.behance.href}
          target="_blank"
          rel="noreferrer"
        >
          Ver no Behance
        </a>
      </div>
    </section>
  );
}
