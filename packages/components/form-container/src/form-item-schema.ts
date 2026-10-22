import type { FormContainerItem } from '@ep-container-kit/components/form-container/src/form-item.ts';
import type { AnyRecord } from '@ep-container-kit/types';
import { getComponentName } from '@ep-container-kit/constants/index.ts';

/**
 * FormItemSchema的组件名
 */
export const COMPONENT_NAME = getComponentName('FormItemSchema');

/**
 * FormItemSchema的Props类型
 */
export type FormItemSchemaProps<T extends AnyRecord = AnyRecord> = {
  /**
   * schema配置
   */
  schema: FormContainerItem<T>[];
};
