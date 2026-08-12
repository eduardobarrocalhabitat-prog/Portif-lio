import { about } from "@/data/about";
import styles from "./SiteFooter.module.css";

/**
 * O rodapé.
 *
 * Ele existia antes só para leitor de tela, escondido, com um e-mail escrito
 * na mão que já estava desatualizado. Agora é o lugar onde os contatos
 * aparecem por extenso: os botões da seção de contato viraram ícones, e ícone
 * não diz um número de telefone.
 *
 * Os dados saem de `about`, os mesmos que alimentam a seção e a barra do topo,
 * então não há como um lugar do site divulgar um endereço e outro divulgar
 * outro.
 */
export function SiteFooter() {
  const { whatsapp, links } = about.contact;
  const email = links.find((link) => link.href.startsWith("mailto:"));
  const sociais = links.filter((link) => !link.href.startsWith("mailto:"));

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.name}>Eduardo Barrocal</p>
          <p className={styles.role}>Design · UI/UX · Soluções com IA</p>
        </div>

        <ul className={styles.canais}>
          <li>
            <span className={styles.rotulo}>WhatsApp</span>
            <a href={whatsapp.href} target="_blank" rel="noreferrer">
              {whatsapp.label}
            </a>
          </li>

          {email ? (
            <li>
              <span className={styles.rotulo}>E-mail</span>
              <a href={email.href}>{email.label}</a>
            </li>
          ) : null}

          <li>
            <span className={styles.rotulo}>Onde mais</span>
            <span className={styles.sociais}>
              {sociais.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </span>
          </li>
        </ul>
      </div>
    </footer>
  );
}
