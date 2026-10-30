<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import TableContainerBasic from '@/demos/table/TableContainerBasic.vue';
  import tableContainerBasicSource from '@/demos/table/TableContainerBasic.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="固定高度与 footer" :full-height="false">
      <DemoBlock
        :code="tableContainerBasicSource"
        description="CkTableContainer 是纵向 flex：内容区 flex:1 且 overflow:hidden，footer 按内容收缩。容器给确定高度、ElTable 再 height=100%，表格就在内容区内滚动而不是撑破页面。"
      >
        <TableContainerBasic />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
