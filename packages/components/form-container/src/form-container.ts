import {
  ElForm,
  type FormProps,
  type FormEmits,
  type FormInstance,
} from 'element-plus';
import type { AnyRecord } from '@ep-container-kit/types';
import type { FormItemSchemaProps } from '@ep-container-kit/components/form-container/src/form-item-schema.ts';
import { getComponentName } from '@ep-container-kit/constants';
import { getPropsDefaultValue } from '@ep-container-kit/utils';

/**
 * 表单容器的组件名
 */
export const COMPONENT_NAME = getComponentName('FormContainer');

/**
 * 表单容器的props
 */
export type FormContainerProps<T extends AnyRecord = AnyRecord> =
  Partial<FormProps> &
    FormContainerProvideProps & {
      /**
       * 元素是否垂直布局 只影响直接子元素的排列方式，与原生的inline属性不同
       * @default false
       */
      vertical?: boolean;
      /**
       * 表单的Schema配置
       * @description 类型从 FormItemSchema 的 props 中提取，保证两者一致
       */
      schema?: FormItemSchemaProps<T>['schema'];
    };

/**
 * 表单容器的props默认值
 */
export const getComponentDefaultProps = (): FormContainerProps => {
  return {
    ...getPropsDefaultValue(ElForm.props),
    vertical: false,
  };
};

/**
 * 表单容器的事件
 */
export type FormContainerEmits = FormEmits & {
  /**
   * 表单提交事件
   */
  submit: () => void;
};

/**
 * 表单容器实例
 */
export type FormContainerInstance = FormInstance;

/**
 * 表单容器提供的provide props
 */
export interface FormContainerProvideProps {
  /**
   * 表单项最小宽度
   * @default 0
   */
  itemMinWidth?: string | number;
  /**
   * 表单项最大宽度
   */
  itemMaxWidth?: string | number;
}
