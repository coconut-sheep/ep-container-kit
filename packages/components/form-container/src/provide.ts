import type { ConfigProvideKey } from '@ep-container-kit/types';
import type { FormContainerProps } from './form-container';
import { ElForm, type FormProps } from 'element-plus';
import { getPropsKeys } from '@ep-container-kit/utils';

/**
 * 表单容器可通过 provide/inject 下发的配置项
 */
export type FormContainerProvideConfig = Omit<FormContainerProps, 'schema'>;

/**
 * 表单相关的 Provide 注入 key
 * @description 由 `CkConfigProvider` 或 `CkFormContainer` 提供，`CkFormItem` 消费
 */
export const FORM_CONTAINER_PROVIDER: ConfigProvideKey<FormContainerProvideConfig> =
  Symbol('formContainerProvider');

/**
 * 表单容器 provide 的配置 key 列表
 * @description 只有列在此处的配置项才会被 provide/inject 处理，新增配置项时需要同步维护
 */
export const FORM_CONTAINER_PROVIDE_KEYS: (keyof FormContainerProvideConfig)[] =
  [
    ...getPropsKeys<FormProps>(ElForm.props, ['model'], false),
    'vertical',
    'itemMinWidth',
    'itemMaxWidth',
  ] as (keyof FormContainerProvideConfig)[];
