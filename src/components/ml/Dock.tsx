import { CONTATO } from "@/data/ml";
import { WhatsAppIcone } from "@/components/ml/WhatsApp";
import styles from "./Dock.module.css";

/*
  O dock fixo no pé da tela. Medido: 67px de altura, fundo de superfície (--rgb-bg2),
  raio 4, a 17px da borda de baixo; itens em 12/12 peso 600, caixa alta, com
  32px entre eles; botão principal de 52px com o ícone do WhatsApp.
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
        <WhatsAppIcone />
        WhatsApp
      </a>
    </nav>
  );
}
