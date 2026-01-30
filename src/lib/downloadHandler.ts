/**
 * Download Handler
 * Handles downloading icons as a zip file with proper organization
 */

import JSZip from 'jszip';
import { generateIcon, generateICNS, generateICO, getPlatformIconSpecs, type IconGenerationSettings } from './iconGenerator';

export interface DownloadOptions {
  sourceImage: string;
  platformId: string;
  settings: IconGenerationSettings;
  onProgress?: (progress: number) => void;
  /** When true, returns the zip Blob instead of triggering a browser download (e.g. for Tauri save dialog) */
  returnBlob?: boolean;
}

/**
 * Download all icons for a platform as a zip file.
 * When returnBlob is true, returns the zip Blob instead of triggering download.
 */
export async function downloadIconsAsZip(options: DownloadOptions): Promise<Blob | void> {
  const { sourceImage, platformId, settings, onProgress } = options;
  
  const iconSpecs = getPlatformIconSpecs(platformId);
  
  if (iconSpecs.length === 0) {
    throw new Error(`No icon specifications found for platform: ${platformId}`);
  }
  
  const zip = new JSZip();
  let completed = 0;
  
  // Group ICO files by filename (since ICO files can contain multiple sizes)
  const icoGroups = new Map<string, Array<{ width: number; height: number; spec: typeof iconSpecs[0] }>>();
  const nonIcoSpecs: typeof iconSpecs = [];
  
  // Separate ICO and non-ICO specs
  iconSpecs.forEach(spec => {
    if (spec.format === 'ico') {
      if (!icoGroups.has(spec.filename)) {
        icoGroups.set(spec.filename, []);
      }
      icoGroups.get(spec.filename)!.push({ width: spec.width, height: spec.height, spec });
    } else {
      nonIcoSpecs.push(spec);
    }
  });
  
  // Generate all icons
  const iconPromises: Promise<void>[] = [];
  
  // Generate ICO files (grouped by filename)
  icoGroups.forEach((sizes, filename) => {
    const promise = (async () => {
      try {
        const blob = await generateICO(
          sourceImage,
          sizes.map(s => ({ width: s.width, height: s.height })),
          settings
        );
        
        // Use the filename as-is (which includes the full folder path)
        // For Tauri, filenames are just the icon names, so we add the folder structure
        const zipPath = platformId === 'tauri' 
          ? `src-tauri/icons/${filename}`
          : filename;
        
        zip.file(zipPath, blob);
        
        completed++;
        if (onProgress) {
          onProgress((completed / (icoGroups.size + nonIcoSpecs.length)) * 100);
        }
      } catch (error) {
        console.error(`Failed to generate ICO file ${filename}:`, error);
        throw error;
      }
    })();
    iconPromises.push(promise);
  });
  
  // Generate non-ICO icons (PNG, ICNS)
  nonIcoSpecs.forEach(spec => {
    const promise = (async () => {
      try {
        let blob: Blob;
        
        // Use ICNS generator for ICNS format, regular generator for PNG
        if (spec.format === 'icns') {
          try {
            blob = await generateICNS(sourceImage, settings);
          } catch (icnsError) {
            console.warn(`ICNS endpoint unavailable, skipping ${spec.filename}:`, icnsError);
            completed++;
            if (onProgress) {
              onProgress((completed / (icoGroups.size + nonIcoSpecs.length)) * 100);
            }
            return;
          }
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
          onProgress((completed / (icoGroups.size + nonIcoSpecs.length)) * 100);
        }
      } catch (error) {
        console.error(`Failed to generate icon ${spec.filename}:`, error);
        throw error;
      }
    })();
    iconPromises.push(promise);
  });
  
  await Promise.all(iconPromises);
  
  // Generate zip file
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  
  if (onProgress) {
    onProgress(100);
  }
  
  if (options.returnBlob) {
    return zipBlob;
  }
  
  // Download the zip file
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `icons-${platformId}-${Date.now()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
