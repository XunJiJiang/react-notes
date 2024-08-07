import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// import fs from 'fs';

// function imgPath() {
//   return {
//     name: 'img-path',
//     transform(src: string, id: string) {
//       if (
//         id.endsWith('.png') ||
//         id.endsWith('.jpg') ||
//         id.endsWith('.jpeg') ||
//         id.endsWith('.gif')
//       ) {
//         return;
//       }
//       return;
//     }
//   };
// }

// function markdownRaw() {
//   return {
//     name: 'markdown-raw',
//     transform(src: string, id: string) {
//       if (id.endsWith('.md')) {
//         return src;
//       }
//       return;
//     },
//   };
// }

const alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@pages': path.resolve(__dirname, 'src/pages'),
  '@img': path.resolve(__dirname, 'src/assets/images'),
  '@type': path.resolve(__dirname, 'src/types'),
  '@router': path.resolve(__dirname, 'src/router')
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias
  },
  server: {
    port: 3000
  },
  build: {
    assetsInlineLimit: 0
  },
  // Github Pages
  base: '/reactnotes/'
});

export const viteConfig = {
  resolve: {
    alias
  }
};
