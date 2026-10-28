import type { FormContainerItem } from './form-item';
import type {
  AnyRecord,
  BaseDefaultPropsSource,
} from '@ep-container-kit/types';
import { buildComponentName } from '@ep-container-kit/constants';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';

export const COMPONENT_NAME = buildComponentName('FormItemSchema');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsSource<FormItemSchemaProps> =
  {} as BaseDefaultPropsSource<FormItemSchemaProps>;

export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<FormItemSchemaProps>({
    ...COMPONENT_DEFAULT_PROPS_HOLDER,
    schema: (): FormContainerItem[] => {
      return [];
    },
  });

/**
 * FormItemSchema的Props类型
 */
export type FormItemSchemaProps<T extends AnyRecord = AnyRecord> = {
  /**
   * schema配置
   */
  schema: FormContainerItem<T>[];
};
