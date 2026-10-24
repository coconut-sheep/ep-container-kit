<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { ElButton, ElMessage } from 'element-plus';
  import {
    CkConfigProvider,
    CkFormContainer,
    type FormContainerInstance,
    type FormContainerItem,
  } from 'ep-container-kit';

  type DemoForm = {
    username: string;
    age: number;
    enabled: boolean;
    remark: string;
  };

  const source = ref<DemoForm>({
    username: '',
    age: 18,
    enabled: true,
    remark: '',
  });

  const schema: FormContainerItem<DemoForm>[] = [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
      col: 12,
      props: { placeholder: '请输入用户名' },
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    },
    {
      prop: 'age',
      label: '年龄',
      type: 'inputNumber',
      col: 12,
      props: { min: 0, max: 150 },
    },
    {
      prop: 'enabled',
      label: '是否启用',
      type: 'switch',
    },
    {
      prop: 'remark',
      label: '备注',
      type: 'input',
      props: { type: 'textarea', rows: 3 },
    },
  ];

  const formRef = ref<FormContainerInstance>();
  const submitting = ref(false);

  const sourceJson = computed(() => JSON.stringify(source.value, null, 2));

  const handleSubmit = async () => {
    submitting.value = true;
    try {
      await formRef.value?.validate();
      ElMessage.success('校验通过，数据已输出到右侧');
    } catch {
      ElMessage.error('请检查表单填写');
    } finally {
      submitting.value = false;
    }
  };

  const handleReset = () => {
    formRef.value?.resetFields();
  };
</script>

<template>
  <section class="form-demo">
    <header class="form-demo__header">
      <h1 class="form-demo__title">表单容器</h1>
      <p class="form-demo__desc">
        <code>CkConfigProvider</code>
        +
        <code>CkFormContainer</code>
        的 Schema 驱动表单，右侧实时回显源数据。
      </p>
    </header>

    <div class="form-demo__body">
      <div class="form-demo__panel">
        <CkConfigProvider :form="{ labelWidth: '96px', labelPosition: 'right' }">
          <CkFormContainer
            ref="formRef"
            v-model="source"
            :schema="schema"
            vertical
          />
        </CkConfigProvider>
        <div class="form-demo__actions">
          <ElButton :loading="submitting" type="primary" @click="handleSubmit">
            提交校验
          </ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </div>
      </div>

      <div class="form-demo__panel">
        <h2 class="form-demo__subtitle">源数据</h2>
        <pre class="form-demo__code">{{ sourceJson }}</pre>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .form-demo {
    padding: 24px;

    &__header {
      margin-bottom: 20px;
    }

    &__title {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 500;
    }

    &__desc {
      margin: 0;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }

    &__body {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }

    &__panel {
      flex: 1;
      min-width: 0;
      padding: 20px;
      border: 1px solid var(--el-border-color);
      border-radius: 12px;
    }

    &__subtitle {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 500;
    }

    &__code {
      margin: 0;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
    }

    &__actions {
      display: flex;
      gap: 8px;
      padding-top: 8px;
    }
  }
</style>
