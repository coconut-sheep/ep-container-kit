import {
  ElForm,
  type FormProps,
  type FormInstance,
  type FormItemProp,
} from 'element-plus';
import type {
  AnyRecord,
  FormContainerProvideConfig,
} from '@ep-container-kit/types';
import type { FormItemSchemaProps } from './form-item-schema';
import { getComponentName } from '@ep-container-kit/constants';
import { getPropsDefaultValue } from '@ep-container-kit/utils';

/**
 * 表单容器的组件名
 */
export const COMPONENT_NAME = getComponentName('FormContainer');

/**
 * 表单容器的 props
 * @description 在 ElForm 的 props 基础上，追加垂直布局、Schema 以及可被全局下发的尺寸配置
 */
export type FormContainerProps<T extends AnyRecord = AnyRecord> =
  Partial<FormProps> &
    FormContainerProvideConfig & {
      /**
       * 表单的 Schema 配置
       * @description 类型从 FormItemSchema 的 props 中提取，保证两者一致
       */
      schema?: FormItemSchemaProps<T>['schema'];
    };

/**
 * 表单容器的 props 默认值
 */
export const getComponentDefaultProps = (): FormContainerProps => {
  return {
    ...getPropsDefaultValue(ElForm.props),
    vertical: false,
  };
};

/**
 * 表单容器的事件
 * @description 使用「事件名 → 参数元组」的写法，可直接作为 `defineEmits` 的类型参数。
 * 不能用「函数签名 + 映射类型转换」的写法：`EmitsToTuples` 是映射类型，
 * @vue/compiler-sfc 在构建期无法解析，会直接抛错。
 */
export type FormContainerEmits = {
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
 * 表单容器实例
 */
export type FormContainerInstance = FormInstance;
