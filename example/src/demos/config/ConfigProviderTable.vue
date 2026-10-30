<script setup lang="ts">
  import { ref } from 'vue';
  import { ElTable } from 'element-plus';
  import {
    CkConfigProvider,
    CkTableColumnSchema,
    CkTableContainer,
    type TableColumnItem,
  } from 'ep-container-kit';

  type Asset = {
    id: number;
    name: string;
    ip: string;
    status: 'online' | 'offline';
  };

  const rows = ref<Asset[]>([
    { id: 1, name: 'web-01', ip: '10.0.0.11', status: 'online' },
    { id: 2, name: 'db-01', ip: '10.0.0.21', status: 'offline' },
    { id: 3, name: 'cache-01', ip: '10.0.0.31', status: 'online' },
  ]);

  const columns = [
    { prop: 'name', label: '名称', minWidth: 160 },
    { prop: 'ip', label: 'IP', minWidth: 160 },
    { prop: 'status', label: '状态', width: 120 },
  ] satisfies TableColumnItem<Asset>[];
</script>

<template>
  <div class="config-table">
    <!-- 注入的 align: right 会被组件自身 columnProps 的 align: center 整体覆盖 -->
    <CkConfigProvider
      :table-container="{ align: 'right', headerAlign: 'center' }"
    >
      <CkTableContainer height="240">
        <ElTable :data="rows" height="100%" border>
          <CkTableColumnSchema
            :schema="columns"
            :column-props="{ align: 'center' }"
          >
            <template #slot_status="{ row }">
              {{ row.status === 'online' ? '在线' : '离线' }}
            </template>
          </CkTableColumnSchema>
        </ElTable>
      </CkTableContainer>
    </CkConfigProvider>

    <p class="config-table__hint">
      注入的
      <code>align: right</code>
      被组件自身
      <code>columnProps</code>
      的
      <code>align: center</code>
      覆盖，而
      <code>headerAlign</code>
      没有在组件上重写， 于是按注入值生效——同一张表里能同时看到两级的胜负。
    </p>
  </div>
</template>

<style scoped lang="scss">
  .config-table {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    &__hint {
      margin: 0;
      font-size: 13px;
      line-height: 1.7;
      color: var(--el-text-color-secondary);
    }
  }
</style>
