import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import type { MojipassConfig, CredentialsFile } from '../../src/types/config.types'
import { validateCredentials } from '../../src/core/auth'
import { signSession } from '../../src/core/session'

interface AuthRequestBody {
  code: string
  username?: string
}

/**
 * Creates the Mojipass auth routes.
 *
 * @param config - The loaded Mojipass config
 * @param credentialsFile - The loaded hashed credentials
 * @returns A Hono app with /api/mojipass/auth and /api/mojipass/logout
 */
export function createAuthRoutes(config: MojipassConfig, credentialsFile: CredentialsFile) {
  const router = new Hono()

  router.post('/api/mojipass/auth', async (context) => {
    const body = await context.req.json<AuthRequestBody>()

    if (!body.code) {
      return context.json({ error: 'Code is required' }, 400)
    }

    const isValid = await validateCredentials(
      body.code,
      body.username,
      credentialsFile.credentials,
      config,
    )

    if (!isValid) {
      return context.json({ error: 'Invalid credentials' }, 401)
    }

    const sessionPayload = body.username ?? 'authenticated'
    const token = signSession(sessionPayload, config.session.secret)

    setCookie(context, config.session.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: config.session.expiresInSeconds,
      path: '/',
    })

    return context.json({ ok: true })
  })

  router.get('/api/mojipass/logout', (context) => {
    deleteCookie(context, config.session.cookieName, { path: '/' })
    return context.redirect('/login')
  })

  return router
}
