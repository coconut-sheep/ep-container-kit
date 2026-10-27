<script setup lang="ts">
  import { computed, type CSSProperties } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowLeft } from '@element-plus/icons-vue';
  import { toSizeValue } from '@ep-container-kit/utils';
  import {
    COMPONENT_DEFAULT_PROPS,
    COMPONENT_NAME,
    type PageContentEmitsTuple,
    type PageContentProps,
  } from './page-content';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = withDefaults(
    defineProps<PageContentProps>(),
    COMPONENT_DEFAULT_PROPS,
  );

  const emits = defineEmits<PageContentEmitsTuple>();

  /**
   * 内容区尺寸
   * @description `fullHeight` 优先；尺寸值统一交给 `toSizeValue` 归一化，
   * 数字补 `px`，带单位的字符串原样透传，非法值直接忽略
   */
  const contentStyle = computed<CSSProperties>(() => {
    const result: CSSProperties = {};

    if (props.fullHeight) {
      result.height = '100%';
    } else {
      const height = toSizeValue(props.height);
      if (height) {
        result.height = height;
      }
    }

    const width = toSizeValue(props.width);
    if (width) {
      result.width = width;
    }

    return result;
  });

  const handleBackClick = () => {
    emits('backClick');
  };
</script>

<template>
  <div class="page-content" :style="contentStyle">
    <div v-if="$slots.header || title || showBack" class="page-content--header">
      <div v-if="title || showBack" class="header-title">
        <span
          v-if="showBack"
          class="header-back"
          role="button"
          tabindex="0"
          aria-label="返回"
          @click="handleBackClick"
          @keydown.enter="handleBackClick"
        >
          <slot name="back-icon">
            <el-icon size="22px">
              <ArrowLeft />
            </el-icon>
          </slot>
        </span>
        <span class="header-title-text">{{ props.title }}</span>
      </div>
      <slot name="header" />
    </div>
    <div v-if="$slots.default" class="page-content--body" :class="bodyClass">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '@ep-container-kit/styles/mixins' as *;

  @include ck-border-box;

  .page-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 12px;
    row-gap: 12px;
    border-radius: 12px;
    background: var(--el-bg-color, #ffffff);
    box-shadow: var(--el-box-shadow);

    .page-content--header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      position: relative;
      min-width: 0;
      min-height: 0;
      column-gap: 12px;
      border-radius: 8px;

      .header-title {
        display: flex;
        align-items: center;
        column-gap: 4px;
        max-width: 40%;
        min-width: 0;
        font-size: 18px;
        font-weight: 700;
        color: var(--el-text-color-primary, #303133);

        .header-back {
          display: flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          cursor: pointer;

          &:hover {
            color: var(--el-color-primary, #409eff);
          }

          &:focus-visible {
            outline: 2px solid var(--el-color-primary, #409eff);
            outline-offset: 2px;
          }
        }

        .header-title-text {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .page-content--body {
      display: flex;
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
  }
</style>
