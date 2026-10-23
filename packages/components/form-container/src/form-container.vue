<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import {
    COMPONENT_NAME,
    getComponentDefaultProps,
    type FormContainerEmits,
    type FormContainerProps,
  } from '@ep-container-kit/components/form-container/src/form-container.ts';
  import { computed, inject, provide, useTemplateRef } from 'vue';
  import {
    filterNullishProps,
    getRefExpose,
    isArray,
  } from '@ep-container-kit/utils';
  import type { AnyRecord, EmitsToTuples } from '@ep-container-kit/types';
  import { ElForm, type FormInstance, type FormItemProp } from 'element-plus';
  import FormItemSchema from '@ep-container-kit/components/form-container/src/form-item-schema.vue';
  import { FORM_PROVIDER } from '@ep-container-kit/constants';
  import {
    FORM_CONTAINER_PROVIDE_KEY_LIST,
    type ConfigProviderProvide,
    type FormContainerProvideConfig,
  } from '@ep-container-kit/components/config-provider/src/config-provider.ts';
  import {
    handleInjectValue,
    handleProvideValue,
  } from '@ep-container-kit/components/config-provider/src/utils.ts';

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

  const emits = defineEmits<EmitsToTuples<FormContainerEmits>>();

  const _inject = inject<
    Partial<ConfigProviderProvide<FormContainerProvideConfig>>
  >(FORM_PROVIDER, {});

  const mergedProps = computed(() => {
    const defaultProps = getComponentDefaultProps();
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
    if (!isValid) {
      formContainerRef.value?.scrollToField(prop);
    }
    emits('validate', prop, isValid, message);
  };

  defineExpose(getRefExpose(formContainerRef));
</script>

<template>
  <el-form
    ref="formContainerRef"
    class="form-container"
    v-bind="mergedProps"
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
