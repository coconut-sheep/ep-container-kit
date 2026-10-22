import type { AnyRecord } from '@ep-container-kit/types';

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
 */
export const defineProp = <K extends PropertyKey, V>(
  key: K,
  value: V,
): Partial<Record<K, Exclude<V, undefined>>> => {
  if (value === undefined) {
    return {};
  }
  return { [key]: value } as Partial<Record<K, Exclude<V, undefined>>>;
};
