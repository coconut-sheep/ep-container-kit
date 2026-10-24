// 布局工具类与过渡动画，构建时抽取为 dist/index.css。
// 不包含全局重置：库不改变宿主的 `box-sizing`、字体、背景与滚动行为
import '@ep-container-kit/styles/index.scss';

import type { App, Plugin } from 'vue';
import { components } from '@ep-container-kit/components';
import { installComponents } from '@ep-container-kit/utils';

// 组件与组件类型（局部按需导入入口）
export * from '@ep-container-kit/components';

// 工具函数与常量（withInstall、toSizeValue、FORM_PROVIDER 等）
export * from '@ep-container-kit/utils';
export * from '@ep-container-kit/constants';

// 公共类型
export * from '@ep-container-kit/types';

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
 * import EpContainerKit from 'ep-container-kit';
 * import 'ep-container-kit/dist/index.css';
 *
 * app.use(EpContainerKit);
 * ```
 */
export const EpContainerKit: Plugin = {
  install,
};

export default EpContainerKit;
