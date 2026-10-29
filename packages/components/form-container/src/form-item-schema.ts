import type { FormContainerItem } from './form-item';
import type {
  AnyRecord,
  BaseDefaultPropsHolder,
  BaseDefaultPropsSource,
} from '@ep-container-kit/types';
import { buildComponentName } from '@ep-container-kit/constants';

export const COMPONENT_NAME = buildComponentName('FormItemSchema');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsHolder<FormItemSchemaProps> =
  {};

export const COMPONENT_DEFAULT_PROPS: BaseDefaultPropsSource<FormItemSchemaProps> =
  {
    schema: (): FormContainerItem[] => {
      return [];
    },
  };

/**
 * FormItemSchema的Props类型
 */
export type FormItemSchemaProps<T extends AnyRecord = AnyRecord> = {
  /**
   * schema配置
   */
  schema: FormContainerItem<T>[];
};

/**
 * FormItemSchema的Item类型
 */
export type FormItemSchemaItem<T extends AnyRecord = AnyRecord> =
  FormItemSchemaProps<T>;
