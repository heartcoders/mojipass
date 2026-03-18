import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import yaml from 'js-yaml'
import type { MojipassConfig, CredentialsFile } from '../types/config.types'

const DEFAULT_EMOJI_KEYS = [
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

/**
 * Loads and parses the Mojipass config file.
 *
 * @param configPath - Absolute or relative path to mojipass.config.yml
 * @returns Parsed and merged config with defaults applied
 * @throws {Error} If the config file cannot be read or parsed
 */
export function loadConfig(configPath = 'mojipass.config.yml'): MojipassConfig {
  const absolutePath = resolve(process.cwd(), configPath)
  const raw = readFileSync(absolutePath, 'utf-8')
  const parsed = yaml.load(raw) as Partial<MojipassConfig>

  return {
    codeLength: parsed.codeLength ?? 4,
    keys: parsed.keys ?? DEFAULT_EMOJI_KEYS,
    username: parsed.username ?? false,
    session: {
      secret: parsed.session?.secret ?? '',
      expiresInSeconds: parsed.session?.expiresInSeconds ?? 86400,
      cookieName: parsed.session?.cookieName ?? 'mojipass_session',
    },
    credentials: {
      path: parsed.credentials?.path ?? './credentials.hash.yml',
    },
    colors: parsed.colors,
    proxy: parsed.proxy,
    protectedPaths: parsed.protectedPaths,
  }
}

/**
 * Loads and parses the hashed credentials file.
 *
 * @param credentialsPath - Path to the credentials.hash.yml file
 * @returns Parsed credentials list
 * @throws {Error} If the credentials file cannot be read or parsed
 */
export function loadCredentials(credentialsPath: string): CredentialsFile {
  const absolutePath = resolve(process.cwd(), credentialsPath)
  const raw = readFileSync(absolutePath, 'utf-8')
  return yaml.load(raw) as CredentialsFile
}
