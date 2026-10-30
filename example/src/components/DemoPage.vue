<script setup lang="ts">
  import { CkPageContainer } from 'ep-container-kit';
</script>

<template>
  <CkPageContainer class="demo-page">
    <slot />
  </CkPageContainer>
</template>

<style scoped lang="scss">
  // CkPageContainer 默认是横向 flex（一行并排多个区块）。
  // 文档页需要把多张 CkPageContent 纵向堆叠，因此在这里改主轴向，
  // 而不是在库内改掉 page-container 的默认行为
  .demo-page {
    flex-direction: column;
    row-gap: 12px;
  }
</style>
