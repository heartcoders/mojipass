import { Credential, MojipassConfig } from '../types/config.types';
/**
 * Converts an array of emoji values (numbers) into a string code.
 *
 * @param values - Array of numeric key values selected by the user
 * @returns A string representation of the code
 */
export declare function buildCodeString(values: number[]): string;
/**
 * Hashes a plaintext code using bcrypt for secure storage.
 *
 * @param plainCode - The plaintext code to hash
 * @returns A bcrypt hash of the code
 */
export declare function hashCode(plainCode: string): Promise<string>;
/**
 * Validates user input against stored credentials.
 *
 * @param inputCode - The code entered by the user as a joined string
 * @param inputUsername - Optional username entered by the user
 * @param credentials - List of stored credential entries
 * @param config - The Mojipass config (to check if username is required)
 * @returns True if a matching credential is found
 */
export declare function validateCredentials(inputCode: string, inputUsername: string | undefined, credentials: Credential[], config: Pick<MojipassConfig, 'username'>): Promise<boolean>;
