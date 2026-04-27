import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          forms: ['@hookform/resolvers', 'react-hook-form', 'zod'],
          icons: ['lucide-react'],
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    sourcemap: false,
    target: 'es2022',
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  test: {
    css: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
