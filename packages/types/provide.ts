import type { ComputedRef, InjectionKey } from 'vue';
import type { AnyRecord } from './tools';

/**
 * 通过 provide 下发的配置项的类型
 */
export type ConfigProvideKey<T extends AnyRecord> = InjectionKey<
  Partial<ConfigProviderProvide<T>>
>;

/**
 * 通过 provide 下发的配置对象
 * @description 每一项都被包装为 `ComputedRef`，保证注入方可响应式地跟随提供方的变化
 * @template T 原始配置对象的类型
 * @example
 * ```ts
 * interface FormConfig { vertical?: boolean; labelWidth?: string }
 * type type1 = ConfigProviderProvide<FormConfig>;
 * // { vertical: ComputedRef<boolean | undefined>, labelWidth: ComputedRef<string | undefined> }
 * ```
 */
export type ConfigProviderProvide<T extends AnyRecord> = {
  [K in keyof T]: ComputedRef<T[K]>;
};
