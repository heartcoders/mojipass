import { Hono } from 'hono'
import type { MojipassConfig, PublicConfig } from '../../src/types/config.types'

/**
 * Creates the public config route.
 * Only exposes fields safe for the client — never session secrets or credentials paths.
 *
 * @param config - The loaded Mojipass config
 * @returns A Hono app with GET /api/mojipass/config
 */
export function createConfigRoute(config: MojipassConfig) {
  const router = new Hono()

  const publicConfig: PublicConfig = {
    codeLength: config.codeLength,
    username: config.username,
    keys: config.keys,
    colors: config.colors,
  }

  router.get('/api/mojipass/config', (context) => {
    return context.json(publicConfig)
  })

  return router
}
