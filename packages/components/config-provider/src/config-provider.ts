import { type ConfigProviderProps as ElConfigProviderProps } from 'element-plus';
import { getComponentName } from '@ep-container-kit/constants';
import type { FormContainerProvideConfig } from '@ep-container-kit/types';

/**
 * 配置提供器组件的组件名
 */
export const COMPONENT_NAME = getComponentName('ConfigProvider');

/**
 * 配置提供器组件的 props
 */
export interface ConfigProviderProps extends Partial<ElConfigProviderProps> {
  /**
   * 表单容器的全局配置
   * @description 由 `CkConfigProvider` 通过 provide 下发，`CkFormContainer` / `CkFormItem`
   * 按「组件值 > 注入值 > 默认值」的优先级合并
   */
  form?: FormContainerProvideConfig;
}

// 这两个类型原先定义在本文件，现统一收敛到 @ep-container-kit/types。
// 此处按原路径再导出，避免破坏既有的深层引用。
export type {
  ConfigProviderProvide,
  FormContainerProvideConfig,
} from '@ep-container-kit/types';
