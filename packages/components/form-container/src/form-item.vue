<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import {
    COMPONENT_NAME,
    type FormContainerItem,
    type FormItemProps,
  } from '@ep-container-kit/components/form-container/src/form-item.ts';
  import { computed, h, useAttrs, useSlots } from 'vue';
  import type { AnyRecord, AnyValue, BaseSlots } from '@ep-container-kit/types';
  import { ElFormItem } from 'element-plus';
  import { isUndefined, omitEntryProps } from '@ep-container-kit/utils';
  import { createFormItemComponent } from '@ep-container-kit/components/form-container/src/utils.ts';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const modelValue = defineModel<AnyValue>({
    default: undefined,
    required: false,
  });

  const props = withDefaults(defineProps<FormItemProps>(), {
    visible: true,
    hidden: false,
    rules: () => {
      return [];
    },
    itemProps: () => {
      return {};
    },
    itemSlots: () => {
      return {};
    },
    props: () => {
      return {};
    },
    slots: () => {
      return {};
    },
    events: () => {
      return {};
    },
  });

  const slots = useSlots();
  const attrs = useAttrs();

  /**
   * 组件使用的props配置
   */
  const formItemProps = computed(() => {
    const _class: string[] = [];
    if (props.col) {
      _class.push(`column-${props.col}`);
    }

    // el-form-item组件的props配置
    const itemProps = omitEntryProps(props, [
      'type',
      'props',
      'slots',
      'events',
      'component',
      'render',
    ]);

    return {
      class: _class.join(' '),
      ...itemProps,
      ...(props.itemProps || {}),
      prop: props.prop ? String(props.prop) : '',
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
    if (props.itemRender) {
      return props.itemRender(props, modelValue);
    }

    // v-if效果实现
    if (props.hidden) {
      return null;
    }

    // visible默认值处理
    const _isVisible = isUndefined(props.visible) ? true : props.visible;
    // v-show效果实现
    const vShowStyle = _isVisible ? {} : { display: 'none' };

    // 除默认插槽之外的其他插槽
    const otherSlots = omitEntryProps(props.itemSlots, ['default']);

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
        style: {
          ...vShowStyle,
          ...(props.itemProps?.style || {}),
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
