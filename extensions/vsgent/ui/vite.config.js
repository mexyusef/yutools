// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist', // Output directory (default)
//     rollupOptions: {
//       input: 'index.html', // Ensure Vite knows your input file
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Matches "@/*": ["./src/*"]
      '@shared': path.resolve(__dirname, '../src/shared'), // Matches "@shared/*": ["../src/shared/*"]
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory
    rollupOptions: {
      input: 'index.html', // Ensure Vite knows your input file
      output: {
        entryFileNames: 'index.js', // Remove hash for JavaScript files
        chunkFileNames: 'index.js', // Remove hash for code-split chunks
        assetFileNames: 'index.[ext]', // Remove hash for CSS and other assets
      },
    },
  },
});
