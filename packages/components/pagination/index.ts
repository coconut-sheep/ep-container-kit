import { withInstall } from '@ep-container-kit/utils';
import PaginationVue from './src/pagination.vue';

export const CkPagination = withInstall(PaginationVue);

export {
  getDefaultPaginationConfig,
  getComponentDefaultProps,
} from './src/pagination';

export type {
  PaginationConfig,
  PaginationEmits,
  PaginationLayout,
  PaginationProps,
} from './src/pagination';

export default CkPagination;
