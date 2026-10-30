<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import FormContainerBasic from '@/demos/form/FormContainerBasic.vue';
  import formContainerBasicSource from '@/demos/form/FormContainerBasic.vue?raw';
  import FormContainerGrid from '@/demos/form/FormContainerGrid.vue';
  import formContainerGridSource from '@/demos/form/FormContainerGrid.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="基础用法" :full-height="false">
      <DemoBlock
        :code="formContainerBasicSource"
        description="用一份 schema 描述整张表单，v-model 绑定源数据；实例方法直接透传 ElForm，validate / resetFields 都能直接调用。"
      >
        <FormContainerBasic />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="栅格与横向排列" :full-height="false">
      <DemoBlock
        :code="formContainerGridSource"
        description="去掉 vertical 后容器改为横向 flex 并允许换行，col 表示占 24 栅格中的几列，语义与 el-col 的 span 一致。"
      >
        <FormContainerGrid />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
