import { type ConfigProviderProps as ElConfigProviderProps } from 'element-plus';
import { getComponentName } from '@ep-container-kit/constants';
import type { BaseDefaultPropsSource } from '@ep-container-kit/types';
import type { FormContainerProvideConfig } from '@ep-container-kit/components/form-container';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';

export const COMPONENT_NAME = getComponentName('ConfigProvider');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsSource<ConfigProviderProps> =
  {} as BaseDefaultPropsSource<ConfigProviderProps>;

export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<ConfigProviderProps>({
    formContainer: () => {
      return {} as FormContainerProvideConfig;
    },
  });

/**
 * 配置提供器组件的 props
 */
export interface ConfigProviderProps extends Partial<ElConfigProviderProps> {
  /**
   * 表单容器的全局配置
   * @description 由 `CkConfigProvider` 通过 provide 下发，`CkFormContainer` / `CkFormItem`
   * 按「组件值 > 注入值 > 默认值」的优先级合并
   */
  formContainer?: FormContainerProvideConfig;
}

export type { ConfigProviderProvide } from '@ep-container-kit/types';
export type { FormContainerProvideConfig } from '@ep-container-kit/components/form-container';
