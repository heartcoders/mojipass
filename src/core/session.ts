import { sign, unsign } from 'cookie-signature'

/**
 * Creates a signed session token from a payload string.
 * Uses cookie-signature's HMAC-SHA256 signing: returns "payload.signature".
 *
 * @param payload - The session data to sign (e.g. username or 'authenticated')
 * @param secret - The shared secret used for signing
 * @returns A signed cookie value in the format "payload.signature"
 */
export function signSession(payload: string, secret: string): string {
  return sign(payload, secret)
}

/**
 * Verifies and decodes a signed session token.
 *
 * @param token - The raw cookie value to verify
 * @param secret - The shared secret used for verification
 * @returns The original payload if valid, null otherwise
 */
export function verifySession(token: string | undefined, secret: string): string | null {
  if (!token) return null
  const result = unsign(token, secret)
  return result === false ? null : result
}

/**
 * Checks whether a session token is valid without returning the payload.
 *
 * @param token - The raw cookie value
 * @param secret - The shared secret
 * @returns True if the session is valid
 */
export function isSessionValid(token: string | undefined, secret: string): boolean {
  return verifySession(token, secret) !== null
}
