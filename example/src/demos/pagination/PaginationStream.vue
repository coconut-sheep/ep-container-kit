<script setup lang="ts">
  import { ref } from 'vue';
  import { ElButton } from 'element-plus';
  import {
    CkPagination,
    getDefaultPaginationConfig,
    type PaginationConfig,
  } from 'ep-container-kit';

  /**
   * 流式加载
   * @description `stream` 会把 pager / prev / next / jumper / total 一并剔除，
   * 由 `loadMore` 片段承载「加载更多 + 已加载 / 总数量」
   */
  const pagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({ total: 120, pageSize: 20 }),
  );

  /** 已加载条数，由业务侧维护 */
  const loaded = ref(20);
  const loading = ref(false);

  const lastChange = ref('');

  /**
   * 模拟一次追加加载
   * @description 真实场景里这里是请求下一页再 push 到列表，这里只推进已加载条数
   */
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

  /** 改页长等同于重新开始累计 */
  const handleChange = (config: PaginationConfig) => {
    loaded.value = Math.min(config.pageSize, config.total);
    lastChange.value = `每页 ${config.pageSize} 条`;
  };

  const resetLoaded = () => {
    loaded.value = Math.min(pagination.value.pageSize, pagination.value.total);
  };

  const finishLoaded = () => {
    loaded.value = pagination.value.total;
  };
</script>

<template>
  <div class="pagination-stream">
    <CkPagination
      v-model="pagination"
      stream
      :loaded="loaded"
      :loading="loading"
      @load-more="handleLoadMore"
      @change="handleChange"
    />

    <div class="pagination-stream__toolbar">
      <ElButton size="small" @click="resetLoaded">重置已加载</ElButton>
      <ElButton size="small" @click="finishLoaded">直接加载完</ElButton>
      <span class="pagination-stream__hint">
        {{ lastChange || '尚未翻页' }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .pagination-stream {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    &__toolbar {
      display: flex;
      align-items: center;
      column-gap: 8px;
    }

    &__hint {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
</style>
