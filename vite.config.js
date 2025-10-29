import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Otimizações de build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa bibliotecas grandes em chunks diferentes
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
          'gsap-vendor': ['gsap'],
          'ogl-vendor': ['ogl'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap', 'ogl'],
  },
  server: {
    // Configurações para desenvolvimento
    hmr: {
      overlay: false,
    },
  },
})