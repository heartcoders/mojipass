import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { loadConfig, loadCredentials } from '../src/core/config'
import { createAuthRoutes } from './routes/auth'

const DEV_API_PORT = 4001

function startDevServer() {
  const configPath = process.env.MOJIPASS_CONFIG ?? 'mojipass.config.yml'
  const config = loadConfig(configPath)
  const credentialsFile = loadCredentials(config.credentials.path)

  const app = new Hono()

  app.route('/', createAuthRoutes(config, credentialsFile))

  serve({ fetch: app.fetch, port: DEV_API_PORT }, () => {
    console.log(`\n  Mojipass Dev API  →  http://localhost:${DEV_API_PORT}`)
    console.log(`  Auth endpoint     →  POST /api/mojipass/auth`)
    console.log(`  Logout            →  GET  /api/mojipass/logout\n`)
  })
}

startDevServer()
