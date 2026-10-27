import { withInstall } from '@ep-container-kit/utils';
import PaginationVue from './src/pagination.vue';

export const CkPagination = withInstall(PaginationVue);

export { getDefaultPaginationConfig } from './src/pagination';

export type {
  PaginationProps,
  PaginationEmits,
  PaginationEmitsTuple,
  PaginationLayout,
  PaginationConfig,
} from './src/pagination';

export type {
  PaginationLoadMoreProps,
  PaginationLoadMoreEmits,
  PaginationLoadMoreEmitsTuple,
} from './src/pagination-loadmore';

export default CkPagination;
