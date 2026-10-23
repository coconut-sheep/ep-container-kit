import { getComponentName } from '@ep-container-kit/constants';
import { type ConfigProviderProps as ElConfigProviderProps } from 'element-plus';
import type {
  FormContainerProps,
  FormContainerProvideProps,
} from '@ep-container-kit/components/form-container/src/form-container.ts';
import type { AnyRecord, AnyValue } from '@ep-container-kit/types';
import type { ComputedRef } from 'vue';

/**
 * 配置提供器组件
 */
export const COMPONENT_NAME = getComponentName('ConfigProvider');

/**
 * 配置提供器组件的props
 */
export interface ConfigProviderProps extends Partial<ElConfigProviderProps> {
  /**
   * 表单容器的配置
   */
  form?: FormContainerProvideConfig;
  /**
   * 详情容器的配置
   */
  detail?: DetailContainerProvideConfig;
}

/**
 * 配置提供的组件的Provide配置
 */
export type ConfigProviderProvide<T extends AnyRecord> = {
  [K in keyof T]: ComputedRef<T[K]>;
};

/**
 * 全局配置器中表单容器的配置
 */
export type FormContainerProvideConfig = Partial<
  Pick<
    FormContainerProps,
    | 'vertical'
    | 'labelWidth'
    | 'labelPosition'
    | keyof FormContainerProvideProps
  >
>;

/**
 * 表单容器 provide 的配置 key 列表
 */
export const FORM_CONTAINER_PROVIDE_KEY_LIST: (keyof FormContainerProvideConfig)[] = [
  'vertical',
  'itemMaxWidth',
  'itemMinWidth',
  'labelPosition',
  'labelWidth',
];

/**
 * 全局配置器中详情容器的配置
 */
export interface DetailContainerProvideConfig {
  [key: string]: AnyValue;
}
