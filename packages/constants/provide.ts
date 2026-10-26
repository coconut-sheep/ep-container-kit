import type {
  ConfigProvideKey,
  FormContainerProvideConfig,
} from '@ep-container-kit/types';

/**
 * 表单相关的 Provide 注入 key
 * @description 由 `CkConfigProvider` 或 `CkFormContainer` 提供，`CkFormItem` 消费
 */
export const FORM_PROVIDER: ConfigProvideKey<FormContainerProvideConfig> =
  Symbol('formProvider');

/**
 * 表单容器 provide 的配置 key 列表
 * @description 只有列在此处的配置项才会被 provide/inject 处理，新增配置项时需要同步维护
 */
export const FORM_CONTAINER_PROVIDE_KEY_LIST: (keyof FormContainerProvideConfig)[] =
  ['vertical', 'labelPosition', 'labelWidth', 'itemMinWidth', 'itemMaxWidth'];
