"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, Maximize2, X, ImageIcon } from "lucide-react";
import { usePlatform } from "../contexts/PlatformContext";
import { useImageSettings } from "../contexts/ImageSettingsContext";
import { useMemo, useState } from "react";
import Devices from "./Devices";

interface PreviewContainerProps {
  selectedImage?: string | null;
}

// Map platform IDs from AppHeader to platform names
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
  
  return platformMap[platformId] || "iOS";
};

// Platform info structure (same as in InfoAndColorSelector)
interface SubPlatform {
  name: string;
  iconCount: number;
  dimensions: string[];
  types: string[];
  description: string;
}

interface Platform {
  name: string;
  subPlatforms: SubPlatform[];
}

const platformInfo: Platform[] = [
  {
    name: "iOS",
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

// Device ordering: mobile devices, laptops, desktop displays, then TV
const deviceOrder: Record<string, number> = {
  "ios": 1,          // Mobile device 1 (iOS phone)
  "android": 2,      // Mobile device 2 (Android phone)
  "watch": 3,        // Watch
  "tablet": 4,       // Tablet
  "windowslaptop": 5, // Laptop 1
  "macos": 6,        // Laptop 2
  "imac": 7,         // Desktop display 1
  "windows": 8,      // Desktop display 2
  "tv": 9,           // TV
};

// Device type to label mapping
const deviceLabels: Record<string, string> = {
  "ios": "iPhone",
  "android": "Android Phone",
  "watch": "Apple Watch",
  "tablet": "iPad",
  "windowslaptop": "Windows Laptop",
  "macos": "MacBook",
  "imac": "iMac",
  "windows": "Windows Desktop",
  "tv": "TV",
};

export default function PreviewContainer({ selectedImage }: PreviewContainerProps) {
  const { selectedPlatform: platformId } = usePlatform();
  const { backgroundColor, scale, positionX, positionY, borderRoundness } = useImageSettings();
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);
  
  const selectedPlatform = useMemo(() => mapPlatformIdToName(platformId), [platformId]);
  
  const allDimensions = useMemo(() => {
    const platform = platformInfo.find(p => p.name === selectedPlatform);
    if (!platform) return [];
    
    // Collect all unique dimensions from all sub-platforms
    const dimensionsSet = new Set<string>();
    platform.subPlatforms.forEach(subPlatform => {
      subPlatform.dimensions.forEach(dim => dimensionsSet.add(dim));
    });
    
    return Array.from(dimensionsSet).sort((a, b) => {
      const [aWidth, aHeight] = a.split("×").map(d => parseInt(d.trim()));
      const [bWidth, bHeight] = b.split("×").map(d => parseInt(d.trim()));
      const aSize = aWidth * aHeight;
      const bSize = bWidth * bHeight;
      return aSize - bSize;
    });
  }, [selectedPlatform]);

  // Map platform to relevant device types
  const getDevicesForPlatform = useMemo(() => {
    const deviceMap: Record<string, Array<"ios" | "android" | "tablet" | "watch" | "tv" | "macos" | "imac" | "windows" | "windowslaptop">> = {
      "iOS": ["ios", "android", "watch", "tablet", "windowslaptop", "macos", "imac", "windows", "tv"],
      "Android": ["ios", "android", "watch", "tablet", "windowslaptop", "macos", "imac", "windows", "tv"],
      "Web": ["ios", "android", "watch", "tablet", "windowslaptop", "macos", "imac", "windows", "tv"],
      "Windows": ["ios", "android", "watch", "tablet", "windowslaptop", "macos", "imac", "windows", "tv"],
      "macOS": ["ios", "android", "watch", "tablet", "windowslaptop", "macos", "imac", "windows", "tv"],
      "Tauri": ["ios", "android", "watch", "tablet", "windowslaptop", "macos", "imac", "windows", "tv"],
      "Electron": ["ios", "android", "watch", "tablet", "windowslaptop", "macos", "imac", "windows", "tv"],
    };
    const devices = deviceMap[selectedPlatform] || ["ios", "android", "watch", "tablet", "windowslaptop", "macos", "imac", "windows", "tv"];
    
    // Sort devices according to the specified order
    return devices.sort((a, b) => {
      const orderA = deviceOrder[a] || 999;
      const orderB = deviceOrder[b] || 999;
      return orderA - orderB;
    });
  }, [selectedPlatform]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full min-h-[400px] lg:min-h-0 w-full bg-card/40 backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col p-4 max-h-full"
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </h3>
        {allDimensions.length > 0 && (
          <span className="text-xs text-foreground/60">
            {allDimensions.length} sizes
          </span>
        )}
      </div>

      <div className="flex-1 bg-accent/10 rounded-lg border border-border overflow-auto custom-scrollbar p-4" style={{ overflowX: "auto", overflowY: "auto" }}>
        <AnimatePresence mode="wait">
          {!selectedImage ? (
            <motion.div
              key="no-image"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full gap-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <ImageIcon className="w-16 h-16 text-primary/60 mx-auto" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-base font-semibold text-foreground">
                  Select an Image
                </h4>
                <p className="text-sm text-foreground/60 max-w-sm">
                  Choose an image from the left panel to see previews across different device sizes and platforms
                </p>
              </div>
            </motion.div>
          ) : allDimensions.length === 0 ? (
            <motion.div
              key="no-platform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-foreground/50 text-sm"
            >
              No platform information available
            </motion.div>
          ) : (
            <>
              <motion.div
                key={selectedPlatform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8"
              >
                {allDimensions.map((dimension, index) => {
                  const [width, height] = dimension.split("×").map(d => parseInt(d.trim()));
                  const maxPreviewSize = 120; // Maximum preview size in pixels
                  const previewSize = Math.min(maxPreviewSize, Math.max(width, height));
                  
                  return (
                    <motion.div
                      key={dimension}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="flex flex-col items-center gap-2"
                      style={{ minWidth: 0, minHeight: 0, maxWidth: "none" }}
                    >
                      <div
                        className="flex items-center justify-center border border-border/50 overflow-hidden relative"
                        style={{
                          width: `${previewSize}px`,
                          height: `${previewSize}px`,
                          minWidth: `${previewSize}px`,
                          minHeight: `${previewSize}px`,
                          maxWidth: "none",
                          maxHeight: "none",
                          borderRadius: `${borderRoundness}px`,
                          backgroundColor: backgroundColor === "transparent" 
                            ? "transparent" 
                            : backgroundColor,
                          backgroundImage: backgroundColor === "transparent"
                            ? `linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)`
                            : undefined,
                          backgroundSize: "8px 8px",
                          backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                        }}
                      >
                        <img
                          src={selectedImage!}
                          alt={`Icon ${dimension}`}
                          style={{
                            width: `${previewSize * (scale / 100)}px`,
                            height: `${previewSize * (scale / 100)}px`,
                            maxWidth: "none",
                            maxHeight: "none",
                            objectFit: "contain",
                            borderRadius: `${borderRoundness}px`,
                            transform: `translate(calc(-50% + ${(positionX - 50) * previewSize / 100}px), calc(-50% + ${(positionY - 50) * previewSize / 100}px))`,
                            transformOrigin: "center",
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-foreground/80 text-center">
                        {dimension}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Devices Section */}
              {selectedImage && getDevicesForPlatform.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-8 pt-8 border-t border-border/50"
                >
                  <h4 className="text-sm font-semibold text-foreground mb-4">Device Previews</h4>
                  
                  {expandedDevice ? (
                    // Expanded device view
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full flex flex-col items-center justify-center min-h-[400px] bg-accent/5 rounded-lg border border-border/50 p-8"
                    >
                      <button
                        onClick={() => setExpandedDevice(null)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 hover:bg-background border border-border/50 transition-colors"
                        aria-label="Close expanded view"
                      >
                        <X className="w-4 h-4 text-foreground" />
                      </button>
                      <div className="w-full max-w-[400px] h-auto mb-4">
                        <Devices
                          selectedImage={null}
                          deviceType={expandedDevice as any}
                          className="w-full h-auto"
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {deviceLabels[expandedDevice] || expandedDevice}
                      </span>
                    </motion.div>
                  ) : (
                    // Grid view of all devices
                    <div className="grid grid-cols-3 gap-6">
                      {getDevicesForPlatform.map((deviceType, index) => (
                        <motion.div
                          key={deviceType}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex flex-col items-center gap-2 relative group"
                        >
                          <div className="w-full max-w-[200px] h-auto relative">
                            <Devices
                              selectedImage={null}
                              deviceType={deviceType}
                              className="w-full h-auto"
                            />
                            <button
                              onClick={() => setExpandedDevice(deviceType)}
                              className="absolute top-2 right-2 p-1.5 rounded-md bg-background/90 hover:bg-background border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              aria-label={`Expand ${deviceLabels[deviceType] || deviceType}`}
                            >
                              <Maximize2 className="w-3.5 h-3.5 text-foreground" />
                            </button>
                          </div>
                          <span className="text-xs font-medium text-foreground/80 text-center">
                            {deviceLabels[deviceType] || deviceType}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
