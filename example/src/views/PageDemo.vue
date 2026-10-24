<script setup lang="ts">
  import { computed, ref } from 'vue';
  import {
    ElButton,
    ElDescriptions,
    ElDescriptionsItem,
    ElInput,
    ElMessage,
    ElTable,
    ElTableColumn,
    ElTag,
  } from 'element-plus';
  import { CkPageContainer, CkPageContent } from 'ep-container-kit';

  type Asset = {
    id: number;
    name: string;
    ip: string;
    group: string;
    status: 'online' | 'offline';
  };

  const assets = ref<Asset[]>([
    { id: 1, name: 'web-01', ip: '10.0.0.11', group: '生产环境', status: 'online' },
    { id: 2, name: 'db-01', ip: '10.0.0.21', group: '生产环境', status: 'offline' },
    { id: 3, name: 'cache-01', ip: '10.0.0.31', group: '测试环境', status: 'online' },
  ]);

  const keyword = ref('');
  /** 当前查看的资产；为 null 时展示列表页 */
  const current = ref<Asset | null>(null);

  const filteredAssets = computed(() => {
    const key = keyword.value.trim();
    if (!key) {
      return assets.value;
    }
    return assets.value.filter((item) => {
      return item.name.includes(key) || item.ip.includes(key);
    });
  });

  const handleSearch = () => {
    ElMessage.info(`已按「${keyword.value || '全部'}」过滤`);
  };

  const handleView = (row: Asset) => {
    current.value = row;
  };

  const handleBack = () => {
    current.value = null;
  };

  const handleSave = () => {
    ElMessage.success('演示环境，未实际保存');
  };
</script>

<template>
  <!--
    典型布局：CkPageContainer 铺满父级并承担滚动，
    CkPageContent 负责「标题栏 + 内容区」的两段式结构。
  -->
  <CkPageContainer>
    <!-- 列表页：标题在左、搜索区通过 #header 插槽放在右侧 -->
    <CkPageContent v-if="!current" title="资产列表">
      <template #header>
        <div class="page-demo__toolbar">
          <ElInput
            v-model="keyword"
            clearable
            placeholder="按名称或 IP 搜索"
            style="width: 220px"
            @keyup.enter="handleSearch"
          />
          <ElButton type="primary" @click="handleSearch">搜索</ElButton>
        </div>
      </template>

      <div class="page-demo__table">
        <ElTable :data="filteredAssets" border stripe>
          <ElTableColumn prop="name" label="名称" min-width="140" />
          <ElTableColumn prop="ip" label="IP" min-width="140" />
          <ElTableColumn prop="group" label="分组" min-width="120" />
          <ElTableColumn label="状态" width="110">
            <template #default="{ row }">
              <ElTag :type="row.status === 'online' ? 'success' : 'info'">
                {{ row.status === 'online' ? '在线' : '离线' }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="handleView(row as Asset)">
                查看
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </CkPageContent>

    <!-- 详情页：show-back 渲染内置返回箭头，点击后回到列表 -->
    <CkPageContent
      v-else
      :title="`资产详情 - ${current.name}`"
      show-back
      body-class="flex-column row-gap-10"
      @back-click="handleBack"
    >
      <template #header>
        <div class="page-demo__toolbar">
          <ElButton @click="handleBack">返回列表</ElButton>
          <ElButton type="primary" @click="handleSave">保存</ElButton>
        </div>
      </template>

      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="名称">{{ current.name }}</ElDescriptionsItem>
        <ElDescriptionsItem label="IP">{{ current.ip }}</ElDescriptionsItem>
        <ElDescriptionsItem label="分组">{{ current.group }}</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          {{ current.status === 'online' ? '在线' : '离线' }}
        </ElDescriptionsItem>
      </ElDescriptions>

      <div class="page-demo__tip">
        这里演示 <code>body-class</code> 透传：内容区叠加了
        <code>flex-column row-gap-10</code>，子元素纵向排列且间距 10px。
      </div>
    </CkPageContent>
  </CkPageContainer>
</template>

<style scoped lang="scss">
  .page-demo {
    &__toolbar {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      column-gap: 8px;
    }

    &__table {
      width: 100%;
    }

    &__tip {
      padding: 12px;
      font-size: 13px;
      line-height: 1.7;
      color: var(--el-text-color-secondary);
      background: var(--el-fill-color-lighter);
      border-radius: 8px;
    }
  }
</style>
