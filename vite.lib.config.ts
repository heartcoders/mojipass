import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { chmodSync, readFileSync, writeFileSync } from 'node:fs'
import dts from 'vite-plugin-dts'
import type { Plugin } from 'vite'

function prepareBin(filePath: string): Plugin {
  return {
    name: 'prepare-bin',
    writeBundle() {
      const content = readFileSync(filePath, 'utf-8')
      if (!content.startsWith('#!')) {
        writeFileSync(filePath, `#!/usr/bin/env node\n${content}`, 'utf-8')
      }
      chmodSync(filePath, 0o755)
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: [
        'src/index.ts',
        'src/core/index.ts',
        'src/nuxt/module.ts',
        'src/components/**/*.vue',
        'src/composables/**/*.ts',
        'src/types/**/*.ts',
        'src/core/**/*.ts',
      ],
      outDir: 'dist/types',
      tsconfigPath: './tsconfig.app.json',
    }),
    prepareBin(resolve(__dirname, 'dist/create.js')),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        core: resolve(__dirname, 'src/core/index.ts'),
        'nuxt/module': resolve(__dirname, 'src/nuxt/module.ts'),
        create: resolve(__dirname, 'scripts/create.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        '@vueuse/motion',
        '@nuxt/kit',
        'bcryptjs',
        'cookie-signature',
        'js-yaml',
        /^node:/,
      ],
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
