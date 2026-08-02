import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    tailwindcss(),
  ],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 1000000000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});