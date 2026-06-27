import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";



export default defineConfig({
  plugins: [dts({ copyDtsFiles: true })],
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/index.ts",
        "src/types/**",
        "src/interfaces/**",
      ],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
  build: {
    target: ["es2020", "node18"],
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
