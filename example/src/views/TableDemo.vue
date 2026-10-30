<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { ElAlert, ElDivider, ElSwitch, ElTable, ElTag } from 'element-plus';
  import type { PaginationConfig, TableColumnItem } from 'ep-container-kit';
  import {
    CkConfigProvider,
    CkPageContainer,
    CkPageContent,
    CkPagination,
    CkTableColumnSchema,
    CkTableContainer,
    getDefaultPaginationConfig,
  } from 'ep-container-kit';

  type Asset = {
    id: number;
    name: string;
    ip: string;
    group: string;
    status: 'online' | 'offline';
  };

  /**
   * 造一批资产数据
   * @description 47 条刚好用来看分页切片，条数不是页长的整数倍
   */
  const assets = ref<Asset[]>(
    Array.from({ length: 47 }, (_, index) => {
      const serial = String(index + 1).padStart(2, '0');
      return {
        id: index + 1,
        name: `asset-${serial}`,
        ip: `10.0.1.${index + 1}`,
        group: index % 2 === 0 ? '生产环境' : '测试环境',
        status: index % 3 === 0 ? 'offline' : 'online',
      };
    }),
  );

  /**
   * 列配置
   * @description 用 `satisfies` 而不是类型标注：既能校验 `prop` 必须是 `Asset` 的键，
   * 又不会把 `slots` 一起带进推断结果（`slots` 的函数参数是逆变的，
   * 标注成 `TableColumnItem<Asset>[]` 后无法再传给组件的 `TableColumnItem<AnyRecord>[]`）
   */
  const columns = [
    { prop: 'name', label: '名称', minWidth: 160 },
    { prop: 'ip', label: 'IP', minWidth: 140 },
    { prop: 'group', label: '分组', minWidth: 120 },
    { prop: 'status', label: '状态', width: 100 },
  ] satisfies TableColumnItem<Asset>[];

  /** 基础示例的分页配置 */
  const pagination = ref<PaginationConfig>(
    getDefaultPaginationConfig({ total: assets.value.length, pageSize: 10 }),
  );

  /** 最近一次分页操作，用于观察 change 的触发时机 */
  const lastChange = ref('');

  const currentRows = computed(() => {
    const { currentPage, pageSize } = pagination.value;
    const start = (currentPage - 1) * pageSize;
    return assets.value.slice(start, start + pageSize);
  });

  /**
   * 分页变更
   * @description 事件在 `nextTick` 中派发，此时 `pagination` 已是最新值，直接读即可
   */
  const handleChange = (config: PaginationConfig) => {
    lastChange.value = `第 ${config.currentPage} 页 / 每页 ${config.pageSize} 条`;
  };

  /** 是否隐藏「状态」列，演示 `hidden` 只影响渲染、不落到 ElTableColumn 上 */
  const hideStatus = ref(false);

  /**
   * 带 `hidden` 开关的列配置
   * @description `hidden` 与 `v-if` 等价：为真的项不会被渲染成列，
   * 但也不会作为属性传给 `ElTableColumn`，因此不会出现在 DOM 属性里
   */
  const hiddenColumns = computed(() => {
    return columns.map((item) => {
      if (item.prop !== 'status') {
        return item;
      }
      return { ...item, hidden: hideStatus.value };
    });
  });

  /** 是否提供 `slot_status` 定向插槽，用于演示三级插槽优先级 */
  const usePropSlot = ref(false);

  /**
   * 插槽示例的列配置
   * @description 第一列的 `slots.default` 是「最低优先级」的来源，会被模板插槽覆盖
   */
  const slotColumns = [
    {
      prop: 'name',
      label: '名称（优先级最低的 item 插槽）',
      minWidth: 220,
      slots: {
        default: () => 'item.slots.default',
      },
    },
    { prop: 'ip', label: 'IP（只受模板插槽影响）', minWidth: 220 },
    { prop: 'status', label: '状态（可被 slot_status 接管）', minWidth: 220 },
  ] satisfies TableColumnItem<Asset>[];
</script>

<template>
  <CkPageContainer>
    <CkPageContent title="表格" body-class="flex-column row-gap-10">
      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="组件库不封装 ElTable：它自身功能面太广，包一层只会变成负担。这里只补两件事——高度布局（CkTableContainer）与列的批量渲染（CkTableColumnSchema）。"
      />

      <ElDivider content-position="left">容器 + 列 Schema + 分页</ElDivider>

      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="CkTableContainer 是纵向 flex：内容区 flex:1 且 overflow:hidden，footer 按内容收缩。给容器一个确定高度、并让 ElTable 也 height=100%，表格就会在内容区内滚动而不是撑破页面。"
      />

      <!--
        固定高度 320 只为了让示例在页面里可预期；
        真实页面通常是 height="100%"，由上层页面容器提供确定高度。
      -->
      <CkTableContainer height="320" body-class="table-demo__body">
        <ElTable :data="currentRows" height="100%" border stripe>
          <!-- columnProps 下发的是「所有列共享」的那一份，schema 项自身属性优先 -->
          <CkTableColumnSchema
            :schema="columns"
            :column-props="{ align: 'center', showOverflowTooltip: true }"
          >
            <!-- 模板默认插槽作用于所有列，这里按列自身声明的 prop 取对应字段 -->
            <template #default="{ row, column }">
              {{ row[column.property as keyof Asset] }}
            </template>
            <!-- slot_${prop} 定向插槽只接管 prop 为 status 的那一列 -->
            <template #slot_status="{ row }">
              <ElTag
                :type="row.status === 'online' ? 'success' : 'info'"
                size="small"
              >
                {{ row.status === 'online' ? '在线' : '离线' }}
              </ElTag>
            </template>
          </CkTableColumnSchema>
        </ElTable>

        <template #footer>
          <CkPagination v-model="pagination" @change="handleChange" />
        </template>
      </CkTableContainer>

      <div class="table-demo__hint">
        {{ lastChange || '尚未翻页' }}
      </div>

      <ElDivider content-position="left">hidden：只控制是否渲染</ElDivider>

      <div class="table-demo__toolbar">
        <span class="table-demo__label">隐藏「状态」列</span>
        <ElSwitch v-model="hideStatus" />
      </div>

      <CkTableContainer height="260" body-class="table-demo__body">
        <ElTable :data="currentRows.slice(0, 5)" height="100%" border>
          <CkTableColumnSchema :schema="hiddenColumns">
            <template #slot_status="{ row }">
              <ElTag
                :type="row.status === 'online' ? 'success' : 'info'"
                size="small"
              >
                {{ row.status === 'online' ? '在线' : '离线' }}
              </ElTag>
            </template>
          </CkTableColumnSchema>
        </ElTable>
      </CkTableContainer>

      <ElDivider content-position="left">三级插槽优先级</ElDivider>

      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="默认插槽的来源由低到高：schema 项的 slots.default → 模板 #default → slot_${prop} 定向插槽。下层永远覆盖上层，不是叠加。"
      />

      <div class="table-demo__toolbar">
        <span class="table-demo__label">启用 slot_status 定向插槽</span>
        <ElSwitch v-model="usePropSlot" />
      </div>

      <CkTableContainer height="260" body-class="table-demo__body">
        <ElTable :data="currentRows.slice(0, 5)" height="100%" border>
          <CkTableColumnSchema :schema="slotColumns">
            <!-- 模板默认插槽覆盖每一列的 item.slots.default -->
            <template #default="{ row }">
              <span class="table-demo__slot table-demo__slot--normal">
                模板 #default（{{ row.name }}）
              </span>
            </template>
            <!-- 定向插槽按 prop 匹配，优先级最高；不提供时该列回落到模板 #default -->
            <template v-if="usePropSlot" #slot_status="{ row }">
              <span class="table-demo__slot table-demo__slot--strong">
                slot_status（{{ row.status === 'online' ? '在线' : '离线' }}）
              </span>
            </template>
          </CkTableColumnSchema>
        </ElTable>
      </CkTableContainer>

      <ElDivider content-position="left">全局配置：tableContainer</ElDivider>

      <ElAlert
        :closable="false"
        type="info"
        show-icon
        title="由于不封装 Table 与 TableColumn，这份全局配置最终只作用于 ElTableColumn。prop / property / label / hidden 是每列各自不同的属性，不参与下发。"
      />

      <CkConfigProvider
        :table-container="{ align: 'right', headerAlign: 'center' }"
      >
        <CkTableContainer height="240" body-class="table-demo__body">
          <ElTable :data="currentRows.slice(0, 4)" height="100%" border>
            <!-- 组件自身的 columnProps 优先级高于注入值 -->
            <CkTableColumnSchema
              :schema="columns"
              :column-props="{ align: 'center' }"
            >
              <template #slot_status="{ row }">
                <ElTag
                  :type="row.status === 'online' ? 'success' : 'info'"
                  size="small"
                >
                  {{ row.status === 'online' ? '在线' : '离线' }}
                </ElTag>
              </template>
            </CkTableColumnSchema>
          </ElTable>
        </CkTableContainer>
      </CkConfigProvider>

      <div class="table-demo__hint">
        注入的
        <code>align: right</code>
        被组件自身
        <code>columnProps</code>
        的
        <code>align: center</code>
        整体覆盖，而
        <code>headerAlign</code>
        没有在组件上重写， 于是按注入值生效——同一张表里能同时看到两级的胜负。
      </div>
    </CkPageContent>
  </CkPageContainer>
</template>

<style scoped lang="scss">
  .table-demo {
    &__body {
      // 内容区已是 flex:1，这里只需要让 ElTable 撑满宽度，高度由 height="100%" 决定
      min-width: 0;
    }

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
      line-height: 1.7;
      color: var(--el-text-color-secondary);
    }

    &__slot {
      &--normal {
        color: var(--el-color-primary);
      }

      &--strong {
        font-weight: 600;
        color: var(--el-color-danger);
      }
    }
  }
</style>
