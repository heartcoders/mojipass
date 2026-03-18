import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { loadConfig, loadCredentials } from '../src/core/config'
import { createAuthRoutes } from './routes/auth'
import { createConfigRoute } from './routes/config'
import { createSessionGuard } from './middleware/sessionGuard'

const PORT = Number(process.env.PORT ?? 4000)
const DIST_DIR = resolve(process.cwd(), 'dist')

function buildLoginHtml(config: ReturnType<typeof loadConfig>): string {
  const htmlPath = resolve(DIST_DIR, 'index.html')

  if (!existsSync(htmlPath)) {
    throw new Error('dist/index.html not found — run npm run build first')
  }

  const html = readFileSync(htmlPath, 'utf-8')
  const publicConfig = {
    codeLength: config.codeLength,
    username: config.username,
    keys: config.keys,
    colors: config.colors,
  }

  const injectedScript = `<script>window.__MOJIPASS_CONFIG__ = ${JSON.stringify(publicConfig)}</script>`
  return html.replace('</head>', `${injectedScript}\n  </head>`)
}

async function proxyRequest(request: Request, targetBase: string): Promise<Response> {
  const url = new URL(request.url)
  const targetUrl = new URL(url.pathname + url.search, targetBase)

  const proxyHeaders = new Headers(request.headers)
  proxyHeaders.set('x-forwarded-host', url.hostname)
  proxyHeaders.set('x-forwarded-proto', url.protocol.replace(':', ''))

  return fetch(targetUrl.toString(), {
    method: request.method,
    headers: proxyHeaders,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  })
}

function startServer() {
  const configPath = process.env.MOJIPASS_CONFIG ?? 'mojipass.config.yml'
  const config = loadConfig(configPath)

  if (!config.session.secret || config.session.secret === 'change-me-to-a-long-random-secret') {
    console.error('\n  Error: session.secret is not set in mojipass.config.yml')
    console.error('  Set a long random string as the session secret before starting.\n')
    process.exit(1)
  }

  const credentialsFile = loadCredentials(config.credentials.path)
  const loginHtml = buildLoginHtml(config)

  const app = new Hono()

  app.use('*', createSessionGuard({ session: config.session, protectedPaths: config.protectedPaths }))

  app.route('/', createAuthRoutes(config, credentialsFile))
  app.route('/', createConfigRoute(config))

  app.get('/login', (context) => {
    return context.html(loginHtml)
  })

  app.use('/assets/*', serveStatic({ root: './dist' }))
  app.use('/favicon*', serveStatic({ root: './dist' }))

  if (config.proxy?.target) {
    const proxyTarget = config.proxy.target
    app.all('*', async (context) => {
      const response = await proxyRequest(context.req.raw, proxyTarget)
      return response
    })
  } else {
    app.get('*', (context) => context.html(loginHtml))
  }

  serve({ fetch: app.fetch, port: PORT }, () => {
    console.log('\n┌─────────────────────────────────────────┐')
    console.log('│              Mojipass Server              │')
    console.log('└─────────────────────────────────────────┘')
    console.log(`\n  Listening on http://localhost:${PORT}`)
    if (config.proxy?.target) {
      console.log(`  Proxying to   ${config.proxy.target}`)
    }
    console.log(`  Username mode ${config.username ? 'enabled' : 'disabled'}`)
    console.log(`  Code length   ${config.codeLength} symbols\n`)
  })
}

startServer()
