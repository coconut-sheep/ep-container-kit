<script setup lang="ts">
  import { ref } from 'vue';
  import {
    CkPagination,
    getDefaultPaginationConfig,
    type PaginationConfig,
  } from 'ep-container-kit';

  /**
   * 紧凑形态
   * @description 布局声明与普通分页一字不差，`compact` 只替换渲染单元，
   * 用于下拉面板、树节点这类空间受限的位置
   */
  const pagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({ total: 120, pageSize: 20 }),
  );

  const lastChange = ref('');

  const handleChange = (config: PaginationConfig) => {
    lastChange.value = `第 ${config.currentPage} 页 / 每页 ${config.pageSize} 条`;
  };
</script>

<template>
  <div class="pagination-compact">
    <div class="pagination-compact__panel">
      <span class="pagination-compact__label">下拉面板 / 树节点</span>
      <CkPagination v-model="pagination" compact @change="handleChange" />
    </div>

    <span class="pagination-compact__hint">
      {{ lastChange || '紧凑形态下 pager 只显示当前页码' }}
    </span>
  </div>
</template>

<style scoped lang="scss">
  .pagination-compact {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    &__panel {
      display: flex;
      align-items: center;
      column-gap: 16px;
      width: fit-content;
      padding: 6px 12px;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
    }

    &__label {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }

    &__hint {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
</style>
