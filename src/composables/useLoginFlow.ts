import { ref, computed, readonly, toValue } from 'vue'
import type { MaybeRef } from 'vue'
import type { PublicConfig } from '@/types/config.types'

type LoginStatus = 'idle' | 'loading' | 'error' | 'success'

/**
 * Manages the emoji code entry flow and submits credentials to the auth endpoint.
 *
 * @param config - The resolved Mojipass public config, accepts a plain object or a Ref
 * @param basePath - URL prefix to prepend to all API calls. Pass `useRuntimeConfig().app.baseURL` in Nuxt apps deployed at a sub-path.
 * @returns Reactive state and handlers for the login UI
 */
export function useLoginFlow(config: MaybeRef<Pick<PublicConfig, 'codeLength' | 'username'>>, basePath = '') {
  const enteredValues = ref<number[]>([])
  const username = ref('')
  const status = ref<LoginStatus>('idle')
  const errorMessage = ref('')

  const filledCount = computed(() => enteredValues.value.length)
  const isCodeComplete = computed(() => filledCount.value === toValue(config).codeLength)
  const isDisabled = computed(() => status.value === 'loading' || status.value === 'success')
  const hasError = computed(() => status.value === 'error')

  function pressKey(value: number) {
    if (isDisabled.value || isCodeComplete.value) return
    enteredValues.value = [...enteredValues.value, value]

    if (enteredValues.value.length === toValue(config).codeLength) {
      submitCode()
    }
  }

  function deleteLastKey() {
    if (isDisabled.value || enteredValues.value.length === 0) return
    enteredValues.value = enteredValues.value.slice(0, -1)
    if (status.value === 'error') {
      status.value = 'idle'
      errorMessage.value = ''
    }
  }

  function resetCode() {
    enteredValues.value = []
    status.value = 'idle'
    errorMessage.value = ''
  }

  async function submitCode() {
    status.value = 'loading'
    errorMessage.value = ''

    try {
      const response = await fetch(`${basePath}/api/mojipass/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: enteredValues.value.join(''),
          username: toValue(config).username ? username.value : undefined,
        }),
      })

      if (!response.ok) throw new Error('Invalid code')

      status.value = 'success'
      const redirectTarget = new URLSearchParams(window.location.search).get('redirect') ?? '/'
      window.location.href = redirectTarget
    } catch {
      status.value = 'error'
      errorMessage.value = 'Incorrect code. Please try again.'
      setTimeout(resetCode, 800)
    }
  }

  return {
    username,
    filledCount: readonly(filledCount),
    isDisabled: readonly(isDisabled),
    isCodeComplete: readonly(isCodeComplete),
    hasError: readonly(hasError),
    status: readonly(status),
    errorMessage: readonly(errorMessage),
    pressKey,
    deleteLastKey,
  }
}
