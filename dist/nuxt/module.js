import { createRequire as f } from "node:module";
import { realpathSync as g } from "node:fs";
import { fileURLToPath as d } from "node:url";
import { resolve as n, dirname as l } from "node:path";
import { defineNuxtModule as h, useNuxt as v, extendViteConfig as j, installModule as C, addPluginTemplate as y, addTemplate as t, addServerHandler as s } from "@nuxt/kit";
const x = f(import.meta.url), k = n(l(d(import.meta.url)), "../.."), E = n(l(d(import.meta.url)), "..");
function a(o) {
  try {
    return g(o);
  } catch {
    return o;
  }
}
const b = h({
  meta: {
    name: "mojipass",
    configKey: "mojipass"
  },
  async setup() {
    const o = v(), c = (o.options.app.baseURL ?? "/").replace(/\/$/, "");
    o.options.css.push(a(n(E, "style.css"))), j((e) => {
      var r, i;
      e.server ?? (e.server = {}), (r = e.server).fs ?? (r.fs = {}), (i = e.server.fs).allow ?? (i.allow = []), e.server.fs.allow.push(a(k));
    }), await C(x.resolve("@vueuse/motion/nuxt")), y({
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
    }), u = t({
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
    }), p = t({
      write: !0,
      filename: "mojipass/logout.get.mjs",
      getContents: () => [
        "import { defineEventHandler, deleteCookie, sendRedirect } from 'h3'",
        "import { loadConfig } from 'mojipass/core'",
        "",
        `const BASE_URL = '${c}'`,
        "",
        "export default defineEventHandler((event) => {",
        "  const config = loadConfig()",
        "  deleteCookie(event, config.session.cookieName)",
        "  return sendRedirect(event, `${BASE_URL}/login`, 302)",
        "})"
      ].join(`
`)
    });
    s({ route: "/api/mojipass/config", handler: m.dst }), s({ route: "/api/mojipass/auth", handler: u.dst }), s({ route: "/api/mojipass/logout", handler: p.dst });
  }
});
export {
  b as default
};
