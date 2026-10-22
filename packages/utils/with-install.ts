import type { App, Component, Plugin } from 'vue';
import type { AnyValue } from '@ep-container-kit/types';

/**
 * 带 install 方法的组件类型
 * @description 在普通组件的基础上追加 `install` 方法，使其可以被 `app.use(Component)` 局部注册
 */
export type SFCWithInstall<T extends Component> = T & Plugin;

/**
 * 为组件附加 install 方法，使其可被 `app.use(Component)` 局部注册
 * @param comp 要包装的组件
 * @param [name] 需要注册的组件名，缺省时取组件自身的 name 属性
 * @example
 * ```ts
 * export const FormContainer = withInstall(FormContainerVue);
 * app.use(FormContainer); // 注册为 name 属性指定的名字
 * ```
 */
export const withInstall = <T extends Component>(
  comp: T,
  name?: string,
): SFCWithInstall<T> => {
  const c = comp as SFCWithInstall<T>;
  c.install = (app: App) => {
    const componentName = name || ((comp as AnyValue).name as string) || '';
    if (componentName) {
      app.component(componentName, comp);
    }
  };
  return c;
};

/**
 * 将多个已带 install 方法的组件合并为一个安装器
 * @param app
 * @param components 已经 withInstall 包装过的组件列表
 */
export const installComponents = (app: App, components: Plugin[]) => {
  components.forEach((comp) => {
    app.use(comp);
  });
};
