import type { AnyRecord, AnyValue } from '@ep-container-kit/types';
import { isObject } from './types';

/**
 * 用于从 Element Plus 的组件中获取其 props 的默认值，当属性不存在默认值时，返回的对象中不会包含该属性
 * @param props 组件的 props 对象
 * @param [useUndefined = false] 当 prop 的默认值不存在时，是否使用 undefined 作为默认值
 * @example
 * ```ts
 * import { ElForm } from 'element-plus';
 * const formDefaultProps = getPropsDefaultValue(ElForm.props); // { labelPosition: 'right', inline: false, ... }
 * ```
 */
export const getPropsDefaultValue = (
  props: AnyValue,
  useUndefined: boolean = false,
) => {
  const defaultProps: AnyRecord = {};
  for (const [key, value] of Object.entries(props)) {
    if (!value || !isObject(value)) {
      if (useUndefined) {
        defaultProps[key] = undefined;
      }
      continue;
    }
    if (!Object.hasOwn(value, 'default')) {
      if (useUndefined) {
        defaultProps[key] = undefined;
      }
      continue;
    }
    defaultProps[key] = value.default;
  }
  return defaultProps;
};
