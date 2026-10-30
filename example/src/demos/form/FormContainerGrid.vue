<script setup lang="ts">
  import { ref } from 'vue';
  import { CkFormContainer, type FormContainerItem } from 'ep-container-kit';

  type QueryForm = {
    keyword: string;
    status: string;
    owner: string;
    beginDate: string;
    pageSize: number;
  };

  const form = ref<QueryForm>({
    keyword: '',
    status: '',
    owner: '',
    beginDate: '',
    pageSize: 20,
  });

  /**
   * 横向表单 + 栅格
   * @description `col` 表示占 24 栅格中的几列，容器为横向 flex 且允许换行，
   * 因此 `12 + 12` 占满一行、`8 + 8 + 8` 三个一行
   */
  const schema: FormContainerItem<QueryForm>[] = [
    {
      prop: 'keyword',
      label: '关键字',
      type: 'input',
      col: 12,
      props: { placeholder: '名称 / IP' },
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      col: 12,
      props: {
        placeholder: '全部',
        options: [
          { label: '在线', value: 'online' },
          { label: '离线', value: 'offline' },
        ],
      },
    },
    {
      prop: 'owner',
      label: '负责人',
      type: 'input',
      col: 8,
    },
    {
      prop: 'beginDate',
      label: '创建日期',
      type: 'datePicker',
      col: 8,
      props: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '选择日期',
      },
    },
    {
      prop: 'pageSize',
      label: '每页条数',
      type: 'inputNumber',
      col: 8,
      props: { min: 10, max: 100, step: 10 },
    },
  ];
</script>

<template>
  <CkFormContainer
    v-model="form"
    :schema="schema"
    label-width="96px"
    item-min-width="240"
  />
</template>
