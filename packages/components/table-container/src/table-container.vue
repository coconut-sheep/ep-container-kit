<script setup lang="ts">
  import {
    COMPONENT_DEFAULT_PROPS,
    COMPONENT_DEFAULT_PROPS_HOLDER,
    COMPONENT_NAME,
    type TableContainerProps,
    type TableContainerSlots,
  } from './table-container';
  import {
    buildPropsDefaultValues,
    filterNullishProps,
    toSizeValue,
  } from '@ep-container-kit/utils';
  import { computed, type CSSProperties, useSlots } from 'vue';

  defineOptions({
    name: COMPONENT_NAME,
  });

  defineSlots<TableContainerSlots>();

  const props = withDefaults(
    defineProps<TableContainerProps>(),
    COMPONENT_DEFAULT_PROPS_HOLDER,
  );
  const slots = useSlots();

  const defaultProps = buildPropsDefaultValues<TableContainerProps>(
    COMPONENT_DEFAULT_PROPS,
  );
  const mergedProps = computed<TableContainerProps>(() => {
    const definedProps = filterNullishProps(props);

    return {
      ...defaultProps,
      ...definedProps,
    };
  });

  const sizeStyle = computed(() => {
    const result: CSSProperties = {};

    const width = toSizeValue(mergedProps.value?.width);
    if (width) {
      result.width = width;
    }

    const height = toSizeValue(mergedProps.value?.height);
    if (height) {
      result.height = height;
    }

    return result;
  });
</script>

<template>
  <div class="table-container" :style="sizeStyle">
    <div class="table-container--body" :class="mergedProps.bodyClass">
      <slot />
    </div>
    <div
      v-if="slots.footer"
      class="table-container--footer"
      :class="mergedProps.footerClass"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '@ep-container-kit/styles/mixins' as *;

  @include ck-border-box;

  .table-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;

    .table-container--body {
      display: flex;
      width: 100%;
      flex: 1;
      overflow: hidden;
    }

    .table-container--footer {
      display: flex;
      width: 100%;
      justify-content: flex-end;
    }
  }
</style>
