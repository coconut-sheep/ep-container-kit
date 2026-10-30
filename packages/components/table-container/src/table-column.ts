import type {
  AnyRecord,
  ComponentProps,
  ComponentSlots,
} from '@ep-container-kit/types';
import { ElTableColumn } from 'element-plus';

/**
 * 表格列的Props
 */
export interface TableColumnProps<
  T extends AnyRecord = AnyRecord,
> extends Partial<ComponentProps<typeof ElTableColumn>> {
  /**
   * 属性，表示从数据源对象的哪个属性中取值，同时用于ElTableColumn的prop属性
   * @description 当该值为 truthy 时，模板中名为 `slot_${prop}` 的插槽有效，且优先级最高，会覆盖默认插槽的其它来源
   */
  prop?: string | Extract<keyof T, string>;
  /**
   * 是否隐藏 与v-if一致，控制ElTableColumn
   * @default false
   */
  hidden?: boolean;
}

/**
 * 表格列的类型
 */
export interface TableColumnItem<
  T extends AnyRecord = AnyRecord,
> extends TableColumnProps<T> {
  /**
   * 插槽
   */
  slots?: TableColumnSlots<T>;
}

/**
 * 表格列的各插槽类型
 */
export type TableColumnSlots<T extends AnyRecord = AnyRecord> = ComponentSlots<
  typeof ElTableColumn<T>
>;
