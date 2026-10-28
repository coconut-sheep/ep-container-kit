import { type Ref } from 'vue';
import type {
  AnyFunction,
  AnyRecord,
  AnyValue,
  PickFunction,
} from '@ep-container-kit/types';
import { isFunction } from './types';
import { defineProp } from './object';

/**
 * 获取某个 ref 对象所暴露的属性（代理转发，方法自动绑定 this）
 * @description 常用于 `defineExpose(getRefExpose(formRef))`，把内部 Element Plus 实例的方法原样透出。
 * 返回值类型直接取 `T`，从而让 `defineExpose` 在父组件侧保留完整的方法签名。
 * @param ref 持有组件实例的 ref 对象
 * @example
 * ```ts
 * const formRef = useTemplateRef<FormInstance>('formRef');
 * defineExpose(getRefExpose(formRef));
 * // 父组件拿到的是完整的 FormInstance，可直接 formRef.value.validate()
 * ```
 */
export const getRefExpose = <T extends AnyRecord = AnyRecord>(ref: {
  value: T | null | undefined;
}): T => {
  return new Proxy({} as T, {
    get(_target, key) {
      const instance = ref?.value as AnyRecord | null | undefined;
      const value = instance?.[key as string];
      return isFunction(value) ? value.bind(instance) : value;
    },
    has(_target, key) {
      const instance = ref?.value as AnyRecord | null | undefined;
      if (!instance) {
        return false;
      }
      return Object.hasOwn(instance, key);
    },
  });
};

/**
 * 获取某个 ref 对象暴露的属性，手动指定属性列表，仅限方法
 * @param ref ref 对象
 * @param props 要获取的方法名列表
 * @example
 * ```ts
 * const formRef = ref<FormInstance>();
 * const formExpose = getRefExposeManuel(formRef, ['validate']);
 * // { validate: (callback?: FormValidateCallback) => Promise<void> }
 * ```
 */
export const getRefExposeManuel = <T extends AnyRecord>(
  ref: Partial<Ref<T>>,
  props: (keyof PickFunction<T>)[],
) => {
  return Object.fromEntries(
    props.map((name) => [
      name,
      (...args: AnyValue[]) =>
        (ref.value as AnyRecord | undefined)?.[name as string]?.(...args),
    ]),
  );
};

/**
 * 构建 props 的默认值
 * @description 把 {@link BaseDefaultPropsSource} 的「源形态」求值成「裸值形态」：工厂函数在此调用，
 * 原始值原样透传。**必须在实例作用域内调用**（组件 `setup` 顶层），每个实例拿到各自的对象；
 * 若在模块顶层调用，工厂结果会成为跨实例共享的单例
 * @param props 组件的 props 定义对象
 */
export const buildPropsDefaultValues = <T extends AnyRecord>(props: {
  [K in keyof T]: T[K] | AnyFunction;
}): T => {
  let result: T = {} as T;
  for (const [key, value] of Object.entries(props)) {
    if (!isFunction(value)) {
      result = {
        ...result,
        ...defineProp(key, value),
      };
      continue;
    }

    result = {
      ...result,
      ...defineProp(key, value()),
    };
  }

  return result;
};
