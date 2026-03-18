import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { mkdirSync } from 'node:fs'
import { createInterface } from 'node:readline'
import bcrypt from 'bcryptjs'
import yaml from 'js-yaml'

const SALT_ROUNDS = 12
const PLAIN_CREDENTIALS_PATH = resolve(process.cwd(), 'credentials.plain.yml')
const CONFIG_PATH = resolve(process.cwd(), 'mojipass.config.yml')

interface PlainCredential {
  username?: string
  password: string
}

interface PlainCredentialsFile {
  credentials: PlainCredential[]
}

interface HashedCredential {
  username?: string
  passwordHash: string
}

function prompt(question: string): Promise<string> {
  const readline = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolvePromise) => {
    readline.question(question, (answer) => {
      readline.close()
      resolvePromise(answer.trim())
    })
  })
}

function readOutputPath(): string {
  if (!existsSync(CONFIG_PATH)) {
    return resolve(process.cwd(), 'credentials.hash.yml')
  }
  const raw = readFileSync(CONFIG_PATH, 'utf-8')
  const config = yaml.load(raw) as { credentials?: { path?: string } }
  return resolve(process.cwd(), config?.credentials?.path ?? 'credentials.hash.yml')
}

async function hashCredentials(plain: PlainCredentialsFile): Promise<HashedCredential[]> {
  const hashed: HashedCredential[] = []

  for (const credential of plain.credentials) {
    const passwordHash = await bcrypt.hash(credential.password, SALT_ROUNDS)
    const entry: HashedCredential = { passwordHash }
    if (credential.username) entry.username = credential.username
    hashed.push(entry)
  }

  return hashed
}

async function run() {
  console.log('\n┌─────────────────────────────────────────┐')
  console.log('│         Mojipass Setup — Hashing         │')
  console.log('└─────────────────────────────────────────┘\n')

  if (!existsSync(PLAIN_CREDENTIALS_PATH)) {
    console.log('  credentials.plain.yml not found.\n')
    const shouldCreate = await prompt('  Create a new credentials.plain.yml? (y/n): ')

    if (shouldCreate.toLowerCase() !== 'y') {
      console.log('\n  Aborted.')
      process.exit(0)
    }

    const username = await prompt('  Username (leave empty to skip): ')
    const password = await prompt('  Password/Code: ')

    const plain: PlainCredentialsFile = {
      credentials: [
        username ? { username, password } : { password },
      ],
    }

    writeFileSync(PLAIN_CREDENTIALS_PATH, yaml.dump(plain), 'utf-8')
    console.log('\n  credentials.plain.yml created.')
  }

  const raw = readFileSync(PLAIN_CREDENTIALS_PATH, 'utf-8')
  const plain = yaml.load(raw) as PlainCredentialsFile

  console.log(`\n  Hashing ${plain.credentials.length} credential(s)...\n`)

  const hashedCredentials = await hashCredentials(plain)
  const outputPath = readOutputPath()
  const outputDir = dirname(outputPath)

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  writeFileSync(outputPath, yaml.dump({ credentials: hashedCredentials }), 'utf-8')

  console.log(`  ✓  Credentials hashed and written to:`)
  console.log(`     ${outputPath}\n`)
  console.log('  Add credentials.plain.yml to .gitignore — never commit plaintext passwords.')
  console.log('\n─────────────────────────────────────────────\n')
}

run().catch((setupError) => {
  console.error('  Setup failed:', setupError)
  process.exit(1)
})
