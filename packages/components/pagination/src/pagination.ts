import { getComponentName } from '@ep-container-kit/constants';
import {
  type PaginationProps as ElPaginationProps,
  ElPagination,
} from 'element-plus';
import {
  getPropsDefaultValue,
  isNumber,
  omitEntryProps,
} from '@ep-container-kit/utils';

/**
 * Pagination 的组件名
 */
export const COMPONENT_NAME = getComponentName('Pagination');

/**
 * 无效 Props 的 key 并集：被直接移除的 Props 与被整合的 Props
 * @description 刻意写成字面量联合，而不是从 `INVALID_PROPS` 反推（如 `(typeof INVALID_PROPS)[number]`）：
 * `@vue/compiler-sfc` 解析 `defineProps<T>()` 时，无法把「`as const` + 数组展开」解析成有限 key，
 * 会抛 `Failed to resolve index type into finite keys`，组件在 vite 编译期直接失败
 * @description 保持一致的方式是反向的：`INVALID_PROPS` 声明为 `satisfies readonly InvalidPropKey[]`，
 * 而本类型用 `AssertInvalidPropKey` 保证每一项都是 `ElPaginationProps` 的真实 key
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
 * ElPagination 中在本组件无效的 Props
 * @description 分两类：前 6 个是被**直接移除**的（避免误写），后 5 个是被**整合进 modelValue** 的，
 * 后者只能通过 v-model 传入，写成 prop 不会再生效（如 EP 默认的 `layout` 字符串会盖掉配置里的数组）
 * @description 运行时用它剔除 EP 的默认值与透传的 attrs，类型层由 `InvalidPropKey` 剔除，两者需同步维护
 */
export const INVALID_PROPS = [
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
] as const satisfies readonly InvalidPropKey[];

/**
 * Pagination 的 Props 类型
 * @description 其中 `currentPage`、`pageSize`、`pageSizes`、`total`、`layout` 被整合到 modelValue的类型`PaginationConfig`中
 * @description 其中 `defaultCurrentPage`、`defaultPageSize`、`hideOnSinglePage`、`small`、`size`、`pageCount` 属性被移除
 */
export type PaginationProps = {
  /**
   * 是否启用紧凑形态
   * @description 只决定「由哪套单元渲染」，不改变参数含义与取值
   * @description 为 `true` 时，`pager` 仅显示当前页码，不显示其他页码按钮
   * @default false
   */
  compact?: boolean;
  /**
   * 是否为流式加载
   * @description 类似滚动到底部触发加载更多，适用于分段累计加载的场景
   * @description 为 `true` 时 `pager`、`prev`、`next`、`jumper`、`total` 一律从布局中剔除，
   * 由 `loadMore` **一个**片段固定渲染「加载更多按钮 + 已加载 / 总数量」：
   * 按钮与计数绑在同一片段内，顺序固定，不会因布局顺序不同而被拆散
   * @description 与 `compact` 相互独立，两种形态下表现一致：紧凑形态由本组件逐片段渲染；
   * 非紧凑形态把该片段挂到 Element Plus 的 `slot` 位置渲染，其余片段（如 `sizes`、`->`）仍交给 Element Plus
   * @default false
   */
  stream?: boolean;
  /**
   * 已加载条数
   * @description 仅在 `stream` 为 `true` 时被读取：判断是否还有更多（`loaded < total`），
   * 并作为 `loadMore` 片段中「已加载 / 总数量」的已加载一方
   * @description 未开启 `stream` 时该属性不产生任何效果
   * @default 0
   */
  loaded?: number;
  /**
   * 加载中状态
   * @description 为 `true` 时禁用所有可操作单元：`prev`、`next`、`sizes`、`jumper`、`loadMore`，
   * 其中「加载更多」按钮还会呈现 loading
   * @description 生效范围取决于形态：`compact` 为 `true` 时由本组件逐个禁用；
   * 非紧凑形态下借 Element Plus 的 `disabled` 整体禁用，但**仅在 `stream` 为 `true` 时**，
   * 普通分页不受该属性影响
   * @default false
   */
  loading?: boolean;
} & Partial<Omit<ElPaginationProps, InvalidPropKey>>;

/**
 * 分页器的布局片段
 * @description 取值与 Element Plus 的 `layout` 基本一致，按数组顺序从左到右渲染，不去重也不排序
 * @description `->` 是占位符，把它前后的片段分推到两侧
 * @description `loadMore` 是本组件新增的片段，一个片段内固定包含「加载更多按钮」与
 * 「已加载 / 总数量」两部分，二者不拆成两个片段，避免相对位置随布局顺序漂移
 * @description 各片段的生效条件：
 * - `loadMore`：`stream` 为 `true`
 * - `pager`、`prev`、`next`、`jumper`、`total`：`stream` 为 `false`（计数已并入 `loadMore`）
 * - `->`：`compact` 为 `false`
 * @description 关于 `slot`：Element Plus 的 `slot` 片段已被本组件内部占用（承载 `loadMore`），
 * 不再对外暴露，因此不在取值范围内
 */
export type PaginationLayout =
  'total' | 'sizes' | 'prev' | 'pager' | 'next' | 'jumper' | '->' | 'loadMore';

/**
 * 分页配置对象
 */
export interface PaginationConfig {
  /**
   * 当前页码，从 1 开始
   */
  currentPage: number;
  /**
   * 每页条数
   */
  pageSize: number;
  /**
   * 每页条数的可选项
   * @description 按数组顺序原样传给 Element Plus 与紧凑形态的步进按钮，
   * 不会被自动去重或排序，请自行保证每一项唯一且升序
   */
  pageSizes: number[];
  /**
   * 数据总条数
   */
  total: number;
  /**
   * 布局片段
   */
  layout: PaginationLayout[];
}

/**
 * Pagination 的 Emits 类型
 * @description 使用元组形式而非映射类型，避免 @vue/compiler-sfc 解析 `defineEmits<T>()` 时递归
 */
export type PaginationEmits = {
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
 * 获取 Pagination 的 Props 默认值
 * @description 每次调用返回新对象，避免多个实例共享同一份引用
 * @description 无效 Props 由 `INVALID_PROPS` 剔除，避免 v-model 之外再出现第二个入口
 * @returns 与 `PaginationProps` 对应的默认值对象
 */
export const getComponentDefaultProps = (): PaginationProps => {
  return {
    ...omitEntryProps(getPropsDefaultValue(ElPagination.props), [
      ...INVALID_PROPS,
      'prevIcon',
      'nextIcon',
    ]),
    background: true,
    compact: false,
    stream: false,
    loaded: 0,
    loading: false,
  };
};

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
 * //   pageSizes: [10, 20, 50, 100, 200],
 * //   total: 0,
 * //   layout: ['sizes', 'prev', 'pager', 'next', 'jumper', 'loadMore', 'total'],
 * // }
 *
 * const pagination = getDefaultPaginationConfig({ pageSize: 20 });
 * // {
 * //   currentPage: 1,
 * //   pageSize: 20,
 * //   pageSizes: [10, 20, 50, 100, 200],
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
    pageSizes: [10, 20, 50, 100, 200],
    layout: ['sizes', 'prev', 'pager', 'next', 'jumper', 'loadMore', 'total'],
    ...(config || {}),
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
