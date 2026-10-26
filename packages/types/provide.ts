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

/**
 * 表单容器可通过 provide/inject 下发的配置项
 * @description 这组配置既可作为 `CkFormContainer` 的 props，也可通过 `CkConfigProvider` 全局下发。
 * 单独定义在此处是为了让 `@ep-container-kit/constants` 能引用它而不必反向依赖 `@ep-container-kit/components`，
 * 从而保持包依赖为单向的 DAG（types ← constants ← utils ← components ← ep-container-kit）。
 */
export interface FormContainerProvideConfig {
  /**
   * 元素是否垂直布局，仅影响直接子元素的排列方式
   * @default false
   */
  vertical?: boolean;
  /**
   * 表单标签的宽度
   * @default 'auto'
   */
  labelWidth?: string | number;
  /**
   * 表单标签的位置
   * @default 'right'
   */
  labelPosition?: 'left' | 'right' | 'top';
  /**
   * 表单项最小宽度
   * @default 0
   */
  itemMinWidth?: string | number;
  /**
   * 表单项最大宽度
   */
  itemMaxWidth?: string | number;
}
