import { createRequire } from 'node:module'
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineNuxtModule, addPluginTemplate, addTemplate, addServerHandler, installModule, extendViteConfig, useNuxt } from '@nuxt/kit'

const resolveFromMojipass = createRequire(import.meta.url)
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function tryRealpath(path: string): string {
  try { return realpathSync(path) } catch { return path }
}

/**
 * Nuxt module for Mojipass. Registers automatically:
 *
 * - @vueuse/motion/nuxt so v-motion works in MojipassLogin
 * - A server-only plugin that patches globalThis.$fetch with useRequestFetch()
 *   so SSR requests forward the browser session cookie automatically
 * - Server routes: GET /api/mojipass/config, POST /api/mojipass/auth, GET /api/mojipass/logout
 */
export default defineNuxtModule({
  meta: {
    name: 'mojipass',
    configKey: 'mojipass',
  },
  async setup() {
    const nuxt = useNuxt()

    nuxt.options.css.push(tryRealpath(resolve(distDir, 'style.css')))

    extendViteConfig((config) => {
      config.server ??= {}
      config.server.fs ??= {}
      config.server.fs.allow ??= []
      config.server.fs.allow.push(tryRealpath(packageRoot))
    })

    await installModule(resolveFromMojipass.resolve('@vueuse/motion/nuxt'))

    addPluginTemplate({
      filename: 'mojipass.server.mjs',
      mode: 'server',
      getContents: () => [
        "import { defineNuxtPlugin, useRequestFetch } from '#imports'",
        '',
        'export default defineNuxtPlugin({',
        "  name: 'mojipass:ssr-fetch',",
        '  enforce: "pre",',
        '  setup() {',
        '    const requestFetch = useRequestFetch()',
        '    globalThis.$fetch = requestFetch',
        '  },',
        '})',
      ].join('\n'),
    })

    const configHandler = addTemplate({
      write: true,
      filename: 'mojipass/config.get.mjs',
      getContents: () => [
        "import { defineEventHandler } from 'h3'",
        "import { loadConfig } from 'mojipass/core'",
        '',
        'export default defineEventHandler(() => {',
        '  const config = loadConfig()',
        '  return {',
        '    codeLength: config.codeLength,',
        '    username: config.username,',
        '    keys: config.keys,',
        '    colors: config.colors,',
        '  }',
        '})',
      ].join('\n'),
    })

    const authHandler = addTemplate({
      write: true,
      filename: 'mojipass/auth.post.mjs',
      getContents: () => [
        "import { defineEventHandler, readBody, createError, setCookie } from 'h3'",
        "import { loadConfig, loadCredentials, validateCredentials, signSession } from 'mojipass/core'",
        '',
        'export default defineEventHandler(async (event) => {',
        '  const body = await readBody(event)',
        '  const config = loadConfig()',
        '  const credentialsFile = loadCredentials(config.credentials.path)',
        '',
        '  const isValid = await validateCredentials(',
        '    body.code,',
        '    body.username,',
        '    credentialsFile.credentials,',
        '    config,',
        '  )',
        '',
        "  if (!isValid) throw createError({ statusCode: 401, message: 'Invalid credentials' })",
        '',
        "  const token = signSession(body.username ?? 'authenticated', config.session.secret)",
        '',
        '  setCookie(event, config.session.cookieName, token, {',
        '    httpOnly: true,',
        "    secure: process.env.NODE_ENV === 'production',",
        "    sameSite: 'lax',",
        '    maxAge: config.session.expiresInSeconds,',
        '  })',
        '',
        '  return { ok: true }',
        '})',
      ].join('\n'),
    })

    const logoutHandler = addTemplate({
      write: true,
      filename: 'mojipass/logout.get.mjs',
      getContents: () => [
        "import { defineEventHandler, deleteCookie, sendRedirect } from 'h3'",
        "import { loadConfig } from 'mojipass/core'",
        '',
        'export default defineEventHandler((event) => {',
        '  const config = loadConfig()',
        '  deleteCookie(event, config.session.cookieName)',
        '  const runtimeConfig = useRuntimeConfig(event)',
        "  const baseUrl = runtimeConfig.app?.baseURL?.replace(/\\/$/, '') ?? ''",
        '  return sendRedirect(event, `${baseUrl}/login`, 302)',
        '})',
      ].join('\n'),
    })

    const authGuardMiddleware = addTemplate({
      write: true,
      filename: 'mojipass/auth-guard.mjs',
      getContents: () => [
        "import { defineEventHandler, getCookie, sendRedirect } from 'h3'",
        "import { loadConfig, isSessionValid } from 'mojipass/core'",
        '',
        'export default defineEventHandler((event) => {',
        '  const runtimeConfig = useRuntimeConfig(event)',
        "  const baseUrl = runtimeConfig.app?.baseURL?.replace(/\\/$/, '') ?? ''",
        '  const loginPath = `${baseUrl}/login`',
        '  const requestPath = event.path',
        '',
        '  if (requestPath === loginPath || requestPath.startsWith(`${baseUrl}/api/mojipass`)) {',
        '    return',
        '  }',
        '',
        '  const config = loadConfig()',
        '',
        '  if (config.protectedPaths) {',
        '    const isPathProtected = config.protectedPaths.some((protectedPath) =>',
        '      requestPath.startsWith(`${baseUrl}${protectedPath}`)',
        '    )',
        '    if (!isPathProtected) return',
        '  }',
        '',
        '  const sessionToken = getCookie(event, config.session.cookieName)',
        '  if (isSessionValid(sessionToken, config.session.secret)) return',
        '',
        '  return sendRedirect(event, loginPath, 302)',
        '})',
      ].join('\n'),
    })

    addServerHandler({ route: '/api/mojipass/config', handler: configHandler.dst })
    addServerHandler({ route: '/api/mojipass/auth', handler: authHandler.dst })
    addServerHandler({ route: '/api/mojipass/logout', handler: logoutHandler.dst })
    addServerHandler({ middleware: true, handler: authGuardMiddleware.dst })
  },
})
