/**
 * Icon Generator Utility
 * Generates icons with proper sizing, background, scale, position, and border roundness
 */

import { isTauri } from './tauri';

export interface IconGenerationSettings {
  backgroundColor: string;
  scale: number; // percentage (0-500)
  positionX: number; // percentage (0-100)
  positionY: number; // percentage (0-100)
  borderRoundness: number; // pixels
}

export interface IconSpec {
  width: number;
  height: number;
  filename: string;
  format: 'png' | 'ico' | 'icns';
}

/**
 * Generate an icon image with the specified settings
 */
export async function generateIcon(
  sourceImage: string,
  width: number,
  height: number,
  settings: IconGenerationSettings
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Load the source image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Helper function to draw rounded rectangle with true circular arcs
      const drawRoundedRect = (x: number, y: number, w: number, h: number, radius: number) => {
        // Clamp radius to not exceed half of width or height
        const maxRadius = Math.min(w / 2, h / 2);
        const r = Math.min(radius, maxRadius);
        
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      };
      
      // Calculate border radius once for the entire icon (used for both background and image clipping)
      // Treat borderRoundness as percentage (0-100) of smallest canvas dimension
      const iconRadius = settings.borderRoundness > 0 
        ? (settings.borderRoundness / 100) * (Math.min(width, height) / 2)
        : 0;
      
      // Draw background (transparent backgrounds remain transparent in output)
      if (settings.backgroundColor !== 'transparent') {
        ctx.fillStyle = settings.backgroundColor;
        if (iconRadius > 0) {
          // Draw rounded rectangle background
          drawRoundedRect(0, 0, width, height, iconRadius);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, width, height);
        }
      }
      
      // Calculate image dimensions maintaining aspect ratio (contain behavior - match preview)
      const imageScale = settings.scale / 100;
      const sourceAspectRatio = img.width / img.height;
      const targetAspectRatio = width / height;
      
      // Calculate the maximum available dimensions with scale
      const maxWidth = width * imageScale;
      const maxHeight = height * imageScale;
      
      let drawWidth: number;
      let drawHeight: number;
      
      // Use "contain" behavior - fit image within bounds while maintaining aspect ratio
      // This matches the preview which uses objectFit: "contain"
      if (sourceAspectRatio > targetAspectRatio) {
        // Source is wider - fit to width, height will be smaller
        drawWidth = maxWidth;
        drawHeight = drawWidth / sourceAspectRatio;
        // Ensure it doesn't exceed height
        if (drawHeight > maxHeight) {
          drawHeight = maxHeight;
          drawWidth = drawHeight * sourceAspectRatio;
        }
      } else {
        // Source is taller - fit to height, width will be smaller
        drawHeight = maxHeight;
        drawWidth = drawHeight * sourceAspectRatio;
        // Ensure it doesn't exceed width
        if (drawWidth > maxWidth) {
          drawWidth = maxWidth;
          drawHeight = drawWidth / sourceAspectRatio;
        }
      }
      
      // Calculate position offset
      const offsetX = ((settings.positionX - 50) / 100) * width;
      const offsetY = ((settings.positionY - 50) / 100) * height;
      
      // Draw image centered with offset (matching preview behavior)
      const x = (width - drawWidth) / 2 + offsetX;
      const y = (height - drawHeight) / 2 + offsetY;
      
      // Apply border roundness to entire canvas (clipping to match background)
      if (iconRadius > 0) {
        ctx.save();
        drawRoundedRect(0, 0, width, height, iconRadius);
        ctx.clip();
      }
      
      // Draw the entire image without cropping (contain behavior)
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      if (iconRadius > 0) {
        ctx.restore();
      }
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load source image'));
    };
    
    img.src = sourceImage;
  });
}

/**
 * Generate an ICNS file with multiple icon sizes
 * ICNS files contain multiple resolutions in a single file
 * Uses Tauri command if running in Tauri, otherwise falls back to API endpoint
 */
export async function generateICNS(
  sourceImage: string,
  settings: IconGenerationSettings
): Promise<Blob> {
  if (isTauri()) {
    // Use Tauri v2 to generate ICNS natively
    try {
      const { invoke } = await import('@tauri-apps/api/core');

      // Generate all required PNG sizes for ICNS (standard macOS icon sizes)
      const sizes = [16, 32, 64, 128, 256, 512, 1024];
      const pngImages: { size: number; data: string }[] = [];
      
      for (const size of sizes) {
        const pngBlob = await generateIcon(sourceImage, size, size, settings);
        // Use FileReader to avoid "Maximum call stack size exceeded" with large PNGs
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data ?? '');
          };
          reader.onerror = reject;
          reader.readAsDataURL(pngBlob);
        });
        pngImages.push({ size, data: base64 });
      }
      
      // Call Tauri command to generate ICNS
      const icnsBase64 = await invoke('generate_icns', { images: pngImages });
      
      // Convert base64 back to blob
      const binaryString = atob(icnsBase64 as string);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      return new Blob([bytes], { type: 'image/icns' });
    } catch (error) {
      console.error('Tauri ICNS generation failed, falling back to API:', error);
      // Fall through to API method
    }
  }
  
  // Fallback to API method (for web or if Tauri fails)
  // Generate a high-resolution PNG (1024x1024) to send to the API
  const pngBlob = await generateIcon(sourceImage, 1024, 1024, settings);
  
  // Convert the PNG blob to base64 for API transmission
  // Use FileReader for efficient base64 conversion
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (data:image/png;base64,)
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(pngBlob);
  });
  
  // Get the API URL from environment variable
  const apiUrl = import.meta.env.VITE_SITE_URL || 'https://iconify.roboticela.com';
  const endpoint = `${apiUrl}/api/generate-icns`;
  
  // Prepare the request payload
  const payload = {
    image: base64, // Base64 string without data URL prefix
    settings: {
      backgroundColor: settings.backgroundColor,
      scale: settings.scale,
      positionX: settings.positionX,
      positionY: settings.positionY,
      borderRoundness: settings.borderRoundness,
    },
  };
  
  // Call the API endpoint
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate ICNS file: ${response.status} ${response.statusText}. ${errorText}`);
  }
  
  // Get the ICNS file as a blob
  const icnsBlob = await response.blob();
  
  // Verify it's an ICNS file
  if (!icnsBlob || icnsBlob.size === 0) {
    throw new Error('API returned empty ICNS file');
  }
  
  return icnsBlob;
}

/**
 * Generate an ICO file with multiple icon sizes
 * ICO files can contain multiple resolutions in a single file
 * Modern ICO files use PNG encoding for better compression
 */
export async function generateICO(
  sourceImage: string,
  sizes: Array<{ width: number; height: number }>,
  settings: IconGenerationSettings
): Promise<Blob> {
  // Generate PNG images for each size
  const iconPromises = sizes.map(async ({ width, height }) => {
    const pngBlob = await generateIcon(sourceImage, width, height, settings);
    const arrayBuffer = await pngBlob.arrayBuffer();
    const pngData = new Uint8Array(arrayBuffer);
    return { width, height, pngData };
  });

  const icons = await Promise.all(iconPromises);

  // Calculate total size needed for ICO file
  // ICO Header: 6 bytes
  // ICO Directory: 16 bytes per entry
  // Image data: size of each PNG
  const headerSize = 6;
  const directoryEntrySize = 16;
  const directorySize = icons.length * directoryEntrySize;
  let imageDataOffset = headerSize + directorySize;
  
  // Calculate total file size
  const totalSize = headerSize + directorySize + icons.reduce((sum, icon) => sum + icon.pngData.length, 0);

  // Create ICO file buffer
  const icoBuffer = new ArrayBuffer(totalSize);
  const icoView = new DataView(icoBuffer);
  const icoArray = new Uint8Array(icoBuffer);

  // Write ICO Header
  // Reserved (must be 0): 2 bytes
  icoView.setUint16(0, 0, true);
  // Type (1 = ICO): 2 bytes
  icoView.setUint16(2, 1, true);
  // Number of images: 2 bytes
  icoView.setUint16(4, icons.length, true);

  // Write ICO Directory entries and image data
  let currentOffset = imageDataOffset;
  icons.forEach((icon, index) => {
    const directoryOffset = headerSize + (index * directoryEntrySize);
    
    // Width (0-255, 0 means 256): 1 byte
    // ICO format only supports up to 256x256 in directory entry
    const width = icon.width > 256 ? 256 : icon.width;
    const height = icon.height > 256 ? 256 : icon.height;
    icoView.setUint8(directoryOffset, width === 256 ? 0 : width);
    // Height (0-255, 0 means 256): 1 byte
    icoView.setUint8(directoryOffset + 1, height === 256 ? 0 : height);
    // Color palette (0 for PNG): 1 byte
    icoView.setUint8(directoryOffset + 2, 0);
    // Reserved (must be 0): 1 byte
    icoView.setUint8(directoryOffset + 3, 0);
    // Color planes (0 or 1 for PNG): 2 bytes
    icoView.setUint16(directoryOffset + 4, 0, true);
    // Bits per pixel (0 for PNG): 2 bytes
    icoView.setUint16(directoryOffset + 6, 0, true);
    // Size of image data: 4 bytes
    icoView.setUint32(directoryOffset + 8, icon.pngData.length, true);
    // Offset of image data: 4 bytes
    icoView.setUint32(directoryOffset + 12, currentOffset, true);
    
    // Write PNG image data
    icoArray.set(icon.pngData, currentOffset);
    currentOffset += icon.pngData.length;
  });

  return new Blob([icoBuffer], { type: 'image/x-icon' });
}

/**
 * Get platform-specific icon specifications
 */
export function getPlatformIconSpecs(platformId: string): IconSpec[] {
  // Map platform IDs to their icon requirements with exact folder structures
  const platformSpecs: Record<string, IconSpec[]> = {
    // Android
    'android': [
      { width: 48, height: 48, filename: 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png', format: 'png' },
      { width: 72, height: 72, filename: 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png', format: 'png' },
      { width: 96, height: 96, filename: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png', format: 'png' },
      { width: 144, height: 144, filename: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', format: 'png' },
      { width: 192, height: 192, filename: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', format: 'png' },
      { width: 512, height: 512, filename: 'android/app/src/main/playstore/icon.png', format: 'png' },
    ],
    
    // Android TV
    'android-tv': [
      { width: 160, height: 160, filename: 'android-tv/app/src/main/res/mipmap-hdpi/ic_launcher.png', format: 'png' },
      { width: 240, height: 240, filename: 'android-tv/app/src/main/res/mipmap-xhdpi/ic_launcher.png', format: 'png' },
      { width: 320, height: 320, filename: 'android-tv/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', format: 'png' },
      { width: 1280, height: 720, filename: 'android-tv/app/src/main/tv-banner/banner.png', format: 'png' },
    ],
    
    // Angular
    'angular': [
      // ICO file with multiple sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256)
      { width: 16, height: 16, filename: 'angular/src/assets/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'angular/src/assets/icons/favicon.ico', format: 'ico' },
      { width: 48, height: 48, filename: 'angular/src/assets/icons/favicon.ico', format: 'ico' },
      { width: 64, height: 64, filename: 'angular/src/assets/icons/favicon.ico', format: 'ico' },
      { width: 128, height: 128, filename: 'angular/src/assets/icons/favicon.ico', format: 'ico' },
      { width: 256, height: 256, filename: 'angular/src/assets/icons/favicon.ico', format: 'ico' },
      { width: 192, height: 192, filename: 'angular/src/assets/icons/icon-192.png', format: 'png' },
      { width: 512, height: 512, filename: 'angular/src/assets/icons/icon-512.png', format: 'png' },
    ],
    
    // Apple TV (tvOS)
    'apple-tv': [
      { width: 400, height: 240, filename: 'apple-tv/Assets.xcassets/App Icon.appiconset/AppIcon-400x240.png', format: 'png' },
      { width: 800, height: 480, filename: 'apple-tv/Assets.xcassets/App Icon.appiconset/AppIcon-800x480.png', format: 'png' },
      { width: 1280, height: 768, filename: 'apple-tv/Assets.xcassets/App Icon.appiconset/AppIcon-1280x768.png', format: 'png' },
    ],
    
    // Browser Extension
    'browser-extension': [
      { width: 16, height: 16, filename: 'browser-extension/icons/icon-16.png', format: 'png' },
      { width: 32, height: 32, filename: 'browser-extension/icons/icon-32.png', format: 'png' },
      { width: 48, height: 48, filename: 'browser-extension/icons/icon-48.png', format: 'png' },
      { width: 128, height: 128, filename: 'browser-extension/icons/icon-128.png', format: 'png' },
    ],
    
    // Cordova
    'cordova': [
      { width: 48, height: 48, filename: 'cordova/res/android/icon/drawable-mdpi-icon.png', format: 'png' },
      { width: 72, height: 72, filename: 'cordova/res/android/icon/drawable-hdpi-icon.png', format: 'png' },
      { width: 96, height: 96, filename: 'cordova/res/android/icon/drawable-xhdpi-icon.png', format: 'png' },
      { width: 144, height: 144, filename: 'cordova/res/android/icon/drawable-xxhdpi-icon.png', format: 'png' },
      { width: 192, height: 192, filename: 'cordova/res/android/icon/drawable-xxxhdpi-icon.png', format: 'png' },
      { width: 60, height: 60, filename: 'cordova/res/ios/icon/icon-60.png', format: 'png' },
      { width: 120, height: 120, filename: 'cordova/res/ios/icon/icon-60@2x.png', format: 'png' },
      { width: 180, height: 180, filename: 'cordova/res/ios/icon/icon-60@3x.png', format: 'png' },
    ],
    
    // Electron
    'electron': [
      { width: 16, height: 16, filename: 'electron/build/icons/png/16x16.png', format: 'png' },
      { width: 32, height: 32, filename: 'electron/build/icons/png/32x32.png', format: 'png' },
      { width: 64, height: 64, filename: 'electron/build/icons/png/64x64.png', format: 'png' },
      { width: 128, height: 128, filename: 'electron/build/icons/png/128x128.png', format: 'png' },
      { width: 256, height: 256, filename: 'electron/build/icons/png/256x256.png', format: 'png' },
      { width: 512, height: 512, filename: 'electron/build/icons/icns/icon.icns', format: 'icns' },
      // ICO file with multiple sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256)
      { width: 16, height: 16, filename: 'electron/build/icons/ico/icon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'electron/build/icons/ico/icon.ico', format: 'ico' },
      { width: 48, height: 48, filename: 'electron/build/icons/ico/icon.ico', format: 'ico' },
      { width: 64, height: 64, filename: 'electron/build/icons/ico/icon.ico', format: 'ico' },
      { width: 128, height: 128, filename: 'electron/build/icons/ico/icon.ico', format: 'ico' },
      { width: 256, height: 256, filename: 'electron/build/icons/ico/icon.ico', format: 'ico' },
    ],
    
    // Flutter Desktop
    'flutter-desktop': [
      { width: 32, height: 32, filename: 'flutter-desktop/linux/icons/32x32.png', format: 'png' },
      { width: 64, height: 64, filename: 'flutter-desktop/linux/icons/64x64.png', format: 'png' },
      { width: 128, height: 128, filename: 'flutter-desktop/linux/icons/128x128.png', format: 'png' },
      { width: 256, height: 256, filename: 'flutter-desktop/linux/icons/256x256.png', format: 'png' },
      { width: 1024, height: 1024, filename: 'flutter-desktop/macos/Runner/Assets.xcassets/AppIcon.appiconset/icon_1024.png', format: 'png' },
      // ICO file with multiple sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256)
      { width: 16, height: 16, filename: 'flutter-desktop/windows/runner/resources/app_icon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'flutter-desktop/windows/runner/resources/app_icon.ico', format: 'ico' },
      { width: 48, height: 48, filename: 'flutter-desktop/windows/runner/resources/app_icon.ico', format: 'ico' },
      { width: 64, height: 64, filename: 'flutter-desktop/windows/runner/resources/app_icon.ico', format: 'ico' },
      { width: 128, height: 128, filename: 'flutter-desktop/windows/runner/resources/app_icon.ico', format: 'ico' },
      { width: 256, height: 256, filename: 'flutter-desktop/windows/runner/resources/app_icon.ico', format: 'ico' },
    ],
    
    // Flutter Mobile
    'flutter-mobile': [
      { width: 48, height: 48, filename: 'flutter-mobile/android/app/src/main/res/mipmap-mdpi/ic_launcher.png', format: 'png' },
      { width: 72, height: 72, filename: 'flutter-mobile/android/app/src/main/res/mipmap-hdpi/ic_launcher.png', format: 'png' },
      { width: 96, height: 96, filename: 'flutter-mobile/android/app/src/main/res/mipmap-xhdpi/ic_launcher.png', format: 'png' },
      { width: 144, height: 144, filename: 'flutter-mobile/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', format: 'png' },
      { width: 192, height: 192, filename: 'flutter-mobile/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', format: 'png' },
      { width: 1024, height: 1024, filename: 'flutter-mobile/ios/Runner/Assets.xcassets/AppIcon.appiconset/icon_1024.png', format: 'png' },
    ],
    
    // Godot
    'godot': [
      { width: 256, height: 256, filename: 'godot/icons/icon.png', format: 'png' },
    ],
    
    // Ionic
    'ionic': [
      { width: 512, height: 512, filename: 'ionic/resources/android/icon.png', format: 'png' },
      { width: 1024, height: 1024, filename: 'ionic/resources/ios/icon.png', format: 'png' },
    ],
    
    // iOS
    'ios': [
      { width: 60, height: 60, filename: 'ios/Assets.xcassets/AppIcon.appiconset/icon-60.png', format: 'png' },
      { width: 120, height: 120, filename: 'ios/Assets.xcassets/AppIcon.appiconset/icon-60@2x.png', format: 'png' },
      { width: 180, height: 180, filename: 'ios/Assets.xcassets/AppIcon.appiconset/icon-60@3x.png', format: 'png' },
      { width: 1024, height: 1024, filename: 'ios/Assets.xcassets/AppIcon.appiconset/icon-1024.png', format: 'png' },
    ],
    
    // JavaFX / Swing / Qt / Native Desktop
    'java-javafx': [
      { width: 16, height: 16, filename: 'desktop/icons/icon-16.png', format: 'png' },
      { width: 32, height: 32, filename: 'desktop/icons/icon-32.png', format: 'png' },
      { width: 64, height: 64, filename: 'desktop/icons/icon-64.png', format: 'png' },
      { width: 128, height: 128, filename: 'desktop/icons/icon-128.png', format: 'png' },
      { width: 256, height: 256, filename: 'desktop/icons/icon-256.png', format: 'png' },
    ],
    'java-swing': [
      { width: 16, height: 16, filename: 'desktop/icons/icon-16.png', format: 'png' },
      { width: 32, height: 32, filename: 'desktop/icons/icon-32.png', format: 'png' },
      { width: 64, height: 64, filename: 'desktop/icons/icon-64.png', format: 'png' },
      { width: 128, height: 128, filename: 'desktop/icons/icon-128.png', format: 'png' },
      { width: 256, height: 256, filename: 'desktop/icons/icon-256.png', format: 'png' },
    ],
    'qt': [
      { width: 16, height: 16, filename: 'desktop/icons/icon-16.png', format: 'png' },
      { width: 32, height: 32, filename: 'desktop/icons/icon-32.png', format: 'png' },
      { width: 64, height: 64, filename: 'desktop/icons/icon-64.png', format: 'png' },
      { width: 128, height: 128, filename: 'desktop/icons/icon-128.png', format: 'png' },
      { width: 256, height: 256, filename: 'desktop/icons/icon-256.png', format: 'png' },
    ],
    'native-desktop': [
      { width: 16, height: 16, filename: 'desktop/icons/icon-16.png', format: 'png' },
      { width: 32, height: 32, filename: 'desktop/icons/icon-32.png', format: 'png' },
      { width: 64, height: 64, filename: 'desktop/icons/icon-64.png', format: 'png' },
      { width: 128, height: 128, filename: 'desktop/icons/icon-128.png', format: 'png' },
      { width: 256, height: 256, filename: 'desktop/icons/icon-256.png', format: 'png' },
    ],
    
    // Next.js / React / Vue / Web PWA
    'nextjs': [
      // ICO file with multiple sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256)
      { width: 16, height: 16, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 48, height: 48, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 64, height: 64, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 128, height: 128, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 256, height: 256, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 192, height: 192, filename: 'web/public/icons/icon-192.png', format: 'png' },
      { width: 512, height: 512, filename: 'web/public/icons/icon-512.png', format: 'png' },
      { width: 180, height: 180, filename: 'web/public/icons/apple-touch-icon.png', format: 'png' },
    ],
    'react': [
      // ICO file with multiple sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256)
      { width: 16, height: 16, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 48, height: 48, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 64, height: 64, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 128, height: 128, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 256, height: 256, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 192, height: 192, filename: 'web/public/icons/icon-192.png', format: 'png' },
      { width: 512, height: 512, filename: 'web/public/icons/icon-512.png', format: 'png' },
      { width: 180, height: 180, filename: 'web/public/icons/apple-touch-icon.png', format: 'png' },
    ],
    'vue': [
      // ICO file with multiple sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256)
      { width: 16, height: 16, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 48, height: 48, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 64, height: 64, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 128, height: 128, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 256, height: 256, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 192, height: 192, filename: 'web/public/icons/icon-192.png', format: 'png' },
      { width: 512, height: 512, filename: 'web/public/icons/icon-512.png', format: 'png' },
      { width: 180, height: 180, filename: 'web/public/icons/apple-touch-icon.png', format: 'png' },
    ],
    'web-pwa': [
      // ICO file with multiple sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256)
      { width: 16, height: 16, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 48, height: 48, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 64, height: 64, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 128, height: 128, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 256, height: 256, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 192, height: 192, filename: 'web/public/icons/icon-192.png', format: 'png' },
      { width: 512, height: 512, filename: 'web/public/icons/icon-512.png', format: 'png' },
      { width: 180, height: 180, filename: 'web/public/icons/apple-touch-icon.png', format: 'png' },
    ],
    
    // watchOS
    'watchos': [
      { width: 48, height: 48, filename: 'watchos/Assets.xcassets/AppIcon.appiconset/icon-48.png', format: 'png' },
      { width: 55, height: 55, filename: 'watchos/Assets.xcassets/AppIcon.appiconset/icon-55.png', format: 'png' },
      { width: 88, height: 88, filename: 'watchos/Assets.xcassets/AppIcon.appiconset/icon-88.png', format: 'png' },
      { width: 1024, height: 1024, filename: 'watchos/Assets.xcassets/AppIcon.appiconset/icon-1024.png', format: 'png' },
    ],
    
    // Wear OS
    'wear-os': [
      { width: 48, height: 48, filename: 'wear-os/app/src/main/res/mipmap-mdpi/ic_launcher.png', format: 'png' },
      { width: 72, height: 72, filename: 'wear-os/app/src/main/res/mipmap-hdpi/ic_launcher.png', format: 'png' },
      { width: 96, height: 96, filename: 'wear-os/app/src/main/res/mipmap-xhdpi/ic_launcher.png', format: 'png' },
      { width: 144, height: 144, filename: 'wear-os/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', format: 'png' },
    ],
    
    // Tauri - All icons in one folder with exact names
    'tauri': [
      { width: 32, height: 32, filename: '32x32.png', format: 'png' },
      { width: 128, height: 128, filename: '128x128.png', format: 'png' },
      { width: 256, height: 256, filename: '128x128@2x.png', format: 'png' },
      { width: 256, height: 256, filename: '256x256.png', format: 'png' },
      { width: 512, height: 512, filename: '512x512.png', format: 'png' },
      { width: 512, height: 512, filename: 'icon.png', format: 'png' },
      { width: 1024, height: 1024, filename: 'icon.icns', format: 'icns' },
      // ICO file with multiple sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256)
      { width: 16, height: 16, filename: 'icon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'icon.ico', format: 'ico' },
      { width: 48, height: 48, filename: 'icon.ico', format: 'ico' },
      { width: 64, height: 64, filename: 'icon.ico', format: 'ico' },
      { width: 128, height: 128, filename: 'icon.ico', format: 'ico' },
      { width: 256, height: 256, filename: 'icon.ico', format: 'ico' },
      { width: 50, height: 50, filename: 'StoreLogo.png', format: 'png' },
      { width: 30, height: 30, filename: 'Square30x30Logo.png', format: 'png' },
      { width: 44, height: 44, filename: 'Square44x44Logo.png', format: 'png' },
      { width: 71, height: 71, filename: 'Square71x71Logo.png', format: 'png' },
      { width: 89, height: 89, filename: 'Square89x89Logo.png', format: 'png' },
      { width: 107, height: 107, filename: 'Square107x107Logo.png', format: 'png' },
      { width: 142, height: 142, filename: 'Square142x142Logo.png', format: 'png' },
      { width: 150, height: 150, filename: 'Square150x150Logo.png', format: 'png' },
      { width: 284, height: 284, filename: 'Square284x284Logo.png', format: 'png' },
      { width: 310, height: 310, filename: 'Square310x310Logo.png', format: 'png' },
    ],
  };
  
  return platformSpecs[platformId] || [];
}
