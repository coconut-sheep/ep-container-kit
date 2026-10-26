import type { FormContainerItem } from './form-item';
import type { AnyRecord } from '@ep-container-kit/types';
import { getComponentName } from '@ep-container-kit/constants';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';

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
   * @description 每项对应一个FormItem。表单项的prop需与源数据(source)字段对应，
   * 当prop为空或源数据中不存在该字段时，该字段的v-model不会生效：
   * 不读写源数据、不被响应式覆盖，仅作编辑占位；提交前请去重清洗或修正prop。
   */
  schema: FormContainerItem<T>[];
};

/**
 * FormItemSchema的props默认值
 */
export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<FormItemSchemaProps>({
    schema: (): FormContainerItem[] => {
      return [];
    },
  });
