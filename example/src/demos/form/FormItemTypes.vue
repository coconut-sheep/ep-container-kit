<script setup lang="ts">
  import { computed, h, ref } from 'vue';
  import { ElCheckbox, ElOption, ElRadio } from 'element-plus';
  import { CkFormContainer, type FormContainerItem } from 'ep-container-kit';

  type SettingForm = {
    role: string;
    gender: string;
    scopes: string[];
    birthday: string;
    workTime: string;
    weight: number;
    notify: boolean;
    themeColor: string;
  };

  const form = ref<SettingForm>({
    role: '',
    gender: 'male',
    scopes: [],
    birthday: '',
    workTime: '',
    weight: 50,
    notify: true,
    themeColor: '#409eff',
  });

  const ROLE_OPTIONS = [
    { label: '管理员', value: 'admin' },
    { label: '编辑', value: 'editor' },
    { label: '访客', value: 'guest' },
  ];

  /**
   * 各类内置 type 的写法
   * @description `type` 决定落到哪个 Element Plus 组件上，组件特有的属性走 `props`，
   * 需要子节点（`el-option`、`el-radio` 等）时用 `slots` 提供渲染函数
   */
  const schema: FormContainerItem<SettingForm>[] = [
    {
      prop: 'role',
      label: '角色',
      type: 'select',
      col: 12,
      props: { placeholder: '请选择角色' },
      slots: {
        default: () => {
          return ROLE_OPTIONS.map((item) => {
            return h(ElOption, {
              key: item.value,
              label: item.label,
              value: item.value,
            });
          });
        },
      },
    },
    {
      prop: 'gender',
      label: '性别',
      type: 'radioGroup',
      col: 12,
      slots: {
        default: () => {
          return [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ].map((item) => {
            return h(ElRadio, { key: item.value, value: item.value }, () => {
              return item.label;
            });
          });
        },
      },
    },
    {
      prop: 'scopes',
      label: '可用范围',
      type: 'checkboxGroup',
      col: 24,
      slots: {
        default: () => {
          return ['读', '写', '导出'].map((item) => {
            return h(ElCheckbox, { key: item, value: item }, () => {
              return item;
            });
          });
        },
      },
    },
    {
      prop: 'birthday',
      label: '生日',
      type: 'datePicker',
      col: 12,
      props: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '选择日期',
      },
    },
    {
      prop: 'workTime',
      label: '上班时间',
      type: 'timePicker',
      col: 12,
      props: { valueFormat: 'HH:mm', placeholder: '选择时间' },
    },
    {
      prop: 'weight',
      label: '权重',
      type: 'slider',
      col: 12,
    },
    {
      prop: 'themeColor',
      label: '主题色',
      type: 'colorPicker',
      col: 12,
    },
    {
      prop: 'notify',
      label: '接收通知',
      type: 'switch',
      col: 12,
    },
  ];

  const sourceJson = computed(() => JSON.stringify(form.value, null, 2));
</script>

<template>
  <div class="form-types">
    <CkFormContainer v-model="form" :schema="schema" vertical />
    <pre class="form-types__source">{{ sourceJson }}</pre>
  </div>
</template>

<style scoped lang="scss">
  .form-types {
    display: flex;
    flex-direction: column;
    row-gap: 16px;

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
