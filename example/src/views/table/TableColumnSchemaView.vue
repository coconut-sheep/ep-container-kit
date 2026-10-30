<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import TableColumnSchemaBasic from '@/demos/table/TableColumnSchemaBasic.vue';
  import tableColumnSchemaBasicSource from '@/demos/table/TableColumnSchemaBasic.vue?raw';
  import TableColumnSchemaHidden from '@/demos/table/TableColumnSchemaHidden.vue';
  import tableColumnSchemaHiddenSource from '@/demos/table/TableColumnSchemaHidden.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="列 Schema" :full-height="false">
      <DemoBlock
        :code="tableColumnSchemaBasicSource"
        description="一份 schema 批量渲染 ElTableColumn；columnProps 是所有列共享的属性，schema 项自身属性优先。slot_ + prop 的定向插槽可单独接管某一列。"
      >
        <TableColumnSchemaBasic />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="hidden：只控制是否渲染" :full-height="false">
      <DemoBlock
        :code="tableColumnSchemaHiddenSource"
        description="hidden 等价 v-if：为真的项不会渲染成列，也不会作为属性落到 ElTableColumn 上，DOM 里不会出现 hidden 属性。"
      >
        <TableColumnSchemaHidden />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
