import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// import fs from 'node:fs';

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
  '@router': path.resolve(__dirname, 'src/router'),
  '@layout': path.resolve(__dirname, 'src/layout'),
  '@setting': path.resolve(__dirname, 'src/setting.ts')
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias
  },
  server: {
    host: true,
    port: 3000
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        404: path.resolve(__dirname, '404.html')
      }
    }
  },
  // Github Pages
  base: '/reactnotes/'
});

export const viteConfig = {
  resolve: {
    alias
  }
};
