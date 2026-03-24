import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['engboost-frontend.onrender.com', 'localhost'],
  },
  build: {
    // Giảm tài nguyên sử dụng khi build
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: 'lightningcss',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
