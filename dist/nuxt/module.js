import { createRequire as p } from "node:module";
import { realpathSync as g } from "node:fs";
import { fileURLToPath as d } from "node:url";
import { resolve as s, dirname as l } from "node:path";
import { defineNuxtModule as h, useNuxt as v, extendViteConfig as C, installModule as j, addPluginTemplate as k, addTemplate as t, addServerHandler as o } from "@nuxt/kit";
const P = p(import.meta.url), x = s(l(d(import.meta.url)), "../.."), y = s(l(d(import.meta.url)), "..");
function a(n) {
  try {
    return g(n);
  } catch {
    return n;
  }
}
const q = h({
  meta: {
    name: "mojipass",
    configKey: "mojipass"
  },
  async setup() {
    v().options.css.push(a(s(y, "style.css"))), C((e) => {
      var i, r;
      e.server ?? (e.server = {}), (i = e.server).fs ?? (i.fs = {}), (r = e.server.fs).allow ?? (r.allow = []), e.server.fs.allow.push(a(x));
    }), await j(P.resolve("@vueuse/motion/nuxt")), k({
      filename: "mojipass.server.mjs",
      mode: "server",
      getContents: () => [
        "import { defineNuxtPlugin, useRequestFetch } from '#imports'",
        "",
        "export default defineNuxtPlugin({",
        "  name: 'mojipass:ssr-fetch',",
        '  enforce: "pre",',
        "  setup() {",
        "    const requestFetch = useRequestFetch()",
        "    globalThis.$fetch = requestFetch",
        "  },",
        "})"
      ].join(`
`)
    });
    const c = t({
      write: !0,
      filename: "mojipass/config.get.mjs",
      getContents: () => [
        "import { defineEventHandler } from 'h3'",
        "import { loadConfig } from 'mojipass/core'",
        "",
        "export default defineEventHandler(() => {",
        "  const config = loadConfig()",
        "  return {",
        "    codeLength: config.codeLength,",
        "    username: config.username,",
        "    keys: config.keys,",
        "    colors: config.colors,",
        "  }",
        "})"
      ].join(`
`)
    }), m = t({
      write: !0,
      filename: "mojipass/auth.post.mjs",
      getContents: () => [
        "import { defineEventHandler, readBody, createError, setCookie } from 'h3'",
        "import { loadConfig, loadCredentials, validateCredentials, signSession } from 'mojipass/core'",
        "",
        "export default defineEventHandler(async (event) => {",
        "  const body = await readBody(event)",
        "  const config = loadConfig()",
        "  const credentialsFile = loadCredentials(config.credentials.path)",
        "",
        "  const isValid = await validateCredentials(",
        "    body.code,",
        "    body.username,",
        "    credentialsFile.credentials,",
        "    config,",
        "  )",
        "",
        "  if (!isValid) throw createError({ statusCode: 401, message: 'Invalid credentials' })",
        "",
        "  const token = signSession(body.username ?? 'authenticated', config.session.secret)",
        "",
        "  setCookie(event, config.session.cookieName, token, {",
        "    httpOnly: true,",
        "    secure: process.env.NODE_ENV === 'production',",
        "    sameSite: 'lax',",
        "    maxAge: config.session.expiresInSeconds,",
        "  })",
        "",
        "  return { ok: true }",
        "})"
      ].join(`
`)
    }), u = t({
      write: !0,
      filename: "mojipass/logout.get.mjs",
      getContents: () => [
        "import { defineEventHandler, deleteCookie, sendRedirect } from 'h3'",
        "import { useRuntimeConfig } from 'nitropack/runtime'",
        "import { loadConfig } from 'mojipass/core'",
        "",
        "export default defineEventHandler((event) => {",
        "  const config = loadConfig()",
        "  deleteCookie(event, config.session.cookieName)",
        "  const runtimeConfig = useRuntimeConfig(event)",
        "  const baseUrl = runtimeConfig.app?.baseURL?.replace(/\\/$/, '') ?? ''",
        "  return sendRedirect(event, `${baseUrl}/login`, 302)",
        "})"
      ].join(`
`)
    }), f = t({
      write: !0,
      filename: "mojipass/auth-guard.mjs",
      getContents: () => [
        "import { defineEventHandler, getCookie, sendRedirect } from 'h3'",
        "import { useRuntimeConfig } from 'nitropack/runtime'",
        "import { loadConfig, isSessionValid } from 'mojipass/core'",
        "",
        "export default defineEventHandler((event) => {",
        "  const runtimeConfig = useRuntimeConfig(event)",
        "  const baseUrl = runtimeConfig.app?.baseURL?.replace(/\\/$/, '') ?? ''",
        "  const loginPath = `${baseUrl}/login`",
        "  const requestPath = event.path",
        "",
        "  if (requestPath === loginPath || requestPath.startsWith(`${baseUrl}/api/mojipass`)) {",
        "    return",
        "  }",
        "",
        "  const config = loadConfig()",
        "",
        "  if (config.protectedPaths) {",
        "    const isPathProtected = config.protectedPaths.some((protectedPath) =>",
        "      requestPath.startsWith(`${baseUrl}${protectedPath}`)",
        "    )",
        "    if (!isPathProtected) return",
        "  }",
        "",
        "  const sessionToken = getCookie(event, config.session.cookieName)",
        "  if (isSessionValid(sessionToken, config.session.secret)) return",
        "",
        "  return sendRedirect(event, loginPath, 302)",
        "})"
      ].join(`
`)
    });
    o({ route: "/api/mojipass/config", handler: c.dst }), o({ route: "/api/mojipass/auth", handler: m.dst }), o({ route: "/api/mojipass/logout", handler: u.dst }), o({ middleware: !0, handler: f.dst });
  }
});
export {
  q as default
};
