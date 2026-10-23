import type { AnyRecord } from '@ep-container-kit/types';
import { isNull, isUndefined } from '@ep-container-kit/utils/types.ts';

/**
 * 选择源对象中指定的键，返回新对象。
 * @param source 原对象
 * @param keys 要选择的键数组
 */
export const pickEntryProps = <T extends AnyRecord, K extends keyof T>(
  source: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = source[key];
  }
  return result;
};

/**
 * 移除源对象中指定的键，返回新对象。
 * @param source 原对象
 * @param keys 要删除的键数组
 */
export const omitEntryProps = <T extends AnyRecord, K extends keyof T>(
  source: T,
  keys: K[],
): Omit<T, K> => {
  const result = { ...source };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

/**
 * 仅在值已定义时生成单个属性，便于构造精确可选字段对象。
 * 与直接写入 `undefined` 相比，这种方式能保留“字段缺失”的协议语义。
 * @param key 属性名
 * @param value 属性值
 * @param [useUndefined = false] 是否允许undefined值
 */
export const defineProp = <K extends PropertyKey, V>(
  key: K,
  value: V,
  useUndefined: boolean = false,
): Partial<Record<K, Exclude<V, undefined>>> => {
  if (!useUndefined && isUndefined(value)) {
    return {};
  }
  return { [key]: value } as Partial<Record<K, Exclude<V, undefined>>>;
};

/**
 * 过滤对象中值为 null/undefined 的字段，返回新对象。
 * 显式传入的 null/undefined 会被视为“未提供”，与 defineProp 保持一致。
 * @param source 原对象
 */
export const filterNullishProps = <T extends AnyRecord>(
  source: T,
): Partial<T> => {
  const result = {} as Partial<T>;
  for (const key of Object.keys(source) as (keyof T)[]) {
    const value = source[key];
    if (!isNull(value) && !isUndefined(value)) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * 检查对象是否包含指定属性（包括继承属性）。
 * @param obj 要检查的对象
 * @param prop 要检查的属性名
 */
export const hasProp = (obj: AnyRecord, prop: PropertyKey) => {
  return Object.hasOwn(obj, prop);
};
