/**
 * Loads the public Mojipass config.
 *
 * Resolution order:
 * 1. window.__MOJIPASS_CONFIG__ (standalone server mode)
 * 2. GET {basePath}/api/mojipass/config (library/Nuxt mode)
 * 3. Built-in defaults (fallback)
 *
 * @param basePath - URL prefix to prepend to all API calls. Pass `useRuntimeConfig().app.baseURL` in Nuxt apps deployed at a sub-path.
 * @returns Reactive config, loading state, and error state
 */
export declare function useMojipassConfig(basePath?: string): {
    config: Readonly<import('vue').Ref<{
        readonly codeLength: number;
        readonly username: boolean;
        readonly keys: readonly {
            readonly symbol: string;
            readonly value: number;
        }[];
        readonly colors?: {
            readonly background?: string | undefined;
            readonly foreground?: string | undefined;
            readonly primary?: string | undefined;
            readonly primaryForeground?: string | undefined;
            readonly accent?: string | undefined;
            readonly muted?: string | undefined;
            readonly border?: string | undefined;
        } | undefined;
    }, {
        readonly codeLength: number;
        readonly username: boolean;
        readonly keys: readonly {
            readonly symbol: string;
            readonly value: number;
        }[];
        readonly colors?: {
            readonly background?: string | undefined;
            readonly foreground?: string | undefined;
            readonly primary?: string | undefined;
            readonly primaryForeground?: string | undefined;
            readonly accent?: string | undefined;
            readonly muted?: string | undefined;
            readonly border?: string | undefined;
        } | undefined;
    }>>;
    isLoading: Readonly<import('vue').Ref<boolean, boolean>>;
    hasError: Readonly<import('vue').Ref<boolean, boolean>>;
};
