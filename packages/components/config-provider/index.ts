import { withInstall } from '@ep-container-kit/utils';
import ConfigProviderVue from './src/config-provider.vue';

/** 全局配置提供器组件，通过 provide/inject 向子组件注入全局表单配置 */
export const CkConfigProvider = withInstall(ConfigProviderVue);

export type {
  ConfigProviderProps,
  ConfigProviderProvide,
  FormContainerProvideConfig,
} from './src/config-provider';

export default CkConfigProvider;
