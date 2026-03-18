import { MaybeRef } from 'vue';
import { PublicConfig } from '../types/config.types';
type LoginStatus = 'idle' | 'loading' | 'error' | 'success';
/**
 * Manages the emoji code entry flow and submits credentials to the auth endpoint.
 *
 * Uses Nuxt's globalThis.$fetch when available (automatically prepends baseURL).
 * Falls back to native fetch with basePath prefix in standalone environments.
 *
 * @param config - The resolved Mojipass public config, accepts a plain object or a Ref
 * @param basePath - URL prefix for the native fetch fallback. Not used when Nuxt's $fetch is available.
 * @returns Reactive state and handlers for the login UI
 */
export declare function useLoginFlow(config: MaybeRef<Pick<PublicConfig, 'codeLength' | 'username'>>, basePath?: string): {
    username: import('vue').Ref<string, string>;
    filledCount: Readonly<import('vue').Ref<number, number>>;
    isDisabled: Readonly<import('vue').Ref<boolean, boolean>>;
    isCodeComplete: Readonly<import('vue').Ref<boolean, boolean>>;
    hasError: Readonly<import('vue').Ref<boolean, boolean>>;
    status: Readonly<import('vue').Ref<LoginStatus, LoginStatus>>;
    errorMessage: Readonly<import('vue').Ref<string, string>>;
    pressKey: (value: number) => void;
    deleteLastKey: () => void;
};
export {};
