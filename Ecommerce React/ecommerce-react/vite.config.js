import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path' // Import path module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Add alias for '@'
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
})
