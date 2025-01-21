import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    // nodePolyfills({
    //   // Specify polyfills if needed
    //   include: ['path'],
    // }),
    react()
  ],
  optimizeDeps: {
    exclude: ['chromium-bidi']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
