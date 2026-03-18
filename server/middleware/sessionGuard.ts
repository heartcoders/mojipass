import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import type { MojipassConfig } from '../../src/types/config.types'
import { isSessionValid } from '../../src/core/session'

const MOJIPASS_PREFIXES = ['/api/mojipass/', '/assets/', '/favicon']
const LOGIN_PATH = '/login'

function isMojipassRoute(pathname: string): boolean {
  if (pathname === LOGIN_PATH) return true
  return MOJIPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function requiresAuth(pathname: string, protectedPaths: string[] | undefined): boolean {
  if (isMojipassRoute(pathname)) return false
  if (!protectedPaths || protectedPaths.length === 0) return true
  return protectedPaths.some(
    (protectedPath) => pathname === protectedPath || pathname.startsWith(protectedPath + '/'),
  )
}

/**
 * Middleware that checks for a valid Mojipass session cookie.
 *
 * In full gateway mode (no protectedPaths configured), all routes require auth.
 * In partial mode (protectedPaths set), only matching path prefixes require auth —
 * all other routes are publicly accessible.
 *
 * Redirects to /login with the original path as a redirect param when auth is required
 * but missing or invalid.
 */
export function createSessionGuard(config: Pick<MojipassConfig, 'session' | 'protectedPaths'>) {
  return async (context: Context, next: Next) => {
    const pathname = new URL(context.req.url).pathname

    if (!requiresAuth(pathname, config.protectedPaths)) {
      return next()
    }

    const token = getCookie(context, config.session.cookieName)

    if (isSessionValid(token, config.session.secret)) {
      return next()
    }

    const redirectParam = encodeURIComponent(pathname)
    return context.redirect(`${LOGIN_PATH}?redirect=${redirectParam}`)
  }
}
