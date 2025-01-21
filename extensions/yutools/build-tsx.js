/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const esbuild = require('esbuild')

// Build JS
esbuild.build({
  entryPoints: [
    'src/ui/index.tsx'
  ],
  bundle: true,
  minify: true,
  sourcemap: true,

  loader: {
    '.ttf': 'file',  // Tell Esbuild to treat `.ttf` files as files
    '.css': 'css',   // Ensure `.css` files are handled correctly
  },

  outfile: 'dist/ui/index.js',
  format: 'iife', // apparently iife is safe for browsers (safer than cjs)
  platform: 'browser',
  // platform: ['browser', 'node'],
  external: ['vscode'],
}).catch(() => process.exit(1));


// esbuild.build({
//   entryPoints: [
//     'src/llmutils/index.tsx'
//   ],
//   outfile: 'dist/llmutils/index.js',

//   loader: {
//     '.ttf': 'file',  // Tell Esbuild to treat `.ttf` files as files
//     '.css': 'css',   // Ensure `.css` files are handled correctly
//   },

//   bundle: true,
//   minify: true,
//   sourcemap: true,
//   format: 'iife',
//   platform: 'browser',
//   // platform: ['browser', 'node'],
//   // platform: 'node',
//   external: ['vscode'],
// }).catch(() => process.exit(1));

// esbuild.build({
//   entryPoints: [
//     'src/work/workview1.tsx'
//   ],
//   outfile: 'dist/work/workview1.js',
//   bundle: true,
//   minify: true,
//   sourcemap: true,
//   format: 'iife',
//   platform: 'browser',
//   external: ['vscode'],
// }).catch(() => process.exit(1));


// esbuild.build({
//   entryPoints: [
//     'src/work/workview2.tsx'
//   ],
//   outfile: 'dist/work/workview2.js',
//   bundle: true,
//   minify: true,
//   sourcemap: true,
//   format: 'iife',
//   platform: 'browser',
//   external: ['vscode'],
// }).catch(() => process.exit(1));
