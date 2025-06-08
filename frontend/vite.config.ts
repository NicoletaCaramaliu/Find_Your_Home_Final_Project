import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
});
