import { resolve } from "node:path";
import process from "node:process";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";



/**
 * Also emits the UMD bundle under its historical `firemitt.umd.js` name, for script tags and CDNs.
 *
 * @returns The Vite plugin.
 */
function legacyUmd() {
  return {
    name: "firemitt:legacy-umd",
    generateBundle(_, bundle) {
      const umd = bundle["firemitt.umd.cjs"];

      if (umd?.type === "chunk") {
        this.emitFile({ type: "asset", fileName: "firemitt.umd.js", source: umd.code });
      }
    },
  };
}

export default defineConfig({
  plugins: [dts({ include: ["src"], tsconfigPath: "./tsconfig.build.json" }), legacyUmd()],
  test: {
    globals: true,
    environment: "node",
    // Stryker sandboxes link node_modules, where Vitest keeps its module cache: disable it while mutation testing.
    fsModuleCache: !process.env.STRYKER_MUTATOR_WORKER,
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
      fileName: format => format === "umd" ? "firemitt.umd.cjs" : `firemitt.${format}.js`,
    },
    minify: true,
    emptyOutDir: true,
  },
});
