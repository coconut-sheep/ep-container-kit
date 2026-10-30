<script setup lang="ts">
  import {
    COMPONENT_NAME,
    getDefaultPaginationConfig,
    handleJumperPage,
    handleLayout,
    INVALID_PROPS,
    toElPaginationLayout,
    type PaginationConfig,
    type PaginationProps,
    COMPONENT_DEFAULT_PROPS,
    COMPONENT_DEFAULT_PROPS_HOLDER,
    type PaginationEmitsTuple,
  } from './pagination';
  import PaginationLoadMore from './pagination-loadmore.vue';
  import { computed, nextTick, ref, useAttrs, watch } from 'vue';
  import { CHANGE_EVENT } from '@ep-container-kit/constants';
  import {
    buildPropsDefaultValues,
    filterNullishProps,
    omitEntryProps,
    pickEntryProps,
  } from '@ep-container-kit/utils';
  import { ArrowLeft, ArrowRight, Minus, Plus } from '@element-plus/icons-vue';

  defineOptions({
    inheritAttrs: false,
    name: COMPONENT_NAME,
  });

  const modelValue = defineModel<PaginationConfig>({
    required: false,
    default: () => {
      return getDefaultPaginationConfig();
    },
  });

  const props = withDefaults(
    defineProps<PaginationProps>(),
    COMPONENT_DEFAULT_PROPS_HOLDER,
  );
  const emits = defineEmits<PaginationEmitsTuple>();
  const attrs = useAttrs();

  const defaultProps = buildPropsDefaultValues<PaginationProps>(
    COMPONENT_DEFAULT_PROPS,
  );
  const mergedProps = computed<PaginationProps>(() => {
    const definedProps = filterNullishProps(props);
    return {
      ...defaultProps,
      ...definedProps,
    };
  });

  const mergedAttrs = computed(() => {
    return omitEntryProps(attrs, INVALID_PROPS);
  });

  const mergedLayout = computed(() => {
    return handleLayout(
      modelValue.value.layout || [],
      pickEntryProps(mergedProps.value, ['compact', 'stream']),
    );
  });

  // 交给 Element Plus 的 layout 字符串：`loadMore` 在这里被翻译成它认识的 `slot`
  const elPaginationLayout = computed(() => {
    return toElPaginationLayout(mergedLayout.value);
  });

  const mergedElPaginationProps = computed(() => {
    return omitEntryProps(
      {
        ...mergedProps.value,
        ...mergedAttrs.value,
      },
      ['loading', 'loaded', 'compact', 'stream'],
    );
  });

  const updatePageSize = (pageSize: number) => {
    modelValue.value = {
      ...modelValue.value,
      pageSize,
    };
  };

  const updateCurrentPage = (currentPage: number) => {
    modelValue.value = {
      ...modelValue.value,
      currentPage,
    };
  };

  // 是否为紧凑模式
  const isCompact = computed(() => {
    return mergedProps.value.compact;
  });

  // 是否为流式加载
  const isStream = computed(() => {
    return mergedProps.value.stream;
  });

  // 上一个 / 下一个的图标：默认值不再注入工厂函数，这里兜底成真实组件
  const prevIcon = computed(() => {
    return mergedProps.value.prevIcon ?? ArrowLeft;
  });

  const nextIcon = computed(() => {
    return mergedProps.value.nextIcon ?? ArrowRight;
  });

  // 是否可以操作
  const isOperable = computed(() => {
    if (mergedProps.value.disabled) {
      return false;
    }

    return !mergedProps.value.loading;
  });

  // 非紧凑形态下没有可逐个禁用的单元，借 Element Plus 的 `disabled` 整体禁用：
  // 只在流式加载时跟随 `loading`（避免加载中途改页长），普通分页不受影响
  const elPaginationDisabled = computed(() => {
    if (mergedProps.value.disabled) {
      return true;
    }

    return isStream.value && Boolean(mergedProps.value.loading);
  });

  // 总页数，与 Element Plus 一致：无数据时也按 1 页处理
  const pageCount = computed(() => {
    const { total, pageSize } = modelValue.value;

    if (pageSize <= 0) {
      return 1;
    }

    return Math.max(1, Math.ceil(Math.max(0, total) / pageSize));
  });

  // 是否为第一页
  const isFirstPage = computed(() => {
    return modelValue.value.currentPage <= 1;
  });

  // 是否为最后一页
  const isLastPage = computed(() => {
    return modelValue.value.currentPage >= pageCount.value;
  });

  // 上一页
  const handlePagePrev = () => {
    if (isFirstPage.value || !isOperable.value) {
      return;
    }
    updateCurrentPage(modelValue.value.currentPage - 1);
  };

  // 下一页
  const handlePageNext = () => {
    if (isLastPage.value || !isOperable.value) {
      return;
    }
    updateCurrentPage(modelValue.value.currentPage + 1);
  };

  // 上一个pageSize
  const handlePageSizePrev = () => {
    const { pageSize, pageSizes } = modelValue.value;
    const index = pageSizes.findIndex((item) => {
      return item === pageSize;
    });

    if (index < 1 || !isOperable.value) {
      return;
    }

    updatePageSize(pageSizes[index - 1]!);
  };

  // 下一个pageSize
  const handlePageSizeNext = () => {
    const { pageSize, pageSizes } = modelValue.value;
    const index = pageSizes.findIndex((item) => {
      return item === pageSize;
    });

    if (index < 0 || index > pageSizes.length - 2 || !isOperable.value) {
      return;
    }

    updatePageSize(pageSizes[index + 1]!);
  };

  // 加载更多
  const handleLoadMore = () => {
    emits('loadMore');
  };

  // 跳转页码，初始值跟随当前页码，避免父级初始页码不为 1 时输入框显示错误
  const jumperPage = ref<number | string>(modelValue.value.currentPage);
  const handleJumperPageChange = (value: string) => {
    jumperPage.value = handleJumperPage(
      value,
      pageCount.value,
      modelValue.value.currentPage,
    );
  };
  const handleJumperPageConfirm = () => {
    const page = handleJumperPage(
      String(jumperPage.value),
      pageCount.value,
      modelValue.value.currentPage,
    );

    jumperPage.value = page;
    updateCurrentPage(page);
  };

  watch(
    [() => modelValue.value.currentPage, () => modelValue.value.pageSize],
    ([page, pageSize], [pageOld, pageSizeOld]) => {
      const pageChanged = page !== pageOld;
      const pageSizeChanged = pageSize !== pageSizeOld;

      if (!pageChanged && !pageSizeChanged) {
        return;
      }

      // 先判断页码大小是否发生变化
      if (pageSizeChanged) {
        // 如果当前已经在第一页，直接抛出change事件即可
        if (isFirstPage.value) {
          nextTick(() => {
            emits(CHANGE_EVENT, { ...modelValue.value });
            jumperPage.value = modelValue.value.currentPage;
          });
          return;
        }

        // 否则修改当前页为第一页，但不触发事件，等待下一个watch触发
        modelValue.value = {
          ...modelValue.value,
          currentPage: 1,
        };
        return;
      }

      // 页码未发生变化，不做处理
      if (!pageChanged) {
        return;
      }

      nextTick(() => {
        emits(CHANGE_EVENT, { ...modelValue.value });
        jumperPage.value = modelValue.value.currentPage;
      });
    },
  );
</script>
<template>
  <template v-if="!isCompact">
    <el-pagination
      v-bind="mergedElPaginationProps"
      :current-page="modelValue.currentPage"
      :page-size="modelValue.pageSize"
      :page-sizes="modelValue.pageSizes"
      :total="modelValue.total"
      :layout="elPaginationLayout"
      :disabled="elPaginationDisabled"
      class="pagination-container"
      @update:current-page="updateCurrentPage"
      @update:page-size="updatePageSize"
    >
      <pagination-load-more
        v-if="isStream"
        class="pagination--loadmore is-slot"
        :loaded="mergedProps.loaded ?? 0"
        :total="modelValue.total"
        :loading="Boolean(mergedProps.loading)"
        :disabled="Boolean(mergedProps.disabled)"
        @load-more="handleLoadMore"
      />
    </el-pagination>
  </template>
  <template v-else>
    <div
      v-bind="mergedAttrs"
      class="el-pagination pagination-container pagination-container--compact"
    >
      <template v-for="(item, index) in mergedLayout" :key="`${item}-${index}`">
        <el-button
          v-if="item === 'prev'"
          class="pagination-item pagination--prev"
          :disabled="!isOperable || isFirstPage"
          link
          @click.stop="handlePagePrev"
        >
          <el-icon>
            <component :is="prevIcon" />
          </el-icon>
        </el-button>
        <div
          v-if="item === 'pager'"
          class="pagination-item pagination--pager"
          :class="{
            'is-disabled': !isOperable,
          }"
        >
          {{ `${modelValue.currentPage || 0}` }}
        </div>
        <el-button
          v-if="item === 'next'"
          class="pagination-item pagination--next"
          :disabled="!isOperable || isLastPage"
          link
          @click.stop="handlePageNext"
        >
          <el-icon>
            <component :is="nextIcon" />
          </el-icon>
        </el-button>
        <pagination-load-more
          v-if="item === 'loadMore'"
          class="pagination-item"
          :loaded="mergedProps.loaded ?? 0"
          :total="modelValue.total"
          :loading="Boolean(mergedProps.loading)"
          :disabled="Boolean(mergedProps.disabled)"
          @load-more="handleLoadMore"
        />
        <div
          v-if="item === 'total'"
          class="pagination-item pagination--total"
          :class="{
            'is-disabled': !isOperable,
          }"
        >
          {{ `共 ${modelValue.total} 条` }}
        </div>
        <div
          v-if="item === 'sizes'"
          class="pagination-item pagination--sizes"
          :class="{
            'is-disabled': !isOperable,
          }"
          :title="isStream ? '单次加载数量' : ''"
        >
          <el-icon @click.stop="handlePageSizePrev">
            <Minus />
          </el-icon>
          <div>
            {{ `${modelValue.pageSize || 0} 条/${isStream ? '次' : '页'}` }}
          </div>
          <el-icon @click.stop="handlePageSizeNext">
            <Plus />
          </el-icon>
        </div>
        <div
          v-if="item === 'jumper'"
          class="pagination-item pagination--jumper"
          :class="{
            'is-disabled': !isOperable,
          }"
        >
          <el-input
            v-model="jumperPage"
            :disabled="!isOperable"
            @change="handleJumperPageChange"
            @keyup.enter.stop="handleJumperPageConfirm"
          >
            <template #prefix>to</template>
          </el-input>
        </div>
      </template>
    </div>
  </template>
</template>
<style scoped lang="scss">
  @use '@ep-container-kit/styles/mixins' as *;

  @include ck-border-box;

  .pagination-container--compact {
    display: flex;
    align-items: center;
    --pagination-item-gap: 5px;
    gap: var(--pagination-item-gap);

    .pagination-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      height: var(--el-pagination-button-height);
      margin: 0;
      padding: 0;

      &.is-disabled {
        cursor: not-allowed;
        color: var(--el-pagination-button-disabled-color);
      }

      .el-icon {
        font-size: 16px;
        cursor: pointer;

        &:hover {
          color: var(--el-pagination-hover-color);
        }
      }
    }

    .pagination--prev,
    .pagination--next {
      font-size: 16px;
      cursor: pointer;
    }

    .pagination--pager {
      padding: 0 4px;
      font-size: var(--el-pagination-font-size);
    }

    .pagination--sizes {
      column-gap: 6px;
      padding: 0 8px;
      border-radius: var(--el-pagination-border-radius);
      background-color: var(--el-pagination-bg-color);
      font-size: var(--el-pagination-font-size);
      border: 1px solid var(--el-border-color);

      &.is-disabled {
        background: var(--el-disabled-bg-color);
      }
    }

    .pagination--jumper {
      .el-input {
        width: 75px;
        height: 100%;
      }

      :deep(.el-input__inner) {
        text-align: center;
      }
    }

    .pagination--loadmore {
      &.is-slot {
        margin-left: var(--pagination-item-gap);
      }
    }

    .pagination--total {
      color: var(--el-text-color-regular);
      font-size: var(--el-pagination-font-size);
    }
  }
</style>
