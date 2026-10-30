<script setup lang="ts">
  import { CkPageContainer, CkPageContent } from 'ep-container-kit';

  const blocks = [
    {
      title: '概览',
      text: 'CkPageContainer 铺满父级并承担滚动，CkPageContent 负责「标题栏 + 内容区」。',
    },
    {
      title: '资源用量',
      text: '外层容器高度固定为 320px，内容超出时由 page-container 自身滚动，而不是撑破页面。',
    },
    {
      title: '变更记录',
      text: '多个 CkPageContent 之间用 row-gap 分隔，间距由外层 flex 容器统一控制。',
    },
  ];
</script>

<template>
  <div class="page-container-basic">
    <CkPageContainer class="page-container-basic__inner">
      <CkPageContent
        v-for="block in blocks"
        :key="block.title"
        :title="block.title"
        :full-height="false"
      >
        <p class="page-container-basic__text">{{ block.text }}</p>
      </CkPageContent>
    </CkPageContainer>
  </div>
</template>

<style scoped lang="scss">
  // 给 page-container 一个确定高度，它才能接管滚动
  .page-container-basic {
    height: 320px;
    overflow: hidden;
    border: 1px solid var(--el-border-color);
    border-radius: 8px;

    // page-container 默认横向排列，这里改成纵向堆叠多张 page-content
    &__inner {
      flex-direction: column;
      row-gap: 12px;
    }

    &__text {
      width: 100%;
      margin: 0;
      font-size: 13px;
      line-height: 1.7;
      color: var(--el-text-color-regular);
    }
  }
</style>
