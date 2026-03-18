import { watch, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { ColorScheme } from '@/types/config.types'

const COLOR_PROPERTY_MAP: Record<keyof ColorScheme, string> = {
  background: '--mp-background',
  foreground: '--mp-foreground',
  primary: '--mp-primary',
  primaryForeground: '--mp-primary-foreground',
  accent: '--mp-accent',
  muted: '--mp-muted',
  border: '--mp-border',
}

function applyColors(colors: ColorScheme | undefined) {
  if (!colors) return
  const root = document.documentElement
  for (const [key, property] of Object.entries(COLOR_PROPERTY_MAP)) {
    const value = colors[key as keyof ColorScheme]
    if (value) root.style.setProperty(property, value)
  }
}

/**
 * Reactively applies user-defined color overrides from config to the document root.
 * Accepts a plain value, a Ref, or a getter — re-applies whenever the value changes.
 *
 * @param colors - Optional color overrides from mojipass.config.yml
 */
export function useColorScheme(colors: MaybeRefOrGetter<ColorScheme | undefined>) {
  watch(() => toValue(colors), applyColors, { immediate: true })
}
