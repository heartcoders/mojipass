<script setup lang="ts">
defineProps<{
  codeLength: number
  filledCount: number
  hasError: boolean
}>()
</script>

<template>
  <div
    class="mp-code"
    role="status"
    aria-live="polite"
    :aria-label="`${filledCount} of ${codeLength} symbols entered`"
  >
    <div
      v-for="index in codeLength"
      :key="index"
      v-motion
      :initial="{ scale: 1 }"
      :animate="{
        scale: filledCount >= index ? 1.15 : 1,
        transition: { duration: 150 }
      }"
      :class="[
        'mp-code__dot',
        hasError
          ? 'mp-code__dot--error'
          : filledCount >= index
            ? 'mp-code__dot--filled'
            : '',
      ]"
    />
  </div>
</template>
