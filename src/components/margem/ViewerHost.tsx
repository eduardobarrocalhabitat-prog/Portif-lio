"use client";

import { createContext, useCallback, useContext, useState } from "react";

import { Viewer, type ViewerSource } from "@/components/Viewer/Viewer";

type Aberto = { title: string; source: ViewerSource; cover?: string };

const Ctx = createContext<(a: Aberto) => void>(() => {});

/** Qualquer seção abre o visualizador por aqui: o case do túnel, a linha do índice. */
export const useAbrir = () => useContext(Ctx);

export function ViewerHost({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState<Aberto | null>(null);
  const fechar = useCallback(() => setAberto(null), []);

  return (
    <Ctx.Provider value={setAberto}>
      {children}
      {aberto ? (
        <Viewer
          title={aberto.title}
          source={aberto.source}
          cover={aberto.cover}
          onClose={fechar}
        />
      ) : null}
    </Ctx.Provider>
  );
}
