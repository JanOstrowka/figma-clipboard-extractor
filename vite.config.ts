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
    // Enable code splitting for better caching and smaller initial bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Split framer-motion into its own chunk (heavy library, not needed for FCP)
          'framer-motion': ['framer-motion'],
          // Split Radix UI components
          'radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
            '@radix-ui/react-slot'
          ],
          // Split analytics (not needed for FCP)
          'analytics': ['@vercel/analytics', '@vercel/speed-insights'],
        },
      },
    },
    // Ensure CSS is inlined in the initial chunk for faster FCP
    cssCodeSplit: true,
    // Generate source maps for debugging
    sourcemap: false,
    // Minify for production
    minify: 'esbuild',
  },
})
