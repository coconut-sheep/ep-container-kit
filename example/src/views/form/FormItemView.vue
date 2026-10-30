<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import FormItemBasic from '@/demos/form/FormItemBasic.vue';
  import formItemBasicSource from '@/demos/form/FormItemBasic.vue?raw';
  import FormItemSlot from '@/demos/form/FormItemSlot.vue';
  import formItemSlotSource from '@/demos/form/FormItemSlot.vue?raw';
  import FormItemTypes from '@/demos/form/FormItemTypes.vue';
  import formItemTypesSource from '@/demos/form/FormItemTypes.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="单项使用" :full-height="false">
      <DemoBlock
        :code="formItemBasicSource"
        description="不套表单也能单独使用：v-model 与 Element Plus 控件一致，visible 等价 v-show，hidden 等价 v-if。"
      >
        <FormItemBasic />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="内置类型" :full-height="false">
      <DemoBlock
        :code="formItemTypesSource"
        description="type 决定落到哪个 Element Plus 组件上，控件属性走 props，需要子节点时用 slots 提供渲染函数。"
      >
        <FormItemTypes />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="定向插槽 slot_${prop}" :full-height="false">
      <DemoBlock
        :code="formItemSlotSource"
        description="模板插槽名为 slot_ + prop，只要 prop 有效就会接管该表单项的默认插槽，优先级高于 type 生成的组件与 schema 里的 slots。"
      >
        <FormItemSlot />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
