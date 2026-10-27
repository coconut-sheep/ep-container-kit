import type { FormContainerItem } from './form-item';
import type {
  AnyRecord,
  BaseDefaultPropsSource,
} from '@ep-container-kit/types';
import { getComponentName } from '@ep-container-kit/constants';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';

export const COMPONENT_NAME = getComponentName('FormItemSchema');

export const COMPONENT_DEFAULT_PROPS_SOURCE: BaseDefaultPropsSource<FormItemSchemaProps> =
  {
    schema: (): FormContainerItem[] => {
      return [];
    },
  };

export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<FormItemSchemaProps>(COMPONENT_DEFAULT_PROPS_SOURCE);

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
