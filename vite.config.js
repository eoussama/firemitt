import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [dts({ copyDtsFiles: true })],
  build: {
    lib: {
      name: 'Firemitt',
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      fileName: format => `firemitt.${format}.js`
    },
    minify: true,
    emptyOutDir: true,
  }
})
