export * from './config-provider';
export * from './form-container';
export * from './page-container';
export * from './pagination';

import { CkConfigProvider } from './config-provider';
import {
  CkFormContainer,
  CkFormItem,
  CkFormItemSchema,
} from './form-container';
import { CkPageContainer, CkPageContent } from './page-container';
import { CkPagination } from './pagination';

/**
 * 组件库所有组件列表
 * @description 供全局注册（app.use(EpContainerKit)）时逐个安装
 */
export const components = [
  CkConfigProvider,
  CkFormContainer,
  CkFormItem,
  CkFormItemSchema,
  CkPageContainer,
  CkPageContent,
  CkPagination,
];
