import { buildComponentName } from '@ep-container-kit/constants';
import type { TableColumnItem } from './table-column';
import type { TableContainerProvideConfig } from './provide';
import type {
  AnyRecord,
  BaseDefaultPropsHolder,
  BaseDefaultPropsSource,
} from '@ep-container-kit/types';

export const COMPONENT_NAME = buildComponentName('TableColumnSchema');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsHolder<TableColumnSchemaProps> =
  {};

export const COMPONENT_DEFAULT_PROPS: BaseDefaultPropsSource<TableColumnSchemaProps> =
  {
    schema: (): TableColumnItem[] => {
      return [];
    },
    columnProps: (): TableContainerProvideConfig => {
      return {};
    },
  };

/**
 * 表格列Schema的props
 * @description 刻意不把 `ElTableColumn` 的 props 平铺到本组件上，原因有二：
 * 1. `@vue/compiler-sfc` 无法从 `ComponentProps<typeof ElTableColumn>` 这类
 * 泛型 SFC 的条件类型里展开出运行时 props 声明，平铺写法会直接编译失败
 * 2. 平铺后所有 Boolean prop 都会在缺席时被 Vue 隐式补成 `false`，
 * 反而盖掉 `ElTableColumn` 自己的默认值。收进 `columnProps` 后这两个问题都不存在
 */
export interface TableColumnSchemaProps<
  T extends AnyRecord = AnyRecord,
> {
  /**
   * schema配置
   * @description 每项会被渲染成一个 `ElTableColumn`
   */
  schema?: TableColumnItem<T>[];
  /**
   * 所有列共享的默认属性
   * @description 会与每一项自身属性合并后一起交给 `ElTableColumn`，
   * 优先级：`schema 项` > `columnProps` > `注入值（CkConfigProvider 的 tableContainer）`
   */
  columnProps?: TableContainerProvideConfig;
}

/**
 * 表格列Schema的Item
 */
export type TableColumnSchemaItem<T extends AnyRecord = AnyRecord> =
  TableColumnSchemaProps<T>;
