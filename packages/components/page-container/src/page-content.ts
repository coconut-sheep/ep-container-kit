import { getComponentName } from '@ep-container-kit/constants';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';
import type {
  BaseDefaultPropsSource,
  TuplesToEmits,
} from '@ep-container-kit/types';

export const COMPONENT_NAME = getComponentName('PageContent');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsSource<PageContentProps> =
  {
    showBack: undefined,
    fullHeight: undefined,
    transparent: undefined,
  };

export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<PageContentProps>({
    showBack: false,
    title: '',
    bodyClass: '',
    fullHeight: true,
    transparent: false,
    width: '',
    height: '',
  });

/**
 * PageContent 的 Props 类型
 */
export interface PageContentProps {
  /**
   * 背景是否透明
   * @default false
   */
  transparent?: boolean;
  /**
   * 是否显示返回按钮
   * @default false
   */
  showBack?: boolean;
  /**
   * 标题文案
   * @default ''
   */
  title?: string;
  /**
   * 内容区的额外 class
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
}

/**
 * PageContent 的 Emits 类型
 */
export type PageContentEmitsTuple = {
  backClick: [];
};

/**
 * PageContent 的 Emits 类型
 */
export type PageContentEmits = TuplesToEmits<PageContentEmitsTuple>;
