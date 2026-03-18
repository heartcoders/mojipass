import { MojipassConfig, CredentialsFile } from '../types/config.types';
/**
 * Loads and parses the Mojipass config file.
 *
 * @param configPath - Absolute or relative path to mojipass.config.yml
 * @returns Parsed and merged config with defaults applied
 * @throws {Error} If the config file cannot be read or parsed
 */
export declare function loadConfig(configPath?: string): MojipassConfig;
/**
 * Loads and parses the hashed credentials file.
 *
 * @param credentialsPath - Path to the credentials.hash.yml file
 * @returns Parsed credentials list
 * @throws {Error} If the credentials file cannot be read or parsed
 */
export declare function loadCredentials(credentialsPath: string): CredentialsFile;
