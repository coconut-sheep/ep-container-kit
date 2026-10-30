<script setup lang="ts">
  import { ref } from 'vue';
  import { ElSwitch } from 'element-plus';
  import { CkFormItem } from 'ep-container-kit';

  const username = ref('');
  const age = ref(18);
  const enabled = ref(true);
  const remark = ref('');
  const showRemark = ref(true);
</script>

<template>
  <div class="form-item-basic">
    <!-- 单项使用：v-model 与 Element Plus 表单控件的行为一致 -->
    <CkFormItem
      v-model="username"
      label="用户名"
      type="input"
      :props="{ placeholder: '请输入用户名' }"
    />

    <CkFormItem
      v-model="age"
      label="年龄"
      type="inputNumber"
      :props="{ min: 0, max: 150 }"
    />

    <CkFormItem v-model="enabled" label="是否启用" type="switch" />

    <!-- visible 与 v-show 等价：只切换显示，组件实例与取值都保留 -->
    <CkFormItem
      v-model="remark"
      label="备注"
      type="input"
      :visible="showRemark"
      :props="{ placeholder: '输入点什么' }"
    />

    <div class="form-item-basic__toolbar">
      <ElSwitch v-model="showRemark" />
      <span>切换「备注」的 visible</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .form-item-basic {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    max-width: 420px;

    &__toolbar {
      display: flex;
      align-items: center;
      column-gap: 8px;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
</style>
