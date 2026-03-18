# Mojipass

A lightweight authentication package that replaces passwords with an emoji keypad — inspired by the iPhone passcode screen.

Use it in two ways:

- **Standalone server** — runs in front of your app as a full proxy gateway
- **Nuxt module** — integrates directly into your Nuxt project

---

## Standalone server

Mojipass runs as a standalone Node server in front of your app and proxies all authenticated traffic.

**Full gateway** — every route requires login:

```
Browser → Mojipass :4000 ──authenticated──→ Your app :3000
                   ↓ not logged in
              /login (emoji keypad)
```

**Partial protection** — only specific paths require login, all others pass through freely:

```
/public     → passes through freely
/admin      → requires emoji login
/dashboard  → requires emoji login
```

### Quick start

**1. Create and hash your credentials**

```bash
npm run setup
```

Or use the CLI directly:

```bash
mojipass-create --password "1234"
mojipass-create --password "1234,5678" --username "alice,bob"
```

**2. Set your session secret**

Open `mojipass.config.yml` and replace the placeholder:

```yaml
session:
  secret: "your-long-random-secret-here"
```

**3. Build the UI**

```bash
npm run build
```

**4. Start**

```bash
npm run start
```

Mojipass starts on `http://localhost:4000`. Point your reverse proxy (nginx, Caddy) at this port — not at your app directly.

### Development

```bash
npm run dev        # API + Vite in parallel
npm run dev:api    # Hono API on :4001 only
npm run dev:ui     # Vite dev server on :5173 only
```

---

## Nuxt module

Mojipass can be integrated directly into a Nuxt project as a module.

### Installation

```bash
npm link mojipass   # or: npm install mojipass
```

### Setup

**1. Register the module**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['mojipass/nuxt'],
  css: ['mojipass/style.css'],
})
```

The module registers automatically:

- `@vueuse/motion` so the `v-motion` directive works inside mojipass components
- A server plugin that patches `$fetch` with `useRequestFetch()` so SSR requests forward the browser's session cookie — without this, the session guard would incorrectly redirect logged-in users to `/login` during server-side rendering
- Server routes: `GET /api/mojipass/config`, `POST /api/mojipass/auth`, `GET /api/mojipass/logout`

**2. Add a `mojipass.config.yml` to your project root**

```yaml
codeLength: 4
username: false

keys:
  - symbol: "🦊"
    value: 0
  - symbol: "🌊"
    value: 1
  - symbol: "🍕"
    value: 2
  - symbol: "🌈"
    value: 3
  - symbol: "🔥"
    value: 4

session:
  secret: "your-long-random-secret-here"
  cookieName: "mojipass_session"
  expiresInSeconds: 86400

credentials:
  path: "./credentials.hash.yml"
```

**3. Create your credentials**

```bash
mojipass-create --password "1234"
mojipass-create --password "1234,5678" --username "alice,bob"
```

**4. Add the session guard middleware**

This is the only file you need to create manually. It protects your routes and redirects unauthenticated requests to `/login`. The middleware reads `app.baseURL` at runtime via `useRuntimeConfig` so it works correctly when the app is mounted at a sub-path:

```ts
// server/middleware/auth.ts
import { verifySession, loadConfig } from 'mojipass/core'
import { getCookie, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  const config = loadConfig()
  const token = getCookie(event, config.session.cookieName)
  const pathname = getRequestURL(event).pathname

  const { app } = useRuntimeConfig(event)
  const base = (app.baseURL ?? '/').replace(/\/$/, '')
  const loginPath = `${base}/login`

  const isPublic =
    pathname.startsWith(loginPath) || pathname.startsWith('/api/mojipass')
  if (isPublic) return

  if (!verifySession(token, config.session.secret)) {
    return sendRedirect(event, loginPath, 302)
  }
})
```

**5. Create the login page**

```vue
<!-- pages/login.vue -->
<script setup lang="ts">
import { MojipassLogin } from 'mojipass'

definePageMeta({ layout: false })

const { app } = useRuntimeConfig()
const basePath = app.baseURL.replace(/\/$/, '')
</script>

<template>
  <MojipassLogin :base-path="basePath" />
</template>
```

The `basePath` prop prefixes all internal API calls (`/api/mojipass/config`, `/api/mojipass/auth`). When the app is deployed at the root, `baseURL` is `/` and `basePath` resolves to `''`, so no prefix is added. When deployed at a sub-path like `/pkmn`, `basePath` becomes `/pkmn` and requests go to `/pkmn/api/mojipass/config` etc.

---

## Credentials CLI

```bash
# Single password, no username
mojipass-create --password "1234"

# Multiple passwords at once
mojipass-create --password "1234,5678,9012"

# With usernames (count must match)
mojipass-create --password "1234,5678" --username "alice,bob"

# Help
mojipass-create --help
```

New credentials are appended to the existing file — existing entries are not overwritten. The output path is read from `mojipass.config.yml` (`credentials.path`), defaulting to `./credentials.hash.yml`.

---

## Configuration

All configuration lives in `mojipass.config.yml`:

```yaml
# Number of emoji symbols the user must enter
codeLength: 4

# The emoji keypad — define which symbols appear and their internal values
keys:
  - symbol: "🦊"
    value: 0
  - symbol: "🌊"
    value: 1
  - symbol: "🍕"
    value: 2

# Require a username in addition to the emoji code
username: false

# Session settings
session:
  secret: "change-me-to-a-long-random-secret"
  cookieName: "mojipass_session"
  expiresInSeconds: 86400

# Path to the hashed credentials file
credentials:
  path: "./credentials.hash.yml"

# Optional: override the color scheme (any valid CSS color value)
# colors:
#   background: "#13131f"
#   foreground: "#f0f0ff"
#   primary:    "#7c3aed"
#   accent:     "#7c3aed"
#   muted:      "hsl(240 26% 14%)"
#   border:     "hsl(240 26% 20%)"

# Standalone only: proxy authenticated traffic to your app
# proxy:
#   target: "http://localhost:3000"

# Standalone only: protect only specific paths (htaccess-style)
# protectedPaths:
#   - "/admin"
#   - "/dashboard"
```

### Color tokens

| Token | Light default | Dark default | Role |
|---|---|---|---|
| `background` | `hsl(0 0% 98%)` | `hsl(222 47% 9%)` | Page background |
| `foreground` | `hsl(222 47% 11%)` | `hsl(213 31% 91%)` | Text |
| `primary` | `hsl(221 83% 53%)` | `hsl(217 91% 60%)` | Active / selected states |
| `accent` | `hsl(262 80% 60%)` | `hsl(262 80% 65%)` | Highlight |
| `muted` | `hsl(210 40% 94%)` | `hsl(223 47% 16%)` | Subtle backgrounds |
| `border` | `hsl(214 32% 89%)` | `hsl(216 34% 17%)` | Borders and dividers |

Any valid CSS color value is accepted: `#hex`, `rgb()`, `hsl()`, `oklch()`, etc.

---

## Package exports

| Import | Contents |
|---|---|
| `mojipass` | Vue components and composables |
| `mojipass/core` | Server-side utilities (auth, session, config) |
| `mojipass/nuxt` | Nuxt module |
| `mojipass/style.css` | Pre-built CSS (Tailwind utilities + color tokens) |

---

## Security notes

- Credentials are hashed with bcrypt at 12 salt rounds — never stored in plain text.
- Session cookies are signed with HMAC using your `session.secret`.
- Never commit `credentials.plain.yml` — add it to `.gitignore` or delete it after hashing.
- In production, store `credentials.hash.yml` outside the project directory by setting an absolute path in `credentials.path`.
- Set `session.secret` via an environment variable in production — never commit it.
- The config path can be overridden at runtime: `MOJIPASS_CONFIG=/etc/mojipass/config.yml npm run start`

---

## Tech stack

- **Vue 3** — UI components
- **Vite** — build tool
- **Tailwind CSS v4** — styling
- **@vueuse/motion** — micro animations
- **Hono** — standalone server
- **bcryptjs** — credential hashing
- **js-yaml** — config and credentials parsing
- **@nuxt/kit** — Nuxt module API
