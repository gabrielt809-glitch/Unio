import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          forms: ['@hookform/resolvers', 'react-hook-form', 'zod'],
          icons: ['lucide-react'],
          query: ['@tanstack/react-query'],
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
    exclude: [...configDefaults.exclude, 'tests/visual/**'],
    setupFiles: ['./src/test/setup.ts'],
  },
});
