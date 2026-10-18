import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";



const { version } = JSON.parse(readFileSync(resolve(import.meta.dirname, "../package.json"), "utf8"));

export default defineConfig({
  root: resolve(import.meta.dirname),
  envDir: resolve(import.meta.dirname, ".."),
  // Serves the logo and favicon of the repository.
  publicDir: resolve(import.meta.dirname, "../assets"),
  define: {
    __FIREMITT_VERSION__: JSON.stringify(version),
  },
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
