<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import PaginationBasic from '@/demos/pagination/PaginationBasic.vue';
  import paginationBasicSource from '@/demos/pagination/PaginationBasic.vue?raw';
  import PaginationCompact from '@/demos/pagination/PaginationCompact.vue';
  import paginationCompactSource from '@/demos/pagination/PaginationCompact.vue?raw';
  import PaginationStream from '@/demos/pagination/PaginationStream.vue';
  import paginationStreamSource from '@/demos/pagination/PaginationStream.vue?raw';
  import PaginationStreamCompact from '@/demos/pagination/PaginationStreamCompact.vue';
  import paginationStreamCompactSource from '@/demos/pagination/PaginationStreamCompact.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="基础分页" :full-height="false">
      <DemoBlock
        :code="paginationBasicSource"
        description="数据完全由 v-model 提供：currentPage / pageSize / total / layout 都在配置对象里，组件就地写回，不派发 update:modelValue。"
      >
        <PaginationBasic />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="紧凑形态 compact" :full-height="false">
      <DemoBlock
        :code="paginationCompactSource"
        description="compact 只切换渲染单元：布局仍是同一份声明，外观换成自研单元以适配树节点 / 下拉面板，pager 只显示当前页码。"
      >
        <PaginationCompact />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="流式加载 stream" :full-height="false">
      <DemoBlock
        :code="paginationStreamSource"
        description="stream 把 pager / prev / next / jumper / total 一并剔除，由 loadMore 片段承载「加载更多 + 已加载 / 总数量」；加载中会整体禁用，避免中途改页长。"
      >
        <PaginationStream />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="紧凑 + 流式" :full-height="false">
      <DemoBlock
        :code="paginationStreamCompactSource"
        description="两者相互独立：叠加后只剩 sizes 与 loadMore，markup 与非紧凑的流式写法完全一致，只是换成自研单元渲染。"
      >
        <PaginationStreamCompact />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
