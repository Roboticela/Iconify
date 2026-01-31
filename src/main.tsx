import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./App.css"

import { ThemeProvider } from './contexts/ThemeContext'
import { PlatformProvider } from './contexts/PlatformContext'
import { ImageSettingsProvider } from './contexts/ImageSettingsContext'
import { ThemeScript } from './components/ThemeScript'
import { isTauri } from './lib/tauri'

// In Tauri: disable context menu and devtools shortcuts
if (isTauri()) {
  document.addEventListener('contextmenu', (e) => e.preventDefault())
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
      (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))
    ) {
      e.preventDefault()
    }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeScript />
    <ThemeProvider>
      <PlatformProvider>
        <ImageSettingsProvider>
          <App />
        </ImageSettingsProvider>
      </PlatformProvider>
    </ThemeProvider>
  </StrictMode>,
)
