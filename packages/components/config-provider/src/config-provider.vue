<script setup lang="ts">
  import {
    COMPONENT_NAME,
    FORM_CONTAINER_PROVIDE_KEY_LIST,
    type ConfigProviderProps,
  } from '@ep-container-kit/components/config-provider/src/config-provider.ts';
  import { computed, provide } from 'vue';
  import { FORM_PROVIDER } from '@ep-container-kit/constants';
  import { omitEntryProps } from '@ep-container-kit/utils';
  import { handleProvideValue } from '@ep-container-kit/components/config-provider/src/utils.ts';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = defineProps<ConfigProviderProps>();

  /**
   * 提供FormContainer 组件的 provide 属性
   */
  provide(
    FORM_PROVIDER,
    handleProvideValue(() => props.form || {}, FORM_CONTAINER_PROVIDE_KEY_LIST),
  );

  /**
   * ElConfigProvider 组件的 props 属性
   */
  const providerProps = computed(() => {
    return omitEntryProps(props, ['form']);
  });
</script>

<template>
  <el-config-provider v-bind="providerProps">
    <slot />
  </el-config-provider>
</template>

<style scoped lang="scss"></style>
