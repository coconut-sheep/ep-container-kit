import {
  ElForm,
  type FormProps,
  type FormInstance,
  type FormItemProp,
} from 'element-plus';
import type {
  AnyRecord,
  BaseDefaultPropsSource,
  TuplesToEmits,
} from '@ep-container-kit/types';
import type { FormItemSchemaProps } from './form-item-schema';
import { getComponentName } from '@ep-container-kit/constants';
import {
  buildPropsDefaultValues,
  getPropsDefaultValue,
} from '@ep-container-kit/utils';

export const COMPONENT_NAME = getComponentName('FormContainer');

export const COMPONENT_DEFAULT_PROPS_SOURCE: BaseDefaultPropsSource<FormContainerProps> =
  {
    ...getPropsDefaultValue(ElForm.props),
    itemMinWidth: 0,
  };

export const COMPONENT_DEFAULT_PROPS =
  buildPropsDefaultValues<FormContainerProps>(COMPONENT_DEFAULT_PROPS_SOURCE);

/**
 * 表单容器的 props
 * @description 在 ElForm 的 props 基础上，追加垂直布局、Schema 以及可被全局下发的尺寸配置
 * @description 剔除了 ElForm 的 `model`：容器自身的数据源由 `v-model` 提供，并原样作为
 * ElForm 的 `model` 参与校验。保留该 props 会让调用方误以为 `:model` 是数据入口，
 * 实际却会被内部绑定覆盖，表现为「传了数据但校验始终不通过」。
 */
export type FormContainerProps<T extends AnyRecord = AnyRecord> = {
  /**
   * 元素是否垂直布局，仅影响直接子元素的排列方式
   * @default false
   */
  vertical?: boolean;
  /**
   * 表单项最小宽度
   * @default 0
   */
  itemMinWidth?: string | number;
  /**
   * 表单项最大宽度
   */
  itemMaxWidth?: string | number;
  /**
   * 表单的 Schema 配置
   * @description 类型从 FormItemSchema 的 props 中提取，保证两者一致
   */
  schema?: FormItemSchemaProps<T>['schema'];
} & Partial<Omit<FormProps, 'model'>>;

/**
 * 表单容器的事件元组
 */
export type FormContainerEmitsTuple = {
  /**
   * 表单提交事件
   */
  submit: [];
  /**
   * 表单校验事件，透传 el-form 的 validate
   */
  validate: [prop: FormItemProp, isValid: boolean, message: string];
};

/**
 * 表单容器的事件
 */
export type FormContainerEmits = TuplesToEmits<FormContainerEmitsTuple>;

/**
 * 表单容器实例
 */
export type FormContainerInstance = FormInstance;
