import { withInstall } from '@ep-container-kit/utils';
import TableContainerVue from './src/table-container.vue';
import TableColumnSchemaVue from './src/table-column-schema.vue';

/**
 * 表格容器
 */
export const CkTableContainer = withInstall(TableContainerVue);

/**
 * 表格列的Schema
 */
export const CkTableColumnSchema = withInstall(TableColumnSchemaVue);

export type {
  TableContainerProps,
  TableContainerSlots,
} from './src/table-container';

export type {
  TableColumnSlots,
  TableColumnProps,
  TableColumnItem,
} from './src/table-column';

export type {
  TableColumnSchemaProps,
  TableColumnSchemaItem,
} from './src/table-column-schema';

export {
  type TableContainerProvideConfig,
  TABLE_CONTAINER_PROVIDER,
  TABLE_CONTAINER_PROVIDE_KEYS,
} from './src/provide';

export default CkTableContainer;
