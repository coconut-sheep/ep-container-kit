import {
  ElForm,
  type FormProps,
  type FormInstance,
  type FormItemProp,
} from 'element-plus';
import type {
  AnyRecord,
  BaseDefaultPropsHolder,
  BaseDefaultPropsSource,
  TuplesToEmits,
} from '@ep-container-kit/types';
import type { FormItemSchemaItem } from './form-item-schema';
import { buildComponentName } from '@ep-container-kit/constants';
import { getPropsDefaultValue } from '@ep-container-kit/utils';

export const COMPONENT_NAME = buildComponentName('FormContainer');

/**
 * ElForm 的默认值，已按用途拆成「真实默认值」与「布尔占位」两份
 */
const EL_DEFAULT_PROPS = getPropsDefaultValue(ElForm.props);

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsHolder<FormContainerProps> =
  {
    ...EL_DEFAULT_PROPS.holderProps,
    vertical: undefined,
  };

export const COMPONENT_DEFAULT_PROPS: BaseDefaultPropsSource<FormContainerProps> =
  {
    ...EL_DEFAULT_PROPS.defaultProps,
    itemMinWidth: 0,
    vertical: false,
  };

/**
 * 表单容器的 props
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
   */
  schema?: FormItemSchemaItem<T>['schema'];
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
