import l from "bcryptjs";
import { sign as d, unsign as f } from "cookie-signature";
import { readFileSync as c } from "node:fs";
import { resolve as u } from "node:path";
import m from "js-yaml";
function w(s) {
  return s.join("");
}
async function x(s) {
  return l.hash(s, 12);
}
async function C(s, e, n, o) {
  const r = o.username ? n.filter((t) => t.username === e) : n;
  for (const t of r)
    if (await l.compare(s, t.passwordHash)) return !0;
  return !1;
}
function L(s, e) {
  return d(s, e);
}
function p(s, e) {
  if (!s) return null;
  const n = f(s, e);
  return n === !1 ? null : n;
}
function _(s, e) {
  return p(s, e) !== null;
}
const y = [
  { symbol: "🦊", value: 0 },
  { symbol: "🌊", value: 1 },
  { symbol: "🍕", value: 2 },
  { symbol: "🌈", value: 3 },
  { symbol: "🔥", value: 4 },
  { symbol: "🎯", value: 5 },
  { symbol: "🌙", value: 6 },
  { symbol: "⚡", value: 7 },
  { symbol: "🎸", value: 8 }
];
function N(s = "mojipass.config.yml") {
  var r, t, a, i;
  const e = u(process.cwd(), s), n = c(e, "utf-8"), o = m.load(n);
  return {
    codeLength: o.codeLength ?? 4,
    keys: o.keys ?? y,
    username: o.username ?? !1,
    session: {
      secret: ((r = o.session) == null ? void 0 : r.secret) ?? "",
      expiresInSeconds: ((t = o.session) == null ? void 0 : t.expiresInSeconds) ?? 86400,
      cookieName: ((a = o.session) == null ? void 0 : a.cookieName) ?? "mojipass_session"
    },
    credentials: {
      path: ((i = o.credentials) == null ? void 0 : i.path) ?? "./credentials.hash.yml"
    },
    colors: o.colors,
    proxy: o.proxy,
    protectedPaths: o.protectedPaths
  };
}
function P(s) {
  const e = u(process.cwd(), s), n = c(e, "utf-8");
  return m.load(n);
}
export {
  w as buildCodeString,
  x as hashCode,
  _ as isSessionValid,
  N as loadConfig,
  P as loadCredentials,
  L as signSession,
  C as validateCredentials,
  p as verifySession
};
