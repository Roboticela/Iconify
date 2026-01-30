/**
 * Detect if the app is running inside a Tauri shell (v1 or v2).
 * Tauri v2 injects __TAURI_INTERNALS__ or __TAURI_METADATA__; v1 uses __TAURI__.
 */
export function isTauri(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as Window & {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
    __TAURI_METADATA__?: unknown;
  };
  return (
    "__TAURI_INTERNALS__" in w ||
    "__TAURI_METADATA__" in w ||
    w.__TAURI__ !== undefined
  );
}
