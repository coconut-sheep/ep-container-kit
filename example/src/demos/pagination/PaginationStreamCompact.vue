<script setup lang="ts">
  import { ref } from 'vue';
  import { ElButton } from 'element-plus';
  import {
    CkPagination,
    getDefaultPaginationConfig,
    type PaginationConfig,
  } from 'ep-container-kit';

  /**
   * 紧凑 + 流式
   * @description 两者相互独立：叠加后只剩 `sizes` 与 `loadMore`，
   * 翻页单元与 `->` 一并被剔除，markup 与非紧凑的流式写法完全一致
   */
  const pagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({ total: 60, pageSize: 20 }),
  );

  const loaded = ref(20);
  const loading = ref(false);

  const handleLoadMore = () => {
    if (loading.value) {
      return;
    }

    loading.value = true;
    window.setTimeout(() => {
      loaded.value = Math.min(
        loaded.value + pagination.value.pageSize,
        pagination.value.total,
      );
      loading.value = false;
    }, 400);
  };

  const handleChange = (config: PaginationConfig) => {
    loaded.value = Math.min(config.pageSize, config.total);
  };

  const resetLoaded = () => {
    loaded.value = Math.min(pagination.value.pageSize, pagination.value.total);
  };

  const finishLoaded = () => {
    loaded.value = pagination.value.total;
  };
</script>

<template>
  <div class="pagination-stream-compact">
    <div class="pagination-stream-compact__panel">
      <CkPagination
        v-model="pagination"
        compact
        stream
        :loaded="loaded"
        :loading="loading"
        @load-more="handleLoadMore"
        @change="handleChange"
      />
    </div>

    <div class="pagination-stream-compact__toolbar">
      <ElButton size="small" @click="resetLoaded">重置已加载</ElButton>
      <ElButton size="small" @click="finishLoaded">直接加载完</ElButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .pagination-stream-compact {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    &__panel {
      width: fit-content;
      padding: 6px 12px;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
    }

    &__toolbar {
      display: flex;
      align-items: center;
      column-gap: 8px;
    }
  }
</style>
