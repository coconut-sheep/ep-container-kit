import type { FormContainerItem } from '@ep-container-kit/components/form-container/src/form-item.ts';
import type { AnyRecord } from '@ep-container-kit/types';

/**
 * FormItemSchema的组件名
 */
export const COMPONENT_NAME = 'CKFormItemSchema';

/**
 * FormItemSchema的Props类型
 */
export type FormItemSchemaProps<T extends AnyRecord = AnyRecord> = {
  /**
   * schema配置
   */
  schema: FormContainerItem<T>[];
};
