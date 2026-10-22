export * from './form-container/index.ts';

import {
  CkFormContainer,
  CkFormItem,
  CkFormItemSchema,
} from './form-container/index.ts';

/**
 * 组件库所有组件列表
 * @description 供全局注册（app.use(EpContainerKit)）时逐个安装
 */
export const components = [CkFormContainer, CkFormItem, CkFormItemSchema];
