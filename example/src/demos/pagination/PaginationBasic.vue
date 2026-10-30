<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { ElSwitch, ElTable, ElTableColumn, ElTag } from 'element-plus';
  import {
    CkPagination,
    getDefaultPaginationConfig,
    type PaginationConfig,
  } from 'ep-container-kit';

  type Asset = {
    id: number;
    name: string;
    ip: string;
    status: 'online' | 'offline';
  };

  const assets = ref<Asset[]>(
    Array.from({ length: 47 }, (_, index) => {
      const serial = String(index + 1).padStart(2, '0');
      return {
        id: index + 1,
        name: `asset-${serial}`,
        ip: `10.0.1.${index + 1}`,
        status: index % 3 === 0 ? 'offline' : 'online',
      };
    }),
  );

  /**
   * 分页配置即数据源
   * @description `total` 是唯一的数据入口，总页数与越界夹取都由它推算
   */
  const pagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({ total: assets.value.length, pageSize: 10 }),
  );

  /** 是否禁用整个分页器 */
  const disabled = ref(false);

  /** 最近一次操作，用于观察 change 的触发时机 */
  const lastChange = ref('');

  const currentRows = computed(() => {
    const { currentPage, pageSize } = pagination.value;
    const start = (currentPage - 1) * pageSize;
    return assets.value.slice(start, start + pageSize);
  });

  /**
   * 页码或每页条数变更
   * @description 事件在 `nextTick` 中派发，此时 `pagination` 已是最新值
   */
  const handleChange = (config: PaginationConfig) => {
    lastChange.value = `第 ${config.currentPage} 页 / 每页 ${config.pageSize} 条`;
  };
</script>

<template>
  <div class="pagination-basic">
    <div class="pagination-basic__toolbar">
      <span class="pagination-basic__label">禁用分页器</span>
      <ElSwitch v-model="disabled" />
      <span class="pagination-basic__hint">{{ lastChange || '尚未操作' }}</span>
    </div>

    <ElTable :data="currentRows" border stripe>
      <ElTableColumn prop="name" label="名称" min-width="140" />
      <ElTableColumn prop="ip" label="IP" min-width="140" />
      <ElTableColumn label="状态" width="100">
        <template #default="{ row }">
          <ElTag
            :type="row.status === 'online' ? 'success' : 'info'"
            size="small"
          >
            {{ row.status === 'online' ? '在线' : '离线' }}
          </ElTag>
        </template>
      </ElTableColumn>
    </ElTable>

    <CkPagination
      v-model="pagination"
      :disabled="disabled"
      @change="handleChange"
    />
  </div>
</template>

<style scoped lang="scss">
  .pagination-basic {
    display: flex;
    flex-direction: column;
    row-gap: 12px;

    &__toolbar {
      display: flex;
      align-items: center;
      column-gap: 10px;
    }

    &__label {
      font-size: 13px;
      color: var(--el-text-color-regular);
    }

    &__hint {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
</style>
