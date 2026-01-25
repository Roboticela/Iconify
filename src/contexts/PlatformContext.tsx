"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface PlatformContextType {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [selectedPlatform, setSelectedPlatformState] = useState<string>("tauri");

  useEffect(() => {
    const savedPlatform = localStorage.getItem("selectedPlatform");
    if (savedPlatform) {
      setSelectedPlatformState(savedPlatform);
    }
  }, []);

  const setSelectedPlatform = (platform: string) => {
    setSelectedPlatformState(platform);
    localStorage.setItem("selectedPlatform", platform);
  };

  return (
    <PlatformContext.Provider value={{ selectedPlatform, setSelectedPlatform }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
}
