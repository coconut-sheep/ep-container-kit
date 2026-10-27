import { describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { reactive } from 'vue';
import {
  CkPagination,
  getDefaultPaginationConfig,
  type PaginationConfig,
  type PaginationLayout,
} from 'ep-container-kit';

const global = { plugins: [ElementPlus] };

type MountOptions = {
  props?: Record<string, unknown>;
  config?: Partial<PaginationConfig>;
};

const mountPagination = (options: MountOptions = {}) => {
  const model = reactive(getDefaultPaginationConfig(options.config));

  const wrapper = mount(CkPagination, {
    props: {
      modelValue: model,
      'onUpdate:modelValue': (value: PaginationConfig) => {
        Object.assign(model, value);
      },
      ...options.props,
    },
    global,
  });

  return { wrapper, model };
};

describe('getDefaultPaginationConfig', () => {
  it('返回完整的默认配置', () => {
    expect(getDefaultPaginationConfig()).toEqual({
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 50, 100, 200],
      // loadMore 与 total 同时存在：二者按 stream 互斥生效
      layout: ['sizes', 'prev', 'pager', 'next', 'jumper', 'loadMore', 'total'],
    });
  });

  it('支持部分覆盖', () => {
    const config = getDefaultPaginationConfig({ pageSize: 20, total: 100 });

    expect(config.pageSize).toBe(20);
    expect(config.total).toBe(100);
    // 未覆盖的字段保持默认
    expect(config.currentPage).toBe(1);
  });

  it('每次返回新对象，避免多个调用方共享同一份配置', () => {
    const first = getDefaultPaginationConfig();
    const second = getDefaultPaginationConfig();

    expect(first).not.toBe(second);
    expect(first.pageSizes).not.toBe(second.pageSizes);
    expect(first.layout).not.toBe(second.layout);
  });
});

describe('CkPagination 非紧凑形态', () => {
  it('交给 el-pagination 渲染', () => {
    const { wrapper } = mountPagination();

    expect(wrapper.find('.el-pagination').exists()).toBe(true);
    expect(wrapper.find('.pagination-container--compact').exists()).toBe(false);
    expect(wrapper.find('.btn-prev').exists()).toBe(true);
    expect(wrapper.find('.el-pager').exists()).toBe(true);
  });

  it('stream 为 false 时 loadMore 片段被剔除', () => {
    const { wrapper } = mountPagination({
      config: { layout: ['prev', 'pager', 'loadMore'] },
    });

    expect(wrapper.find('.pagination-loadmore').exists()).toBe(false);
  });

  it('stream 为 true 时 loadMore 落进 el-pagination 的 slot，并剔除翻页与计数', () => {
    const { wrapper } = mountPagination({
      props: { stream: true, loaded: 10 },
      config: {
        total: 100,
        layout: ['prev', 'pager', 'next', 'loadMore', 'total'],
      },
    });

    // loadMore 被翻译成 el-pagination 的 slot 片段
    expect(wrapper.find('.pagination-loadmore').exists()).toBe(true);
    // pager / prev / next / total 全部被剔除
    expect(wrapper.find('.el-pager').exists()).toBe(false);
    expect(wrapper.find('.btn-prev').exists()).toBe(false);
    expect(wrapper.find('.el-pagination__total').exists()).toBe(false);
  });
});

describe('CkPagination 紧凑形态', () => {
  it('由组件自身逐片段渲染，class 标记紧凑形态', () => {
    const { wrapper } = mountPagination({
      props: { compact: true },
      config: { layout: ['prev', 'pager', 'next'], total: 100 },
    });

    expect(wrapper.find('.pagination-container--compact').exists()).toBe(true);
    expect(wrapper.find('.pagination--prev').exists()).toBe(true);
    expect(wrapper.find('.pagination--next').exists()).toBe(true);
    expect(wrapper.find('.pagination--pager').text()).toBe('1');
  });

  it('紧凑形态不支持左右分栏，`->` 片段被剔除', () => {
    const { wrapper } = mountPagination({
      props: { compact: true },
      config: { layout: ['prev', '->', 'next'] },
    });

    // `->` 没有渲染成任何单元
    expect(wrapper.findAll('.pagination-item')).toHaveLength(2);
  });

  it('点击下一页更新 currentPage 并抛出 change', async () => {
    const { wrapper, model } = mountPagination({
      props: { compact: true },
      config: { layout: ['prev', 'pager', 'next'], total: 100, pageSize: 10 },
    });

    await wrapper.find('.pagination--next').trigger('click');
    await flushPromises();

    expect(model.currentPage).toBe(2);
    expect(wrapper.find('.pagination--pager').text()).toBe('2');

    const changeEvents = wrapper.emitted('change');
    expect(changeEvents).toHaveLength(1);
    expect(changeEvents?.[0]?.[0]).toMatchObject({ currentPage: 2 });
  });

  it('首页时上一页不可用', async () => {
    const { wrapper, model } = mountPagination({
      props: { compact: true },
      config: { layout: ['prev', 'next'], total: 100 },
    });

    await wrapper.find('.pagination--prev').trigger('click');
    await flushPromises();

    expect(model.currentPage).toBe(1);
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('禁用状态下不响应翻页', async () => {
    const { wrapper, model } = mountPagination({
      props: { compact: true, disabled: true },
      config: { layout: ['prev', 'next'], total: 100 },
    });

    await wrapper.find('.pagination--next').trigger('click');
    await flushPromises();

    expect(model.currentPage).toBe(1);
  });

  it('loading 时不响应翻页', async () => {
    const { wrapper, model } = mountPagination({
      props: { compact: true, loading: true },
      config: { layout: ['prev', 'next'], total: 100 },
    });

    await wrapper.find('.pagination--next').trigger('click');
    await flushPromises();

    expect(model.currentPage).toBe(1);
  });

  it('切换每页条数时回到第一页', async () => {
    const { wrapper, model } = mountPagination({
      props: { compact: true },
      config: {
        layout: ['sizes', 'prev', 'next'],
        total: 100,
        pageSize: 10,
        currentPage: 3,
      },
    });

    const [minus] = wrapper.findAll('.pagination--sizes .el-icon');
    await minus!.trigger('click');
    await flushPromises();

    // pageSize 10 的前一项不存在（已是第一项），不应发生变化
    expect(model.pageSize).toBe(10);

    const plus = wrapper.findAll('.pagination--sizes .el-icon')[1];
    await plus!.trigger('click');
    await flushPromises();

    expect(model.pageSize).toBe(20);
    // 改页长后 currentPage 先归 1，再抛出 change
    expect(model.currentPage).toBe(1);
  });
});

describe('CkPagination 流式加载', () => {
  it('紧凑形态下点击「加载更多」抛出 loadMore', async () => {
    const { wrapper } = mountPagination({
      props: { compact: true, stream: true, loaded: 10 },
      config: { layout: ['loadMore'], total: 100 },
    });

    const loadMore = wrapper.find('.pagination-loadmore');
    expect(loadMore.exists()).toBe(true);

    await loadMore.find('.el-button').trigger('click');

    expect(wrapper.emitted('loadMore')).toHaveLength(1);
  });

  it('已加载条数达到总数时禁用「加载更多」', async () => {
    const { wrapper } = mountPagination({
      props: { compact: true, stream: true, loaded: 100 },
      config: { layout: ['loadMore'], total: 100 },
    });

    const loadMore = wrapper.find('.pagination-loadmore');
    expect(loadMore.classes()).toContain('is-disabled');

    await loadMore.find('.el-button').trigger('click');

    expect(wrapper.emitted('loadMore')).toBeUndefined();
  });

  it('加载中时禁用「加载更多」', async () => {
    const { wrapper } = mountPagination({
      props: { compact: true, stream: true, loading: true, loaded: 10 },
      config: { layout: ['loadMore'], total: 100 },
    });

    await wrapper.find('.pagination-loadmore .el-button').trigger('click');

    expect(wrapper.emitted('loadMore')).toBeUndefined();
  });

  it('流式加载会剔除 pager / total 片段，避免出现第二份计数', () => {
    const layout: PaginationLayout[] = ['pager', 'total', 'loadMore'];
    const { wrapper } = mountPagination({
      props: { compact: true, stream: true, loaded: 10 },
      config: { layout, total: 100 },
    });

    expect(wrapper.find('.pagination--pager').exists()).toBe(false);
    expect(wrapper.find('.pagination--total').exists()).toBe(false);
    expect(wrapper.find('.pagination-loadmore').exists()).toBe(true);
  });
});
