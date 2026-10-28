import type { AnyRecord, AnyValue } from '@ep-container-kit/types';
import { isArray, isObject, isUndefined } from './types';

/**
 * 从组件 props 定义中提取出的两份默认值
 * @description 二者的差别只体现在「Boolean 类型且没有默认值」的 props 上：
 * `defaultProps` 里不会出现它们（本就没有默认值可言），`holderProps` 里则显式写成 `undefined`
 */
export type PropsDefaultValue = {
  /**
   * 声明了默认值的 props：属性名 → 默认值
   * @description 默认值原样返回，工厂函数不会被求值，交由 `buildPropsDefaultValues` 统一处理。
   * 用于组件的 `COMPONENT_DEFAULT_PROPS`
   */
  defaultProps: AnyRecord;
  /**
   * 未声明默认值的 Boolean props：属性名 → `undefined`
   * @description 用于组件的 `COMPONENT_DEFAULT_PROPS_HOLDER`，即 `withDefaults` 的第二个参数。
   * Vue 对 Boolean 的隐式缺省只在「未传入 **且** 未声明 `default`」时才补 `false`；
   * 显式声明 `default: undefined` 后，未传入时保持 `undefined`，可被 `filterNullishProps` 过滤掉，
   * 不再冒充「调用方显式传了 false」去盖掉组件默认值与上层注入值
   */
  holderProps: AnyRecord;
};

/**
 * 判断 prop 声明的类型是否包含 Boolean
 * @description `type` 既可能是构造函数（`{ type: Boolean }`），也可能是构造函数数组（`{ type: [Boolean, String] }`）
 * @param type prop 声明中的 `type` 字段
 */
const isBooleanType = (type: AnyValue): boolean => {
  if (isArray(type)) {
    return type.includes(Boolean);
  }
  return type === Boolean;
};

/**
 * 从组件（通常是 Element Plus 组件）的 props 定义中提取默认值，并按用途拆成 `defaultProps` / `holderProps` 两份
 * @description 与「只读 `default` 字段」的做法相比，关键差异是 **无默认值的 Boolean props 也会被显式取出**，
 * 并以 `undefined` 落在 `holderProps` 里。这类 prop 一旦缺席，Vue 会把 `undefined` 隐式补成 `false`，
 * 于是「调用方没传」被伪装成「调用方传了 `false`」，反过来盖掉组件自己的默认值与上层注入值。
 * 用 `holderProps` 声明 `default: undefined`，缺席时才保持 `undefined`
 * @description `default: undefined` 与「没写 `default`」视为同一种情况：都算未声明默认值
 * @param props 组件的 props 定义对象，如 `ElForm.props`
 * @example
 * ```ts
 * const { defaultProps, holderProps } = getPropsDefaultValue(ElForm.props);
 * // defaultProps: { labelPosition: 'right', labelWidth: '', showMessage: true, ... }
 * // holderProps:  { disabled: undefined, inline: undefined, hideRequiredAsterisk: undefined, ... }
 * ```
 */
export const getPropsDefaultValue = (props: AnyValue): PropsDefaultValue => {
  const defaultProps: AnyRecord = {};
  const holderProps: AnyRecord = {};

  for (const [key, value] of Object.entries(props)) {
    // 简写形态（`disabled: Boolean`）在运行时就是构造函数本身，统一补成 `{ type }`
    const prop = isObject(value) ? value : { type: value };
    const defaultValue = prop.default;

    if (Object.hasOwn(prop, 'default') && !isUndefined(defaultValue)) {
      defaultProps[key] = defaultValue;
      continue;
    }

    if (isBooleanType(prop.type)) {
      holderProps[key] = undefined;
    }
  }

  return { defaultProps, holderProps };
};
