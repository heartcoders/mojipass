#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import bcrypt from 'bcryptjs'
import yaml from 'js-yaml'

const SALT_ROUNDS = 12
const DIVIDER = '─'.repeat(45)

interface HashedCredential {
  username?: string
  passwordHash: string
}

interface CredentialsFile {
  credentials: HashedCredential[]
}

function parseArgValue(args: string[], flag: string): string | undefined {
  const flagIndex = args.indexOf(flag)
  if (flagIndex === -1 || flagIndex + 1 >= args.length) return undefined
  return args[flagIndex + 1]
}

function splitArg(value: string): string[] {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function resolveOutputPath(): string {
  const configPath = resolve(process.cwd(), 'mojipass.config.yml')
  if (!existsSync(configPath)) return resolve(process.cwd(), 'credentials.hash.yml')

  const raw = readFileSync(configPath, 'utf-8')
  const config = yaml.load(raw) as { credentials?: { path?: string } }
  return resolve(process.cwd(), config?.credentials?.path ?? 'credentials.hash.yml')
}

function readExistingCredentials(outputPath: string): HashedCredential[] {
  if (!existsSync(outputPath)) return []

  const raw = readFileSync(outputPath, 'utf-8')
  const parsed = yaml.load(raw) as CredentialsFile
  return parsed?.credentials ?? []
}

function printUsage() {
  console.log(`\n${DIVIDER}`)
  console.log('  mojipass-create — Add hashed credentials')
  console.log(DIVIDER)
  console.log('\n  Usage:')
  console.log('    mojipass-create --password <codes>')
  console.log('    mojipass-create --password <codes> --username <names>\n')
  console.log('  Options:')
  console.log('    --password  Comma-separated list of codes (required)')
  console.log('    --username  Comma-separated list of usernames (optional)')
  console.log('    --help      Show this help message\n')
  console.log('  Examples:')
  console.log('    mojipass-create --password "1234"')
  console.log('    mojipass-create --password "1234,5678"')
  console.log('    mojipass-create --password "1234,5678" --username "alice,bob"')
  console.log(`\n${DIVIDER}\n`)
}

async function hashCredentials(
  passwords: string[],
  usernames: string[],
): Promise<HashedCredential[]> {
  const results: HashedCredential[] = []

  for (let index = 0; index < passwords.length; index++) {
    const passwordHash = await bcrypt.hash(passwords[index], SALT_ROUNDS)
    const entry: HashedCredential = { passwordHash }
    if (usernames.length > 0) entry.username = usernames[index]
    results.push(entry)
  }

  return results
}

async function run() {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    printUsage()
    process.exit(0)
  }

  const passwordArg = parseArgValue(args, '--password')
  const usernameArg = parseArgValue(args, '--username')

  if (!passwordArg) {
    console.error('\n  Error: --password is required\n')
    printUsage()
    process.exit(1)
  }

  const passwords = splitArg(passwordArg)
  const usernames = usernameArg ? splitArg(usernameArg) : []

  if (usernames.length > 0 && usernames.length !== passwords.length) {
    console.error(`\n  Error: --username count (${usernames.length}) must match --password count (${passwords.length})\n`)
    process.exit(1)
  }

  console.log(`\n${DIVIDER}`)
  console.log('  mojipass-create')
  console.log(DIVIDER)
  console.log(`\n  Hashing ${passwords.length} credential(s)...\n`)

  const newCredentials = await hashCredentials(passwords, usernames)
  const outputPath = resolveOutputPath()
  const existingCredentials = readExistingCredentials(outputPath)
  const mergedCredentials = [...existingCredentials, ...newCredentials]

  const outputDir = dirname(outputPath)
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

  writeFileSync(outputPath, yaml.dump({ credentials: mergedCredentials }), 'utf-8')

  for (let index = 0; index < newCredentials.length; index++) {
    const label = usernames.length > 0 ? `${usernames[index]}` : `entry ${index + 1}`
    console.log(`  ✓  ${label}`)
  }

  console.log(`\n  Written to: ${outputPath}`)
  console.log(`  Total credentials: ${mergedCredentials.length}`)
  console.log(`\n${DIVIDER}\n`)
}

run().catch((error) => {
  console.error('\n  Error:', error.message)
  process.exit(1)
})
