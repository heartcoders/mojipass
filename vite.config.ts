import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import yaml from 'js-yaml'
import type { Plugin } from 'vite'
import type { MojipassConfig } from './src/types/config.types'

function mojipassConfigPlugin(): Plugin {
  return {
    name: 'mojipass-config-inject',
    transformIndexHtml(html) {
      const configPath = resolve(process.cwd(), 'mojipass.config.yml')
      if (!existsSync(configPath)) return html

      const raw = readFileSync(configPath, 'utf-8')
      const parsed = yaml.load(raw) as Partial<MojipassConfig>

      const publicConfig = {
        codeLength: parsed.codeLength ?? 4,
        username: parsed.username ?? false,
        keys: parsed.keys ?? [],
        colors: parsed.colors,
      }

      const injectedScript = `<script>window.__MOJIPASS_CONFIG__ = ${JSON.stringify(publicConfig)}</script>`
      return html.replace('</head>', `  ${injectedScript}\n  </head>`)
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    mojipassConfigPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/mojipass': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
    },
  },
})
