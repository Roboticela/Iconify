/**
 * Icon Generator Utility
 * Generates icons with proper sizing, background, scale, position, and border roundness
 */

import { Icns, IcnsImage } from '@fiahfy/icns';
import { Buffer } from 'buffer';

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
      
      // Helper function to draw rounded rectangle
      const drawRoundedRect = (x: number, y: number, w: number, h: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };
      
      // Draw background (transparent backgrounds remain transparent in output)
      if (settings.backgroundColor !== 'transparent') {
        ctx.fillStyle = settings.backgroundColor;
        if (settings.borderRoundness > 0) {
          // Draw rounded rectangle background
          const radius = Math.min(settings.borderRoundness, Math.min(width, height) / 2);
          drawRoundedRect(0, 0, width, height, radius);
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
      
      // Apply border roundness to image if needed
      if (settings.borderRoundness > 0) {
        const radius = Math.min(settings.borderRoundness, Math.min(width, height) / 2);
        ctx.save();
        drawRoundedRect(x, y, drawWidth, drawHeight, radius);
        ctx.clip();
      }
      
      // Draw the entire image without cropping (contain behavior)
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      if (settings.borderRoundness > 0) {
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
 * Map icon sizes to ICNS osType codes
 * osType codes specify the icon type in ICNS format
 * Based on Apple ICNS specification
 */
function getOSTypeForSize(size: number, scale: number): string {
  const pixelSize = size * scale;
  
  // Map sizes to osType codes according to ICNS specification
  // ic07: 128x128, ic08: 256x256, ic09: 512x512, ic10: 1024x1024
  // ic11: 32x32 (16@2x), ic12: 64x64 (32@2x), ic13: 256x256 (128@2x), ic14: 512x512 (256@2x)
  
  if (pixelSize === 16) return 'icp4';  // 16x16
  if (pixelSize === 32) {
    return scale === 2 ? 'ic11' : 'icp5'; // 32x32 (16@2x or 32@1x)
  }
  if (pixelSize === 64) {
    return scale === 2 ? 'ic12' : 'icp6'; // 64x64 (32@2x or 64@1x)
  }
  if (pixelSize === 128) return 'ic07';  // 128x128
  if (pixelSize === 256) {
    return scale === 2 ? 'ic13' : 'ic08'; // 256x256 (128@2x or 256@1x)
  }
  if (pixelSize === 512) {
    return scale === 2 ? 'ic14' : 'ic09'; // 512x512 (256@2x or 512@1x)
  }
  if (pixelSize === 1024) return 'ic10'; // 1024x1024 (512@2x)
  
  // Default to largest
  return 'ic10';
}

/**
 * Generate an ICNS file with multiple icon sizes
 * ICNS files contain multiple resolutions in a single file
 */
export async function generateICNS(
  sourceImage: string,
  settings: IconGenerationSettings
): Promise<Blob> {
  // Standard ICNS sizes (in points, @1x and @2x)
  const icnsSizes = [
    { size: 16, scale: 1 },   // 16x16
    { size: 16, scale: 2 },   // 32x32
    { size: 32, scale: 1 },   // 32x32
    { size: 32, scale: 2 },   // 64x64
    { size: 128, scale: 1 },  // 128x128
    { size: 128, scale: 2 },  // 256x256
    { size: 256, scale: 1 }, // 256x256
    { size: 256, scale: 2 }, // 512x512
    { size: 512, scale: 1 }, // 512x512
    { size: 512, scale: 2 }, // 1024x1024
  ];

  // Helper to convert Uint8Array/ArrayBuffer to Buffer
  const toBuffer = (data: Uint8Array | ArrayBuffer): Buffer => {
    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data);
    }
    return Buffer.from(data);
  };

  // Generate all PNG icons for ICNS
  const iconPromises = icnsSizes.map(async ({ size, scale }) => {
    const pixelSize = size * scale;
    const pngBlob = await generateIcon(sourceImage, pixelSize, pixelSize, settings);
    const arrayBuffer = await pngBlob.arrayBuffer();
    const pngData = new Uint8Array(arrayBuffer);
    const osType = getOSTypeForSize(size, scale);
    return { size, scale, pngData, osType };
  });

  const icons = await Promise.all(iconPromises);

  // Create ICNS file
  const icns = new Icns();
  
  for (const { size, scale, pngData, osType } of icons) {
    try {
      // Convert Uint8Array to Buffer for the library
      const buffer = toBuffer(pngData);
      const icnsImage = IcnsImage.fromPNG(buffer, osType as any);
      icns.append(icnsImage);
    } catch (error) {
      console.warn(`Failed to add ${size}@${scale}x to ICNS:`, error);
      // Continue with other sizes
    }
  }

  // Generate ICNS blob
  const icnsBuffer = icns.data;
  // Convert Buffer to Uint8Array for Blob
  const bufferArray = Buffer.isBuffer(icnsBuffer)
    ? new Uint8Array(icnsBuffer)
    : new Uint8Array(icnsBuffer as any);
  return new Blob([bufferArray], { type: 'image/x-icon' });
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
      { width: 16, height: 16, filename: 'angular/src/assets/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'angular/src/assets/icons/favicon.ico', format: 'ico' },
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
      { width: 256, height: 256, filename: 'electron/build/icons/ico/icon.ico', format: 'ico' },
    ],
    
    // Flutter Desktop
    'flutter-desktop': [
      { width: 32, height: 32, filename: 'flutter-desktop/linux/icons/32x32.png', format: 'png' },
      { width: 64, height: 64, filename: 'flutter-desktop/linux/icons/64x64.png', format: 'png' },
      { width: 128, height: 128, filename: 'flutter-desktop/linux/icons/128x128.png', format: 'png' },
      { width: 256, height: 256, filename: 'flutter-desktop/linux/icons/256x256.png', format: 'png' },
      { width: 1024, height: 1024, filename: 'flutter-desktop/macos/Runner/Assets.xcassets/AppIcon.appiconset/icon_1024.png', format: 'png' },
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
      { width: 16, height: 16, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 192, height: 192, filename: 'web/public/icons/icon-192.png', format: 'png' },
      { width: 512, height: 512, filename: 'web/public/icons/icon-512.png', format: 'png' },
      { width: 180, height: 180, filename: 'web/public/icons/apple-touch-icon.png', format: 'png' },
    ],
    'react': [
      { width: 16, height: 16, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 192, height: 192, filename: 'web/public/icons/icon-192.png', format: 'png' },
      { width: 512, height: 512, filename: 'web/public/icons/icon-512.png', format: 'png' },
      { width: 180, height: 180, filename: 'web/public/icons/apple-touch-icon.png', format: 'png' },
    ],
    'vue': [
      { width: 16, height: 16, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 192, height: 192, filename: 'web/public/icons/icon-192.png', format: 'png' },
      { width: 512, height: 512, filename: 'web/public/icons/icon-512.png', format: 'png' },
      { width: 180, height: 180, filename: 'web/public/icons/apple-touch-icon.png', format: 'png' },
    ],
    'web-pwa': [
      { width: 16, height: 16, filename: 'web/public/icons/favicon.ico', format: 'ico' },
      { width: 32, height: 32, filename: 'web/public/icons/favicon.ico', format: 'ico' },
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
