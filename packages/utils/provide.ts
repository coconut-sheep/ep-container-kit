import type {
  ConfigProviderProvide,
  AnyRecord,
  ConfigProvideKey,
} from '@ep-container-kit/types';
import { computed, inject } from 'vue';
import { defineProp } from './object';
import { isNull, isUndefined } from './types';

/**
 * 处理提供属性值，用以生成 provide 函数所需要的函数值
 * @param getValue 返回数据源的惰性取值函数
 * @param propList 需要处理的属性列表
 * @example
 * ```ts
 * const getValue = () => ({
 *   prop1: 'value1',
 *   prop2: 'value2',
 * });
 * const provideValue = handleProvideValue(getValue, ['prop1', 'prop2']);
 * // {
 * //   prop1: computed(() => value.prop1 ?? undefined),
 * //   prop2: computed(() => value.prop2 ?? undefined),
 * // }
 *
 * // 与 vue 的 provide 函数结合使用
 * provide('provideKey', provideValue);
 * ```
 *
 * `getValue` 必须是一个惰性取值函数（而非直接传入数据对象），
 * 这样当数据源对象被延迟提供或被整体替换时，computed 仍能拿到最新值。
 */
export const handleProvideValue = <T extends AnyRecord, K extends keyof T>(
  getValue: () => Partial<T>,
  propList: K[],
) => {
  return propList.reduce<ConfigProviderProvide<T>>((result, prop) => {
    return {
      ...result,
      ...defineProp(
        prop,
        computed(() => getValue()[prop] ?? undefined),
      ),
    };
  }, {} as ConfigProviderProvide<T>);
};

/**
 * 处理注入的属性值，优先级为 组件实际值 > 注入值 > 组件默认值
 * @param options 处理选项
 * @param options.injectValue 注入的属性值
 * @param options.defaultValue 组件默认的属性值
 * @param options.componentValue 组件当前使用的属性值
 * @param options.propList 属性列表
 *
 * @example
 * ```ts
 * // 与 vue 的 inject 函数结合使用
 * const _inject = inject<ConfigProviderProvide<FormContainerProvideConfig>>(
 *   FORM_PROVIDER,
 *   {},
 * );
 * // 假设已经是计算完的结果
 * // {
 * //   vertical: computed(() => false),
 * //   labelWidth: computed(() => undefined),
 * //   labelPosition: computed(() => 'top'),
 * // }
 *
 * const result = handleInjectValue({
 *   injectValue: _inject,
 *   defaultValue: { vertical: false, labelWidth: '100px', labelPosition: 'left' },
 *   componentValue: { vertical: true, labelWidth: undefined, labelPosition: undefined },
 *   propList: ['vertical', 'labelWidth', 'labelPosition'],
 * });
 * // { vertical: true, labelWidth: '100px', labelPosition: 'top' }
 * ```
 */
export const handleInjectValue = <T extends AnyRecord = AnyRecord>(options: {
  injectValue: Partial<ConfigProviderProvide<T>>;
  defaultValue: Partial<T>;
  componentValue: Partial<T>;
  propList: (keyof T)[];
}) => {
  const { injectValue, defaultValue, componentValue, propList } = options;
  let result: T = {} as T;

  propList.forEach((prop) => {
    // 如果组件显式传入了该属性（非 null/undefined），优先使用组件当前值
    if (!isNull(componentValue[prop]) && !isUndefined(componentValue[prop])) {
      result = {
        ...result,
        ...defineProp(prop, componentValue[prop]),
      };
      return;
    }

    const injected = injectValue[prop];

    // 如果没有注入该属性，直接使用默认值
    if (!injected) {
      result = {
        ...result,
        ...defineProp(prop, defaultValue[prop]),
      };
      return;
    }

    // 如果注入的属性为 undefined，直接使用默认值
    if (isUndefined(injected.value)) {
      result = {
        ...result,
        ...defineProp(prop, defaultValue[prop]),
      };
      return;
    }

    // 使用注入的属性值
    result = {
      ...result,
      ...defineProp(prop, injected.value),
    };
  });

  return result;
};

/**
 * 构建 inject 函数，自动处理默认值
 * @param key 提供 key 值，用于 `inject` 函数
 * @param defaultValue 默认值，用于 `inject` 函数，若未提供则使用空对象
 */
export const buildProviderInject = <T extends AnyRecord>(
  key: ConfigProvideKey<T>,
  defaultValue?: T,
) => {
  return inject<Partial<ConfigProviderProvide<T>>>(
    key,
    defaultValue ?? ({} as T),
  );
};
