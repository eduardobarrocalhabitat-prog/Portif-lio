import { CONTATO } from "@/data/ml";
import styles from "./Dock.module.css";

/*
  O dock fixo no pé da tela. Medido: 67px de altura, fundo rgb(22,21,17),
  raio 4, a 17px da borda de baixo; itens em 12/12 peso 600, caixa alta, com
  32px entre eles; botão creme de 52px com o avatar de 24px.
*/
const LINKS = [
  { href: "#projetos", label: "Projetos" },
  { href: "#redes", label: "Redes" },
  { href: "#sobre", label: "Sobre" },
];

export function Dock() {
  return (
    <nav className={styles.dock} aria-label="Navegação">
      <ul className={styles.links}>
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <a
        className={`btnCreme ${styles.botao}`}
        href={CONTATO.orcamento}
        target="_blank"
        rel="noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="avatar" src="/media/eduardo-avatar.webp" alt="" />
        Orçamento
      </a>
    </nav>
  );
}
