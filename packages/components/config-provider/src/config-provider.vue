<script setup lang="ts">
  import { computed, provide } from 'vue';
  import { ElConfigProvider } from 'element-plus';
  import {
    FORM_CONTAINER_PROVIDE_KEYS,
    FORM_CONTAINER_PROVIDER,
  } from '@ep-container-kit/components/form-container';
  import {
    TABLE_CONTAINER_PROVIDE_KEYS,
    TABLE_CONTAINER_PROVIDER,
  } from '@ep-container-kit/components/table-container';
  import {
    buildPropsDefaultValues,
    filterNullishProps,
    handleProvideValue,
    omitEntryProps,
  } from '@ep-container-kit/utils';
  import {
    COMPONENT_NAME,
    COMPONENT_DEFAULT_PROPS_HOLDER,
    COMPONENT_DEFAULT_PROPS,
    type ConfigProviderProps,
  } from './config-provider';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = withDefaults(
    defineProps<ConfigProviderProps>(),
    COMPONENT_DEFAULT_PROPS_HOLDER,
  );

  const defaultProps = buildPropsDefaultValues<ConfigProviderProps>(
    COMPONENT_DEFAULT_PROPS,
  );
  const mergedProps = computed<ConfigProviderProps>(() => {
    const definedProps = filterNullishProps(props);
    return {
      ...defaultProps,
      ...definedProps,
    };
  });

  /**
   * 提供 FormContainer 组件的 provide 属性
   */
  provide(
    FORM_CONTAINER_PROVIDER,
    handleProvideValue(
      () => mergedProps.value.formContainer || {},
      FORM_CONTAINER_PROVIDE_KEYS,
    ),
  );

  /**
   * 提供 TableContainer 组件的 provide 属性
   * @description 由于不提供 Table 与 TableColumn 的封装，这份配置最终只作用于 `ElTableColumn`
   */
  provide(
    TABLE_CONTAINER_PROVIDER,
    handleProvideValue(
      () => mergedProps.value.tableContainer || {},
      TABLE_CONTAINER_PROVIDE_KEYS,
    ),
  );

  /**
   * ElConfigProvider 组件的 props 属性
   */
  const providerProps = computed(() => {
    return omitEntryProps(mergedProps.value, [
      'formContainer',
      'tableContainer',
    ]);
  });
</script>

<template>
  <el-config-provider v-bind="providerProps">
    <slot />
  </el-config-provider>
</template>

<style scoped lang="scss"></style>
