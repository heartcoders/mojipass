/**
 * Color theme configuration for Mojipass.
 */
export interface ColorScheme {
    background?: string;
    foreground?: string;
    primary?: string;
    primaryForeground?: string;
    accent?: string;
    muted?: string;
    border?: string;
}
/**
 * A single emoji key on the keypad.
 * The value is the internal number it maps to.
 */
export interface EmojiKey {
    symbol: string;
    value: number;
}
/**
 * Full Mojipass configuration shape, parsed from mojipass.config.yml.
 */
export interface MojipassConfig {
    codeLength: number;
    keys: EmojiKey[];
    username: boolean;
    session: {
        secret: string;
        expiresInSeconds: number;
        cookieName: string;
    };
    credentials: {
        path: string;
    };
    colors?: ColorScheme;
    proxy?: {
        target: string;
    };
    /**
     * When set, only these path prefixes require authentication.
     * All other routes are publicly accessible.
     * Behaves like htaccess directory protection.
     *
     * When omitted, all routes require authentication (full gateway mode).
     *
     * @example ["/admin", "/dashboard", "/intern"]
     */
    protectedPaths?: string[];
}
/**
 * The subset of MojipassConfig that is safe to expose to the client.
 */
export type PublicConfig = Pick<MojipassConfig, 'codeLength' | 'username' | 'keys' | 'colors'>;
/**
 * A single credential entry from the credentials file.
 */
export interface Credential {
    username?: string;
    passwordHash: string;
}
/**
 * The parsed credentials file structure.
 */
export interface CredentialsFile {
    credentials: Credential[];
}
