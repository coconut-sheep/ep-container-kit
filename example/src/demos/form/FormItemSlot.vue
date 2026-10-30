<script setup lang="ts">
  import { ref } from 'vue';
  import { ElInput, ElRate } from 'element-plus';
  import { CkFormContainer, type FormContainerItem } from 'ep-container-kit';

  type SlotForm = {
    keyword: string;
    score: number;
    tags: string;
  };

  const form = ref<SlotForm>({ keyword: '', score: 3, tags: '' });

  const schema: FormContainerItem<SlotForm>[] = [
    {
      prop: 'keyword',
      label: '关键字',
      type: 'input',
      props: { placeholder: '由 type 生成的内置 input' },
    },
    {
      prop: 'score',
      label: '评分',
      type: 'slider',
    },
    {
      prop: 'tags',
      label: '标签',
      type: 'input',
      props: { placeholder: '没有定向插槽，回落到 type' },
    },
  ];
</script>

<template>
  <CkFormContainer v-model="form" :schema="schema" vertical>
    <!--
      模板插槽名固定为 slot_${prop}：只要 prop 有效，它就会接管该表单项的默认插槽，
      优先级高于 type 生成的组件，也高于 schema 里的 slots
    -->
    <template #slot_keyword>
      <ElInput v-model="form.keyword" placeholder="slot_keyword 接管">
        <template #prepend>搜索</template>
      </ElInput>
    </template>

    <template #slot_score>
      <ElRate v-model="form.score" />
    </template>
  </CkFormContainer>
</template>
