<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { ElButton, ElMessage } from 'element-plus';
  import {
    CkFormContainer,
    type FormContainerInstance,
    type FormContainerItem,
  } from 'ep-container-kit';

  type AccountForm = {
    username: string;
    age: number;
    enabled: boolean;
    remark: string;
  };

  const form = ref<AccountForm>({
    username: '',
    age: 18,
    enabled: true,
    remark: '',
  });

  /**
   * Schema 驱动整张表单
   * @description `col` 走的是工具类 `column-x`，与 `el-col` 的 `span` 语义一致
   */
  const schema: FormContainerItem<AccountForm>[] = [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
      props: { placeholder: '请输入用户名' },
      rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    },
    {
      prop: 'age',
      label: '年龄',
      type: 'inputNumber',
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

  const sourceJson = computed(() => JSON.stringify(form.value, null, 2));

  /**
   * 提交前手动校验
   * @description 组件的实例方法直接透传 `ElForm`，`validate` 失败会抛出异常
   */
  const handleSubmit = async () => {
    submitting.value = true;
    try {
      await formRef.value?.validate();
      ElMessage.success('校验通过');
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
  <div class="form-basic">
    <CkFormContainer ref="formRef" v-model="form" :schema="schema" vertical />

    <div class="form-basic__actions">
      <ElButton type="primary" :loading="submitting" @click="handleSubmit">
        提交校验
      </ElButton>
      <ElButton @click="handleReset">重置</ElButton>
    </div>

    <pre class="form-basic__source">{{ sourceJson }}</pre>
  </div>
</template>

<style scoped lang="scss">
  .form-basic {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    max-width: 520px;

    &__actions {
      display: flex;
      column-gap: 8px;
    }

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
