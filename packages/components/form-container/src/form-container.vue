<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import {
    COMPONENT_NAME,
    type FormContainerEmits,
    type FormContainerInstance,
    type FormContainerProps,
  } from '@ep-container-kit/components/form-container/src/form-container.ts';
  import { computed, useTemplateRef } from 'vue';
  import {
    getPropsDefaultValue,
    getRefExpose,
    isArray,
  } from '@ep-container-kit/utils';
  import type { AnyRecord, EmitsToTuples } from '@ep-container-kit/types';
  import { ElForm, type FormItemProp } from 'element-plus';
  import FormItemSchema from '@ep-container-kit/components/form-container/src/form-item-schema.vue';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = withDefaults(defineProps<FormContainerProps<T>>(), {
    ...getPropsDefaultValue(ElForm.props),
    vertical: false,
  });

  const emits = defineEmits<EmitsToTuples<FormContainerEmits>>();

  // schema 渲染时的数据源
  const sourceData = defineModel<T>('source', {
    required: false,
    default: () => {
      return {} as T;
    },
  });

  const formContainerRef =
    useTemplateRef<FormContainerInstance>('formContainerRef');

  const formContainerClass = computed(() => {
    const result: string[] = [];
    if (props.vertical) {
      result.push('form-container--vertical');
    } else {
      result.push('form-container--horizontal');
    }

    return result.join(' ');
  });

  // 是否以 schema 方式渲染
  const hasSchema = computed(() => props.schema && isArray(props.schema));

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
    v-bind="props"
    :class="formContainerClass"
    :model="sourceData"
    @submit.prevent="handleFormSubmit"
    @validate="handleFormValidate"
  >
    <!-- schema 模式：委托给 FormItemSchema 渲染 -->
    <template v-if="hasSchema">
      <FormItemSchema v-model:source="sourceData" :schema="props.schema!">
        <template
          v-for="(slotFn, slotName) in $slots"
          :key="slotName"
          #[slotName]="scope"
        >
          <Component :is="slotFn" v-bind="scope" />
        </template>
      </FormItemSchema>
    </template>

    <!-- 默认插槽模式 -->
    <slot v-else />
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
