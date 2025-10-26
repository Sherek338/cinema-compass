import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client', 'src'),
    },
  },
  root: path.resolve(__dirname, 'client'),
  publicDir: path.resolve(__dirname, 'clietn', 'public'),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
