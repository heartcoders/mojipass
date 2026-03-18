#!/usr/bin/env node
import { existsSync as d, mkdirSync as y, writeFileSync as $, readFileSync as w } from "node:fs";
import { dirname as j, resolve as i } from "node:path";
import C from "bcryptjs";
import p from "js-yaml";
const S = 12, t = "─".repeat(45);
function m(e, s) {
  const o = e.indexOf(s);
  if (!(o === -1 || o + 1 >= e.length))
    return e[o + 1];
}
function h(e) {
  return e.split(",").map((s) => s.trim()).filter(Boolean);
}
function v() {
  var n;
  const e = i(process.cwd(), "mojipass.config.yml");
  if (!d(e)) return i(process.cwd(), "credentials.hash.yml");
  const s = w(e, "utf-8"), o = p.load(s);
  return i(process.cwd(), ((n = o == null ? void 0 : o.credentials) == null ? void 0 : n.path) ?? "credentials.hash.yml");
}
function A(e) {
  if (!d(e)) return [];
  const s = w(e, "utf-8"), o = p.load(s);
  return (o == null ? void 0 : o.credentials) ?? [];
}
function f() {
  console.log(`
${t}`), console.log("  mojipass-create — Add hashed credentials"), console.log(t), console.log(`
  Usage:`), console.log("    mojipass-create --password <codes>"), console.log(`    mojipass-create --password <codes> --username <names>
`), console.log("  Options:"), console.log("    --password  Comma-separated list of codes (required)"), console.log("    --username  Comma-separated list of usernames (optional)"), console.log(`    --help      Show this help message
`), console.log("  Examples:"), console.log('    mojipass-create --password "1234"'), console.log('    mojipass-create --password "1234,5678"'), console.log('    mojipass-create --password "1234,5678" --username "alice,bob"'), console.log(`
${t}
`);
}
async function E(e, s) {
  const o = [];
  for (let n = 0; n < e.length; n++) {
    const l = { passwordHash: await C.hash(e[n], S) };
    s.length > 0 && (l.username = s[n]), o.push(l);
  }
  return o;
}
async function b() {
  const e = process.argv.slice(2);
  (e.includes("--help") || e.includes("-h")) && (f(), process.exit(0));
  const s = m(e, "--password"), o = m(e, "--username");
  s || (console.error(`
  Error: --password is required
`), f(), process.exit(1));
  const n = h(s), r = o ? h(o) : [];
  r.length > 0 && r.length !== n.length && (console.error(`
  Error: --username count (${r.length}) must match --password count (${n.length})
`), process.exit(1)), console.log(`
${t}`), console.log("  mojipass-create"), console.log(t), console.log(`
  Hashing ${n.length} credential(s)...
`);
  const l = await E(n, r), c = v(), g = [...A(c), ...l], u = j(c);
  d(u) || y(u, { recursive: !0 }), $(c, p.dump({ credentials: g }), "utf-8");
  for (let a = 0; a < l.length; a++) {
    const x = r.length > 0 ? `${r[a]}` : `entry ${a + 1}`;
    console.log(`  ✓  ${x}`);
  }
  console.log(`
  Written to: ${c}`), console.log(`  Total credentials: ${g.length}`), console.log(`
${t}
`);
}
b().catch((e) => {
  console.error(`
  Error:`, e.message), process.exit(1);
});
