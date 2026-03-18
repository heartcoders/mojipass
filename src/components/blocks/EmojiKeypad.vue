<script setup lang="ts">
import type { EmojiKey } from '@/types/config.types'
import EmojiKeyComponent from '@/components/ui/EmojiKey.vue'

defineProps<{
  keys: readonly EmojiKey[]
  isDisabled: boolean
}>()

const emit = defineEmits<{
  (event: 'keyPress', value: number): void
  (event: 'delete'): void
}>()
</script>

<template>
  <div class="mp-keypad">
    <div
      :class="['mp-keypad__grid', keys.length > 9 && 'mp-keypad__grid--4col']"
      role="group"
      aria-label="Emoji keypad"
    >
      <EmojiKeyComponent
        v-for="emojiKey in keys"
        :key="emojiKey.value"
        :emoji-key="emojiKey"
        :is-disabled="isDisabled"
        @press="emit('keyPress', $event)"
      />
    </div>

    <button
      type="button"
      :disabled="isDisabled"
      aria-label="Delete last entry"
      class="mp-keypad__delete"
      @click="emit('delete')"
    >
      Delete
    </button>
  </div>
</template>
