import type {
  AnyRecord,
  AnyValue,
  Arrayable,
  BaseComponent,
  BaseDefaultPropsSource,
  BaseEvents,
  BaseProps,
  BaseSlots,
} from '@ep-container-kit/types';
import type { FormContainerProvideConfig } from './provide';
import {
  ElAutocomplete,
  ElCheckbox,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElInputTag,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTreeSelect,
  ElCascader,
} from 'element-plus';
import type {
  FormItemProps as ElFormItemProps,
  AutocompleteProps as ElAutocompleteProps,
  AutocompleteEmits as ElAutocompleteEmits,
  InputProps as ElInputProps,
  InputEmits as ElInputEmits,
  InputTagProps as ElInputTagProps,
  InputTagEmits as ElInputTagEmits,
  InputNumberProps as ElInputNumberProps,
  InputNumberEmits as ElInputNumberEmits,
  SelectProps as ElSelectProps,
  SelectEmits as ElSelectEmits,
  RadioProps as ElRadioProps,
  RadioEmits as ElRadioEmits,
  RadioGroupProps as ElRadioGroupProps,
  RadioGroupEmits as ElRadioGroupEmits,
  CheckboxProps as ElCheckboxProps,
  CheckboxEmits as ElCheckboxEmits,
  CheckboxGroupProps as ElCheckboxGroupProps,
  CheckboxGroupEmits as ElCheckboxGroupEmits,
  DatePickerProps as ElDatePickerProps,
  TimeSelectProps as ElTimeSelectProps,
  SwitchProps as ElSwitchProps,
  SwitchEmits as ElSwitchEmits,
  TreeComponentProps as ElTreeProps,
  TreeEmits as ElTreeEmits,
  ColorPickerProps as ElColorPickerProps,
  ColorPickerEmits as ElColorPickerEmits,
  SliderProps as ElSliderProps,
  SliderEmits as ElSliderEmits,
  CascaderProps as ElCascaderProps,
  CascaderEmits as ElCascaderEmits,
} from 'element-plus';
import type { EmitFn, Ref, VNode } from 'vue';
import { getComponentName } from '@ep-container-kit/constants';
import { buildPropsDefaultValues } from '@ep-container-kit/utils';

export const COMPONENT_NAME = getComponentName('FormItem');

export const COMPONENT_DEFAULT_PROPS_HOLDER: BaseDefaultPropsSource<FormItemProps> =
  {
    visible: undefined,
    hidden: undefined,
  };

export const COMPONENT_DEFAULT_PROPS = buildPropsDefaultValues<FormItemProps>({
  visible: true,
  hidden: false,
  rules: () => {
    return [] as FormContainerItem['rules'];
  },
  itemProps: () => {
    return {} as FormContainerItem['itemProps'];
  },
  itemSlots: () => {
    return {} as FormContainerItem['itemSlots'];
  },
  props: () => {
    return {} as FormContainerItem['props'];
  },
  slots: () => {
    return {} as FormContainerItem['slots'];
  },
  events: () => {
    return {} as FormContainerItem['events'];
  },
});

/**
 * 组件的插槽类型
 */
type ComponentSlots<T> = T extends abstract new (...args: AnyValue[]) => {
  $slots: infer TSlots;
}
  ? TSlots
  : T;

/**
 * 组件的Props类型
 */
type ComponentProps<T> = T extends abstract new (...args: AnyValue[]) => {
  $props: infer TProps;
}
  ? TProps
  : T;

/**
 * 表单项默认插槽组件的事件类型
 */
type FormItemComponentEvents<T> = Partial<
  Omit<T, 'update:modelValue'> & FormItemBase['events']
>;

/**
 * 表单项默认插槽组件的插槽类型
 */
type FormItemComponentSlots<T> = ComponentSlots<T> & FormItemBase['slots'];

/**
 * 表单项默认插槽组件的Props类型
 */
type FormItemComponentProps<T> = Partial<
  ComponentProps<T> & FormItemBase['props']
>;

/**
 * 表单项的基础Props
 * @description 默认插槽的来源与优先级（低 → 高，高优先级覆盖低优先级）：
 * @description 1. 内置组件：由 `type` + `props`/`slots`/`events` 自动生成的默认插槽组件
 * @description 2. 配置插槽：`itemSlots.default`
 * @description 3. 模板通用插槽：`slots.default`（`useSlots` 传入的默认插槽）
 * @description 4. 模板定向插槽：`slot_${prop}`（仅当 `prop` 值有效时生效，优先级最高）
 */
export interface FormItemBase<T extends AnyRecord = AnyRecord> {
  /**
   * 属性，表示从数据源对象的哪个属性中取值，同时用于ElFormItem的prop属性
   * @description 当该值为 falsy 或在数据源对象中不存在该属性，时，不从数据源中取值，数据由组件内部自己持有
   * @description 当该值为 truthy 时，模板中名为 `slot_${prop}` 的插槽有效，且优先级最高，会覆盖默认插槽的其它来源
   * @description 可以被itemProps中的prop属性覆盖。
   */
  prop?: string | Extract<keyof T, string>;
  /**
   * 表单项的标签
   * @description 可以被itemProps中的label属性覆盖
   */
  label?: string;
  /**
   * 表单项的校验规则
   * @description 可以被itemProps中的rules属性覆盖
   */
  rules?: ElFormItemProps['rules'];
  /**
   * 占几列，与el-col的span属性一致
   * @description 使用column-x的class实现占列效果
   */
  col?: number;
  /**
   * 是否可见，与v-show效果一致，用于控制ElFormItem的显示与隐藏
   * @default true
   */
  visible?: boolean;
  /**
   * 是否隐藏，与v-if效果一致，用于控制ElFormItem的显示与隐藏
   * @default false
   */
  hidden?: boolean;
  /**
   * ElFormItem的属性，包括props与attrs（自定义属性）
   */
  itemProps?: ElFormItemProps & FormContainerProvideConfig & AnyRecord;
  /**
   * 表单项的插槽
   * @description 提供ElFormItem的各插槽。当未提供 `itemSlots.default`、模板 `slots.default` 或模板 `slot_${prop}` 插槽时，默认插槽由 `type` 对应的内置组件自动生成
   */
  itemSlots?: InstanceType<typeof ElFormItem>['$slots'];
  /**
   * 表单项的自定义render函数
   * @param props 表单项的配置
   * @param value 表单项的值的Ref对象
   */
  itemRender?: (
    props: Omit<FormContainerItem<T>, 'itemRender'>,
    value: Ref<AnyValue>,
  ) => Arrayable<VNode>;
  /**
   * ElFormItem默认插槽的类型
   */
  type?: string | 'custom' | 'render';
  /**
   * ElFormItem默认插槽中直接子元素的属性，包括props与attrs（自定义属性）
   */
  props?: BaseProps;
  /**
   * ElFormItem的默认插槽中直接子元素的插槽，包括default插槽与自定义插槽
   */
  slots?: BaseSlots;
  /**
   * ElFormItem的默认插槽中直接子元素的事件，包括组件的事件与自定义事件
   */
  events?: BaseEvents;
  /**
   * ElFormItem的默认插槽中使用的组件
   * @description 仅在type="custom"时有效
   * @description 当该组件存在多个v-model时，需要手动实现v-model的绑定，即拆分成bind事件和update事件
   */
  component?: BaseComponent;
  /**
   * ElFormItem的默认插槽的渲染函数
   * @description 在ElFormItem被覆盖(如使用itemRender属性手动处理渲染逻辑）时无效
   * @description 仅在type="render"时有效
   * @param props 表单项的配置
   * @param value 表单项的值的Ref对象
   */
  render?: (props: FormItemBase<T>, value: Ref<AnyValue>) => Arrayable<VNode>;
}

/**
 * 任意类型的FormItem配置，当type不合法时，坍缩到此类型
 */
export interface FormItemAny<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  /**
   * 不合法的type值，当你看到type的类型为never时，说明你的type值不合法
   */
  type?: never;
}

/**
 * 使用custom的FormItem配置
 */
export interface FormItemCustom<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  /**
   * 表单项的类型，必须为custom
   */
  type: 'custom';
  /**
   * 表单项的组件，在此类型下必填
   */
  component: FormItemBase['component'];
}

/**
 * 使用render的FormItem配置
 */
export interface FormItemRender<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  /**
   * 表单项的类型，必须为render
   */
  type: 'render';
  /**
   * 表单项的渲染函数，在此类型下必填
   */
  render: FormItemBase['render'];
}

/**
 * 使用ElInput组件的FormItem配置
 */
export interface FormItemInput<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'input';
  props?: FormItemComponentProps<ElInputProps>;
  slots?: FormItemComponentSlots<typeof ElInput>;
  events?: FormItemComponentEvents<EmitFn<ElInputEmits>>;
}

/**
 * 使用ElInputTag组件的FormItem配置
 */
export interface FormItemInputTag<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'inputTags';
  props?: FormItemComponentProps<ElInputTagProps>;
  slots?: FormItemComponentSlots<typeof ElInputTag>;
  events?: FormItemComponentEvents<EmitFn<ElInputTagEmits>>;
}

/**
 * 使用ElInputNumber组件的FormItem配置
 */
export interface FormItemInputNumber<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'inputNumber';
  props?: FormItemComponentProps<ElInputNumberProps>;
  slots?: FormItemComponentSlots<typeof ElInputNumber>;
  events?: FormItemComponentEvents<EmitFn<ElInputNumberEmits>>;
}

/**
 * 使用AutoComplete组件的FormItem配置
 */
export interface FormItemAutoComplete<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'autoComplete';
  props?: FormItemComponentProps<ElAutocompleteProps>;
  slots?: FormItemComponentSlots<typeof ElAutocomplete>;
  events?: FormItemComponentEvents<EmitFn<ElAutocompleteEmits>>;
}

/**
 * 使用ElSelect组件的FormItem配置
 */
export interface FormItemSelect<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'select';
  props?: FormItemComponentProps<ElSelectProps>;
  slots?: FormItemComponentSlots<typeof ElSelect>;
  events?: FormItemComponentEvents<ElSelectEmits>;
}

/**
 * 使用ElTreeSelect组件的FormItem配置
 */
export interface FormItemTreeSelect<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'treeSelect';
  props?: FormItemComponentProps<ElTreeProps> &
    FormItemComponentProps<ElSelectProps>;
  slots?: FormItemComponentSlots<typeof ElTreeSelect>;
  events?: FormItemComponentEvents<ElTreeEmits>;
}

/**
 * 使用ElRadio组件的FormItem配置
 */
export interface FormItemRadio<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'radio';
  props?: FormItemComponentProps<ElRadioProps>;
  slots?: FormItemComponentSlots<typeof ElRadio>;
  events?: FormItemComponentEvents<EmitFn<ElRadioEmits>>;
}

/**
 * 使用ElRadioGroup组件的FormItem配置
 */
export interface FormItemRadioGroup<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'radioGroup';
  props?: FormItemComponentProps<ElRadioGroupProps>;
  slots?: FormItemComponentSlots<typeof ElRadioGroup>;
  events?: FormItemComponentEvents<EmitFn<ElRadioGroupEmits>>;
}

/**
 * 使用ElCheckbox组件的FormItem配置
 */
export interface FormItemCheckbox<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'checkbox';
  props?: FormItemComponentProps<ElCheckboxProps>;
  slots?: FormItemComponentSlots<typeof ElCheckbox>;
  events?: FormItemComponentEvents<EmitFn<ElCheckboxEmits>>;
}

/**
 * 使用ElCheckboxGroup组件的FormItem配置
 */
export interface FormItemCheckboxGroup<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'checkboxGroup';
  props?: FormItemComponentProps<ElCheckboxGroupProps>;
  slots?: FormItemComponentSlots<typeof ElCheckboxGroup>;
  events?: FormItemComponentEvents<EmitFn<ElCheckboxGroupEmits>>;
}

/**
 * 使用ElDatePicker组件的FormItem配置
 */
export interface FormItemDatePicker<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'datePicker';
  props?: FormItemComponentProps<ElDatePickerProps>;
  slots?: FormItemComponentSlots<typeof ElDatePicker>;
  events?: FormItemComponentEvents<InstanceType<typeof ElDatePicker>['$emit']>;
}

/**
 * 使用ElTimeSelect组件的FormItem配置
 */
export interface FormItemTimeSelect<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'timeSelect';
  props?: FormItemComponentProps<ElTimeSelectProps>;
  slots?: FormItemComponentSlots<typeof ElTimeSelect>;
  events?: FormItemComponentEvents<InstanceType<typeof ElTimeSelect>['$emit']>;
}

/**
 * 使用ElTimePicker组件的FormItem配置
 */
export interface FormItemTimePicker<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'timePicker';
  props?: FormItemComponentProps<typeof ElTimePicker>;
  slots?: FormItemComponentSlots<typeof ElTimePicker>;
  events?: FormItemComponentEvents<InstanceType<typeof ElTimePicker>['$emit']>;
}

/**
 * 使用ElSwitch组件的FormItem配置
 */
export interface FormItemSwitch<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'switch';
  props?: FormItemComponentProps<ElSwitchProps>;
  slots?: FormItemComponentSlots<typeof ElSwitch>;
  events?: FormItemComponentEvents<EmitFn<ElSwitchEmits>>;
}

/**
 * 使用ElColorPicker组件的FormItem配置
 */
export interface FormItemColorPicker<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'colorPicker';
  props?: FormItemComponentProps<ElColorPickerProps>;
  slots?: FormItemComponentSlots<typeof ElColorPicker>;
  events?: FormItemComponentEvents<EmitFn<ElColorPickerEmits>>;
}

/**
 * 使用ElSlider组件的FormItem配置
 */
export interface FormItemSlider<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'slider';
  props?: FormItemComponentProps<ElSliderProps>;
  slots?: FormItemComponentSlots<typeof ElSlider>;
  events?: FormItemComponentEvents<EmitFn<ElSliderEmits>>;
}

/**
 * 使用ElCascader组件的FormItem配置
 */
export interface FormItemCascader<
  T extends AnyRecord = AnyRecord,
> extends FormItemBase<T> {
  type: 'cascader';
  props?: FormItemComponentProps<ElCascaderProps>;
  slots?: FormItemComponentSlots<typeof ElCascader>;
  events?: FormItemComponentEvents<EmitFn<ElCascaderEmits>>;
}

/**
 * 表单项类型
 */
export type FormContainerItem<T extends AnyRecord = AnyRecord> =
  | FormItemInput<T>
  | FormItemInputTag<T>
  | FormItemInputNumber<T>
  | FormItemAutoComplete<T>
  | FormItemSelect<T>
  | FormItemTreeSelect<T>
  | FormItemRadio<T>
  | FormItemRadioGroup<T>
  | FormItemCheckbox<T>
  | FormItemCheckboxGroup<T>
  | FormItemDatePicker<T>
  | FormItemTimeSelect<T>
  | FormItemTimePicker<T>
  | FormItemSwitch<T>
  | FormItemColorPicker<T>
  | FormItemSlider<T>
  | FormItemCascader<T>
  | FormItemCustom<T>
  | FormItemRender<T>
  | FormItemAny<T>;

/**
 * 表单项Props类型
 */
export type FormItemProps<T extends AnyRecord = AnyRecord> =
  FormContainerItem<T>;
