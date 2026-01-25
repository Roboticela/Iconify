/**
 * Download Handler
 * Handles downloading icons as a zip file with proper organization
 */

import JSZip from 'jszip';
import { generateIcon, generateICNS, getPlatformIconSpecs, type IconGenerationSettings } from './iconGenerator';

export interface DownloadOptions {
  sourceImage: string;
  platformId: string;
  settings: IconGenerationSettings;
  onProgress?: (progress: number) => void;
}

/**
 * Download all icons for a platform as a zip file
 */
export async function downloadIconsAsZip(options: DownloadOptions): Promise<void> {
  const { sourceImage, platformId, settings, onProgress } = options;
  
  const iconSpecs = getPlatformIconSpecs(platformId);
  
  if (iconSpecs.length === 0) {
    throw new Error(`No icon specifications found for platform: ${platformId}`);
  }
  
  const zip = new JSZip();
  let completed = 0;
  
  // Generate all icons
  const iconPromises = iconSpecs.map(async (spec) => {
    try {
      let blob: Blob;
      
      // Use ICNS generator for ICNS format, regular generator for others
      if (spec.format === 'icns') {
        blob = await generateICNS(sourceImage, settings);
      } else {
        blob = await generateIcon(sourceImage, spec.width, spec.height, settings);
      }
      
      // Use the filename as-is (which includes the full folder path)
      // For Tauri, filenames are just the icon names, so we add the folder structure
      const zipPath = platformId === 'tauri' 
        ? `src-tauri/icons/${spec.filename}`
        : spec.filename;
      
      zip.file(zipPath, blob);
      
      completed++;
      if (onProgress) {
        onProgress((completed / iconSpecs.length) * 100);
      }
    } catch (error) {
      console.error(`Failed to generate icon ${spec.filename}:`, error);
      throw error;
    }
  });
  
  await Promise.all(iconPromises);
  
  // Generate zip file
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  
  // Download the zip file
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `icons-${platformId}-${Date.now()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  if (onProgress) {
    onProgress(100);
  }
}
