import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";



export default defineConfig({
  plugins: [dts({ copyDtsFiles: true })],
  build: {
    lib: {
      name: "Firemitt",
      entry: resolve(import.meta.dirname, "src/index.ts"),
      fileName: format => `firemitt.${format}.js`,
    },
    sourcemap: true,
    minify: true,
    emptyOutDir: true,
  },
});
