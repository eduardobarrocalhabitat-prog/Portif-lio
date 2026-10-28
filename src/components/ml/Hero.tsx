import { CONTATO } from "@/data/ml";
import styles from "./Hero.module.css";

/* ---------------------------------------------------------------------------
   Abertura.

   Medido em 1440×900: retrato em tela cheia a 43% de opacidade com um
   degradê escurecendo a direita; título em três linhas de 160/144, peso 700,
   −5px de espaçamento; frase de apoio em 16/24 em x=424; "Pixel by pixel" e "Scroll" no pé.

   A foto fica presa ao fundo enquanto a seção seguinte passa por cima dela.
--------------------------------------------------------------------------- */

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`${styles.logo} ${className ?? ""}`}
      aria-label="Eduardo Barrocal"
    >
      <span aria-hidden>EDUARDO</span>
      <span aria-hidden>
        BARR
        <i className={styles.quadrado} />
        CAL
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section id="topo" className={styles.hero} aria-labelledby="hero-titulo">
      {/* A foto: camada fixa atrás da abertura, coberta pela seção seguinte. */}
      <div className={styles.foto} aria-hidden>
        <picture>
          <source media="(max-width: 767px)" srcSet="/media/eduardo-900.webp" />
          <img src="/media/eduardo-1600.webp" alt="" />
        </picture>
        <span className={styles.escuro} />
      </div>

      <a href="#topo" className={styles.marca}>
        <Logo />
      </a>
      <a href={CONTATO.email.href} className={styles.email}>
        {CONTATO.email.label}
      </a>

      <h1
        id="hero-titulo"
        className={styles.titulo}
        aria-label="Marcas, redes e sites"
      >
        <span className={styles.l1} aria-hidden>
          MARCAS,
        </span>
        <span className={styles.l2} aria-hidden>
          REDES &amp;
        </span>
        <span className={styles.l3} aria-hidden>
          SITES
          <span className={styles.seta}>↓</span>
        </span>
      </h1>

      <p className={styles.apoio}>
        Oi, eu sou o Eduardo. Desenho marcas, conteúdo para redes e sites que
        fazem o cliente parar, lembrar e chamar.
      </p>

      <p className={styles.pixel}>Pixel por pixel</p>
      <p className={styles.role}>Role</p>
    </section>
  );
}
