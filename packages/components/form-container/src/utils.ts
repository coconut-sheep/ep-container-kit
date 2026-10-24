import type { Component, Ref, VNode } from 'vue';
import { h, Fragment, createVNode } from 'vue';
import {
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
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
} from 'element-plus';
import type { AnyRecord, AnyValue, Arrayable } from '@ep-container-kit/types';
import type { FormContainerItem } from './form-item';
import { isArray } from '@ep-container-kit/utils';

type FormItemMapValue = <T extends AnyRecord>(
  props: FormContainerItem<T>,
  modelValue: Ref,
) => Arrayable<VNode>;

/**
 * 获取密码输入框的事件处理函数对象
 * @description copy 复制
 * @description cut 剪切
 * @description paste 粘贴
 * @description drop 拖拽 => 释放
 * @param [on=false] 是否需要添加on前缀
 */
export const getPasswordPreventEvents = (on: boolean = false) => {
  const eventList = ['copy', 'cut', 'paste', 'drop'];
  const result: AnyRecord = {};
  const handler = (e: Event) => {
    e.preventDefault();
  };
  eventList.map((event) => {
    const key = on
      ? `on${event.slice(0, 1).toUpperCase()}${event.slice(1)}`
      : event;
    result[key] = handler;
  });
  return result;
};

/**
 * 预处理部分属性
 * @param props
 */
const _handleDefaultProps = <T extends AnyRecord>(
  props: FormContainerItem<T>,
) => {
  const _props = props.props || {};
  const _type = props.type || '';
  let _events = props.events || {};

  // 如果是密码输入框
  if (_type == 'input' && _props['type'] == 'password') {
    // 默认显示密码显示按钮
    _props['showPassword'] = true;
    _events = {
      ..._events,
      ...getPasswordPreventEvents(),
    };
  }

  return {
    ...props,
    props: {
      clearable: true,
      ..._props,
    },
    events: _events,
  };
};

/**
 * 默认插槽组件创建函数Map
 */
const _formItemMap: Map<FormContainerItem['type'], FormItemMapValue> = new Map([
  [
    'input',
    (props, value) =>
      _createComponent(ElInput, _handleDefaultProps(props), value),
  ],
  [
    'inputNumber',
    (props, value) => _createComponent(ElInputNumber, props, value),
  ],
  [
    'autoComplete',
    (props, value) =>
      _createComponent(ElAutocomplete, _handleDefaultProps(props), value),
  ],
  ['inputTags', (props, value) => _createComponent(ElInputTag, props, value)],
  [
    'select',
    (props, value) =>
      _createComponent(ElSelect, _handleDefaultProps(props), value),
  ],
  [
    'treeSelect',
    (props, value) => _createComponent(ElTreeSelect, props, value),
  ],
  ['radio', (props, value) => _createComponent(ElRadio, props, value)],
  [
    'radioGroup',
    (props, value) => _createComponent(ElRadioGroup, props, value),
  ],
  ['checkbox', (props, value) => _createComponent(ElCheckbox, props, value)],
  [
    'checkboxGroup',
    (props, value) => _createComponent(ElCheckboxGroup, props, value),
  ],
  [
    'datePicker',
    (props, value) => _createComponent(ElDatePicker, props, value),
  ],
  [
    'timeSelect',
    (props, value) => _createComponent(ElTimeSelect, props, value),
  ],
  [
    'timePicker',
    (props, value) => _createComponent(ElTimePicker, props, value),
  ],
  ['switch', (props, value) => _createComponent(ElSwitch, props, value)],
  ['slider', (props, value) => _createComponent(ElSlider, props, value)],
  [
    'colorPicker',
    (props, value) => _createComponent(ElColorPicker, props, value),
  ],
  ['cascader', (props, value) => _createComponent(ElCascader, props, value)],
  [
    'custom',
    (props, value) => _createComponent(props.component!, props, value),
  ],
  ['render', (props, value) => _createComponent(null, props, value)],
]);

/**
 * 创建组件
 * @param component 组件
 * @param props props
 * @param valueRef 组件的modelValue
 */
const _createComponent = <T extends AnyRecord>(
  component: Component | string | null,
  props: FormContainerItem<T>,
  valueRef: Ref,
): VNode => {
  props = {
    ...props,
    prop: props.prop ? String(props.prop) : '',
  };

  // 组件事件响应处理
  const _events = props.events || {};
  const eventProp: AnyRecord = {};
  for (const key of Object.keys(_events)) {
    // key 合法性校验：跳过空 key / 纯空白 key
    const eventKey = key.trim();
    if (!eventKey) {
      continue;
    }

    const _handler = _events[key];
    // 已带 on 前缀（如 onInput/onChange）的事件名视为合法，直接使用，避免重复拼接 on
    const _key = /^on[A-Z]/.test(eventKey)
      ? eventKey
      : 'on' + eventKey.slice(0, 1).toUpperCase() + eventKey.slice(1);
    eventProp[_key] = _handler;
  }

  // 如果默认插槽类型为render并且提供了renderer函数，直接返回renderer函数的返回值
  if (props.type === 'render' && props.render) {
    const rendered = props.render(props, valueRef);
    return isArray(rendered) ? createVNode(Fragment, null, rendered) : rendered;
  }

  const slots = props.slots || {};

  // 没有提供组件时，返回空组件
  if (!component) {
    return createVNode(Fragment, null, slots);
  }

  return h(
    component,
    {
      modelValue: valueRef.value,
      'onUpdate:modelValue': (value: AnyValue) => {
        valueRef.value = value;
      },
      ...props.props,
      ...eventProp,
    },
    slots,
  );
};

/**
 * 基于ElFormItem创建其默认插槽的组件
 * @param props props
 * @param value modelValue
 */
export const createFormItemComponent = <T extends AnyRecord>(
  props: FormContainerItem<T>,
  value: Ref,
) => {
  const callback = _formItemMap.get(props.type);
  if (!callback) {
    return null;
  }

  return callback(props, value);
};

/**
 * 处理FormItem的同名props属性，优先级为 itemProps > item > 默认值
 * @param value FormContainerItem
 * @param prop props属性名
 * @param defaultValue 默认值，缺省时取不到属性则返回 undefined
 * @example
 * ```ts
 * const item = { prop: 'a', itemProps: { prop: 'b', label: 'c' } };
 * handleFormItemProp(item, 'prop');   // 'b'，itemProps覆盖item的同名属性
 * handleFormItemProp(item, 'label');  // 'c'
 * handleFormItemProp(item, 'rules');  // undefined，两者都没有则返回默认值/undefined
 * ```
 */
export const handleFormItemProp = <
  K extends keyof Pick<FormContainerItem, 'prop' | 'label' | 'rules'>,
>(
  value: FormContainerItem,
  prop: K,
  defaultValue?: FormContainerItem[K],
) => {
  return value.itemProps?.[prop] ?? value[prop] ?? defaultValue;
};
