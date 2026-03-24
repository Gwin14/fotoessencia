import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "motion-vendor": ["framer-motion", "motion"],
          "gsap-vendor": ["gsap", "@gsap/react"],
          "ogl-vendor": ["ogl"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "motion",
      "gsap",
      "@gsap/react",
      "ogl",
    ],
  },
  server: {
    proxy: {
      "/api/rss": {
        target: "https://fotoessencia.substack.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rss/, "/feed"),
      },
    },
    hmr: {
      overlay: false,
    },
  },
});
