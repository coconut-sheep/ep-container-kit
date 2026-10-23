import type { App, Plugin } from 'vue';
import { components } from './components';
import { installComponents } from './utils';

// 组件及类型（局部导入入口）
export * from './components';

// 工具函数与常量（如 withInstall、toSizeValue 等）
export * from './utils';
export * from './constants';

// 公共类型
export * from './types';

/**
 * 全局注册所有组件
 * @param app Vue 应用实例
 */
export const install = (app: App) => {
  installComponents(app, components);
};

/**
 * 组件库全局安装插件
 * @example
 * ```ts
 * import EpContainerKit from '@ep-container-kit';
 * app.use(EpContainerKit);
 * ```
 */
export const EpContainerKit: Plugin = {
  install,
};

export default EpContainerKit;
