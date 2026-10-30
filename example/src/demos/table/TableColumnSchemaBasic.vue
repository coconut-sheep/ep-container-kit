<script setup lang="ts">
  import { ref } from 'vue';
  import { ElTable, ElTag } from 'element-plus';
  import {
    CkTableColumnSchema,
    CkTableContainer,
    type TableColumnItem,
  } from 'ep-container-kit';

  type Asset = {
    id: number;
    name: string;
    ip: string;
    group: string;
    status: 'online' | 'offline';
  };

  const rows = ref<Asset[]>([
    {
      id: 1,
      name: 'web-01',
      ip: '10.0.0.11',
      group: '生产环境',
      status: 'online',
    },
    {
      id: 2,
      name: 'db-01',
      ip: '10.0.0.21',
      group: '生产环境',
      status: 'offline',
    },
    {
      id: 3,
      name: 'cache-01',
      ip: '10.0.0.31',
      group: '测试环境',
      status: 'online',
    },
    {
      id: 4,
      name: 'mq-01',
      ip: '10.0.0.41',
      group: '测试环境',
      status: 'online',
    },
  ]);

  /**
   * 列配置
   * @description 用 `satisfies` 而不是类型标注：既能校验 `prop` 必须是 `Asset` 的键，
   * 又不会把推断结果绑定到某个具体泛型上
   */
  const columns = [
    { prop: 'name', label: '名称', minWidth: 160 },
    { prop: 'ip', label: 'IP', minWidth: 160 },
    { prop: 'group', label: '分组', minWidth: 140 },
    { prop: 'status', label: '状态', width: 110 },
  ] satisfies TableColumnItem<Asset>[];
</script>

<template>
  <CkTableContainer height="260">
    <ElTable :data="rows" height="100%" border>
      <!--
        columnProps 是「所有列共享」的那一份，
        schema 项自身的属性优先级更高
      -->
      <CkTableColumnSchema
        :schema="columns"
        :column-props="{ align: 'center', showOverflowTooltip: true }"
      >
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
  </CkTableContainer>
</template>
