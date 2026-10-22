import type {
  AnyRecord,
  AnyValue,
  PickFunction,
} from '@ep-container-kit/types';
import { isFunction, isObject } from '@ep-container-kit/utils';
import type { Ref } from 'vue';

/**
 * 用于从Element Plus的组件中获取其props的默认值，当属性不存在默认值时，返回的对象中不会包含该属性
 * @param props 组件的props对象
 * @param [useUndefined = false] 当prop的默认值不存在时，是否使用undefined作为默认值
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

/**
 * 获取某个ref对象的暴露的属性
 * @param ref ref对象
 * @example
 * ```ts
 * const formRef = ref<FormInstance>();
 * const formExpose = getRefExpose(formRef); // { validate: (callback?: FormValidateCallback) => Promise<void>, resetFields: (props?: Arrayable<FormItemProp> | undefined) => void, ... }
 * ```
 */
export const getRefExpose = (ref: Ref) => {
  return new Proxy(
    {},
    {
      get(_target, key) {
        const value = ref?.value?.[key];
        return isFunction(value) ? value.bind(ref?.value) : value;
      },
      has(_target, key) {
        if (!ref) {
          return false;
        }
        if (!ref.value) {
          return false;
        }
        return Object.hasOwn(ref.value, key);
      },
    },
  );
};

/**
 * 获取某个ref对象的暴露的属性 手动指定属性，仅限方法
 * @param ref ref对象
 * @param props 要获取的属性列表
 * @example
 * ```ts
 * const formRef = ref<FormInstance>();
 * const formExpose = getRefExposeManuel(formRef, ['validate']); // { validate: (callback?: FormValidateCallback) => Promise<void> }
 * ```
 */
export const getRefExposeManuel = <T extends AnyRecord>(
  ref: Partial<Ref<T>>,
  props: (keyof PickFunction<T>)[],
) => {
  return Object.fromEntries(
    props.map((name) => [
      name,
      (...args: AnyValue[]) => (ref.value as AnyRecord)?.[name]?.(...args),
    ]),
  );
};
