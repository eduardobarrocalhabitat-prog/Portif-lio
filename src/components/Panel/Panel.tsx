"use client";

import { FolderIcon } from "@/components/FolderIcon/FolderIcon";
import { PanelTeaser } from "@/components/PanelTeaser/PanelTeaser";
import type { FolderDefinition } from "@/data/folders";
import styles from "./Panel.module.css";

type Props = {
  definition: FolderDefinition;
  onClose: () => void;
  /** Fecha o painel e leva para a seção completa da pasta. */
  onExplore: () => void;
  closeRef?: React.Ref<HTMLButtonElement>;
};

/**
 * A casca do painel. Não anima nada por conta própria: a Scene recolhe os
 * elementos marcados com `data-panel-item` (texto, em ordem de leitura) e
 * `data-panel-piece` (as peças jogadas, em ordem aleatória) e escalona os dois
 * grupos na mesma timeline que abriu a pasta.
 */
export function Panel({ definition, onClose, onExplore, closeRef }: Props) {
  const { panel, icon, label } = definition;

  return (
    <div className={styles.panel} role="document">
      <FolderIcon name={icon} className={styles.watermark} />

      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Fechar"
        data-panel-item
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7l10 10M17 7L7 17" />
        </svg>
      </button>

      <div className={styles.head}>
        <p className={styles.kicker} data-panel-item>
          <span className={styles.kickerDot} />
          {panel.kicker}
        </p>

        <h2 className={styles.title} id="panel-title" data-panel-item>
          {panel.title}
        </h2>

        <p className={styles.blurb} data-panel-item>
          {panel.blurb}
        </p>
      </div>

      <PanelTeaser
        content={panel.content}
        total={panel.content.items.length}
        exploreLabel={`Explorar ${label.toLowerCase()}`}
        onExplore={onExplore}
      />

      <p className={styles.footnote} data-panel-item>
        {label} · pressione <kbd>Esc</kbd> para voltar
      </p>
    </div>
  );
}
