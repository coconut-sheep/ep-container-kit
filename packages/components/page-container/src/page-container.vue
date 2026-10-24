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
    // 纯色页面底色：不使用半透明叠层与 backdrop-filter，
    // 避免组件库侵入宿主的玻璃拟态主题，宿主可用 --el-bg-color-page 覆盖
    background: var(--el-bg-color-page, transparent);
  }
</style>
