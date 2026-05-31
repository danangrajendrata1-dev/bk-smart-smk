"use client";

import { useEffect, useMemo, useState } from "react";

export type LayoutMode = "auto" | "mobile" | "desktop";

const STORAGE_KEY = "bk_layout_mode";

export function useLayoutMode() {
  const [mode, setModeState] = useState<LayoutMode>("auto");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) as LayoutMode | null;
    if (stored === "auto" || stored === "mobile" || stored === "desktop") {
      setModeState(stored);
      return;
    }
    localStorage.setItem(STORAGE_KEY, "auto");
  }, []);

  const setMode = (nextMode: LayoutMode) => {
    setModeState(nextMode);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, nextMode);
    }
  };

  const flags = useMemo(() => {
    return {
      isAuto: mode === "auto",
      isForceMobile: mode === "mobile",
      isForceDesktop: mode === "desktop",
    };
  }, [mode]);

  return {
    mode,
    setMode,
    ...flags,
  };
}
