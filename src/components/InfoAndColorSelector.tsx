"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Palette, Smartphone, Globe, Monitor, Laptop, ZoomIn, Move, CornerDownRight } from "lucide-react";
import { usePlatform } from "../contexts/PlatformContext";
import { useImageSettings } from "../contexts/ImageSettingsContext";

interface InfoAndColorSelectorProps {
  selectedImage?: string | null;
}

interface ControlBarProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

const ControlBar = ({ label, icon, value, onChange, min = 0, max = 100, unit = "%" }: ControlBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 w-full min-w-0"
    >
      <motion.div
        className="text-foreground flex-shrink-0"
        whileHover={{ scale: 1.05, rotate: 3 }}
        transition={{ duration: 0.2 }}
        style={{ transformOrigin: "center" }}
      >
        {icon}
      </motion.div>
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[9px] sm:text-[10px] text-foreground font-medium">{label}</span>
          <motion.span
            key={value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-[9px] sm:text-[10px] text-foreground"
          >
            {value}{unit}
          </motion.span>
        </div>
        <div className="relative h-2 bg-background border border-border/40 rounded-full overflow-visible w-full min-w-0">
          <motion.div
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background pointer-events-none"
            style={{
              boxShadow: "0 0 6px currentColor, 0 2px 4px rgba(0,0,0,0.3)",
              color: "var(--primary)",
              transformOrigin: "center",
            }}
            animate={{
              left: `calc(${((value - min) / (max - min)) * 100}% - 6px)`,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{
              background: "transparent",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface SubPlatform {
  name: string;
  iconCount: number;
  dimensions: string[];
  types: string[];
  description: string;
}

interface Platform {
  name: string;
  icon: React.ReactNode;
  subPlatforms: SubPlatform[];
}

const platformInfo: Platform[] = [
  {
    name: "iOS",
    icon: <Smartphone className="w-4 h-4" />,
    subPlatforms: [
      {
        name: "iPhone",
        iconCount: 10,
        dimensions: ["60×60", "120×120", "180×180", "1024×1024"],
        types: ["PNG"],
        description: "App Icons"
      },
      {
        name: "iPad",
        iconCount: 5,
        dimensions: ["76×76", "152×152", "167×167"],
        types: ["PNG"],
        description: "App Icons"
      },
      {
        name: "Apple Watch",
        iconCount: 3,
        dimensions: ["40×40", "44×44", "46×46", "50×50", "51×51", "58×58", "80×80", "88×88", "87×87", "100×100", "102×102", "172×172", "196×196"],
        types: ["PNG"],
        description: "Watch App Icons"
      },
      {
        name: "Apple TV",
        iconCount: 2,
        dimensions: ["400×240", "1280×768"],
        types: ["PNG"],
        description: "tvOS Icons"
      }
    ]
  },
  {
    name: "Android",
    icon: <Smartphone className="w-4 h-4" />,
    subPlatforms: [
      {
        name: "Phone",
        iconCount: 4,
        dimensions: ["48×48", "72×72", "96×96", "144×144", "192×192", "512×512"],
        types: ["PNG"],
        description: "Adaptive Icons"
      },
      {
        name: "Tablet",
        iconCount: 2,
        dimensions: ["192×192", "512×512"],
        types: ["PNG"],
        description: "Tablet Icons"
      },
      {
        name: "TV",
        iconCount: 1,
        dimensions: ["320×180"],
        types: ["PNG"],
        description: "Android TV Icons"
      },
      {
        name: "Wear OS",
        iconCount: 1,
        dimensions: ["48×48"],
        types: ["PNG"],
        description: "Wearable Icons"
      }
    ]
  },
  {
    name: "Web",
    icon: <Globe className="w-4 h-4" />,
    subPlatforms: [
      {
        name: "Favicon",
        iconCount: 6,
        dimensions: ["16×16", "32×32", "48×48", "64×64"],
        types: ["ICO", "PNG"],
        description: "Browser Favicons"
      },
      {
        name: "PWA",
        iconCount: 6,
        dimensions: ["96×96", "128×128", "144×144", "192×192", "256×256", "384×384", "512×512"],
        types: ["PNG"],
        description: "Progressive Web App Icons"
      },
      {
        name: "Browser Extension",
        iconCount: 4,
        dimensions: ["16×16", "32×32", "48×48", "128×128"],
        types: ["PNG"],
        description: "Extension Icons"
      }
    ]
  },
  {
    name: "Windows",
    icon: <Monitor className="w-4 h-4" />,
    subPlatforms: [
      {
        name: "Desktop",
        iconCount: 4,
        dimensions: ["16×16", "32×32", "48×48", "256×256"],
        types: ["ICO", "PNG"],
        description: "Windows Desktop Icons"
      },
      {
        name: "Start Menu",
        iconCount: 3,
        dimensions: ["70×70", "150×150", "310×150"],
        types: ["PNG"],
        description: "Start Menu Tiles"
      }
    ]
  },
  {
    name: "macOS",
    icon: <Laptop className="w-4 h-4" />,
    subPlatforms: [
      {
        name: "App Icon",
        iconCount: 7,
        dimensions: ["16×16", "32×32", "64×64", "128×128", "256×256", "512×512", "1024×1024"],
        types: ["ICNS", "PNG"],
        description: "macOS App Icons"
      }
    ]
  },
  {
    name: "Tauri",
    icon: <Monitor className="w-4 h-4" />,
    subPlatforms: [
      {
        name: "Windows",
        iconCount: 4,
        dimensions: ["16×16", "32×32", "48×48", "256×256"],
        types: ["ICO", "PNG"],
        description: "Windows Desktop"
      },
      {
        name: "macOS",
        iconCount: 7,
        dimensions: ["16×16", "32×32", "64×64", "128×128", "256×256", "512×512", "1024×1024"],
        types: ["ICNS", "PNG"],
        description: "macOS Desktop"
      },
      {
        name: "Linux",
        iconCount: 4,
        dimensions: ["16×16", "32×32", "48×48", "256×256"],
        types: ["PNG"],
        description: "Linux Desktop"
      },
      {
        name: "Mobile (iOS)",
        iconCount: 10,
        dimensions: ["60×60", "120×120", "180×180", "1024×1024"],
        types: ["PNG"],
        description: "iOS Mobile"
      },
      {
        name: "Mobile (Android)",
        iconCount: 4,
        dimensions: ["48×48", "72×72", "96×96", "144×144", "192×192", "512×512"],
        types: ["PNG"],
        description: "Android Mobile"
      }
    ]
  },
  {
    name: "Electron",
    icon: <Monitor className="w-4 h-4" />,
    subPlatforms: [
      {
        name: "Windows",
        iconCount: 4,
        dimensions: ["16×16", "32×32", "48×48", "256×256"],
        types: ["ICO", "PNG"],
        description: "Windows Build"
      },
      {
        name: "macOS",
        iconCount: 7,
        dimensions: ["16×16", "32×32", "64×64", "128×128", "256×256", "512×512", "1024×1024"],
        types: ["ICNS", "PNG"],
        description: "macOS Build"
      },
      {
        name: "Linux",
        iconCount: 4,
        dimensions: ["16×16", "32×32", "48×48", "256×256"],
        types: ["PNG"],
        description: "Linux Build"
      }
    ]
  }
];

// Map platform IDs from AppHeader to platform names in InfoAndColorSelector
const mapPlatformIdToName = (platformId: string): string => {
  const platformMap: Record<string, string> = {
    "ios": "iOS",
    "watchos": "iOS",
    "apple-tv": "iOS",
    "android": "Android",
    "android-tv": "Android",
    "wear-os": "Android",
    "web-pwa": "Web",
    "browser-extension": "Web",
    "react": "Web",
    "vue": "Web",
    "angular": "Web",
    "nextjs": "Web",
    "electron": "Electron",
    "tauri": "Tauri",
    "native-desktop": "Windows",
    "qt": "Windows",
    "java-javafx": "Windows",
    "java-swing": "Windows",
    "flutter-desktop": "Windows",
  };
  
  return platformMap[platformId] || "iOS"; // Default to iOS if not mapped
};

export default function InfoAndColorSelector({ selectedImage }: InfoAndColorSelectorProps) {
  const { selectedPlatform: platformId } = usePlatform();
  const { backgroundColor, setBackgroundColor, scale, setScale, positionX, setPositionX, positionY, setPositionY, borderRoundness, setBorderRoundness } = useImageSettings();
  const [dimensions, setDimensions] = useState<string>("N/A");
  const [showTransparent, setShowTransparent] = useState(backgroundColor === "transparent");
  
  const selectedPlatform = useMemo(() => mapPlatformIdToName(platformId), [platformId]);

  useEffect(() => {
    setShowTransparent(backgroundColor === "transparent");
  }, [backgroundColor]);

  useEffect(() => {
    if (selectedImage) {
      const img = new Image();
      img.onload = () => {
        setDimensions(`${img.width} × ${img.height}`);
      };
      img.onerror = () => {
        setDimensions("N/A");
      };
      img.src = selectedImage;
    } else {
      setDimensions("N/A");
    }
  }, [selectedImage]);

  const imageInfo = selectedImage
    ? {
        size: `${Math.round(selectedImage.length / 1024)} KB`,
        format: selectedImage.split(";")[0].split("/")[1] || "Unknown",
        dimensions: dimensions,
      }
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full w-full max-w-full bg-card/40 backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col p-4 min-w-0"
    >
      <div className="flex-1 space-y-4 min-h-0 min-w-0 overflow-x-hidden w-full">
        {/* Image Controls Section */}
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4" />
            Image Controls
          </h3>
          
          {/* Background Color Picker */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3 bg-accent/20 rounded-lg border border-border/50 w-full min-w-0"
          >
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-3 h-3 text-foreground/70" />
              <span className="text-[10px] font-medium text-foreground">Background Color</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={showTransparent ? "#ffffff" : (backgroundColor === "transparent" ? "#ffffff" : backgroundColor)}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      setShowTransparent(false);
                    }}
                    disabled={showTransparent}
                    className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  />
                  {showTransparent && (
                    <div 
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        backgroundImage: `linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)`,
                        backgroundSize: "8px 8px",
                        backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                      }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={showTransparent ? "transparent" : (backgroundColor === "transparent" ? "transparent" : backgroundColor)}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      if (value === "transparent" || value === "") {
                        setShowTransparent(true);
                        setBackgroundColor("transparent");
                      } else if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                        setBackgroundColor(value);
                        setShowTransparent(false);
                      }
                    }}
                    className="w-full px-2 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const newTransparent = !showTransparent;
                  setShowTransparent(newTransparent);
                  if (newTransparent) {
                    setBackgroundColor("transparent");
                  } else {
                    setBackgroundColor("#ffffff");
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border-2 transition-all text-[10px] font-medium ${
                  showTransparent
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-accent/10 text-foreground hover:bg-accent/20 hover:border-border"
                }`}
              >
                <div 
                  className="w-4 h-4 rounded border border-border/50"
                  style={{
                    backgroundImage: showTransparent 
                      ? `linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)`
                      : undefined,
                    backgroundSize: "6px 6px",
                    backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
                    backgroundColor: showTransparent ? undefined : backgroundColor,
                  }}
                />
                <span>Transparent Background</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border/60 my-3"
          />

          {/* Control Bars */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-1 sm:space-y-1.5"
          >
            <ControlBar
              label="Scale"
              icon={<ZoomIn className="w-3 h-3" />}
              value={scale}
              onChange={setScale}
              min={10}
              max={200}
            />
            <ControlBar
              label="Position X"
              icon={<Move className="w-3 h-3" />}
              value={positionX}
              onChange={setPositionX}
              min={0}
              max={100}
            />
            <ControlBar
              label="Position Y"
              icon={<Move className="w-3 h-3" />}
              value={positionY}
              onChange={setPositionY}
              min={0}
              max={100}
            />
            <ControlBar
              label="Border Roundness"
              icon={<CornerDownRight className="w-3 h-3" />}
              value={borderRoundness}
              onChange={setBorderRoundness}
              min={0}
              max={50}
              unit="px"
            />
          </motion.div>
        </div>

        {/* Image Information Section */}
        <div className="w-full min-w-0">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Info className="w-4 h-4" />
            Image Information
          </h3>
          {imageInfo ? (
            <div className="space-y-3 w-full min-w-0">
              <div className="flex items-center justify-between p-2 bg-accent/20 rounded-lg gap-2 min-w-0">
                <span className="text-xs text-foreground/70 flex-shrink-0">Size:</span>
                <span className="text-xs font-medium text-foreground truncate">{imageInfo.size}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent/20 rounded-lg gap-2 min-w-0">
                <span className="text-xs text-foreground/70 flex-shrink-0">Format:</span>
                <span className="text-xs font-medium text-foreground uppercase truncate">{imageInfo.format}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent/20 rounded-lg gap-2 min-w-0">
                <span className="text-xs text-foreground/70 flex-shrink-0">Dimensions:</span>
                <span className="text-xs font-medium text-foreground truncate">{imageInfo.dimensions}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-foreground/50 italic">No image selected</p>
          )}
        </div>

        {/* Platform Information Section */}
        <div className="w-full min-w-0">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Info className="w-4 h-4" />
            Platform Requirements
          </h3>

          {/* Selected Platform Information with Sub-Platforms */}
          <AnimatePresence mode="wait">
            {platformInfo
              .filter((platform) => platform.name === selectedPlatform)
              .map((platform) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 w-full min-w-0"
                >
                  {/* Sub-Platform Cards */}
                  {platform.subPlatforms.map((subPlatform, index) => (
                    <motion.div
                      key={subPlatform.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 bg-accent/20 rounded-lg border border-border/50 w-full min-w-0"
                    >
                      <div className="flex items-center justify-between mb-2 gap-2 min-w-0">
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-foreground block truncate">{subPlatform.name}</span>
                          <p className="text-[10px] text-foreground/50 mt-0.5 line-clamp-1">{subPlatform.description}</p>
                        </div>
                        <span className="text-[10px] text-foreground/60 flex-shrink-0">{subPlatform.iconCount} icons</span>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        <div>
                          <span className="text-[10px] text-foreground/60">Dimensions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {subPlatform.dimensions.map((dim, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.5 bg-background/50 rounded text-foreground/80"
                              >
                                {dim}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-foreground/60">Types:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {subPlatform.types.map((type, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.5 bg-primary/20 rounded text-primary font-medium"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

    </motion.div>
  );
}
