import { type ConfigProviderProps as ElConfigProviderProps } from 'element-plus';
import { getComponentName } from '@ep-container-kit/constants';
import type {
  BaseDefaultPropsSource,
  FormContainerProvideConfig,
} from '@ep-container-kit/types';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';

export const COMPONENT_NAME = getComponentName('ConfigProvider');

export const COMPONENT_DEFAULT_PROPS_SOURCE: BaseDefaultPropsSource<ConfigProviderProps> =
  {
    form: () => {
      return {} as FormContainerProvideConfig;
    },
  };

export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<ConfigProviderProps>(COMPONENT_DEFAULT_PROPS_SOURCE);

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

export type {
  ConfigProviderProvide,
  FormContainerProvideConfig,
} from '@ep-container-kit/types';
