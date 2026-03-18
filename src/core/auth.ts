import bcrypt from 'bcryptjs'
import type { Credential, MojipassConfig } from '../types/config.types'

/**
 * Converts an array of emoji values (numbers) into a string code.
 *
 * @param values - Array of numeric key values selected by the user
 * @returns A string representation of the code
 */
export function buildCodeString(values: number[]): string {
  return values.join('')
}

/**
 * Hashes a plaintext code using bcrypt for secure storage.
 *
 * @param plainCode - The plaintext code to hash
 * @returns A bcrypt hash of the code
 */
export async function hashCode(plainCode: string): Promise<string> {
  const SALT_ROUNDS = 12
  return bcrypt.hash(plainCode, SALT_ROUNDS)
}

/**
 * Validates user input against stored credentials.
 *
 * @param inputCode - The code entered by the user as a joined string
 * @param inputUsername - Optional username entered by the user
 * @param credentials - List of stored credential entries
 * @param config - The Mojipass config (to check if username is required)
 * @returns True if a matching credential is found
 */
export async function validateCredentials(
  inputCode: string,
  inputUsername: string | undefined,
  credentials: Credential[],
  config: Pick<MojipassConfig, 'username'>
): Promise<boolean> {
  const candidates = config.username
    ? credentials.filter((credential) => credential.username === inputUsername)
    : credentials

  for (const candidate of candidates) {
    const isMatch = await bcrypt.compare(inputCode, candidate.passwordHash)
    if (isMatch) return true
  }

  return false
}
