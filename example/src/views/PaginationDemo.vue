<script setup lang="ts">
  import { computed, ref, type Ref } from 'vue';
  import {
    ElAlert,
    ElButton,
    ElDivider,
    ElSwitch,
    ElTable,
    ElTableColumn,
    ElTag,
  } from 'element-plus';
  import type { PaginationConfig } from 'ep-container-kit';
  import {
    CkPageContainer,
    CkPageContent,
    CkPagination,
    getDefaultPaginationConfig,
  } from 'ep-container-kit';

  type Asset = {
    id: number;
    name: string;
    ip: string;
    status: 'online' | 'offline';
  };

  /**
   * 造一批资产数据，交给分页器按条数切片
   */
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
   * 基础分页配置
   * @description `total` 是唯一的数据入口：总页数、越界夹取都由它推算，不再接收 `pageCount`
   */
  const pagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({ total: assets.value.length }),
  );

  /** 是否禁用分页器 */
  const disabled = ref(false);

  /** 最近一次操作，用于观察事件时序 */
  const lastChange = ref('');

  const currentRows = computed(() => {
    const { currentPage, pageSize } = pagination.value;
    const start = (currentPage - 1) * pageSize;
    return assets.value.slice(start, start + pageSize);
  });

  const handleChange = (config: PaginationConfig) => {
    lastChange.value = `第 ${config.currentPage} 页 / 每页 ${config.pageSize} 条`;
  };

  const handleRowClick = (row: Asset) => {
    lastChange.value = `点击了 ${row.name}`;
  };

  const statusTag = (status: Asset['status']) => {
    return status === 'online' ? 'success' : 'info';
  };

  /**
   * 紧凑形态的分页配置
   * @description 布局声明与普通分页一字不差，`compact` 只替换渲染单元
   */
  const panelPagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({
      total: 120,
      pageSize: 20,
    }),
  );

  /**
   * 模拟一次追加加载
   * @description 真实场景里这里是请求下一页再 push 到列表，这里只推进已加载条数
   */
  const simulateLoadMore = (
    loaded: Ref<number>,
    loading: Ref<boolean>,
    step: number,
    total: number,
  ) => {
    if (loading.value) {
      return;
    }

    loading.value = true;
    window.setTimeout(() => {
      loaded.value = Math.min(loaded.value + step, total);
      loading.value = false;
    }, 400);
  };

  /** 流式加载（非紧凑形态）的配置与状态 */
  const streamPagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({
      total: 120,
      pageSize: 20,
    }),
  );
  const streamLoaded = ref(20);
  const streamLoading = ref(false);

  const handleStreamLoadMore = () => {
    simulateLoadMore(
      streamLoaded,
      streamLoading,
      streamPagination.value.pageSize,
      streamPagination.value.total,
    );
  };

  /**
   * 页长变化后让已加载条数与新页长对齐
   * @description 流式场景下 `sizes` 仍在，改页长等同于重新开始累计
   */
  const handleStreamChange = (config: PaginationConfig) => {
    streamLoaded.value = Math.min(config.pageSize, config.total);
    lastChange.value = `流式：每页 ${config.pageSize} 条`;
  };

  const resetStreamLoaded = () => {
    streamLoaded.value = Math.min(
      streamPagination.value.pageSize,
      streamPagination.value.total,
    );
  };

  const finishStreamLoaded = () => {
    streamLoaded.value = streamPagination.value.total;
  };

  /** 流式加载（紧凑形态）的配置与状态 */
  const compactStreamPagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({
      total: 60,
      pageSize: 20,
    }),
  );
  const compactStreamLoaded = ref(20);
  const compactStreamLoading = ref(false);

  const handleCompactStreamLoadMore = () => {
    simulateLoadMore(
      compactStreamLoaded,
      compactStreamLoading,
      compactStreamPagination.value.pageSize,
      compactStreamPagination.value.total,
    );
  };

  const handleCompactStreamChange = (config: PaginationConfig) => {
    compactStreamLoaded.value = Math.min(config.pageSize, config.total);
    lastChange.value = `紧凑流式：每页 ${config.pageSize} 条`;
  };

  const resetCompactStreamLoaded = () => {
    compactStreamLoaded.value = Math.min(
      compactStreamPagination.value.pageSize,
      compactStreamPagination.value.total,
    );
  };

  const finishCompactStreamLoaded = () => {
    compactStreamLoaded.value = compactStreamPagination.value.total;
  };
</script>

<template>
  <CkPageContainer>
    <CkPageContent title="分页" body-class="flex-column row-gap-10">
      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="数据完全由 v-model 提供：currentPage / pageSize / total / layout 都在配置对象里，组件就地写回，不派发 update:modelValue。"
      />

      <div class="toolbar">
        <span class="toolbar__label">禁用分页器</span>
        <ElSwitch v-model="disabled" />
        <span class="toolbar__hint">{{ lastChange || '尚未操作' }}</span>
      </div>

      <ElDivider content-position="left">基础分页</ElDivider>

      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="默认布局 sizes / prev / pager / next / jumper / loadMore / total：未开启 stream 时 loadMore 被剔除，交给 Element Plus 正常渲染。"
      />

      <ElTable :data="currentRows" @row-click="handleRowClick">
        <ElTableColumn prop="name" label="名称" min-width="160" />
        <ElTableColumn prop="ip" label="IP" min-width="140" />
        <ElTableColumn label="状态" width="100">
          <template #default="{ row }">
            <ElTag :type="statusTag(row.status)" size="small">
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

      <ElDivider content-position="left">紧凑形态（compact）</ElDivider>

      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="compact 只切换渲染单元：布局仍是同一份声明，外观换成自研单元以适配树节点 / 下拉面板，pager 只显示当前页码。"
      />

      <div class="demo-row">
        <span class="demo-row__label">下拉面板 / 树节点</span>
        <CkPagination
          v-model="panelPagination"
          compact
          :disabled="disabled"
          @change="handleChange"
        />
      </div>

      <ElDivider content-position="left">流式加载（stream，非紧凑形态）</ElDivider>

      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="stream 会把 pager / prev / next / jumper / total 一并剔除，由一个 loadMore 片段承载「加载更多 + 已加载 / 总数量」；非紧凑形态下该片段挂到 Element Plus 的 slot 位置，sizes、-> 仍由 Element Plus 渲染。加载中会整体禁用，避免中途改页长。"
      />

      <div class="demo-row">
        <CkPagination
          v-model="streamPagination"
          stream
          :loaded="streamLoaded"
          :loading="streamLoading"
          :disabled="disabled"
          @load-more="handleStreamLoadMore"
          @change="handleStreamChange"
        />
        <ElButton size="small" @click="resetStreamLoaded">重置已加载</ElButton>
        <ElButton size="small" @click="finishStreamLoaded">
          直接加载完
        </ElButton>
      </div>

      <ElDivider content-position="left">流式加载 + 紧凑形态</ElDivider>

      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="compact 与 stream 相互独立：两者叠加时只剩 sizes 与 loadMore，翻页单元与 -> 都被剔除，markup 与上一个示例完全一致，只是换成自研单元渲染。"
      />

      <div class="demo-row">
        <CkPagination
          v-model="compactStreamPagination"
          compact
          stream
          :loaded="compactStreamLoaded"
          :loading="compactStreamLoading"
          :disabled="disabled"
          @load-more="handleCompactStreamLoadMore"
          @change="handleCompactStreamChange"
        />
        <ElButton size="small" @click="resetCompactStreamLoaded">
          重置已加载
        </ElButton>
        <ElButton size="small" @click="finishCompactStreamLoaded">
          直接加载完
        </ElButton>
      </div>
    </CkPageContent>
  </CkPageContainer>
</template>

<style scoped lang="scss">
  .toolbar {
    display: flex;
    align-items: center;
    column-gap: 10px;

    &__label {
      font-size: 14px;
      color: var(--el-text-color-regular, #606266);
    }

    &__hint {
      font-size: 13px;
      color: var(--el-text-color-secondary, #909399);
    }
  }

  .demo-row {
    display: flex;
    align-items: center;
    column-gap: 16px;
    padding: 6px 12px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;

    &__label {
      flex: none;
      font-size: 13px;
      color: var(--el-text-color-secondary, #909399);
    }
  }
</style>
