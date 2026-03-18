<script setup lang="ts">
import { computed } from 'vue'
import type { PublicConfig } from '@/types/config.types'
import { useMojipassConfig } from '@/composables/useMojipassConfig'
import { useLoginFlow } from '@/composables/useLoginFlow'
import { useColorScheme } from '@/composables/useColorScheme'
import CodeDisplay from '@/components/ui/CodeDisplay.vue'
import EmojiKeypad from '@/components/blocks/EmojiKeypad.vue'

const props = withDefaults(defineProps<{
  config?: PublicConfig
  basePath?: string
}>(), {
  basePath: '',
})

const { config: fetchedConfig, isLoading: isConfigLoading } = useMojipassConfig(props.basePath)

const activeConfig = computed(() => props.config ?? fetchedConfig.value)

useColorScheme(computed(() => activeConfig.value.colors))

const {
  username,
  filledCount,
  isDisabled,
  hasError,
  status,
  errorMessage,
  pressKey,
  deleteLastKey,
} = useLoginFlow(activeConfig, props.basePath)

const statusLabel = computed(() => {
  if (isConfigLoading.value) return 'Loading...'
  if (status.value === 'loading') return 'Verifying...'
  if (status.value === 'success') return 'Access granted'
  if (status.value === 'error') return errorMessage.value
  return 'Enter your code'
})
</script>

<template>
  <div class="mp-login">
    <div
      v-motion
      :initial="{ opacity: 0, y: 24 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
      class="mp-login__card"
    >
      <header class="mp-login__header">
        <h1 class="mp-login__title">
          Mojipass
        </h1>
        <p
          :class="['mp-login__status', hasError && 'mp-login__status--error']"
          role="status"
          aria-live="polite"
        >
          {{ statusLabel }}
        </p>
      </header>

      <div
        v-if="activeConfig.username"
        class="mp-login__field"
      >
        <label
          for="mojipass-username"
          class="mp-login__label"
        >
          Username
        </label>
        <input
          id="mojipass-username"
          v-model="username"
          type="text"
          autocomplete="username"
          placeholder="Enter your username"
          :disabled="isDisabled"
          class="mp-login__input"
        />
      </div>

      <CodeDisplay
        :code-length="activeConfig.codeLength"
        :filled-count="filledCount"
        :has-error="hasError"
      />

      <EmojiKeypad
        :keys="activeConfig.keys"
        :is-disabled="isDisabled || isConfigLoading"
        @key-press="pressKey"
        @delete="deleteLastKey"
      />
    </div>
  </div>
</template>
