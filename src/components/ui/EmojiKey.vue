<script setup lang="ts">
import type { EmojiKey } from '@/types/config.types'

const props = defineProps<{
  emojiKey: EmojiKey
  isDisabled: boolean
}>()

const emit = defineEmits<{
  (event: 'press', value: number): void
}>()

function handlePress() {
  emit('press', props.emojiKey.value)
}
</script>

<template>
  <button
    type="button"
    :disabled="isDisabled"
    :aria-label="`Enter symbol ${emojiKey.symbol}`"
    class="mp-key"
    @click="handlePress"
  >
    <span aria-hidden="true">{{ emojiKey.symbol }}</span>
  </button>
</template>
