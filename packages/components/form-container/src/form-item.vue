<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import {
    COMPONENT_NAME,
    type FormContainerItem,
    type FormItemProps,
    getComponentDefaultProps,
  } from '@ep-container-kit/components/form-container/src/form-item.ts';
  import { computed, h, inject, useAttrs, useSlots } from 'vue';
  import type { AnyRecord, AnyValue, BaseSlots } from '@ep-container-kit/types';
  import { ElFormItem } from 'element-plus';
  import {
    defineProp,
    filterNullishProps,
    isUndefined,
    omitEntryProps,
    toSizeValue,
  } from '@ep-container-kit/utils';
  import { FORM_PROVIDER } from '@ep-container-kit/constants';
  import {
    FORM_CONTAINER_PROVIDE_KEY_LIST,
    type ConfigProviderProvide,
    type FormContainerProvideConfig,
  } from '@ep-container-kit/components/config-provider/src/config-provider.ts';
  import { handleInjectValue } from '@ep-container-kit/components/config-provider/src/utils.ts';
  import {
    createFormItemComponent,
    handleFormItemProp,
  } from '@ep-container-kit/components/form-container/src/utils.ts';

  defineOptions({
    name: COMPONENT_NAME,
    inheritAttrs: false,
  });

  const modelValue = defineModel<AnyValue>({
    default: undefined,
    required: false,
  });

  const props = defineProps<FormItemProps>();

  const slots = useSlots();
  const attrs = useAttrs();

  const _inject = inject<
    Partial<ConfigProviderProvide<FormContainerProvideConfig>>
  >(FORM_PROVIDER, {});

  const defaultProps = getComponentDefaultProps();

  const mergedProps = computed<FormItemProps>(() => {
    const definedProps = filterNullishProps(props);

    // 上层注入的props
    const injectProps = handleInjectValue({
      injectValue: _inject,
      defaultValue: (defaultProps.itemProps ||
        {}) as FormContainerProvideConfig,
      componentValue: (definedProps.itemProps ||
        {}) as FormContainerProvideConfig,
      propList: FORM_CONTAINER_PROVIDE_KEY_LIST.filter((key) => {
        // vertical 仅作用于 FormContainer 布局，不传递给 FormItem
        return !['vertical'].includes(key);
      }),
    });

    return {
      ...defaultProps,
      ...definedProps,
      ...defineProp('itemProps', {
        ...(defaultProps.itemProps || {}),
        ...(definedProps.itemProps || {}),
        ...injectProps,
      }),
    } as FormItemProps;
  });

  /**
   * 组件使用的props配置
   */
  const formItemProps = computed(() => {
    const _class: string[] = [];
    if (mergedProps.value.col) {
      _class.push(`column-${mergedProps.value.col}`);
    }

    // el-form-item组件的props配置
    const _formItemProps = omitEntryProps(mergedProps.value, [
      'type',
      'props',
      'slots',
      'events',
      'component',
      'render',
    ]);

    return {
      class: _class.join(' '),
      ..._formItemProps,
      prop: handleFormItemProp(mergedProps.value, 'prop', defaultProps.prop),
      label: handleFormItemProp(mergedProps.value, 'label', defaultProps.label),
      rules: handleFormItemProp(mergedProps.value, 'rules', defaultProps.rules),
    };
  });

  /**
   * 组件使用的默认插槽
   */
  const defaultSlots = computed(() => {
    const _defaultSlots: BaseSlots = {};

    // 通过配置生成的默认插槽
    const _component = createFormItemComponent(mergedProps.value, modelValue);
    if (_component) {
      _defaultSlots['default'] = () => _component;
    }

    // 使用配置属性提供的默认插槽
    if (mergedProps.value.itemSlots?.default) {
      _defaultSlots['default'] = mergedProps.value.itemSlots.default;
    }

    // 使用模板语法传入的默认插槽
    if (slots.default) {
      _defaultSlots['default'] = slots.default;
    }

    // 使用模板语法传入的默认插槽，在props值有效时生效
    if (formItemProps.value.prop) {
      const _slotName = `slot_${formItemProps.value.prop}`;
      const _slotContent = slots[_slotName];
      if (_slotContent) {
        _defaultSlots['default'] = _slotContent;
      }
    }

    return _defaultSlots;
  });

  /**
   * v-show效果实现
   * @description visible默认值处理
   */
  const vShowStyle = computed<AnyRecord>(() => {
    const _isVisible = isUndefined(mergedProps.value.visible)
      ? true
      : mergedProps.value.visible;
    return _isVisible ? {} : { display: 'none' };
  });

  /**
   * 表单项的宽度样式
   * @description 根据itemProps.itemMinWidth/itemMaxWidth生成
   */
  const widthStyle = computed<AnyRecord>(() => {
    const itemProps = mergedProps.value.itemProps;
    const result: AnyRecord = {};
    const minWidth = toSizeValue(itemProps?.itemMinWidth);
    if (minWidth) {
      result.minWidth = minWidth;
    }
    const maxWidth = toSizeValue(itemProps?.itemMaxWidth);
    if (maxWidth) {
      result.maxWidth = maxWidth;
    }
    return result;
  });

  /**
   * ElFormItem的style
   */
  const formItemStyle = computed<AnyRecord>(() => {
    return {
      ...vShowStyle.value,
      ...(formItemProps.value.itemProps?.style || {}),
      ...widthStyle.value,
    };
  });

  /**
   * ElFormItem的class
   */
  const formItemClass = computed<string>(() => {
    return ['form-item', formItemProps.value.class || ''].join(' ');
  });

  /**
   * ElFormItem的插槽
   * @description 默认插槽 + 其它插槽 + 模板传入的其它插槽
   */
  const formItemSlots = computed<BaseSlots>(() => {
    // 除默认插槽之外的其他插槽
    const otherSlots = omitEntryProps(mergedProps.value.itemSlots ?? {}, [
      'default',
    ]);
    // 使用模板语法传入的其他插槽
    const templateOtherSlots = omitEntryProps(slots, ['default']);
    return {
      ...defaultSlots.value,
      ...otherSlots,
      ...templateOtherSlots,
    };
  });

  /**
   * 基于ElFormItem组件创建的组件
   * @description 响应值均由上方computed在求值作用域内同步读取，此处仅做最终vnode组装
   */
  const formItemComponent = () => {
    // v-if效果实现
    if (mergedProps.value.hidden) {
      return null;
    }

    // 如果有提供自定义渲染函数，就使用自定义渲染函数
    if (mergedProps.value.itemRender) {
      return mergedProps.value.itemRender(mergedProps.value, modelValue);
    }

    const _formItemProps = omitEntryProps(
      formItemProps.value as FormContainerItem,
      ['col', 'visible', 'hidden', 'itemProps', 'itemSlots', 'itemRender'],
    );

    return h(
      ElFormItem,
      {
        ...attrs,
        ..._formItemProps,
        ...(formItemProps.value.itemProps || {}),
        style: formItemStyle.value,
        class: formItemClass.value,
      },
      formItemSlots.value,
    );
  };
</script>

<template>
  <Component :is="formItemComponent" />
</template>

<style scoped lang="scss">
  .form-item {
    margin-bottom: 0;
    width: 100%;

    &.nowrap {
      .el-form-item__content {
        flex-wrap: nowrap;
      }
    }

    &.el-form-item--label-top {
      .el-form-item__label {
        margin-bottom: 0;
      }
    }

    .el-form-item__label {
      display: flex;
      align-items: center;
    }

    .el-input,
    .el-select,
    .el-cascader,
    .el-input-number,
    .el-date-editor,
    .el-date-picker {
      width: 100%;
    }
  }
</style>
