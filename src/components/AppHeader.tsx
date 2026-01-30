"use client";

import { useTheme, type ThemeName } from "../contexts/ThemeContext";
import { usePlatform } from "../contexts/PlatformContext";
import { useImageSettings } from "../contexts/ImageSettingsContext";
import StoryModal from "../components/StoryModal";
import AboutModal from "../components/AboutModal";
import LicenseModal from "../components/LicenseModal";
import { 
  Palette, 
  Menu,
  ChevronDown,
  BookOpen,
  Info,
  Github,
  FileText,
  Shield,
  Scale,
  Monitor,
  Smartphone,
  Globe,
  Tv,
  Watch,
  Coffee,
  Layers,
  Puzzle,
  Gamepad2,
  RotateCcw,
  Download,
  Save,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "../components/ui/dropdown-menu";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { cn } from "../lib/utils";
import { isTauri as detectTauri } from "../lib/tauri";
import { downloadIconsAsZip } from "../lib/downloadHandler";

const themes: { name: ThemeName; label: string; colors: string }[] = [
  { name: "navy", label: "Navy", colors: "bg-blue-900" },
  { name: "dark", label: "Dark", colors: "bg-gray-900" },
  { name: "light", label: "Light", colors: "bg-gray-100" },
  { name: "sunset", label: "Sunset", colors: "bg-orange-500" },
  { name: "ocean", label: "Ocean", colors: "bg-cyan-500" },
  { name: "forest", label: "Forest", colors: "bg-green-700" },
  { name: "purple", label: "Purple Dream", colors: "bg-purple-600" },
  { name: "midnight", label: "Midnight", colors: "bg-indigo-900" },
];

// Theme-based gradient colors for the icon
const getThemeGradientColors = (themeName: ThemeName): { start: string; end: string; secondary: string } => {
  const themeColors: Record<ThemeName, { start: string; end: string; secondary: string }> = {
    navy: { start: "#3b82f6", end: "#60a5fa", secondary: "#cbd5e1" },
    dark: { start: "#ededed", end: "#a3a3a3", secondary: "#525252" },
    light: { start: "#171717", end: "#525252", secondary: "#e5e7eb" },
    sunset: { start: "#fb923c", end: "#f97316", secondary: "#fed7aa" },
    ocean: { start: "#22d3ee", end: "#06b6d4", secondary: "#cffafe" },
    forest: { start: "#4ade80", end: "#22c55e", secondary: "#bbf7d0" },
    purple: { start: "#c084fc", end: "#a855f7", secondary: "#e9d5ff" },
    midnight: { start: "#818cf8", end: "#6366f1", secondary: "#c7d2fe" },
  };
  return themeColors[themeName] || themeColors.dark;
};



interface HeaderButton {
  id: string;
  type: "dropdown" | "toggle" | "button";
  label: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
}

interface Platform {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const platforms: Platform[] = [
  { id: "android", label: "Android", icon: <Smartphone className="w-4 h-4" /> },
  { id: "android-tv", label: "Android TV", icon: <Tv className="w-4 h-4" /> },
  { id: "angular", label: "Angular", icon: <Layers className="w-4 h-4" /> },
  { id: "apple-tv", label: "Apple TV (tvOS)", icon: <Tv className="w-4 h-4" /> },
  { id: "browser-extension", label: "Browser Extension", icon: <Puzzle className="w-4 h-4" /> },
  { id: "cordova", label: "Cordova", icon: <Smartphone className="w-4 h-4" /> },
  { id: "electron", label: "Electron", icon: <Monitor className="w-4 h-4" /> },
  { id: "flutter-desktop", label: "Flutter Desktop", icon: <Monitor className="w-4 h-4" /> },
  { id: "flutter-mobile", label: "Flutter (Mobile)", icon: <Smartphone className="w-4 h-4" /> },
  { id: "godot", label: "Godot", icon: <Gamepad2 className="w-4 h-4" /> },
  { id: "ionic", label: "Ionic", icon: <Smartphone className="w-4 h-4" /> },
  { id: "ios", label: "iOS", icon: <Smartphone className="w-4 h-4" /> },
  { id: "java-javafx", label: "JavaFX", icon: <Coffee className="w-4 h-4" /> },
  { id: "java-swing", label: "Java Swing", icon: <Coffee className="w-4 h-4" /> },
  { id: "maui", label: "MAUI", icon: <Smartphone className="w-4 h-4" /> },
  { id: "native-desktop", label: "Native Desktop", icon: <Monitor className="w-4 h-4" /> },
  { id: "nextjs", label: "Next.js", icon: <Layers className="w-4 h-4" /> },
  { id: "qt", label: "Qt", icon: <Monitor className="w-4 h-4" /> },
  { id: "react", label: "React", icon: <Layers className="w-4 h-4" /> },
  { id: "react-native", label: "React Native", icon: <Smartphone className="w-4 h-4" /> },
  { id: "tauri", label: "Tauri", icon: <Monitor className="w-4 h-4" /> },
  { id: "unity", label: "Unity", icon: <Gamepad2 className="w-4 h-4" /> },
  { id: "unreal-engine", label: "Unreal Engine", icon: <Gamepad2 className="w-4 h-4" /> },
  { id: "vue", label: "Vue", icon: <Layers className="w-4 h-4" /> },
  { id: "watchos", label: "watchOS", icon: <Watch className="w-4 h-4" /> },
  { id: "wear-os", label: "Wear OS", icon: <Watch className="w-4 h-4" /> },
  { id: "web-pwa", label: "Web / PWA", icon: <Globe className="w-4 h-4" /> },
].sort((a, b) => a.label.localeCompare(b.label));

interface AppHeaderProps {
  selectedImage?: string | null;
  onResetImage?: () => void;
}

export default function AppHeader({ selectedImage, onResetImage }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { selectedPlatform, setSelectedPlatform } = usePlatform();
  const { backgroundColor, scale, positionX, positionY, borderRoundness, setBackgroundColor, setScale, setPositionX, setPositionY, setBorderRoundness } = useImageSettings();
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [menuButtons, setMenuButtons] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isTauri, setIsTauri] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const currentTheme = themes.find(t => t.name === theme);
  const currentPlatform = platforms.find(p => p.id === selectedPlatform);
  
  const iconColors = useMemo(() => getThemeGradientColors(theme), [theme]);

  const allButtons: HeaderButton[] = [
    {
      id: "download",
      type: "button",
      label: isTauri ? "Save" : "Download",
      icon: isTauri ? <Save className="w-4 h-4" /> : <Download className="w-4 h-4" />,
      component: (
        <motion.div whileHover={selectedImage ? { scale: 1.02 } : {}} whileTap={selectedImage ? { scale: 0.98 } : {}} transition={{ duration: 0.2 }}>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap"
            disabled={!selectedImage || isDownloading}
            onClick={async () => {
              if (!selectedImage) return;
              
              setIsDownloading(true);
              setDownloadProgress(0);
              
              try {
                if (isTauri) {
                  const zipBlob = await downloadIconsAsZip({
                    sourceImage: selectedImage,
                    platformId: selectedPlatform,
                    settings: {
                      backgroundColor,
                      scale,
                      positionX,
                      positionY,
                      borderRoundness,
                    },
                    onProgress: (progress) => {
                      setDownloadProgress(progress);
                    },
                    returnBlob: true,
                  });
                  if (zipBlob) {
                    const { save } = await import('@tauri-apps/plugin-dialog');
                    const { invoke } = await import('@tauri-apps/api/core');
                    const defaultName = `icons-${selectedPlatform}-${Date.now()}.zip`;
                    const filePath = await save({
                      defaultPath: defaultName,
                      filters: [{ name: 'Zip archive', extensions: ['zip'] }],
                    });
                    if (filePath) {
                      const base64 = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const result = reader.result as string;
                          resolve(result.split(',')[1] ?? '');
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(zipBlob);
                      });
                      await invoke('write_file', { path: filePath, data: base64 });
                    }
                  }
                } else {
                  await downloadIconsAsZip({
                    sourceImage: selectedImage,
                    platformId: selectedPlatform,
                    settings: {
                      backgroundColor,
                      scale,
                      positionX,
                      positionY,
                      borderRoundness,
                    },
                    onProgress: (progress) => {
                      setDownloadProgress(progress);
                    },
                  });
                }
              } catch (error) {
                console.error(isTauri ? 'Save failed:' : 'Download failed:', error);
                alert(isTauri ? 'Failed to save icons. Please try again.' : 'Failed to download icons. Please try again.');
              } finally {
                setIsDownloading(false);
                setDownloadProgress(null);
              }
            }}
          >
            {isTauri ? <Save className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span className="hidden lg:inline">
              {isDownloading 
                ? downloadProgress !== null 
                  ? (isTauri ? `Saving... ${Math.round(downloadProgress)}%` : `Downloading... ${Math.round(downloadProgress)}%`)
                  : 'Preparing...'
                : (isTauri ? 'Save' : 'Download')
              }
            </span>
          </Button>
        </motion.div>
      ),
    },
    {
      id: "platform",
      type: "dropdown",
      label: currentPlatform?.label || "Platform",
      icon: currentPlatform?.icon || <Monitor className="w-4 h-4" />,
      component: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap">
                {currentPlatform?.icon || <Monitor className="w-4 h-4" />}
                <span className="hidden lg:inline">{currentPlatform?.label || "Platform"}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl max-h-[80vh] overflow-y-auto">
            <AnimatePresence>
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  <DropdownMenuItem
                    onClick={() => setSelectedPlatform(platform.id)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    {platform.icon}
                    <span>{platform.label}</span>
                    {selectedPlatform === platform.id && <span className="ml-auto text-primary">✓</span>}
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: "theme",
      type: "button",
      label: currentTheme?.label || "Theme",
      icon: <Palette className="w-4 h-4" />,
      component: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap">
                <Palette className="w-4 h-4" />
                <span className="hidden lg:inline">{currentTheme?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <AnimatePresence>
              {themes.map((t, index) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <DropdownMenuItem
                    onClick={() => setTheme(t.name)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className={cn("w-6 h-6 rounded", t.colors)}></div>
                    <span>{t.label}</span>
                    {theme === t.name && <span className="ml-auto text-primary">✓</span>}
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: "reset",
      type: "button",
      label: "Reset All",
      icon: <RotateCcw className="w-4 h-4" />,
      component: (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap"
            onClick={() => {
              // Reset image
              onResetImage?.();
              // Reset platform to default
              setSelectedPlatform("tauri");
              // Reset all image settings
              setBackgroundColor("#ffffff");
              setScale(100);
              setPositionX(50);
              setPositionY(50);
              setBorderRoundness(0);
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden lg:inline">Reset All</span>
          </Button>
        </motion.div>
      ),
    },
  ];

  const allButtonIds = useMemo(() => 
    ["download", "platform", "theme", "reset"],
    []
  );

  const adjustVisibleButtons = useCallback(() => {
    if (!headerRef.current || !buttonsContainerRef.current) return;

    const headerWidth = headerRef.current.offsetWidth;
    const leftSectionWidth = leftSectionRef.current?.offsetWidth || 200; // Measure actual width
    const padding = 32; // Padding on both sides (16px each)
    const sectionGap = 16; // Gap between left section and buttons (gap-4 = 16px)
    const gap = 8; // Gap between buttons
    
    // Always reserve space for menu button (it's always visible now)
    const menuButtonWidth = menuButtonRef.current?.offsetWidth || 80;
    const menuButtonGap = 8; // Gap before menu button
    let availableWidth = headerWidth - leftSectionWidth - menuButtonWidth - padding - sectionGap - menuButtonGap;

    const buttonElements = Array.from(buttonsContainerRef.current.children) as HTMLElement[];

    // Reset all buttons to visible first to measure them
    buttonElements.forEach((el, index) => {
      if (el && index < allButtonIds.length) {
        el.style.display = '';
      }
    });

    // Force a reflow to ensure measurements are accurate
    void buttonsContainerRef.current.offsetHeight;

    // Measure total width of all buttons
    let totalButtonsWidth = 0;
    const buttonWidths: number[] = [];
    
    buttonElements.forEach((el, index) => {
      if (index < allButtonIds.length && el) {
        const width = el.offsetWidth;
        buttonWidths.push(width);
        totalButtonsWidth += width + (index > 0 ? gap : 0);
      }
    });

    // If all buttons fit, show them all
    if (totalButtonsWidth <= availableWidth) {
      setMenuButtons([]);
      return;
    }

    // Calculate which buttons fit
    let currentWidth = 0;
    const newVisibleButtons: string[] = [];
    const newMenuButtons: string[] = [];

    buttonElements.forEach((el, index) => {
      if (index >= allButtonIds.length) return;
      
      const buttonId = allButtonIds[index];
      const buttonWidth = buttonWidths[index] + (index > 0 ? gap : 0);

      if (currentWidth + buttonWidth <= availableWidth) {
        currentWidth += buttonWidth;
        newVisibleButtons.push(buttonId);
      } else {
        el.style.display = 'none';
        newMenuButtons.push(buttonId);
      }
    });

    setMenuButtons(newMenuButtons);
  }, [allButtonIds]);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsSafari(ua.includes("Safari") && !ua.includes("Chrome") && !ua.includes("Chromium"));
    setIsTauri(detectTauri());
  }, []);

  useEffect(() => {
    // Initial adjustment
    const timer = setTimeout(() => adjustVisibleButtons(), 100);

    const handleResize = () => {
      setTimeout(() => adjustVisibleButtons(), 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustVisibleButtons]);

  useEffect(() => {
    // Re-adjust when button states change
    const timer = setTimeout(() => adjustVisibleButtons(), 100);
    return () => clearTimeout(timer);
  }, [theme, selectedPlatform, adjustVisibleButtons]);

  const menuButtonItems = allButtons.filter(btn => menuButtons.includes(btn.id));

  return (
    <>
      {isSafari && !isTauri && (
        <div
          role="banner"
          className="w-full py-2 px-4 flex items-center justify-center gap-2 text-sm bg-amber-500/15 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200 border-b border-amber-500/20"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span>
            Transparency effects may not work correctly in Safari. Use Chrome for the best experience.
          </span>
        </div>
      )}
      <motion.header 
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-14 border-b border-border/40 bg-card/40 backdrop-blur-md flex items-center px-4 gap-4 overflow-hidden"
      >
      <motion.div 
        ref={leftSectionRef} 
        className="flex items-center gap-3 flex-shrink-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-8 h-8"
          >
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id={`brandGrad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={iconColors.start} />
                  <stop offset="100%" stopColor={iconColors.end} />
                </linearGradient>
              </defs>

              <path d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z" 
                    stroke={`url(#brandGrad-${theme})`} 
                    strokeWidth="6" 
                    strokeLinejoin="round" 
                    fill="none" />

              <rect x="35" y="32" width="12" height="12" rx="3" fill={`url(#brandGrad-${theme})`} />
              <rect x="53" y="32" width="12" height="12" rx="3" fill={iconColors.secondary} />
              
              <rect x="35" y="50" width="12" height="12" rx="3" fill={iconColors.secondary} />
              <rect x="53" y="50" width="12" height="12" rx="3" fill={`url(#brandGrad-${theme})`} />
              
              <path d="M47 38H53M41 44V50M59 44V50M47 56H53" 
                    stroke={`url(#brandGrad-${theme})`} 
                    strokeWidth="2" 
                    strokeLinecap="round" />
            </svg>
          </motion.div>
          <motion.h1 
            className="text-lg font-bold text-foreground lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Iconify
          </motion.h1>
          <motion.h1 
            className="text-lg font-bold text-foreground hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Iconify
          </motion.h1>
        </div>
      </motion.div>

      <motion.div 
        className="flex items-center gap-2 flex-1 justify-end min-w-0 ml-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div ref={buttonsContainerRef} className="flex items-center gap-2">
          {allButtons.map((button, index) => (
            <motion.div
              key={button.id}
              ref={(el) => {
                if (el) {
                  buttonRefs.current.set(button.id, el);
                }
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              {button.component}
            </motion.div>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div ref={menuButtonRef}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap"
                >
                  <Menu className="w-4 h-4" />
                  <span className="hidden lg:inline">Menu</span>
                </Button>
              </motion.div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            {menuButtonItems.length > 0 && (
              <>
                <AnimatePresence>
                  {menuButtonItems.map((button, btnIndex) => {
                    if (button.type === "dropdown" && button.id === "platform") {
                      return (
                        <motion.div
                          key={button.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2, delay: btnIndex * 0.05 }}
                        >
                          <DropdownMenuItem className="flex items-center gap-3 cursor-pointer" hasSubmenu={true}>
                            <Monitor className="w-4 h-4" />
                            <span>Platform</span>
                            <DropdownMenuSub>
                              <DropdownMenuSubContent className="w-56 rounded-xl max-h-[80vh] overflow-y-auto">
                                <AnimatePresence>
                                  {platforms.map((platform, platformIndex) => (
                                    <motion.div
                                      key={platform.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{ duration: 0.2, delay: platformIndex * 0.02 }}
                                    >
                                      <DropdownMenuItem
                                        onClick={() => setSelectedPlatform(platform.id)}
                                        className="flex items-center gap-3 cursor-pointer"
                                      >
                                        {platform.icon}
                                        <span>{platform.label}</span>
                                        {selectedPlatform === platform.id && <span className="ml-auto text-primary">✓</span>}
                                      </DropdownMenuItem>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuItem>
                        </motion.div>
                      );
                    }
                    if ((button.type === "dropdown" || button.type === "button") && button.id === "theme") {
                      return (
                        <motion.div
                          key={button.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2, delay: btnIndex * 0.05 }}
                        >
                          <DropdownMenuItem className="flex items-center gap-3 cursor-pointer" hasSubmenu={true}>
                            <Palette className="w-4 h-4" />
                            <span>Theme</span>
                            <DropdownMenuSub>
                              <DropdownMenuSubContent className="w-48 rounded-xl">
                                <AnimatePresence>
                                  {themes.map((t, themeIndex) => (
                                    <motion.div
                                      key={t.name}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{ duration: 0.2, delay: themeIndex * 0.05 }}
                                    >
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setTheme(t.name);
                                        }}
                                        className="flex items-center gap-3 cursor-pointer"
                                      >
                                        <div className={cn("w-6 h-6 rounded", t.colors)}></div>
                                        <span>{t.label}</span>
                                        {theme === t.name && <span className="ml-auto text-primary">✓</span>}
                                      </DropdownMenuItem>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuItem>
                        </motion.div>
                      );
                    }
                    return (
                      <motion.div
                        key={button.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, delay: btnIndex * 0.05 }}
                      >
                        <DropdownMenuItem
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          {button.icon}
                          <span>{button.label}</span>
                        </DropdownMenuItem>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div className="h-px bg-border my-1" />
              </>
            )}
            <AnimatePresence>
              <motion.div
                key="story"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenuItem 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setStoryModalOpen(true)}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Story</span>
                </DropdownMenuItem>
              </motion.div>
              <motion.div
                key="about"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <DropdownMenuItem 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setAboutModalOpen(true)}
                >
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </DropdownMenuItem>
              </motion.div>
              <motion.div
                key="github"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <DropdownMenuItem 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    const githubUrl = `https://github.com/Roboticela/Iconify`;
                    window.open(githubUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <Github className="w-4 h-4" />
                  <span>Github</span>
                </DropdownMenuItem>
              </motion.div>
              <motion.div
                key="license"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                <DropdownMenuItem 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setLicenseModalOpen(true)}
                >
                  <FileText className="w-4 h-4" />
                  <span>License</span>
                </DropdownMenuItem>
              </motion.div>
              <motion.div
                key="support"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <DropdownMenuItem 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://iconify.roboticela.com';
                    const supportUrl = `${siteUrl}/support`;
                    window.open(supportUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Support</span>
                </DropdownMenuItem>
              </motion.div>
            </AnimatePresence>
            <div className="h-px bg-border my-1" />
            <AnimatePresence>
              <motion.div
                key="privacy-policy"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <DropdownMenuItem 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://iconify.roboticela.com';
                    const privacyUrl = `${siteUrl}/privacy`;
                    window.open(privacyUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
              </motion.div>
              <motion.div
                key="terms-of-service"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.25 }}
              >
                <DropdownMenuItem 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://iconify.roboticela.com';
                    const termsUrl = `${siteUrl}/terms`;
                    window.open(termsUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <Scale className="w-4 h-4" />
                  <span>Terms of Service</span>
                </DropdownMenuItem>
              </motion.div>
            </AnimatePresence>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Story Modal */}
      <StoryModal isOpen={storyModalOpen} onClose={() => setStoryModalOpen(false)} />
      
      {/* About Modal */}
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      
      {/* License Modal */}
      <LicenseModal isOpen={licenseModalOpen} onClose={() => setLicenseModalOpen(false)} />
    </motion.header>
    </>
  );
}

