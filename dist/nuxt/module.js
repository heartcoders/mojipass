import { createRequire as g } from "node:module";
import { realpathSync as h } from "node:fs";
import { fileURLToPath as l } from "node:url";
import { resolve as n, dirname as c } from "node:path";
import { defineNuxtModule as v, useNuxt as j, extendViteConfig as C, installModule as P, addPluginTemplate as E, addTemplate as o, addServerHandler as s } from "@nuxt/kit";
const R = g(import.meta.url), k = n(c(l(import.meta.url)), "../.."), x = n(c(l(import.meta.url)), "..");
function d(t) {
  try {
    return h(t);
  } catch {
    return t;
  }
}
const $ = v({
  meta: {
    name: "mojipass",
    configKey: "mojipass"
  },
  async setup() {
    const t = j(), r = (t.options.app.baseURL ?? "/").replace(/\/$/, "");
    t.options.css.push(d(n(x, "style.css"))), C((e) => {
      var i, a;
      e.server ?? (e.server = {}), (i = e.server).fs ?? (i.fs = {}), (a = e.server.fs).allow ?? (a.allow = []), e.server.fs.allow.push(d(k));
    }), await P(R.resolve("@vueuse/motion/nuxt")), E({
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
    const m = o({
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
    }), u = o({
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
    }), f = o({
      write: !0,
      filename: "mojipass/logout.get.mjs",
      getContents: () => [
        "import { defineEventHandler, deleteCookie, sendRedirect } from 'h3'",
        "import { loadConfig } from 'mojipass/core'",
        "",
        `const BASE_URL = '${r}'`,
        "",
        "export default defineEventHandler((event) => {",
        "  const config = loadConfig()",
        "  deleteCookie(event, config.session.cookieName)",
        "  return sendRedirect(event, `${BASE_URL}/login`, 302)",
        "})"
      ].join(`
`)
    }), p = o({
      write: !0,
      filename: "mojipass/auth-guard.mjs",
      getContents: () => [
        "import { defineEventHandler, getCookie, sendRedirect } from 'h3'",
        "import { loadConfig, isSessionValid } from 'mojipass/core'",
        "",
        `const BASE_URL = '${r}'`,
        "",
        "export default defineEventHandler((event) => {",
        "  const loginPath = `${BASE_URL}/login`",
        "  const requestPath = event.path",
        "",
        "  if (requestPath.startsWith(loginPath) || requestPath.startsWith(`${BASE_URL}/api/mojipass`)) {",
        "    return",
        "  }",
        "",
        "  const config = loadConfig()",
        "",
        "  if (config.protectedPaths) {",
        "    const isPathProtected = config.protectedPaths.some((protectedPath) =>",
        "      requestPath.startsWith(`${BASE_URL}${protectedPath}`)",
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
    s({ route: "/api/mojipass/config", handler: m.dst }), s({ route: "/api/mojipass/auth", handler: u.dst }), s({ route: "/api/mojipass/logout", handler: f.dst }), s({ middleware: !0, handler: p.dst });
  }
});
export {
  $ as default
};
