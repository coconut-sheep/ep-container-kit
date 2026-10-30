<script setup lang="ts">
  import { computed, ref } from 'vue';
  import {
    ElButton,
    ElInput,
    ElTable,
    ElTableColumn,
    ElTag,
  } from 'element-plus';
  import { CkPageContent } from 'ep-container-kit';

  type Asset = {
    id: number;
    name: string;
    ip: string;
    status: 'online' | 'offline';
  };

  const assets = ref<Asset[]>([
    { id: 1, name: 'web-01', ip: '10.0.0.11', status: 'online' },
    { id: 2, name: 'db-01', ip: '10.0.0.21', status: 'offline' },
    { id: 3, name: 'cache-01', ip: '10.0.0.31', status: 'online' },
  ]);

  const keyword = ref('');

  const filteredAssets = computed(() => {
    const key = keyword.value.trim();
    if (!key) {
      return assets.value;
    }
    return assets.value.filter((item) => {
      return item.name.includes(key) || item.ip.includes(key);
    });
  });
</script>

<template>
  <!--
    title 渲染左侧标题，右侧留给 #header 插槽；
    body-class 追加到内容区，用工具类把内容纵向排布
  -->
  <CkPageContent
    title="资产列表"
    :full-height="false"
    body-class="flex flex-column row-gap-10"
  >
    <template #header>
      <div class="page-content-basic__toolbar">
        <ElInput
          v-model="keyword"
          class="page-content-basic__input"
          clearable
          placeholder="按名称或 IP 过滤"
        />
        <ElButton type="primary">搜索</ElButton>
      </div>
    </template>

    <ElTable :data="filteredAssets" border stripe>
      <ElTableColumn prop="name" label="名称" min-width="120" />
      <ElTableColumn prop="ip" label="IP" min-width="120" />
      <ElTableColumn label="状态" width="100">
        <template #default="{ row }">
          <ElTag :type="row.status === 'online' ? 'success' : 'info'">
            {{ row.status === 'online' ? '在线' : '离线' }}
          </ElTag>
        </template>
      </ElTableColumn>
    </ElTable>
  </CkPageContent>
</template>

<style scoped lang="scss">
  .page-content-basic {
    &__toolbar {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      column-gap: 8px;
    }

    &__input {
      width: 220px;
    }
  }
</style>
