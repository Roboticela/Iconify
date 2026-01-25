"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, type ThemeName } from "../contexts/ThemeContext";
import { X } from "lucide-react";
import { HexColorPicker, HexColorInput, RgbColorPicker, HslColorPicker } from "react-colorful";
import type { RgbColor, HslColor } from "react-colorful";

interface ThemeColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

// Get theme-appropriate color palette
const getThemePalette = (theme: ThemeName): string[] => {
  const palettes: Record<ThemeName, string[]> = {
    navy: [
      "#0f172a", "#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0",
      "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe", "#1e40af", "#1e3a8a", "#1e293b", "#0f172a"
    ],
    dark: [
      "#0a0a0a", "#1a1a1a", "#2a2a2a", "#3a3a3a", "#4a4a4a", "#6b7280", "#9ca3af", "#ededed",
      "#525252", "#737373", "#a3a3a3", "#d4d4d4", "#171717", "#262626", "#404040", "#525252"
    ],
    light: [
      "#ffffff", "#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#171717",
      "#f5f5f5", "#e5e5e5", "#d4d4d4", "#a3a3a3", "#737373", "#525252", "#404040", "#262626"
    ],
    sunset: [
      "#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c",
      "#7c2d12", "#9a3412", "#b45309", "#d97706", "#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"
    ],
    ocean: [
      "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490",
      "#164e63", "#155e75", "#0c4a6e", "#075985", "#0369a1", "#0284c7", "#0ea5e9", "#38bdf8"
    ],
    forest: [
      "#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d",
      "#14532d", "#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"
    ],
    purple: [
      "#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7c3aed",
      "#581c87", "#6b21a8", "#7c3aed", "#9333ea", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff"
    ],
    midnight: [
      "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3",
      "#1e1b4b", "#312e81", "#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"
    ],
  };
  return palettes[theme] || palettes.dark;
};

// Convert hex to RGB
const hexToRgb = (hex: string): RgbColor | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

// Convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number): HslColor => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

export default function ThemeColorPicker({ value, onChange, disabled = false }: ThemeColorPickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value === "transparent" ? "#ffffff" : value);
  const [colorMode, setColorMode] = useState<"hex" | "rgb" | "hsl">("hex");
  const [rgb, setRgb] = useState<RgbColor>({ r: 255, g: 255, b: 255 });
  const [hsl, setHsl] = useState<HslColor>({ h: 0, s: 100, l: 50 });
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onChangeTimeoutRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const palette = getThemePalette(theme);

  // Update current color when value prop changes
  useEffect(() => {
    if (value !== "transparent") {
      setCurrentColor(value);
      const rgbValue = hexToRgb(value);
      if (rgbValue) {
        setRgb(rgbValue);
        setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
      }
    }
  }, [value]);

  // Calculate popup position when opening (only once)
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const calculatePosition = () => {
        if (!buttonRef.current) return;
        
        const rect = buttonRef.current.getBoundingClientRect();
        const popupWidth = 288; // w-72 = 288px
        const popupHeight = 500; // approximate height
        const spacing = 8;
        
        // Calculate position
        let top = rect.bottom + window.scrollY + spacing;
        let left = rect.left + window.scrollX;
        
        // Check if popup would overflow right edge
        if (left + popupWidth > window.innerWidth) {
          left = window.innerWidth - popupWidth - spacing;
        }
        
        // Check if popup would overflow left edge
        if (left < spacing) {
          left = spacing;
        }
        
        // Check if popup would overflow bottom edge
        if (top + popupHeight > window.innerHeight + window.scrollY) {
          // Show above button instead
          top = rect.top + window.scrollY - popupHeight - spacing;
          // If still doesn't fit, position at top of viewport
          if (top < window.scrollY) {
            top = window.scrollY + spacing;
          }
        }
        
        setPopupPosition({ top, left });
      };
      
      calculatePosition();
    }
  }, [isOpen]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
    onChange(color);
    setIsOpen(false);
  };

  // Debounced onChange to prevent excessive re-renders during dragging
  const debouncedOnChange = useCallback((color: string) => {
    if (onChangeTimeoutRef.current !== null) {
      clearTimeout(onChangeTimeoutRef.current);
    }
    isDraggingRef.current = true;
    onChangeTimeoutRef.current = window.setTimeout(() => {
      onChange(color);
      isDraggingRef.current = false;
      onChangeTimeoutRef.current = null;
    }, 50);
  }, [onChange]);

  const handleHexChange = useCallback((color: string) => {
    setCurrentColor(color);
    const rgbValue = hexToRgb(color);
    if (rgbValue) {
      setRgb(rgbValue);
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
    }
    debouncedOnChange(color);
  }, [debouncedOnChange]);

  const handleRgbChange = useCallback((color: RgbColor) => {
    setRgb(color);
    const hex = rgbToHex(color.r, color.g, color.b);
    setCurrentColor(hex);
    setHsl(rgbToHsl(color.r, color.g, color.b));
    debouncedOnChange(hex);
  }, [debouncedOnChange]);

  const handleHslChange = useCallback((color: HslColor) => {
    setHsl(color);
    // Convert HSL to RGB then to HEX
    const rgbValue = hslToRgb(color);
    setRgb(rgbValue);
    const hex = rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
    setCurrentColor(hex);
    debouncedOnChange(hex);
  }, [debouncedOnChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (onChangeTimeoutRef.current) {
        clearTimeout(onChangeTimeoutRef.current);
      }
    };
  }, []);

  // Convert HSL to RGB
  const hslToRgb = (hsl: HslColor): RgbColor => {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const popupContent = useMemo(() => {
    if (!isOpen) return null;
    
    return (
      <AnimatePresence key="color-picker-popup">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[9999] w-72 p-3 bg-card border border-border rounded-lg shadow-lg max-h-[85vh] overflow-y-auto"
          style={{ 
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
          ref={pickerRef}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-foreground">Pick a color</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Color Mode Tabs */}
          <div className="flex gap-1.5 mb-3">
            <button
              onClick={() => setColorMode("hex")}
              className={`px-3 py-1 text-[10px] rounded transition-colors ${
                colorMode === "hex"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/20 text-foreground/70 hover:bg-accent/30"
              }`}
            >
              HEX
            </button>
            <button
              onClick={() => setColorMode("rgb")}
              className={`px-3 py-1 text-[10px] rounded transition-colors ${
                colorMode === "rgb"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/20 text-foreground/70 hover:bg-accent/30"
              }`}
            >
              RGB
            </button>
            <button
              onClick={() => setColorMode("hsl")}
              className={`px-3 py-1 text-[10px] rounded transition-colors ${
                colorMode === "hsl"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/20 text-foreground/70 hover:bg-accent/30"
              }`}
            >
              HSL
            </button>
          </div>

          {/* Color Picker */}
          <div className="mb-3 flex justify-center">
            <style>{`
              .react-colorful {
                width: 100%;
                height: 150px;
              }
              .react-colorful__saturation {
                border-radius: 6px 6px 0 0;
              }
              .react-colorful__hue,
              .react-colorful__alpha {
                height: 16px;
                border-radius: 0 0 6px 6px;
              }
              .react-colorful__pointer {
                width: 14px;
                height: 14px;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              }
            `}</style>
            {colorMode === "hex" && (
              <HexColorPicker color={currentColor} onChange={handleHexChange} />
            )}
            {colorMode === "rgb" && (
              <RgbColorPicker color={rgb} onChange={handleRgbChange} />
            )}
            {colorMode === "hsl" && (
              <HslColorPicker color={hsl} onChange={handleHslChange} />
            )}
          </div>

          {/* Color Preview */}
          <div className="mb-3">
            <div
              className="w-full h-16 rounded-lg border border-border mb-1.5"
              style={{ backgroundColor: currentColor }}
            />
            <div className="text-[10px] text-center text-foreground/70 font-mono">
              {currentColor.toUpperCase()}
            </div>
          </div>

          {/* Color Input */}
          <div className="mb-2">
            {colorMode === "hex" && (
              <div>
                <div className="text-[10px] text-foreground/70 mb-1">HEX</div>
                <HexColorInput
                  color={currentColor}
                  onChange={handleHexChange}
                  prefixed
                  className="w-full px-2 py-1 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            )}
            {colorMode === "rgb" && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-foreground/70 mb-1">R</div>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange({ ...rgb, r: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-foreground/70 mb-1">G</div>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange({ ...rgb, g: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-foreground/70 mb-1">B</div>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange({ ...rgb, b: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}
            {colorMode === "hsl" && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-foreground/70 mb-1">H</div>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => handleHslChange({ ...hsl, h: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-foreground/70 mb-1">S</div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => handleHslChange({ ...hsl, s: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-foreground/70 mb-1">L</div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => handleHslChange({ ...hsl, l: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }, [isOpen, popupPosition, colorMode, currentColor, rgb, hsl, palette, handleColorSelect, handleHexChange, handleRgbChange, handleHslChange]);

  return (
    <>
      <div className="relative">
        <button
          type="button"
          ref={buttonRef}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          style={{
            backgroundColor: currentColor,
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
          title="Pick a color"
        />
      </div>
      {typeof window !== "undefined" && isOpen && createPortal(popupContent, document.body)}
    </>
  );
}
