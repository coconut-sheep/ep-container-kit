<script setup lang="ts">
  import { computed, provide } from 'vue';
  import { ElConfigProvider } from 'element-plus';
  import {
    FORM_CONTAINER_PROVIDE_KEY_LIST,
    FORM_PROVIDER,
  } from '@ep-container-kit/constants';
  import { handleProvideValue, omitEntryProps } from '@ep-container-kit/utils';
  import {
    COMPONENT_NAME,
    COMPONENT_DEFAULT_PROPS_SOURCE,
    type ConfigProviderProps,
  } from './config-provider';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = withDefaults(
    defineProps<ConfigProviderProps>(),
    COMPONENT_DEFAULT_PROPS_SOURCE,
  );

  /**
   * 提供 FormContainer 组件的 provide 属性
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
