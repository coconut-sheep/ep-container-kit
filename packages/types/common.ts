import type { AnyValue } from './tools';

/**
 * 基本编码项
 */
export interface CodeItem<V extends AnyValue = AnyValue> {
  /**
   * 编码标签
   */
  label: string;

  /**
   * 编码值
   */
  value: V;
}

/**
 * 字典编码项
 */
export interface DictItem<V extends AnyValue = AnyValue> extends CodeItem<V> {
  /**
   * 排序
   */
  sort?: number;
  /**
   * 是否隐藏
   */
  hidden?: boolean;
}

/**
 * 枚举编码项，允许拓展其他属性，注意不是TS的枚举类型
 * @description 与 `CodeItem` 结构一致，单独命名用于区分语义
 */
export type EnumItem<V extends AnyValue = AnyValue> = CodeItem<V>;
