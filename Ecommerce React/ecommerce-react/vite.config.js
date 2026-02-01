import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import path from 'path' // No longer needed
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React libraries for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation library in separate chunk
          'animation-vendor': ['framer-motion'],
          // UI utilities in separate chunk
          'ui-vendor': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    minify: 'esbuild'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
})
