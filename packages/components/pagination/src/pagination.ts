import { buildComponentName } from '@ep-container-kit/constants';
import {
  type PaginationProps as ElPaginationProps,
  ElPagination,
} from 'element-plus';
import {
  getPropsDefaultValue,
  isNumber,
  omitEntryProps,
} from '@ep-container-kit/utils';
import type {
  BaseDefaultPropsHolder,
  BaseDefaultPropsSource,
  TuplesToEmits,
} from '@ep-container-kit/types';

/**
 * Pagination 的组件名
 */
export const COMPONENT_NAME = buildComponentName('Pagination');

/**
 * ElPagination 中在本组件无效的 Props
 * @see InvalidPropKey
 */
export const INVALID_PROPS: InvalidPropKey[] = [
  // 直接移除
  'defaultCurrentPage',
  'defaultPageSize',
  'hideOnSinglePage',
  'small',
  'size',
  'pageCount',
  // 整合进 PaginationConfig
  'currentPage',
  'pageSize',
  'pageSizes',
  'total',
  'layout',
];

/**
 * ElPagination 的默认值，已按用途拆成「真实默认值」与「布尔占位」两份
 */
const EL_DEFAULT_PROPS = getPropsDefaultValue(ElPagination.props);

/**
 * 需要从 ElPagination 默认值中剔除的键
 * @description 无效 props 见 {@link INVALID_PROPS}；两个图标 prop 的默认值是图标组件本身，
 * 由组件内部按 `??` 兜底（见 pagination.vue 的 `prevIcon` / `nextIcon`），不参与默认值合并
 */
const OMIT_DEFAULT_PROPS_KEYS = [...INVALID_PROPS, 'prevIcon', 'nextIcon'];

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsHolder<PaginationProps> =
  {
    // ElPagination 中无默认值的 Boolean props：缺席时保持 undefined 而非被 Vue 补成 false，
    // 否则 `background` 这类由 COMPONENT_DEFAULT_PROPS 显式给值的项会被 false 盖掉
    ...omitEntryProps(EL_DEFAULT_PROPS.holderProps, OMIT_DEFAULT_PROPS_KEYS),
    compact: undefined,
    stream: undefined,
    loading: undefined,
  };

export const COMPONENT_DEFAULT_PROPS: BaseDefaultPropsSource<PaginationProps> =
  {
    ...omitEntryProps(EL_DEFAULT_PROPS.defaultProps, OMIT_DEFAULT_PROPS_KEYS),
    background: true,
    compact: false,
    stream: false,
    loaded: 0,
    loading: false,
  };

/**
 * ElPagination中当前组件不再适用的属性，已被使用替代方案实现或被整合
 * - `defaultCurrentPage`、`defaultPageSize`、`hideOnSinglePage`、`size`、`pageCount` 不再适用，已使用替代方案实现
 * - `small` 官方已经不推荐使用
 * - `currentPage`、`pageSize`、`pageSizes`、`total`、`layout` 已被整合到 PaginationConfig类型中
 * - 其中 `layout` 由字符串转为字符串数组
 * @see PaginationConfig
 */
export type InvalidPropKey =
  | 'defaultCurrentPage'
  | 'defaultPageSize'
  | 'hideOnSinglePage'
  | 'small'
  | 'size'
  | 'pageCount'
  | 'currentPage'
  | 'pageSize'
  | 'pageSizes'
  | 'total'
  | 'layout';

/**
 * Pagination 的 Props 类型
 * @description 其中 `currentPage`、`pageSize`、`pageSizes`、`total`、`layout` 被整合到modelValue的类型`PaginationConfig`中
 * @description 其中 `defaultCurrentPage`、`defaultPageSize`、`hideOnSinglePage`、`small`、`size`、`pageCount` 属性被移除
 * @see PaginationConfig
 * @see InvalidPropKey
 */
export type PaginationProps = {
  /**
   * 是否启用紧凑形态
   * @default false
   * @see PaginationLayout
   */
  compact?: boolean;
  /**
   * 是否为流式加载
   * @default false
   * @see PaginationLayout
   */
  stream?: boolean;
  /**
   * 已加载条数
   * @description 作为 `loadMore` 片段中「已加载 / 总数量」的已加载一方
   * @see PaginationLayout
   * @default 0
   */
  loaded?: number;
  /**
   * 加载中状态
   */
  loading?: boolean;
} & Partial<Omit<ElPaginationProps, InvalidPropKey>>;

/**
 * 分页器的布局片段
 * @description 取值与 Element Plus 的 `layout` 基本一致，按数组顺序从左到右渲染，不去重也不排序
 * - `slot` 片段不再适用，已被本组件内部占用（承载 `loadMore`），不再对外暴露，因此不在取值范围内
 * - `loadMore` 是本组件新增的片段，一个片段内固定包含「加载更多按钮」与 「已加载 / 总数量」两部分，二者不拆成两个片段
 * @description 各片段与props的相性：
 * @description `compact` 为 `true` 时：
 * - `pager` 只显示当前页码；
 * - `sizes` 会转化成类似ElInputNumber的左加右减的样式；
 * - `->` 不可用或不生效
 * @description `stream` 为 `true` 时：
 * - `prev`、`pager`、`next`、`jumper`、`total` 不可用或不生效
 * @description `stream` 为 `false` 时：
 * - `loadMore` 不可用或不生效
 */
export type PaginationLayout =
  'total' | 'sizes' | 'prev' | 'pager' | 'next' | 'jumper' | '->' | 'loadMore';

/**
 * 分页配置对象
 */
export interface PaginationConfig {
  /**
   * 当前页码
   */
  currentPage: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 每页条数的可选项
   * @description 不会被自动去重或排序，请自行保证每一项唯一且升序
   */
  pageSizes: number[];
  /**
   * 数据总条数
   */
  total: number;
  /**
   * 布局片段
   * @description 不会被自动去重，重复的标签会重复渲染
   * @see PaginationLayout
   */
  layout: PaginationLayout[];
}

/**
 * Pagination 的 Emits 类型
 */
export type PaginationEmitsTuple = {
  /**
   * 页码或每页条数变更后触发
   * @description 在 `nextTick` 中派发，此时 `v-model` 绑定的配置对象已经是最新值
   */
  change: [config: PaginationConfig];
  /**
   * 点击「加载更多」时触发
   * @description 仅在 `stream` 为 `true`、`loaded < total`，
   * 且未处于加载中（`loading` 为 `false`）、未被禁用时可能触发
   */
  loadMore: [];
};

/**
 * Pagination 的 Emits 类型
 */
export type PaginationEmits = TuplesToEmits<PaginationEmitsTuple>;

/**
 * 获取默认的分页配置
 * @description 供调用方构造分页配置的初始值，避免每处都手写一遍字段
 * @description 默认布局同时写了 `loadMore` 与 `total`，二者互斥生效：`stream` 为 `true` 时 `total` 被剔除，
 * 否则 `loadMore` 被剔除，因此同一份配置在两种形态下都能直接用
 * @param config - 自定义分页配置对象，用以覆盖默认值
 * @example
 * ```ts
 * const pagination = getDefaultPaginationConfig();
 * // {
 * //   currentPage: 1,
 * //   pageSize: 10,
 * //   pageSizes: [10, 20, 50, 100, 200, 500],
 * //   total: 0,
 * //   layout: ['sizes', 'prev', 'pager', 'next', 'jumper', 'loadMore', 'total'],
 * // }
 *
 * const pagination = getDefaultPaginationConfig({ pageSize: 20 });
 * // {
 * //   currentPage: 1,
 * //   pageSize: 20,
 * //   pageSizes: [10, 20, 50, 100, 200, 500],
 * //   total: 0,
 * //   layout: ['sizes', 'prev', 'pager', 'next', 'jumper', 'loadMore', 'total'],
 * // }
 * ```
 */
export const getDefaultPaginationConfig = (
  config?: Partial<PaginationConfig>,
): PaginationConfig => {
  return {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100, 200, 500],
    layout: ['sizes', 'prev', 'pager', 'next', 'jumper', 'loadMore', 'total'],
    ...config,
  };
};

/**
 * 处理layout片段
 * @description 按 `compact`、`stream` 剔除当前形态下无效的片段，不去重，也不排序
 * @description `stream` 与 `compact` 相互独立：`loadMore` 在两种形态下都有效，只有 `->` 受 `compact` 限制
 * @description 剔除规则（取并集）：
 * - `stream` 为 `true`：剔除 `pager`、`prev`、`next`、`jumper`、`total`，翻页与计数统一由 `loadMore` 承载
 * - `stream` 为 `false`：剔除 `loadMore`，它没有可承载的语义
 * - `compact` 为 `true`：再剔除 `->`
 * @description 输出只包含对外的公开片段；非紧凑形态交给 Element Plus 之前还需用 `toElPaginationLayout` 翻译
 * @param layout 原始布局片段，不会被修改
 * @param mode 当前形态，取自 Pagination 的 props
 * @example
 * ```ts
 * // stream 关闭时 `loadMore` 无效，其余片段原样保留
 * handleLayout(['prev', 'pager', 'jumper', 'next', 'loadMore'], {
 *   compact: false,
 * });
 * // ['prev', 'pager', 'jumper', 'next']
 *
 * // stream 开启时翻页与计数都被 `loadMore` 接管，非紧凑形态同样生效，`->` 保留
 * handleLayout(['sizes', 'prev', 'pager', 'next', '->', 'loadMore', 'total'], {
 *   compact: false,
 *   stream: true,
 * });
 * // ['sizes', '->', 'loadMore']
 *
 * // 两条规则叠加时取并集
 * handleLayout(['prev', '->', 'pager', 'jumper', 'next', 'loadMore', 'total'], {
 *   compact: true,
 *   stream: true,
 * });
 * // ['loadMore']
 * ```
 */
export const handleLayout = (
  layout: PaginationLayout[],
  mode: Pick<PaginationProps, 'compact' | 'stream'>,
): PaginationLayout[] => {
  const invalid: PaginationLayout[] = [];

  // 紧凑形态是一条单行 flex，没有左右分栏可言
  if (mode.compact) {
    invalid.push('->');
  }

  if (mode.stream) {
    // 翻页与计数都被 `loadMore` 接管；`total` 若保留会渲染出第二份计数
    invalid.push('pager', 'prev', 'next', 'jumper', 'total');
  } else {
    invalid.push('loadMore');
  }

  return layout.filter((item) => {
    return !invalid.includes(item);
  });
};

/**
 * 把布局片段翻译成 Element Plus 的 `layout` 字符串
 * @description `loadMore` 是本组件独有的片段，Element Plus 不认识它、会静默丢弃，
 * 这里把它映射成 Element Plus 的 `slot`，由默认插槽承载「加载更多 + 已加载 / 总数量」
 * @description 只在非紧凑形态下调用：紧凑形态由本组件逐片段渲染，不需要交给 Element Plus
 * @description 依赖 Element Plus 未写进文档的 `slot` 片段（源码里是 `TEMPLATE_MAP.slot = slots?.default?.()`），
 * 升级 Element Plus 后需要回归「非紧凑 + 流式加载」这条路径
 * @param layout 已经过 `handleLayout` 处理的布局片段，不会被修改
 * @returns 逗号分隔的 Element Plus layout 字符串，空数组时返回空串
 * @example
 * ```ts
 * // 非紧凑 + 流式加载：`loadMore` 落到 Element Plus 的 `slot` 位置
 * toElPaginationLayout(['sizes', '->', 'loadMore']);
 * // 'sizes,->,slot'
 *
 * // 普通分页：原样拼接
 * toElPaginationLayout(['prev', 'pager', 'next']);
 * // 'prev,pager,next'
 * ```
 */
export const toElPaginationLayout = (layout: PaginationLayout[]): string => {
  return layout
    .map((item) => {
      return item === 'loadMore' ? 'slot' : item;
    })
    .join(',');
};

/**
 * 处理跳转页码
 * @description 空值、非数字、小于 1 时返回当前页码；大于总页数时夹取到总页数
 * @description 总页数为 `0`（无数据）时，超过总页数的输入按 `1` 兜底，避免把 `currentPage` 写成 `0`
 * @param value 跳转页码
 * @param pageCount 总页数
 * @param current 当前页码
 * @returns 可解析时返回夹取后的页码，否则返回当前页码
 */
export const handleJumperPage = (
  value: string,
  pageCount: number,
  current: number,
) => {
  if (!value) {
    return current;
  }

  // 尝试强制转化为数字
  let _value = Number(value);
  // 不是一个数字，返回当前页码
  if (!isNumber(_value)) {
    return current;
  }

  // 四舍五入
  _value = Math.ceil(_value);

  if (_value < 1) {
    return current;
  }

  if (_value > pageCount) {
    return Math.max(1, pageCount);
  }

  return _value;
};
