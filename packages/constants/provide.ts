import type { InjectionKey } from 'vue';
import type {
  ConfigProviderProvide,
  FormContainerProvideConfig,
} from '@ep-container-kit/components/config-provider/src/config-provider.ts';

/**
 * 表单相关的Provide
 */
export const FORM_PROVIDER: InjectionKey<
  ConfigProviderProvide<FormContainerProvideConfig>
> = Symbol('formProvider');
