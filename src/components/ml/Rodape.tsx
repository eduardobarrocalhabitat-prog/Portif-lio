import { Logo } from "@/components/ml/Hero";
import { CONTATO } from "@/data/ml";
import styles from "./Rodape.module.css";

/* ---------------------------------------------------------------------------
   Rodapé.

   Medido: logo de 592×150 em x=111; "Ready to start?" em Urbanist 56/76 em
   x=945; contatos em 28/33.6; rótulos de 14/21 em caixa alta; links de
   32/38.4 peso 600 com 53px de passo; dois cards de 176×176; fio e, no pé,
   © e "Back to top" em 14/21.
--------------------------------------------------------------------------- */

const SITE = [
  { href: "#topo", label: "Início" },
  { href: "#projetos", label: "Projetos" },
  { href: "#sites", label: "Sites" },
  { href: "#o-que-faco", label: "Redes" },
  { href: "#empresas", label: "Empresas" },
  { href: "#sobre", label: "Sobre" },
];

const SIGA = [
  { href: CONTATO.linkedin.href, label: "LinkedIn" },
  { href: CONTATO.behance.href, label: "Behance" },
  { href: CONTATO.orcamento, label: "WhatsApp" },
  { href: CONTATO.email.href, label: "E-mail" },
];

function Card({ texto }: { texto: string }) {
  return (
    <span className={styles.card} aria-hidden>
      {texto}
    </span>
  );
}

export function Rodape() {
  return (
    <footer className={styles.rodape}>
      <div className={styles.topo}>
        <Logo className={styles.logo} />
        <div className={styles.contato}>
          <h2 className={styles.pronto}>Pronto para começar?</h2>
          <a href={CONTATO.email.href}>{CONTATO.email.label}</a>
          <a href={CONTATO.orcamento} target="_blank" rel="noreferrer">
            {CONTATO.whatsapp.label}
          </a>
        </div>
      </div>

      <div className={styles.meio}>
        <nav aria-label="Site">
          <p className={styles.rot}>Site</p>
          <ul>
            {SITE.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Redes e contato">
          <p className={styles.rot}>Siga</p>
          <ul>
            {SIGA.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.cards}>
          <Card texto="Pixels são pequenos" />
          <Card texto="Detalhes não" />
        </div>
      </div>

      <div className={styles.pe}>
        <p>© 2026 Eduardo Barrocal</p>
        <a href="#topo">Voltar ao topo</a>
      </div>
    </footer>
  );
}
