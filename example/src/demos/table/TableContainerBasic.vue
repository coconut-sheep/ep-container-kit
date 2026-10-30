<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { ElTable, ElTableColumn, ElTag } from 'element-plus';
  import {
    CkPagination,
    CkTableContainer,
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

  const pagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({ total: assets.value.length, pageSize: 10 }),
  );

  const currentRows = computed(() => {
    const { currentPage, pageSize } = pagination.value;
    const start = (currentPage - 1) * pageSize;
    return assets.value.slice(start, start + pageSize);
  });
</script>

<template>
  <!--
    CkTableContainer 是纵向 flex：内容区 flex:1 且 overflow:hidden，footer 按内容收缩。
    容器给确定高度、ElTable 再 height="100%"，表格就在内容区内滚动而不是撑破页面
  -->
  <CkTableContainer height="320">
    <ElTable :data="currentRows" height="100%" border stripe>
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

    <template #footer>
      <CkPagination v-model="pagination" />
    </template>
  </CkTableContainer>
</template>
