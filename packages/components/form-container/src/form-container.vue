<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import { computed, inject, provide, useTemplateRef } from 'vue';
  import { ElForm, type FormInstance, type FormItemProp } from 'element-plus';
  import {
    FORM_CONTAINER_PROVIDE_KEY_LIST,
    FORM_PROVIDER,
  } from '@ep-container-kit/constants';
  import type {
    AnyRecord,
    ConfigProviderProvide,
    FormContainerProvideConfig,
  } from '@ep-container-kit/types';
  import {
    filterNullishProps,
    getRefExpose,
    handleInjectValue,
    handleProvideValue,
    isArray,
    omitEntryProps,
  } from '@ep-container-kit/utils';
  import {
    COMPONENT_NAME,
    getComponentDefaultProps,
    type FormContainerEmits,
    type FormContainerProps,
  } from './form-container';
  import FormItemSchema from './form-item-schema.vue';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const sourceData = defineModel<T>('source', {
    required: false,
    default: () => {
      return {} as T;
    },
  });

  const props = defineProps<FormContainerProps<T>>();

  const emits = defineEmits<FormContainerEmits>();

  const defaultProps = getComponentDefaultProps();

  const _inject = inject<
    Partial<ConfigProviderProvide<FormContainerProvideConfig>>
  >(FORM_PROVIDER, {});

  const mergedProps = computed(() => {
    const definedProps = filterNullishProps(props);

    return {
      ...defaultProps,
      ...definedProps,
      ...handleInjectValue({
        injectValue: _inject,
        defaultValue: defaultProps,
        componentValue: definedProps,
        propList: FORM_CONTAINER_PROVIDE_KEY_LIST,
      }),
    };
  });

  /**
   * 将合并后的表单配置继续提供给下层组件
   */
  provide(
    FORM_PROVIDER,
    handleProvideValue(
      () => mergedProps.value,
      FORM_CONTAINER_PROVIDE_KEY_LIST,
    ),
  );

  /**
   * 传递给 el-form 的 props
   * @description 剔除 el-form 不认识的内部 key（schema / 提供配置 / vertical），避免其作为 fallthrough attribute 落到根元素
   */
  const formContainerProps = computed(() => {
    return omitEntryProps(mergedProps.value, [
      'schema',
      'itemMinWidth',
      'itemMaxWidth',
      'vertical',
    ]);
  });

  const formContainerRef = useTemplateRef<FormInstance>('formContainerRef');
  const formContainerClass = computed(() => {
    const result: string[] = [];
    if (mergedProps.value.vertical) {
      result.push('form-container--vertical');
    } else {
      result.push('form-container--horizontal');
    }

    return result.join(' ');
  });
  const hasSchema = computed(() => {
    if (!mergedProps.value.schema) {
      return false;
    }

    return isArray(mergedProps.value.schema);
  });

  const handleFormSubmit = () => {
    emits('submit');
  };

  const handleFormValidate = (
    prop: FormItemProp,
    isValid: boolean,
    message: string,
  ) => {
    emits('validate', prop, isValid, message);
  };

  defineExpose(getRefExpose(formContainerRef));
</script>

<template>
  <el-form
    ref="formContainerRef"
    class="form-container"
    v-bind="formContainerProps"
    :class="formContainerClass"
    :model="sourceData"
    @submit.prevent="handleFormSubmit"
    @validate="handleFormValidate"
  >
    <slot>
      <FormItemSchema
        v-if="hasSchema"
        v-model:source="sourceData"
        :schema="mergedProps.schema!"
      >
        <template
          v-for="(slotFn, slotName) in $slots"
          :key="slotName"
          #[slotName]="scope"
        >
          <Component :is="slotFn" v-bind="scope" />
        </template>
      </FormItemSchema>
    </slot>
  </el-form>
</template>

<style scoped lang="scss">
  .form-container {
    display: flex;
    row-gap: 16px;
    width: 100%;

    &.form-container--vertical {
      flex-direction: column;
      align-items: flex-start;
      flex-wrap: nowrap;
    }

    &.form-container--horizontal {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
</style>
