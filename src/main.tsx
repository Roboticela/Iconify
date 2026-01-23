import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./App.css"

import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeScript } from './components/ThemeScript'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeScript />
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
