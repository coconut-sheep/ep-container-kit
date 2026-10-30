<script setup lang="ts">
  import { CkPageContent } from 'ep-container-kit';
  import DemoBlock from '@/components/DemoBlock.vue';
  import DemoPage from '@/components/DemoPage.vue';
  import ConfigProviderForm from '@/demos/config/ConfigProviderForm.vue';
  import configProviderFormSource from '@/demos/config/ConfigProviderForm.vue?raw';
  import ConfigProviderTable from '@/demos/config/ConfigProviderTable.vue';
  import configProviderTableSource from '@/demos/config/ConfigProviderTable.vue?raw';
</script>

<template>
  <DemoPage>
    <CkPageContent title="表单全局配置" :full-height="false">
      <DemoBlock
        :code="configProviderFormSource"
        description="formContainer 的配置由 CkConfigProvider 通过 provide 下发到内部所有 CkFormContainer / CkFormItem，优先级是「组件值 > 注入值 > 默认值」。"
      >
        <ConfigProviderForm />
      </DemoBlock>
    </CkPageContent>

    <CkPageContent title="表格列全局配置" :full-height="false">
      <DemoBlock
        :code="configProviderTableSource"
        description="不封装 Table 与 TableColumn，所以 tableContainer 只作用于 CkTableColumnSchema；prop / label / hidden 这类每列各自不同的属性不参与下发。"
      >
        <ConfigProviderTable />
      </DemoBlock>
    </CkPageContent>
  </DemoPage>
</template>
