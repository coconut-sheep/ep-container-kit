import { getComponentName } from '@ep-container-kit/constants';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';

/**
 * PageContent 的组件名
 */
export const COMPONENT_NAME = getComponentName('PageContent');

/**
 * PageContent 的 Props 类型
 */
export type PageContentProps = {
  /**
   * 是否显示返回按钮
   * @default false
   */
  showBack?: boolean;
  /**
   * 标题文案
   * @description 与 `header` 插槽同时存在时，标题在左、插槽内容在右
   * @default ''
   */
  title?: string;
  /**
   * 内容区的额外 class
   * @description 用于叠加工具类（如 `flex-column`）或局部样式覆盖
   * @default ''
   */
  bodyClass?: string;
  /**
   * 内容区是否撑满父元素高度
   * @description 为 `true` 时忽略 `height`，内容区固定为 `100%`
   * @default true
   */
  fullHeight?: boolean;
  /**
   * 内容区宽度
   * @description 数字按 `px` 处理（`320` → `320px`），也可直接传带单位的字符串（`'100%'`）
   * @default ''
   */
  width?: string | number;
  /**
   * 内容区高度
   * @description 数字按 `px` 处理；仅在 `fullHeight` 为 `false` 时生效
   * @default ''
   */
  height?: string | number;
};

/**
 * PageContent 的 Emits 类型
 * @description 使用元组形式而非映射类型，避免 @vue/compiler-sfc 解析 `defineEmits<T>()` 时递归
 */
export type PageContentEmits = {
  backClick: [];
};

/**
 * PageContent 的 Props 默认值
 */
export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<PageContentProps>({
    showBack: false,
    title: '',
    bodyClass: '',
    fullHeight: true,
    width: '',
    height: '',
  });
