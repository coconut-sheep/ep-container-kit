<script setup lang="ts">
  import {
    COMPONENT_NAME,
    getComponentDefaultProps,
    getDefaultPaginationConfig,
    handleJumperPage,
    handleLayout,
    INVALID_PROPS,
    toElPaginationLayout,
    type PaginationConfig,
    type PaginationEmits,
    type PaginationProps,
  } from './pagination';
  import PaginationLoadMore from './pagination-loadmore.vue';
  import { computed, nextTick, ref, useAttrs, watch } from 'vue';
  import { CHANGE_EVENT } from '@ep-container-kit/constants';
  import {
    filterNullishProps,
    omitEntryProps,
    pickEntryProps,
  } from '@ep-container-kit/utils';
  import {
    ArrowLeft,
    ArrowRight,
    Minus,
    Plus,
    Right,
  } from '@element-plus/icons-vue';

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

  const props = withDefaults(defineProps<PaginationProps>(), {
    // 这里必须再声明一次，不能只依赖 `getComponentDefaultProps()`：
    // `background` 是 Boolean prop，Vue 在调用方未传时给出的运行时默认值是 `false`，
    // 它会在 `filterNullishProps` 之后覆盖掉合并进来的 `true`，导致 background 永远为假
    background: true,
    compact: false,
    stream: false,
    loaded: 0,
    loading: false,
  });

  const emits = defineEmits<PaginationEmits>();

  const attrs = useAttrs();

  const defaultProps = getComponentDefaultProps();

  const mergedProps = computed(() => {
    const definedProps = filterNullishProps(props);
    return {
      ...defaultProps,
      ...definedProps,
    };
  });

  const mergedAttrs = computed(() => {
    // INVALID_PROPS 是 `as const` 的只读元组，展开一份即可满足 K[] 的签名
    return omitEntryProps(attrs, [...INVALID_PROPS]);
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

  const loadMoreAble = computed(() => {
    const { total } = modelValue.value;
    const { loaded = 0 } = mergedProps.value;

    return loaded < total;
  });

  // 加载更多
  const handleLoadMore = () => {
    if (!isOperable.value || !loadMoreAble.value) {
      return;
    }
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
      <!--
        Element Plus 的 `slot` 片段已被本组件占用：`loadMore` 翻译成 `slot` 后落在这里，
        因此默认插槽不再对外暴露自定义内容
      -->
      <pagination-load-more
        v-if="isStream"
        :loaded="mergedProps.loaded ?? 0"
        :total="modelValue.total"
        :loading="Boolean(mergedProps.loading)"
        :disabled="!isOperable"
        :able="loadMoreAble"
        @load-more="handleLoadMore"
      />
    </el-pagination>
  </template>
  <template v-else>
    <div
      v-bind="mergedAttrs"
      class="pagination-container pagination-container--compact"
      :class="{ 'is-background': mergedProps.background }"
    >
      <template v-for="(item, index) in mergedLayout" :key="`${item}-${index}`">
        <el-button
          v-if="item === 'prev'"
          class="pagination--prev"
          :disabled="!isOperable || isFirstPage"
          link
          @click.stop="handlePagePrev"
        >
          <el-icon>
            <component :is="prevIcon" />
          </el-icon>
        </el-button>
        <div v-if="item === 'pager'" class="pagination--pager">
          {{ `${modelValue.currentPage || 0}` }}
        </div>
        <el-button
          v-if="item === 'next'"
          class="pagination--next"
          :disabled="!isOperable || isLastPage"
          link
          @click.stop="handlePageNext"
        >
          <el-icon>
            <component :is="nextIcon" />
          </el-icon>
        </el-button>
        <!--
          `loadMore` 是一个复合片段：加载更多按钮 + 已加载 / 总数量，
          与非紧凑形态共用同一个内部组件，保证两种形态下 markup 与状态判定完全一致
        -->
        <pagination-load-more
          v-if="item === 'loadMore'"
          :loaded="mergedProps.loaded ?? 0"
          :total="modelValue.total"
          :loading="Boolean(mergedProps.loading)"
          :disabled="!isOperable"
          :able="loadMoreAble"
          @load-more="handleLoadMore"
        />
        <!-- 流式加载时 `total` 已被 handleLayout 剔除，这里只剩普通分页的计数 -->
        <div v-if="item === 'total'" class="pagination--total">
          {{ `共 ${modelValue.total} 条` }}
        </div>
        <div
          v-if="item === 'sizes'"
          class="pagination--sizes"
          :class="{
            'is-disabled': !isOperable,
          }"
        >
          <el-icon @click.stop="handlePageSizePrev"><Minus /></el-icon>
          <div>{{ `${modelValue.pageSize || 0} 条/页` }}</div>
          <el-icon @click.stop="handlePageSizeNext"><Plus /></el-icon>
        </div>
        <div
          v-if="item === 'jumper'"
          class="pagination--jumper"
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

  .pagination-container {
    display: flex;
    align-items: center;

    // 非紧凑形态里本组件只贡献 loadMore 一个片段：Element Plus 给每个内建片段加了
    // `margin-left: item-gap`，并靠 `is-first` 清掉首个；slot 内容是 vnode 数组，
    // 拿不到 `is-first` / `is-last`，这里手动补一份，并对首个元素归零
    &:not(.pagination-container--compact) .pagination-loadmore {
      margin-left: var(--el-pagination-item-gap);
    }

    &:not(.pagination-container--compact) .pagination-loadmore:first-child {
      margin-left: 0;
    }

    // 未开启 background 时，Element Plus 的单元是透明底 + 主色 hover 文字，
    // loadMore 按钮跟随同一语义（子组件内部元素，需 :deep 穿透）
    &:not(.is-background) .pagination-loadmore {
      :deep(.el-button) {
        --el-button-bg-color: transparent;
        --el-button-hover-bg-color: var(--el-fill-color-light);
        --el-button-active-bg-color: var(--el-fill-color-light);
        --el-button-disabled-bg-color: transparent;
      }
    }
  }

  // 紧凑形态：整行是一条 flex，所有单元共用同一高度、圆角与间距，
  // 避免按钮、页码、条数、跳转框各按自身默认尺寸渲染而高低参差
  .pagination-container--compact {
    // 紧凑形态的根节点不是 .el-pagination，拿不到 Element Plus 声明在 .el-pagination 上的
    // 分页变量，这里按 EP 的默认值补一份。变量名全部沿用 EP（不新增自定义变量），
    // 宿主覆盖 --el-pagination-* 时两种形态仍保持一致
    --el-pagination-font-size: 14px;
    --el-pagination-border-radius: 2px;
    --el-pagination-button-width: 32px;
    --el-pagination-button-height: 32px;
    --el-pagination-bg-color: var(--el-fill-color-blank);
    --el-pagination-button-color: var(--el-text-color-primary);
    --el-pagination-button-bg-color: var(--el-fill-color);
    --el-pagination-button-disabled-color: var(--el-text-color-placeholder);
    --el-pagination-button-disabled-bg-color: var(--el-fill-color-blank);
    --el-pagination-hover-color: var(--el-color-primary);

    column-gap: 8px;

    > * {
      flex: none;
    }

    // 上一个 / 下一个：尺寸、圆角、颜色全部对齐 Element Plus 的 .btn-prev / .btn-next，
    // 只把 el-button 默认的白底描边与 15px 内边距换掉
    .pagination--prev,
    .pagination--next {
      width: var(--el-pagination-button-width);
      min-width: var(--el-pagination-button-width);
      height: var(--el-pagination-button-height);
      margin: 0;
      padding: 0;
      border-radius: var(--el-pagination-border-radius);

      --el-button-bg-color: var(--el-pagination-bg-color);
      --el-button-border-color: transparent;
      --el-button-text-color: var(--el-pagination-button-color);
      --el-button-hover-bg-color: var(--el-pagination-bg-color);
      --el-button-hover-border-color: transparent;
      --el-button-hover-text-color: var(--el-pagination-hover-color);
      --el-button-active-bg-color: var(--el-pagination-bg-color);
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

    // 页码：只显示当前页。非 background 下 EP 的 .is-active 是主色文字加粗，
    // 所以默认按这个语义渲染，灰底白字的色块放到 .is-background 分支
    .pagination--pager {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: var(--el-pagination-button-width);
      height: var(--el-pagination-button-height);
      padding: 0 4px;
      border-radius: var(--el-pagination-border-radius);
      color: var(--el-pagination-hover-color);
      font-size: var(--el-pagination-font-size);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }

    // 条数步进：与按钮同高，左右留 8px 内边距撑开点击区域
    .pagination--sizes {
      display: flex;
      align-items: center;
      column-gap: 6px;
      height: var(--el-pagination-button-height);
      padding: 0 8px;
      border-radius: var(--el-pagination-border-radius);
      background-color: var(--el-pagination-bg-color);
      color: var(--el-pagination-button-color);
      font-size: var(--el-pagination-font-size);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;

      .el-icon {
        font-size: 12px;
        cursor: pointer;

        &:hover {
          color: var(--el-pagination-hover-color);
        }
      }

      &.is-disabled {
        color: var(--el-pagination-button-disabled-color);
        background-color: var(--el-pagination-button-disabled-bg-color);
        cursor: not-allowed;

        .el-icon {
          cursor: not-allowed;
          pointer-events: none;
        }
      }
    }

    // 跳转：输入框跟随整行高度（默认 32px），不再用 24px 的 small 尺寸
    .pagination--jumper {
      display: flex;
      align-items: center;
      height: var(--el-pagination-button-height);

      // 宽度只留出 3~4 位页码的空间：后缀按钮约占 34px，其余才是输入区，
      // 再宽会让整行被一个数字输入框撑开
      .el-input {
        width: 75px;
        --el-input-height: var(--el-pagination-button-height);
        --el-input-border-radius: var(--el-pagination-border-radius);
      }

      // 页码在输入框里居中，与 Element Plus 分页的 jump 行为一致
      :deep(.el-input__inner) {
        text-align: center;
      }

      // 后缀按钮是输入框的一部分：去掉自身边框与背景，但保留左右内边距，
      // 否则图标会贴边、可点击区域也会缩到只有图标本身
      :deep(.el-input-group__append) {
        padding: 0 4px;

        .el-button {
          min-height: 100%;
          padding: 0 6px;
          border: none;
          background: transparent;
          font-size: 14px;

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }

    // 总条数
    .pagination--total {
      display: flex;
      align-items: center;
      height: var(--el-pagination-button-height);
      color: var(--el-text-color-regular);
      font-size: var(--el-pagination-font-size);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    // 开启 background 时切到 EP 的色块语义：单元灰底、当前页主色块白字
    &.is-background {
      .pagination--prev,
      .pagination--next {
        --el-button-bg-color: var(--el-pagination-button-bg-color);
        --el-button-hover-bg-color: var(--el-fill-color-dark);
        --el-button-active-bg-color: var(--el-fill-color-dark);
        --el-button-disabled-bg-color: var(--el-disabled-bg-color);
      }

      .pagination--pager {
        background-color: var(--el-color-primary);
        color: var(--el-color-white);
        font-weight: 400;
      }

      .pagination--sizes {
        background-color: var(--el-pagination-button-bg-color);

        &.is-disabled {
          background-color: var(--el-disabled-bg-color);
        }
      }
    }
  }
</style>
