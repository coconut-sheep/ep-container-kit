<script setup lang="ts">
  import { BottomRight } from '@element-plus/icons-vue';
  import {
    COMPONENT_DEFAULT_PROPS,
    COMPONENT_NAME,
    type PaginationLoadMoreEmitsTuple,
    type PaginationLoadMoreProps,
  } from './pagination-loadmore';
  import { computed } from 'vue';

  defineOptions({
    name: COMPONENT_NAME,
  });

  const props = withDefaults(
    defineProps<PaginationLoadMoreProps>(),
    COMPONENT_DEFAULT_PROPS,
  );

  const emits = defineEmits<PaginationLoadMoreEmitsTuple>();

  const loadMoreAble = computed(() => {
    const { loaded = 0, total } = props;

    return loaded < total;
  });

  /**
   * 点击按钮
   * @description 禁用或已无更多数据时直接返回，避免父级再判一次；
   * `el-button` 的 `disabled` 已拦住点击，这里兜底键盘与程序化触发
   */
  const handleClick = () => {
    if (props.disabled || !loadMoreAble.value) {
      return;
    }

    emits('loadMore');
  };
</script>

<template>
  <div
    class="pagination-loadmore"
    :class="{ 'is-disabled': disabled || !loadMoreAble }"
  >
    <el-button
      :disabled="disabled || !loadMoreAble"
      :loading="loading"
      :title="loadMoreAble ? '加载更多' : '没有更多了'"
      link
      @click.stop="handleClick"
    >
      <el-icon>
        <BottomRight />
      </el-icon>
    </el-button>
    <div class="pagination-loadmore--total" title="已加载 / 总数量">
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
    width: fit-content;
    flex-wrap: nowrap;
    height: var(--el-pagination-button-height);

    .el-button {
      height: var(--el-pagination-button-height);
      margin: 0;
      padding: 0 4px;
      border-radius: var(--el-pagination-border-radius);
      font-size: var(--el-pagination-font-size);

      .el-icon {
        font-size: 16px;
        font-weight: 700;
      }
    }

    &.is-disabled {
      cursor: not-allowed;

      .pagination-loadmore--total {
        color: var(--el-pagination-button-disabled-color);
      }
    }

    .pagination-loadmore--total {
      display: flex;
      align-items: center;
      column-gap: 4px;
      flex-wrap: nowrap;
      font-size: var(--el-pagination-font-size);
      white-space: nowrap;
    }
  }
</style>
