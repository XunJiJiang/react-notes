import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// import fs from 'fs';

function imgPath() {
  return {
    name: 'img-path',
    transform(src: string, id: string) {
      if (id.endsWith('.png') || id.endsWith('.jpg') || id.endsWith('.jpeg') || id.endsWith('.gif')) {
        return;
      }
      return;
    },
  };
}

function markdownRaw() {
  return {
    name: 'markdown-raw',
    transform(src: string, id: string) {
      if (id.endsWith('.md')) {
        return src;
      }
      return;
    },
  };
}

const alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@pages': path.resolve(__dirname, 'src/pages'),
  '@img': path.resolve(__dirname, 'src/assets/images'),
  '@type': path.resolve(__dirname, 'src/types'),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), imgPath()],
  resolve: {
    alias,
  },
  server: {
    port: 3000,
  },
});

export const viteConfig = {
  resolve: {
    alias,
  },
};
