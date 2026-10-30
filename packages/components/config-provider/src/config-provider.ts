import { type ConfigProviderProps as ElConfigProviderProps } from 'element-plus';
import { buildComponentName } from '@ep-container-kit/constants';
import type {
  BaseDefaultPropsHolder,
  BaseDefaultPropsSource,
} from '@ep-container-kit/types';
import type { FormContainerProvideConfig } from '@ep-container-kit/components/form-container';
import type { TableContainerProvideConfig } from '@ep-container-kit/components/table-container';

export const COMPONENT_NAME = buildComponentName('ConfigProvider');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsHolder<ConfigProviderProps> =
  {};

export const COMPONENT_DEFAULT_PROPS: BaseDefaultPropsSource<ConfigProviderProps> =
  {
    formContainer: () => {
      return {} as FormContainerProvideConfig;
    },
    tableContainer: () => {
      return {} as TableContainerProvideConfig;
    },
  };

/**
 * 配置提供器组件的 props
 */
export interface ConfigProviderProps extends Partial<ElConfigProviderProps> {
  /**
   * 表单容器的全局配置
   * @description 由 `CkConfigProvider` 通过 provide 下发，按层级顺序下发到 `CkFormContainer`、`CkFormItem`中
   * @description 优先级：`组件值` > `注入值` > `默认值`
   */
  formContainer?: FormContainerProvideConfig;
  /**
   * 表单容器的全局配置
   * @description 由 `CkConfigProvider` 通过 provide 下发，
   * @description 由于不提供直接 `Table` 和 `TableColumn`，所以只会下发到 `TableColumnSchema` 中
   * @description 优先级：`组件值` > `注入值` > `默认值`
   */
  tableContainer?: TableContainerProvideConfig;
}

export type { ConfigProviderProvide } from '@ep-container-kit/types';
export type { FormContainerProvideConfig } from '@ep-container-kit/components/form-container';
export type { TableContainerProvideConfig } from '@ep-container-kit/components/table-container';
