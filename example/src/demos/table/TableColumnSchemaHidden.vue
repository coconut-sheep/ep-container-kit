<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { ElSwitch, ElTable } from 'element-plus';
  import {
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

  /** 是否隐藏「状态」列 */
  const hideStatus = ref(false);

  const columns = [
    { prop: 'name', label: '名称', minWidth: 160 },
    { prop: 'ip', label: 'IP', minWidth: 160 },
    { prop: 'status', label: '状态', width: 110 },
  ] satisfies TableColumnItem<Asset>[];

  /**
   * `hidden` 与 `v-if` 等价
   * @description 为真的项不会被渲染成列，也不会作为属性传给 `ElTableColumn`，
   * 因此 DOM 上不会出现 `hidden="true"` 这种脏属性
   */
  const visibleColumns = computed(() => {
    return columns.map((item) => {
      if (item.prop !== 'status') {
        return item;
      }
      return { ...item, hidden: hideStatus.value };
    });
  });
</script>

<template>
  <div class="table-hidden">
    <div class="table-hidden__toolbar">
      <span class="table-hidden__label">隐藏「状态」列</span>
      <ElSwitch v-model="hideStatus" />
    </div>

    <CkTableContainer height="220">
      <ElTable :data="rows" height="100%" border>
        <CkTableColumnSchema :schema="visibleColumns">
          <template #default="{ row, column }">
            {{ row[column.property as keyof Asset] }}
          </template>
        </CkTableColumnSchema>
      </ElTable>
    </CkTableContainer>
  </div>
</template>

<style scoped lang="scss">
  .table-hidden {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    &__toolbar {
      display: flex;
      align-items: center;
      column-gap: 10px;
    }

    &__label {
      font-size: 13px;
      color: var(--el-text-color-regular);
    }
  }
</style>
