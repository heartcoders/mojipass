import { MaybeRefOrGetter } from 'vue';
import { ColorScheme } from '../types/config.types';
/**
 * Reactively applies user-defined color overrides from config to the document root.
 * Accepts a plain value, a Ref, or a getter — re-applies whenever the value changes.
 *
 * @param colors - Optional color overrides from mojipass.config.yml
 */
export declare function useColorScheme(colors: MaybeRefOrGetter<ColorScheme | undefined>): void;
