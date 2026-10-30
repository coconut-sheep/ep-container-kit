import type { TableColumnProps } from './table-column';
import type { AnyValue, ConfigProvideKey } from '@ep-container-kit/types';
import { getPropsKeys } from '@ep-container-kit/utils';
import { ElTableColumn } from 'element-plus';

/**
 * 表格列可以通过 provide/inject 下发的配置
 * @description 即「所有列共享的属性」，有两个入口会提供它：
 * 1. `CkConfigProvider` 的 `tableContainer`，通过 provide 下发到其下所有 `CkTableColumnSchema`
 * 2. `CkTableColumnSchema` 自己的 `columnProps`
 * @description 优先级：`组件 columnProps` > `注入值` > `默认值`
 */
export type TableContainerProvideConfig = Omit<
  TableColumnProps,
  'prop' | 'property' | 'label' | 'hidden'
>;

/**
 * 表格列配置的 Provide 注入 Key
 * @description 由 `CkConfigProvider` 提供，`CkTableColumnSchema` 消费
 */
export const TABLE_CONTAINER_PROVIDER: ConfigProvideKey<TableContainerProvideConfig> =
  Symbol('tableContainerProvider');

/**
 * 表格列配置的 key 列表
 * @description 只有列在此处的配置项才会被 provide/inject 处理，新增配置项时需要同步维护
 * @description `prop` / `property` / `label` / `hidden` 是「每列各自不同」的属性，
 * 共享成默认值没有意义，因此排除在外
 */
export const TABLE_CONTAINER_PROVIDE_KEYS: (keyof TableContainerProvideConfig)[] =
  getPropsKeys(
    // `ElTableColumn` 是「带泛型参数的 SFC」，vue-tsc 给它生成的类型是调用签名（函数），
    // 类型上没有 `props` 字段（`ElForm` 那种 class 形状的才有），但运行时组件对象上确实有，
    // 因此按运行时形状断言一次，把这一处类型缺口收在调用点
    (ElTableColumn as unknown as { props: AnyValue }).props,
    ['prop', 'property', 'label', 'hidden'],
    false,
  );
