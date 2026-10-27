<script setup lang="ts">
  import { COMPONENT_NAME } from './page-container';

  defineOptions({
    name: COMPONENT_NAME,
  });
</script>

<template>
  <div class="page-container">
    <slot />
  </div>
</template>

<style scoped lang="scss">
  @use '@ep-container-kit/styles/mixins' as *;

  @include ck-border-box;

  .page-container {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: transparent;
    padding: 12px;
  }
</style>
