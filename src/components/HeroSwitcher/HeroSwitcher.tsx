"use client";

import { usePathname } from "next/navigation";

import styles from "./HeroSwitcher.module.css";

/*
  Só para comparar as opções de hero. Sai junto com as rotas `/hero/*` quando
  uma delas for escolhida.
*/
const OPCOES = [
  { href: "/", label: "Canvas" },
  { href: "/hero/formatos", label: "Formatos" },
  { href: "/hero/rascunho", label: "Rascunho" },
  { href: "/hero/parede", label: "Parede" },
];

export function HeroSwitcher() {
  const path = usePathname();

  return (
    <nav className={styles.switcher} aria-label="Opções de hero">
      {OPCOES.map((o) => (
        <a
          key={o.href}
          href={o.href}
          aria-current={path === o.href ? "page" : undefined}
        >
          {o.label}
        </a>
      ))}
    </nav>
  );
}
