"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Palette, Smartphone, Globe, Monitor, Laptop, ZoomIn, Move, CornerDownRight, RotateCcw } from "lucide-react";
import { usePlatform } from "../contexts/PlatformContext";
import { useImageSettings } from "../contexts/ImageSettingsContext";
import { useTheme, type ThemeName } from "../contexts/ThemeContext";
import ThemeColorPicker from "./ThemeColorPicker";

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
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [inputWidth, setInputWidth] = useState<number>(40);
  const measureRef = useRef<HTMLSpanElement>(null);
  const maxMeasureRef = useRef<HTMLSpanElement>(null);

  // Update input value when prop value changes (but not while editing)
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  // Measure text width and update input width
  useEffect(() => {
    // Use setTimeout to ensure DOM is fully updated
    const timeoutId = setTimeout(() => {
      if (measureRef.current && maxMeasureRef.current) {
        // Use scrollWidth for more accurate text measurement
        const currentWidth = measureRef.current.scrollWidth || measureRef.current.offsetWidth;
        const maxWidth = maxMeasureRef.current.scrollWidth || maxMeasureRef.current.offsetWidth;
        
        // Min width for small values, max width for "9999"
        const minWidth = 40;
        // Padding: px-2 (8px left) + pr-6 (24px right for unit) = 32px total
        const leftPadding = 8; // px-2
        const rightPadding = 24; // pr-6 for unit space
        const totalPadding = leftPadding + rightPadding;
        
        // Add extra width per character for better spacing
        const charCount = (inputValue || "0").length;
        const extraPerChar = 2; // Extra pixels per character
        
        // Calculate width: text width + padding + extra per character, capped at max width
        const calculatedWidth = currentWidth + totalPadding + (charCount * extraPerChar);
        const maxCalculatedWidth = maxWidth + totalPadding + (4 * extraPerChar); // 4 chars for "9999"
        
        setInputWidth(Math.max(minWidth, Math.min(maxCalculatedWidth, calculatedWidth)));
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [inputValue, unit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // Allow values beyond min/max for flexibility
      onChange(numValue);
      setInputValue(numValue.toString());
    } else {
      // Reset to current value if invalid
      setInputValue(value.toString());
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

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
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] sm:text-[10px] text-foreground font-medium">{label}</span>
          <div className="relative flex items-center">
            {/* Hidden spans to measure text width */}
            <span
              ref={measureRef}
              className="text-[9px] sm:text-[10px] absolute whitespace-pre"
              style={{ 
                position: "absolute",
                visibility: "hidden",
                top: "-9999px",
                left: "-9999px",
                display: "inline-block",
                whiteSpace: "pre",
              }}
            >
              {inputValue || "0"}
            </span>
            <span
              ref={maxMeasureRef}
              className="text-[9px] sm:text-[10px] absolute whitespace-pre"
              style={{ 
                position: "absolute",
                visibility: "hidden",
                top: "-9999px",
                left: "-9999px",
                display: "inline-block",
                whiteSpace: "pre",
              }}
            >
              9999
            </span>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onKeyDown={handleInputKeyDown}
              step={unit === "%" ? 1 : 0.1}
              className="text-[9px] sm:text-[10px] text-foreground bg-background/50 border border-border/40 rounded px-2 py-0.5 pr-6 text-right leading-none focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ 
                WebkitAppearance: "textfield",
                MozAppearance: "textfield",
                width: `${inputWidth}px`,
                minWidth: "40px",
              }}
            />
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] text-foreground/60 pointer-events-none leading-none">{unit}</span>
          </div>
        </div>
        <div className="relative h-2 bg-background border border-border/40 rounded-full overflow-visible w-full min-w-0">
          <motion.div
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))}%` }}
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
              left: `calc(${Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))}% - 6px)`,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={Math.max(min, Math.min(max, value))}
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

// Get theme-appropriate default background color
const getThemeDefaultColor = (theme: ThemeName): string => {
  const themeColors: Record<ThemeName, string> = {
    navy: "#1e293b", // card color from navy theme
    dark: "#1a1a1a", // card color from dark theme
    light: "#ffffff", // white for light theme
    sunset: "#fff7ed", // foreground color from sunset theme (light)
    ocean: "#e0f2fe", // foreground color from ocean theme (light)
    forest: "#f0fdf4", // foreground color from forest theme (light)
    purple: "#faf5ff", // foreground color from purple theme (light)
    midnight: "#e0e7ff", // foreground color from midnight theme (light)
  };
  return themeColors[theme] || "#ffffff";
};

export default function InfoAndColorSelector({ selectedImage }: InfoAndColorSelectorProps) {
  const { selectedPlatform: platformId } = usePlatform();
  const { theme } = useTheme();
  const { backgroundColor, setBackgroundColor, scale, setScale, positionX, setPositionX, positionY, setPositionY, borderRoundness, setBorderRoundness } = useImageSettings();
  const [dimensions, setDimensions] = useState<string>("N/A");
  const [showTransparent, setShowTransparent] = useState(backgroundColor === "transparent");
  
  const selectedPlatform = useMemo(() => mapPlatformIdToName(platformId), [platformId]);
  const themeDefaultColor = useMemo(() => getThemeDefaultColor(theme), [theme]);

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
      <div className="flex-1 space-y-4 min-h-0 min-w-0 overflow-hidden w-full">
        {/* Image Controls Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Image Controls
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setBackgroundColor(themeDefaultColor);
                setScale(100);
                setPositionX(50);
                setPositionY(50);
                setBorderRoundness(0);
                setShowTransparent(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-foreground/70 hover:text-foreground bg-accent/20 hover:bg-accent/30 border border-border/40 rounded-md transition-colors"
              title="Reset all settings to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </motion.button>
          </div>
          
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
                  <ThemeColorPicker
                    value={showTransparent ? themeDefaultColor : (backgroundColor === "transparent" ? themeDefaultColor : backgroundColor)}
                    onChange={(color) => {
                      setBackgroundColor(color);
                      setShowTransparent(false);
                    }}
                    disabled={showTransparent}
                  />
                  {showTransparent && (
                    <div 
                      className="absolute inset-0 rounded-lg pointer-events-none z-10"
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
                    placeholder={themeDefaultColor}
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
              max={500}
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
              onChange={(v) => setBorderRoundness(Math.max(0, Math.min(100, v)))}
              min={0}
              max={100}
              unit="%"
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
