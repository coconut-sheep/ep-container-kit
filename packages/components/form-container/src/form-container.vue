<script setup lang="ts">
  import {
    COMPONENT_NAME,
    type FormContainerEmits,
    type FormContainerInstance,
    type FormContainerProps,
  } from '@ep-container-kit/components/form-container/src/form-container.ts';
  import { computed, useTemplateRef } from 'vue';
  import { getPropsDefaultValue, getRefExpose } from '@ep-container-kit/utils';
  import type { EmitsToTuples } from '@ep-container-kit/types';
  import { ElForm, type FormItemProp } from 'element-plus';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = withDefaults(defineProps<FormContainerProps>(), {
    ...getPropsDefaultValue(ElForm.props),
    vertical: false,
  });

  const emits = defineEmits<EmitsToTuples<FormContainerEmits>>();

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
    @submit.prevent="handleFormSubmit"
    @validate="handleFormValidate"
  >
    <slot />
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
