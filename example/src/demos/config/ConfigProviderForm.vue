<script setup lang="ts">
  import { computed, ref } from 'vue';
  import {
    CkConfigProvider,
    CkFormContainer,
    type FormContainerItem,
  } from 'ep-container-kit';

  type ProjectForm = {
    name: string;
    owner: string;
    description: string;
  };

  const form = ref<ProjectForm>({ name: '', owner: '', description: '' });

  /**
   * 标签宽度默认取注入值
   * @description 第二项用 `itemProps.labelWidth` 覆盖了注入值，
   * 优先级是「组件值 > 注入值 > 默认值」
   */
  const schema: FormContainerItem<ProjectForm>[] = [
    {
      prop: 'name',
      label: '项目名称',
      type: 'input',
      props: { placeholder: '继承注入的 labelWidth' },
    },
    {
      prop: 'owner',
      label: '负责人',
      type: 'input',
      itemProps: { labelWidth: '120px' },
      props: { placeholder: '被 itemProps 覆盖为 120px' },
    },
    {
      prop: 'description',
      label: '描述',
      type: 'input',
      props: { type: 'textarea', rows: 2 },
    },
  ];

  const sourceJson = computed(() => JSON.stringify(form.value, null, 2));
</script>

<template>
  <!-- formContainer 的配置会下发到其内部所有 CkFormContainer / CkFormItem -->
  <CkConfigProvider
    :form-container="{ labelWidth: '88px', labelPosition: 'right' }"
  >
    <div class="config-form">
      <CkFormContainer v-model="form" :schema="schema" vertical />

      <pre class="config-form__source">{{ sourceJson }}</pre>
    </div>
  </CkConfigProvider>
</template>

<style scoped lang="scss">
  .config-form {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    max-width: 480px;

    &__source {
      margin: 0;
      padding: 12px;
      font-family: var(--el-font-family-mono, monospace);
      font-size: 12px;
      line-height: 1.7;
      color: var(--el-text-color-regular);
      background: var(--el-fill-color-lighter);
      border-radius: 8px;
    }
  }
</style>
