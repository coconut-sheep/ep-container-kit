import { buildComponentName } from '@ep-container-kit/constants';
import type {
  Arrayable,
  BaseDefaultPropsHolder,
  BaseDefaultPropsSource,
} from '@ep-container-kit/types';
import type { VNode } from 'vue';

export const COMPONENT_NAME = buildComponentName('TableContainer');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsHolder<TableContainerProps> =
  {};

export const COMPONENT_DEFAULT_PROPS: BaseDefaultPropsSource<TableContainerProps> =
  {
    width: '',
    height: '',
    bodyClass: '',
    footerClass: '',
  };

/**
 * 表格容器的Props
 */
export interface TableContainerProps {
  /**
   * 宽度
   * @default ''
   */
  width?: string | number;
  /**
   * 高度
   * @default ''
   */
  height?: string | number;
  /**
   * body的class
   * @default ''
   */
  bodyClass?: string;
  /**
   * footer的class
   * @default ''
   */
  footerClass?: string;
}

/**
 * 表格容器的Slots
 */
export interface TableContainerSlots {
  /**
   * 默认插槽
   */
  default?: () => Arrayable<VNode>;
  /**
   * 底部插槽
   */
  footer?: () => Arrayable<VNode>;
}
