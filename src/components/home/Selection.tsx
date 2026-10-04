"use client";

import { createContext, useContext, useState } from "react";
import type { ProjectSlug } from "@/lib/projects";

type Ctx = {
  /** The concept on the gallery stage. */
  active: ProjectSlug;
  setActive: (s: ProjectSlug) => void;
  /** The concept the visitor said they liked, carried into the brief. */
  liked: ProjectSlug | null;
  setLiked: (s: ProjectSlug | null) => void;
};

const SelectionContext = createContext<Ctx | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ProjectSlug>("sahra");
  const [liked, setLiked] = useState<ProjectSlug | null>(null);
  return <SelectionContext.Provider value={{ active, setActive, liked, setLiked }}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection outside SelectionProvider");
  return ctx;
}
