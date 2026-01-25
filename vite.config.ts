import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    nodePolyfills({
      // Enable polyfills for Node.js modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Polyfill specific Node.js modules
      include: ['util', 'stream', 'events', 'buffer', 'process'],
    }),
  ],
  define: {
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      util: 'util',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and React DOM into separate chunk
          'react-vendor': ['react', 'react-dom'],
          // Split animation library
          'framer-motion': ['framer-motion'],
          // Split icon generation libraries
          'icon-libs': ['@fiahfy/icns', 'jszip'],
          // Split UI libraries
          'ui-libs': ['lucide-react', 'react-colorful'],
        },
      },
    },
    // Increase chunk size warning limit if you want to suppress the warning
    // chunkSizeWarningLimit: 1000,
  },
})
