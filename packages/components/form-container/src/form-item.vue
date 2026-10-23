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

  const mergedProps = computed<FormItemProps>(() => {
    const definedProps = filterNullishProps(props);
    const defaultProps = getComponentDefaultProps();

    // 上层注入的props
    const injectProps = handleInjectValue({
      injectValue: _inject,
      defaultValue: (defaultProps.itemProps ||
        {}) as FormContainerProvideConfig,
      componentValue: (definedProps.itemProps ||
        {}) as FormContainerProvideConfig,
      propList: FORM_CONTAINER_PROVIDE_KEY_LIST,
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
    if (props.col) {
      _class.push(`column-${props.col}`);
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

    const _defaultProps = getComponentDefaultProps();

    return {
      class: _class.join(' '),
      ..._formItemProps,
      prop: handleFormItemProp(mergedProps.value, 'prop', _defaultProps.prop),
      label: handleFormItemProp(
        mergedProps.value,
        'label',
        _defaultProps.label,
      ),
      rules: handleFormItemProp(
        mergedProps.value,
        'rules',
        _defaultProps.rules,
      ),
    };
  });

  /**
   * 组件使用的默认插槽
   */
  const defaultSlots = computed(() => {
    const _defaultSlots: BaseSlots = {};

    // 通过配置生成的默认插槽
    const _component = createFormItemComponent(props, modelValue);
    if (_component) {
      _defaultSlots['default'] = () => _component;
    }

    // 使用配置属性提供的默认插槽
    if (props.itemSlots?.default) {
      _defaultSlots['default'] = props.itemSlots.default;
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
   * 基于ElFormItem组件创建的组件
   */
  const formItemComponent = () => {
    // 如果有提供自定义渲染函数，就使用自定义渲染函数
    if (mergedProps.value.itemRender) {
      return mergedProps.value.itemRender(props, modelValue);
    }

    // v-if效果实现
    if (mergedProps.value.hidden) {
      return null;
    }

    // visible默认值处理
    const _isVisible = isUndefined(mergedProps.value.visible)
      ? true
      : mergedProps.value.visible;
    // v-show效果实现
    const vShowStyle = _isVisible ? {} : { display: 'none' };

    // 除默认插槽之外的其他插槽
    const otherSlots = omitEntryProps(mergedProps.value.itemSlots ?? {}, [
      'default',
    ]);

    // 使用模板语法传入的其他插槽
    const templateOtherSlots = omitEntryProps(slots, ['default']);

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
        style: {
          ...vShowStyle,
          ...(formItemProps.value.itemProps?.style || {}),
        },
        class: ['form-item', formItemProps.value.class || ''].join(' '),
      },
      {
        ...defaultSlots.value,
        ...otherSlots,
        ...templateOtherSlots,
      },
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
