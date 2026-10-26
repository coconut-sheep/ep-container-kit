<script setup lang="ts">
  import { MoreFilled } from '@element-plus/icons-vue';
  import {
    COMPONENT_DEFAULT_PROPS,
    COMPONENT_NAME,
    type PaginationLoadMoreEmits,
    type PaginationLoadMoreProps,
  } from './pagination-loadmore';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = withDefaults(
    defineProps<PaginationLoadMoreProps>(),
    COMPONENT_DEFAULT_PROPS,
  );

  const emits = defineEmits<PaginationLoadMoreEmits>();

  /**
   * 点击按钮
   * @description 禁用或已无更多数据时直接返回，避免父级再判一次；
   * `el-button` 的 `disabled` 已拦住点击，这里兜底键盘与程序化触发
   */
  const handleClick = () => {
    if (props.disabled || !props.able) {
      return;
    }

    emits('loadMore');
  };
</script>

<template>
  <!--
    「加载更多」与「已加载 / 总数量」固定渲染在同一个根元素内：
    二者是一份数据状态的两面，拆成两个布局片段会被布局顺序拆散。
    非紧凑形态下本组件挂在 Element Plus 的 `slot` 位置，是 vnode 数组中的一项，
    拿不到它给首尾子节点加的 `is-first` / `is-last`，因此这里不依赖这两个类，边距由自身控制。
  -->
  <div
    class="pagination-loadmore"
    :class="{ 'is-disabled': disabled || !able }"
  >
    <el-button
      :disabled="disabled || !able"
      :loading="loading"
      :title="able ? '加载更多' : '没有更多了'"
      link
      @click.stop="handleClick"
    >
      <el-icon>
        <MoreFilled />
      </el-icon>
    </el-button>
    <div class="pagination-loadmore-total" title="已加载 / 总数量">
      <span>{{ loaded }}</span>
      <span aria-hidden="true">/</span>
      <span>{{ total }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use '@ep-container-kit/styles/mixins' as *;

  @include ck-border-box;

  .pagination-loadmore {
    display: flex;
    flex: none;
    align-items: center;
    column-gap: 8px;
    // 与相邻的 Element Plus 单元同高，保证整行基线一致。
    // 分页变量由 .el-pagination（非紧凑）或 .pagination-container--compact 提供，
    // 两者都沿用 EP 的 --el-pagination-*，这里不再引入自定义变量
    height: var(--el-pagination-button-height);

    // 按钮沿用 Element Plus 分页单元的规格：方形、灰底、无边框、2px 圆角。
    // 宽度用 min-width 而非固定值：loading 时图标会与 spinner 并排，让按钮自然撑开，
    // 不挤压 spinner
    .el-button {
      min-width: var(--el-pagination-button-width);
      height: var(--el-pagination-button-height);
      margin: 0;
      padding: 0 6px;
      border-radius: var(--el-pagination-border-radius);

      --el-button-bg-color: var(--el-pagination-button-bg-color);
      --el-button-border-color: transparent;
      --el-button-text-color: var(--el-pagination-button-color);
      --el-button-hover-bg-color: var(--el-fill-color-dark);
      --el-button-hover-border-color: transparent;
      --el-button-hover-text-color: var(--el-pagination-hover-color);
      --el-button-active-bg-color: var(--el-fill-color-dark);
      --el-button-active-border-color: transparent;
      --el-button-disabled-bg-color: var(
        --el-pagination-button-disabled-bg-color
      );
      --el-button-disabled-border-color: transparent;
      --el-button-disabled-text-color: var(
        --el-pagination-button-disabled-color
      );

      .el-icon {
        font-size: 12px;
        font-weight: 700;
      }
    }

    &.is-disabled {
      cursor: not-allowed;
    }

    .pagination-loadmore-total {
      display: flex;
      align-items: center;
      column-gap: 2px;
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      color: var(--el-text-color-secondary, #909399);
    }
  }
</style>
