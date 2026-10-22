import {
  type FormProps,
  type FormEmits,
  type FormInstance,
} from 'element-plus';
import type { AnyRecord } from '@ep-container-kit/types';
import type { FormContainerItem } from '@ep-container-kit/components/form-container/src/form-item.ts';

/**
 * 表单容器的组件名
 */
export const COMPONENT_NAME = 'CkFormContainer';

/**
 * 表单容器的props
 */
export type FormContainerProps<T extends AnyRecord = AnyRecord> =
  Partial<FormProps> & {
    /**
     * 元素是否垂直布局 只影响直接子元素的排列方式，与原生的inline属性不同
     * @default false
     */
    vertical?: boolean;
    /**
     * 表单的Schema配置
     */
    schema?: FormContainerItem<T>[];
  };

/**
 * 表单容器的事件（对外暴露应为函数签名形式）
 * @description 从el-form的FormEmits派生（随版本追踪），追加容器自身事件
 */
export type FormContainerEmits = FormEmits & {
  submit: () => void;
};

/**
 * 表单容器实例
 */
export type FormContainerInstance = FormInstance;
