import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This relative base path ensures assets link correctly 
  // on GitHub Pages (e.g. /repo-name/assets/...)
  base: './', 
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
});