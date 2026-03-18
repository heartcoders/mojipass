/**
 * Nuxt module for Mojipass. Registers automatically:
 *
 * - @vueuse/motion/nuxt so v-motion works in MojipassLogin
 * - A server-only plugin that patches globalThis.$fetch with useRequestFetch()
 *   so SSR requests forward the browser session cookie automatically
 * - Server routes: GET /api/mojipass/config, POST /api/mojipass/auth, GET /api/mojipass/logout
 */
declare const _default: NuxtModule<TOptions, TOptions, false>;
export default _default;
