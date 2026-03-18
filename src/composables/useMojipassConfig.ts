import { ref, readonly } from 'vue'
import type { PublicConfig } from '@/types/config.types'

const DEFAULT_KEYS = [
  { symbol: '🦊', value: 0 },
  { symbol: '🌊', value: 1 },
  { symbol: '🍕', value: 2 },
  { symbol: '🌈', value: 3 },
  { symbol: '🔥', value: 4 },
  { symbol: '🎯', value: 5 },
  { symbol: '🌙', value: 6 },
  { symbol: '⚡', value: 7 },
  { symbol: '🎸', value: 8 },
]

const DEFAULT_CONFIG: PublicConfig = {
  codeLength: 4,
  username: false,
  keys: [...DEFAULT_KEYS],
}

function readWindowConfig(): PublicConfig | null {
  if (typeof window === 'undefined') return null
  const windowConfig = (window as Window & { __MOJIPASS_CONFIG__?: PublicConfig }).__MOJIPASS_CONFIG__
  return windowConfig ?? null
}

/**
 * Loads the public Mojipass config.
 *
 * Resolution order:
 * 1. window.__MOJIPASS_CONFIG__ (standalone server mode)
 * 2. GET {basePath}/api/mojipass/config (library/Nuxt mode)
 * 3. Built-in defaults (fallback)
 *
 * @param basePath - URL prefix to prepend to all API calls. Pass `useRuntimeConfig().app.baseURL` in Nuxt apps deployed at a sub-path.
 * @returns Reactive config, loading state, and error state
 */
export function useMojipassConfig(basePath = '') {
  const config = ref<PublicConfig>(readWindowConfig() ?? DEFAULT_CONFIG)
  const isLoading = ref(false)
  const hasError = ref(false)

  const windowConfig = readWindowConfig()
  if (windowConfig) {
    return {
      config: readonly(config),
      isLoading: readonly(isLoading),
      hasError: readonly(hasError),
    }
  }

  isLoading.value = true

  fetch(`${basePath}/api/mojipass/config`)
    .then((response) => {
      if (!response.ok) throw new Error(`Config fetch failed: ${response.status}`)
      return response.json() as Promise<PublicConfig>
    })
    .then((fetchedConfig) => {
      config.value = fetchedConfig
    })
    .catch(() => {
      hasError.value = true
    })
    .finally(() => {
      isLoading.value = false
    })

  return {
    config: readonly(config),
    isLoading: readonly(isLoading),
    hasError: readonly(hasError),
  }
}
