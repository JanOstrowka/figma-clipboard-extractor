import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy dependencies into separate chunks
          'framer-motion': ['framer-motion'],
          'radix': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-slot'],
          'vendor': ['react', 'react-dom'],
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Enable minification
    minify: 'esbuild',
  },
})
