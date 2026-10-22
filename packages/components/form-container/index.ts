import { withInstall } from '@ep-container-kit/utils';
import FormContainerVue from './src/form-container.vue';
import FormItemVue from './src/form-item.vue';
import FormItemSchemaVue from './src/form-item-schema.vue';

/** 表单容器组件，用于批量渲染 FormItem */
export const FormContainer = withInstall(FormContainerVue);

/** 表单项组件，可直接使用，也用于被 FormContainer 批量渲染 */
export const FormItem = withInstall(FormItemVue);

/** 基于 schema 批量渲染 FormItem 的容器组件 */
export const FormItemSchema = withInstall(FormItemSchemaVue);

export {
  type FormContainerEmits,
  type FormContainerInstance,
  type FormContainerProps,
} from './src/form-container.ts';

export {
  type FormItemAny,
  type FormItemAutoComplete,
  type FormItemBase,
  type FormItemCascader,
  type FormItemCheckbox,
  type FormItemCheckboxGroup,
  type FormItemColorPicker,
  type FormItemCustom,
  type FormItemDatePicker,
  type FormItemInput,
  type FormItemInputNumber,
  type FormItemInputTag,
  type FormItemProps,
  type FormItemRadio,
  type FormItemRadioGroup,
  type FormItemRender,
  type FormItemSelect,
  type FormItemSlider,
  type FormItemSwitch,
  type FormItemTimePicker,
  type FormItemTimeSelect,
  type FormItemTreeSelect,
  type FormContainerItem,
} from './src/form-item.ts';

export type { FormItemSchemaProps } from './src/form-item-schema.ts';

export default FormContainer;
