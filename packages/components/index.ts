export * from './config-provider';
export * from './form-container';

import { CkConfigProvider } from './config-provider';
import {
  CkFormContainer,
  CkFormItem,
  CkFormItemSchema,
} from './form-container';

/**
 * 组件库所有组件列表
 * @description 供全局注册（app.use(EpContainerKit)）时逐个安装
 */
export const components = [
  CkConfigProvider,
  CkFormContainer,
  CkFormItem,
  CkFormItemSchema,
];
