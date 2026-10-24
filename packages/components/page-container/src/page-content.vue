<script setup lang="ts">
  import { computed, type CSSProperties } from 'vue';
  import { ElIcon } from 'element-plus';
  import { ArrowLeft } from '@element-plus/icons-vue';
  import { toSizeValue } from '@ep-container-kit/utils';
  import {
    COMPONENT_DEFAULT_PROPS,
    COMPONENT_NAME,
    type PageContentEmits,
    type PageContentProps,
  } from './page-content';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = withDefaults(
    defineProps<PageContentProps>(),
    COMPONENT_DEFAULT_PROPS,
  );

  const emits = defineEmits<PageContentEmits>();

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
    <!--
      头部渲染条件：header 插槽 / title / showBack 任一存在即可。
      直接读 $slots 而非用 computed 包裹，保证父级动态增删插槽时每次渲染都重新求值。
    -->
    <div v-if="$slots.header || title || showBack" class="page-content-header">
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
          <!--
            图标默认走 Element Plus 官方图标，与 ElButton 等组件的观感统一；
            `back-icon` 插槽可整体接管，用于替换为自定义 SVG 或其他图标集
          -->
          <slot name="back-icon">
            <ElIcon aria-hidden="true">
              <ArrowLeft />
            </ElIcon>
          </slot>
        </span>
        <span class="header-title-text">{{ title }}</span>
      </div>
      <slot name="header" />
    </div>
    <div v-if="$slots.default" class="page-content-body" :class="bodyClass">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .page-content {
    display: flex;
    flex-direction: column;
    // `height: 100%` 与 `padding: 18px` 并存，必须是 border-box 才不会溢出父级。
    // 组件库不做全局 reset，这个尺寸前提由组件自己在 scoped 样式里声明
    box-sizing: border-box;
    width: 100%;
    padding: 18px;
    row-gap: 14px;

    .page-content-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // `min-height` 需包含 padding 与 border，否则 52px 会变成 70px
      box-sizing: border-box;
      min-width: 0;
      min-height: 52px;
      padding: 8px 10px;
      column-gap: 12px;
      border: 1px solid var(--el-border-color-lighter, #ebeef5);
      border-radius: 8px;
      // 纯色底 + 细边框：用实色表面表达层级，不叠加模糊与半透明蒙层
      background: var(--el-bg-color, #ffffff);

      .header-title {
        display: flex;
        align-items: center;
        column-gap: 6px;
        max-width: 40%;
        min-width: 0;
        font-size: 18px;
        font-weight: 700;
        color: var(--el-text-color-primary, #303133);

        .header-back {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          color: inherit;
          cursor: pointer;
          border-radius: 4px;

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

    .page-content-body {
      display: flex;
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
  }
</style>
