<script setup lang="ts">
import MojipassLogin from '@/components/blocks/MojipassLogin.vue'
import { useColorScheme } from '@/composables/useColorScheme'
import type { MojipassConfig } from '@/types/config.types'

declare global {
  interface Window {
    __MOJIPASS_CONFIG__: Pick<MojipassConfig, 'codeLength' | 'username' | 'keys' | 'colors'>
  }
}

const config = window.__MOJIPASS_CONFIG__ ?? {
  codeLength: 4,
  username: false,
  keys: [
    { symbol: '🦊', value: 0 },
    { symbol: '🌊', value: 1 },
    { symbol: '🍕', value: 2 },
    { symbol: '🌈', value: 3 },
    { symbol: '🔥', value: 4 },
    { symbol: '🎯', value: 5 },
    { symbol: '🌙', value: 6 },
    { symbol: '⚡', value: 7 },
    { symbol: '🎸', value: 8 },
  ],
}

useColorScheme(config.colors)
</script>

<template>
  <MojipassLogin :config="config" />
</template>
