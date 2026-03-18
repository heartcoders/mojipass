export { default as MojipassLogin } from '@/components/blocks/MojipassLogin.vue'
export { default as EmojiKeypad } from '@/components/blocks/EmojiKeypad.vue'
export { default as CodeDisplay } from '@/components/ui/CodeDisplay.vue'
export { default as EmojiKey } from '@/components/ui/EmojiKey.vue'

export { useColorScheme } from '@/composables/useColorScheme'
export { useLoginFlow } from '@/composables/useLoginFlow'
export { useMojipassConfig } from '@/composables/useMojipassConfig'

export type {
  MojipassConfig,
  PublicConfig,
  ColorScheme,
  EmojiKey as EmojiKeyConfig,
  Credential,
  CredentialsFile,
} from '@/types/config.types'
