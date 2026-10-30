<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import FormItemSchemaBasic from '@/demos/form/FormItemSchemaBasic.vue';
  import formItemSchemaBasicSource from '@/demos/form/FormItemSchemaBasic.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="基础用法" :full-height="false">
      <DemoBlock
        :code="formItemSchemaBasicSource"
        description="只负责按 schema 渲染表单项，本身不带 el-form，因此可以放进任意已有表单里；校验由外层表单统一接管。"
      >
        <FormItemSchemaBasic />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
