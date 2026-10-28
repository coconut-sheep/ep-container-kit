import { buildComponentName } from '@ep-container-kit/constants';
import type {
  BaseDefaultPropsSource,
  TuplesToEmits,
} from '@ep-container-kit/types';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';

export const COMPONENT_NAME = buildComponentName('PaginationLoadMore');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsSource<PaginationLoadMoreProps> =
  {
    loading: undefined,
    disabled: undefined,
  };

export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<PaginationLoadMoreProps>({
    loaded: 0,
    total: 0,
    loading: false,
    disabled: false,
  });

/**
 * PaginationLoadMore 的 Props 类型
 * @description 该组件只负责渲染 `loadMore` 布局片段，状态全部由 Pagination 计算好再传入，
 * 自身不持有状态，也不读取 Pagination 的 provide / inject
 */
export type PaginationLoadMoreProps = {
  /**
   * 已加载条数
   * @default 0
   */
  loaded?: number;
  /**
   * 数据总条数
   * @default 0
   */
  total?: number;
  /**
   * 是否处于加载中
   * @description 为 `true` 时按钮呈现 loading，且不可点击
   * @default false
   */
  loading?: boolean;
  /**
   * 是否禁用
   * @description 由 Pagination 汇总 `disabled` 与 `loading` 后传入，为 `true` 时按钮不可点击
   * @default false
   */
  disabled?: boolean;
};

/**
 * PaginationLoadMore 的 Emits 类型
 * @description 使用元组形式而非映射类型，避免 @vue/compiler-sfc 解析 `defineEmits<T>()` 时递归
 */
export type PaginationLoadMoreEmitsTuple = {
  /**
   * 点击「加载更多」时触发
   * @description 已禁用或已无更多数据时不会触发
   */
  loadMore: [];
};

/**
 * PaginationLoadMore 的 Emits 类型
 */
export type PaginationLoadMoreEmits =
  TuplesToEmits<PaginationLoadMoreEmitsTuple>;
