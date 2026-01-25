"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone, Tablet, Tv, Watch, Eye } from "lucide-react";
import { useImageSettings } from "../contexts/ImageSettingsContext";
import Devices from "./Devices";

interface PreviewContainerProps {
  selectedImage?: string | null;
}

type PreviewMode = "desktop" | "mobile" | "tablet" | "tv" | "watch" | "normal";

const previewModes: { mode: PreviewMode; label: string; icon: React.ReactNode; width: string; height: string }[] = [
  { mode: "desktop", label: "Desktop", icon: <Monitor className="w-4 h-4" />, width: "1920px", height: "1080px" },
  { mode: "mobile", label: "Mobile", icon: <Smartphone className="w-4 h-4" />, width: "375px", height: "667px" },
  { mode: "tablet", label: "Tablet", icon: <Tablet className="w-4 h-4" />, width: "768px", height: "1024px" },
  { mode: "tv", label: "TV", icon: <Tv className="w-4 h-4" />, width: "3840px", height: "2160px" },
  { mode: "watch", label: "Watch", icon: <Watch className="w-4 h-4" />, width: "390px", height: "390px" },
  { mode: "normal", label: "Normal", icon: <Eye className="w-4 h-4" />, width: "auto", height: "auto" },
];

export default function PreviewContainer({ selectedImage }: PreviewContainerProps) {
  const [selectedMode, setSelectedMode] = useState<PreviewMode>("normal");
  const { backgroundColor, scale, positionX, positionY, borderRoundness } = useImageSettings();

  const currentMode = previewModes.find((m) => m.mode === selectedMode) || previewModes[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full w-full bg-card/40 backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col p-4 max-h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </h3>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col gap-4 bg-accent/10 rounded-lg border border-border overflow-auto custom-scrollbar p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 items-center justify-center min-h-0"
          >
            {/* Device Previews - Always Visible */}
            <div className="w-full flex flex-col gap-6">
              <div className="w-full">
                <h4 className="text-xs font-medium text-foreground/60 mb-2">iMac</h4>
                <Devices selectedImage={selectedImage} className="w-full h-auto max-w-md mx-auto" deviceType="imac" />
              </div>
              <div className="w-full">
                <h4 className="text-xs font-medium text-foreground/60 mb-2">Windows Display</h4>
                <Devices selectedImage={selectedImage} className="w-full h-auto max-w-md mx-auto" deviceType="windows" />
              </div>
              <div className="w-full">
                <h4 className="text-xs font-medium text-foreground/60 mb-2">Tablet</h4>
                <Devices selectedImage={selectedImage} className="w-full h-auto max-w-md mx-auto" deviceType="tablet" />
              </div>
              <div className="w-full">
                <h4 className="text-xs font-medium text-foreground/60 mb-2">Android Phone</h4>
                <Devices selectedImage={selectedImage} className="w-full h-auto max-w-xs mx-auto" deviceType="android" />
              </div>
              <div className="w-full">
                <h4 className="text-xs font-medium text-foreground/60 mb-2">Watch</h4>
                <Devices selectedImage={selectedImage} className="w-full h-auto max-w-xs mx-auto" deviceType="watch" />
              </div>
              <div className="w-full">
                <h4 className="text-xs font-medium text-foreground/60 mb-2">MacOS Laptop</h4>
                <Devices selectedImage={selectedImage} className="w-full h-auto max-w-md mx-auto" deviceType="tv" />
              </div>
            </div>
            
            {/* Regular Preview - Only when image selected */}
            {selectedImage && (
              <div
                className="flex items-center justify-center"
                style={{
                  width: currentMode.mode === "normal" ? "auto" : currentMode.width,
                  height: currentMode.mode === "normal" ? "auto" : currentMode.height,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
                {selectedMode === "normal" ? (
                  <div
                    className="relative rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: backgroundColor === "transparent" ? undefined : backgroundColor,
                      backgroundImage: backgroundColor === "transparent" 
                        ? `linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)`
                        : undefined,
                      backgroundSize: backgroundColor === "transparent" ? "20px 20px" : undefined,
                      backgroundPosition: backgroundColor === "transparent" ? "0 0, 0 10px, 10px -10px, -10px 0px" : undefined,
                    }}
                  >
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      style={{
                        transform: `scale(${scale / 100}) translate(${(positionX - 50) * 2}%, ${(positionY - 50) * 2}%)`,
                        transformOrigin: "center",
                        borderRadius: `${borderRoundness}px`,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="relative rounded-lg shadow-lg border border-border overflow-hidden"
                    style={{
                      width: currentMode.width,
                      height: currentMode.height,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      backgroundColor: backgroundColor === "transparent" ? undefined : backgroundColor,
                      backgroundImage: backgroundColor === "transparent" 
                        ? `repeating-conic-gradient(#e5e5e5 0% 25%, transparent 0% 50%) 50% / 20px 20px`
                        : undefined,
                    }}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-center p-4"
                      style={{
                        transform: `translate(${(positionX - 50) * 2}%, ${(positionY - 50) * 2}%)`,
                      }}
                    >
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                        style={{
                          transform: `scale(${scale / 100})`,
                          transformOrigin: "center",
                          borderRadius: `${borderRoundness}px`,
                        }}
                      />
                    </div>
                    {/* Device Frame Simulation */}
                    {selectedMode === "mobile" && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background rounded-b-2xl border-x border-b border-border" />
                    )}
                    {selectedMode === "tablet" && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-background rounded-b-2xl border-x border-b border-border" />
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* No image message - Only when no image selected */}
            {!selectedImage && (
              <div className="text-center text-foreground/30">
                <Eye className="w-16 h-16 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No image selected</p>
                <p className="text-xs mt-1">Select an image to see it in the device preview</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
