<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import PageContainerBasic from '@/demos/page/PageContainerBasic.vue';
  import pageContainerBasicSource from '@/demos/page/PageContainerBasic.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="基础用法" :full-height="false">
      <DemoBlock
        :code="pageContainerBasicSource"
        description="CkPageContainer 铺满父级并承担滚动；这里把它限制在 320px 高的盒子里，多个 CkPageContent 纵向堆叠，超出即由容器滚动。"
      >
        <PageContainerBasic />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
