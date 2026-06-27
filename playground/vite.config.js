import { resolve } from "node:path";
import { defineConfig } from "vite";



export default defineConfig({
  root: resolve(import.meta.dirname),
  envDir: resolve(import.meta.dirname, ".."),
  resolve: {
    alias: {
      "@eoussama/firemitt": resolve(import.meta.dirname, "../src/index.ts"),
    },
  },
  server: {
    port: 5174,
    open: true,
  },
});
