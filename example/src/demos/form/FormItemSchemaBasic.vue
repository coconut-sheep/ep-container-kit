<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { CkFormItemSchema, type FormContainerItem } from 'ep-container-kit';

  type Profile = {
    nickname: string;
    gender: string;
    birthday: string;
    bio: string;
  };

  const profile = ref<Profile>({
    nickname: '白泽',
    gender: 'male',
    birthday: '',
    bio: '',
  });

  /**
   * 只负责「按 schema 渲染表单项」的容器
   * @description 与 `CkFormContainer` 的区别：不自带 `el-form`，
   * 因此可以放进任意已有的表单里，校验规则由外层表单统一接管
   */
  const schema: FormContainerItem<Profile>[] = [
    {
      prop: 'nickname',
      label: '昵称',
      type: 'input',
      props: { placeholder: '请输入昵称' },
    },
    {
      prop: 'gender',
      label: '性别',
      type: 'radioGroup',
      props: {
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ],
      },
    },
    {
      prop: 'birthday',
      label: '生日',
      type: 'datePicker',
      props: { type: 'date', valueFormat: 'YYYY-MM-DD' },
    },
    {
      prop: 'bio',
      label: '简介',
      type: 'input',
      props: { type: 'textarea', rows: 2 },
    },
  ];

  const sourceJson = computed(() => JSON.stringify(profile.value, null, 2));
</script>

<template>
  <div class="schema-basic">
    <CkFormItemSchema v-model="profile" :schema="schema" />

    <pre class="schema-basic__source">{{ sourceJson }}</pre>
  </div>
</template>

<style scoped lang="scss">
  .schema-basic {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    max-width: 420px;

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
