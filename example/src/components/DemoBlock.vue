<script setup lang="ts">
  import { ref } from 'vue';
  import { ElButton, ElCollapseTransition } from 'element-plus';
  import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
  import CodeBlock from './CodeBlock.vue';

  defineProps<{
    /** 该示例的源码，由调用方用 `?raw` 导入，展示的就是实际运行的代码 */
    code: string;
    /** 示例说明，渲染在预览区上方 */
    description?: string;
  }>();

  /** 源码默认收起：一页多个示例时全展开会把页面拉得过长 */
  const expanded = ref(false);
</script>

<template>
  <div class="demo-block">
    <p v-if="description" class="demo-block__desc">{{ description }}</p>

    <div class="demo-block__preview">
      <slot />
    </div>

    <div class="demo-block__toolbar">
      <ElButton
        link
        type="primary"
        :icon="expanded ? ArrowUp : ArrowDown"
        @click="expanded = !expanded"
      >
        {{ expanded ? '收起源码' : '查看源码' }}
      </ElButton>
    </div>

    <ElCollapseTransition>
      <div v-show="expanded" class="demo-block__source">
        <CodeBlock :code="code" />
      </div>
    </ElCollapseTransition>
  </div>
</template>

<style scoped lang="scss">
  .demo-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    row-gap: 8px;

    &__desc {
      margin: 0;
      font-size: 13px;
      line-height: 1.7;
      color: var(--el-text-color-secondary);
    }

    &__preview {
      width: 100%;
      min-width: 0;
      padding: 16px;
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 8px;
    }

    &__toolbar {
      display: flex;
      justify-content: center;
    }

    &__source {
      width: 100%;
      min-width: 0;
    }
  }
</style>
