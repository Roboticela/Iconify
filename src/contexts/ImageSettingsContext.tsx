"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ImageSettingsContextType {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  scale: number;
  setScale: (scale: number) => void;
  positionX: number;
  setPositionX: (x: number) => void;
  positionY: number;
  setPositionY: (y: number) => void;
  borderRoundness: number;
  setBorderRoundness: (roundness: number) => void;
}

const ImageSettingsContext = createContext<ImageSettingsContextType | undefined>(undefined);

export function ImageSettingsProvider({ children }: { children: ReactNode }) {
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [scale, setScale] = useState<number>(100);
  const [positionX, setPositionX] = useState<number>(50);
  const [positionY, setPositionY] = useState<number>(50);
  const [borderRoundness, setBorderRoundness] = useState<number>(0);

  return (
    <ImageSettingsContext.Provider
      value={{
        backgroundColor,
        setBackgroundColor,
        scale,
        setScale,
        positionX,
        setPositionX,
        positionY,
        setPositionY,
        borderRoundness,
        setBorderRoundness,
      }}
    >
      {children}
    </ImageSettingsContext.Provider>
  );
}

export function useImageSettings() {
  const context = useContext(ImageSettingsContext);
  if (context === undefined) {
    throw new Error("useImageSettings must be used within an ImageSettingsProvider");
  }
  return context;
}
