import { defineConfig } from 'vite';
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
});
