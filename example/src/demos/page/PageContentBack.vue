<script setup lang="ts">
  import { ref } from 'vue';
  import {
    ElDescriptions,
    ElDescriptionsItem,
    ElIcon,
    ElMessage,
    ElSwitch,
  } from 'element-plus';
  import { Back } from '@element-plus/icons-vue';
  import { CkPageContent } from 'ep-container-kit';

  /** 是否用 back-icon 插槽替换默认返回图标（默认是 Element Plus 的 ArrowLeft） */
  const useCustomBackIcon = ref(false);

  const handleBack = () => {
    ElMessage.info('已触发 backClick');
  };
</script>

<template>
  <CkPageContent
    title="资产详情"
    show-back
    :full-height="false"
    body-class="flex flex-column row-gap-10"
    @back-click="handleBack"
  >
    <template #header>
      <label class="page-content-back__switch">
        自定义返回图标
        <ElSwitch v-model="useCustomBackIcon" />
      </label>
    </template>

    <!-- 存在该插槽时整体接管返回图标，不存在则由组件渲染内置图标 -->
    <template v-if="useCustomBackIcon" #back-icon>
      <ElIcon><Back /></ElIcon>
    </template>

    <ElDescriptions :column="2" border>
      <ElDescriptionsItem label="名称">web-01</ElDescriptionsItem>
      <ElDescriptionsItem label="IP">10.0.0.11</ElDescriptionsItem>
      <ElDescriptionsItem label="分组">生产环境</ElDescriptionsItem>
      <ElDescriptionsItem label="状态">在线</ElDescriptionsItem>
    </ElDescriptions>
  </CkPageContent>
</template>

<style scoped lang="scss">
  .page-content-back {
    &__switch {
      display: inline-flex;
      align-items: center;
      column-gap: 6px;
      font-size: 13px;
      color: var(--el-text-color-regular);
      cursor: pointer;
    }
  }
</style>
