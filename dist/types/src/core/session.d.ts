/**
 * Creates a signed session token from a payload string.
 * Uses cookie-signature's HMAC-SHA256 signing: returns "payload.signature".
 *
 * @param payload - The session data to sign (e.g. username or 'authenticated')
 * @param secret - The shared secret used for signing
 * @returns A signed cookie value in the format "payload.signature"
 */
export declare function signSession(payload: string, secret: string): string;
/**
 * Verifies and decodes a signed session token.
 *
 * @param token - The raw cookie value to verify
 * @param secret - The shared secret used for verification
 * @returns The original payload if valid, null otherwise
 */
export declare function verifySession(token: string | undefined, secret: string): string | null;
/**
 * Checks whether a session token is valid without returning the payload.
 *
 * @param token - The raw cookie value
 * @param secret - The shared secret
 * @returns True if the session is valid
 */
export declare function isSessionValid(token: string | undefined, secret: string): boolean;
