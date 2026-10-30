<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import PageContentBack from '@/demos/page/PageContentBack.vue';
  import pageContentBackSource from '@/demos/page/PageContentBack.vue?raw';
  import PageContentBasic from '@/demos/page/PageContentBasic.vue';
  import pageContentBasicSource from '@/demos/page/PageContentBasic.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="标题与右侧操作区" :full-height="false">
      <DemoBlock
        :code="pageContentBasicSource"
        description="title 渲染左侧标题，右侧留给 header 插槽；body-class 追加到内容区，可用库里的 flex 工具类做纵向排布。"
      >
        <PageContentBasic />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="返回按钮" :full-height="false">
      <DemoBlock
        :code="pageContentBackSource"
        description="show-back 渲染内置返回箭头并派发 backClick；提供 back-icon 插槽即可整体替换图标。"
      >
        <PageContentBack />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
