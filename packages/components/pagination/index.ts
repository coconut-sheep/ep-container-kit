import { withInstall } from '@ep-container-kit/utils';
import PaginationVue from './src/pagination.vue';

export const CkPagination = withInstall(PaginationVue);

export { getDefaultPaginationConfig } from './src/pagination';

export type {
  PaginationProps,
  PaginationConfig,
  PaginationEmits,
  PaginationLayout,
} from './src/pagination';

export type {
  PaginationLoadMoreEmits,
  PaginationLoadMoreEmitsTuple,
  PaginationLoadMoreProps,
} from './src/pagination-loadmore';

export default CkPagination;
