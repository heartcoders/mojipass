import { createRequire as f } from "node:module";
import { realpathSync as p } from "node:fs";
import { fileURLToPath as d } from "node:url";
import { resolve as n, dirname as l } from "node:path";
import { defineNuxtModule as g, useNuxt as h, extendViteConfig as v, installModule as j, addPluginTemplate as C, addTemplate as t, addServerHandler as s } from "@nuxt/kit";
const x = f(import.meta.url), y = n(l(d(import.meta.url)), "../.."), k = n(l(d(import.meta.url)), "..");
function a(o) {
  try {
    return p(o);
  } catch {
    return o;
  }
}
const F = g({
  meta: {
    name: "mojipass",
    configKey: "mojipass"
  },
  async setup() {
    h().options.css.push(a(n(k, "style.css"))), v((e) => {
      var r, i;
      e.server ?? (e.server = {}), (r = e.server).fs ?? (r.fs = {}), (i = e.server.fs).allow ?? (i.allow = []), e.server.fs.allow.push(a(y));
    }), await j(x.resolve("@vueuse/motion/nuxt")), C({
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
    const m = t({
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
    }), c = t({
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
        "import { loadConfig } from 'mojipass/core'",
        "",
        "export default defineEventHandler((event) => {",
        "  const config = loadConfig()",
        "  deleteCookie(event, config.session.cookieName)",
        "  return sendRedirect(event, '/login')",
        "})"
      ].join(`
`)
    });
    s({ route: "/api/mojipass/config", handler: m.dst }), s({ route: "/api/mojipass/auth", handler: c.dst }), s({ route: "/api/mojipass/logout", handler: u.dst });
  }
});
export {
  F as default
};
