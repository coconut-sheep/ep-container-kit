import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElPagination } from 'element-plus';
import type { PaginationConfig } from 'ep-container-kit';
import { CkPagination, getDefaultPaginationConfig } from 'ep-container-kit';

/**
 * 构造一份可被就地修改的分页配置
 * @param patch 覆盖字段
 */
const createConfig = (patch: Partial<PaginationConfig> = {}) => {
  return { ...getDefaultPaginationConfig(), pageTotal: 100, ...patch };
};

describe('CkPagination', () => {
  describe('非紧凑形态（Element Plus 单元）', () => {
    it('默认渲染总条数与页码按钮', () => {
      const wrapper = mount(CkPagination, {
        props: { modelValue: createConfig() },
      });

      expect(wrapper.classes()).toContain('pagination');
      expect(wrapper.find('.el-pagination').exists()).toBe(true);
      expect(wrapper.find('.el-pagination__total').text()).toContain('100');
      // 共 10 页，但默认 pagerCount 为 5，中间的页码折叠为省略号
      expect(wrapper.findAll('.el-pager li.number')).toHaveLength(5);
    });

    it('pagerCount 透传到分页器，偶数归一化为奇数', () => {
      const odd = mount(CkPagination, {
        props: { modelValue: createConfig(), pagerCount: 7 },
      });
      expect(odd.findAll('.el-pager li.number')).toHaveLength(7);

      const even = mount(CkPagination, {
        props: { modelValue: createConfig(), pagerCount: 6 },
      });
      expect(even.findComponent(ElPagination).props('pagerCount')).toBe(7);
    });

    it('layouts 去重后交给分页器，重复片段只渲染一次', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({
            layouts: ['total', 'total', 'prev', 'pager', 'next'],
          }),
        },
      });

      expect(wrapper.findComponent(ElPagination).props('layout')).toBe(
        'total, prev, pager, next',
      );
      expect(wrapper.findAll('.el-pagination__total')).toHaveLength(1);
    });

    it('pageSizes 去重且保持原顺序', () => {
      const wrapper = mount(CkPagination, {
        props: { modelValue: createConfig({ pageSizes: [20, 10, 20, 50] }) },
      });

      expect(wrapper.findComponent(ElPagination).props('pageSizes')).toEqual([
        20, 10, 50,
      ]);
    });

    it('点击页码写回 current 并触发 change', async () => {
      const config = createConfig();
      const onChange = vi.fn<(value: PaginationConfig) => void>();

      const wrapper = mount(CkPagination, {
        props: { modelValue: config, onChange },
      });

      await wrapper.findAll('.el-pager li.number')[1]!.trigger('click');
      await wrapper.vm.$nextTick();

      expect(config.current).toBe(2);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0]![0].current).toBe(2);
    });

    it('每页条数变更时 pageSize 生效且页码回到第一页', async () => {
      const config = createConfig({ current: 5 });
      const onChange = vi.fn<(value: PaginationConfig) => void>();

      const wrapper = mount(CkPagination, {
        props: { modelValue: config, onChange },
      });

      wrapper.findComponent(ElPagination).vm.$emit('size-change', 50);
      await wrapper.vm.$nextTick();

      expect(config.pageSize).toBe(50);
      expect(config.current).toBe(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('disabled 透传到分页器', () => {
      const wrapper = mount(CkPagination, {
        props: { modelValue: createConfig(), disabled: true },
      });

      expect(wrapper.findComponent(ElPagination).props('disabled')).toBe(true);
    });

    it('未声明的属性透传到分页器（如 hideOnSinglePage）', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ pageTotal: 5 }),
          hideOnSinglePage: true,
        },
      });

      expect(
        wrapper.findComponent(ElPagination).props('hideOnSinglePage'),
      ).toBe(true);
      // 只有一页时整个分页器不渲染
      expect(wrapper.find('.el-pagination').exists()).toBe(false);
    });

    it('默认形态不带紧凑样式类', () => {
      const wrapper = mount(CkPagination, {
        props: { modelValue: createConfig() },
      });

      expect(wrapper.classes()).not.toContain('pagination--compact');
    });

    it('传入 extra 插槽时自动补上 slot 片段且不重复', () => {
      const wrapper = mount(CkPagination, {
        props: { modelValue: createConfig({ layouts: ['total', 'sizes'] }) },
        slots: { extra: '<span class="my-extra">自定义</span>' },
      });

      expect(wrapper.findComponent(ElPagination).props('layout')).toBe(
        'total, sizes, slot',
      );
      expect(wrapper.find('.my-extra').exists()).toBe(true);
    });
  });

  describe('紧凑形态（自研单元）', () => {
    it('不再渲染 Element Plus 分页器，根节点换成紧凑容器', () => {
      const wrapper = mount(CkPagination, {
        props: { modelValue: createConfig(), compact: true },
      });

      expect(wrapper.classes()).toContain('pagination');
      expect(wrapper.classes()).toContain('pagination--compact');
      expect(wrapper.find('.el-pagination').exists()).toBe(false);
    });

    it('layouts 决定单元的渲染顺序', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({
            layouts: ['total', 'sizes', 'prev', 'pager', 'next'],
          }),
          compact: true,
        },
      });

      const html = wrapper.html();
      const totalAt = html.indexOf('pagination__total');
      const sizesAt = html.indexOf('pagination__sizes');
      const prevAt = html.indexOf('pagination__nav');
      const pagerAt = html.indexOf('pagination__pager');

      expect(totalAt).toBeGreaterThan(-1);
      expect(sizesAt).toBeGreaterThan(totalAt);
      expect(prevAt).toBeGreaterThan(sizesAt);
      expect(pagerAt).toBeGreaterThan(prevAt);
    });

    it('total 单元显示 Element Plus 的总条数文案', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['total'], pageTotal: 100 }),
          compact: true,
        },
      });

      expect(wrapper.find('.pagination__total').text()).toContain('100');
    });

    it('sizes 单元是步进器而非下拉框', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['sizes'] }),
          compact: true,
        },
      });

      expect(wrapper.find('.el-pagination__sizes').exists()).toBe(false);
      expect(wrapper.find('.pagination__sizes').exists()).toBe(true);
      expect(wrapper.find('.pagination__size-text').text()).toContain('10');
    });

    it('步进器按候选顺序调整条数并回到第一页', async () => {
      const config = createConfig({ layouts: ['sizes'], current: 3 });
      const onChange = vi.fn<(value: PaginationConfig) => void>();

      const wrapper = mount(CkPagination, {
        props: { modelValue: config, compact: true, onChange },
      });

      const steps = wrapper.findAll('.pagination__step');
      await steps[1]!.trigger('click');
      await wrapper.vm.$nextTick();

      expect(config.pageSize).toBe(20);
      expect(config.current).toBe(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('到达候选边界时对应方向禁用', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['sizes'], pageSize: 10 }),
          compact: true,
        },
      });

      const steps = wrapper.findAll('.pagination__step');
      expect(steps[0]!.classes()).toContain('is-disabled');
      expect(steps[1]!.classes()).not.toContain('is-disabled');
    });

    it('pageSize 不在 pageSizes 内时两个方向仍可用', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({
            layouts: ['sizes'],
            pageSize: 15,
            pageSizes: [10, 20],
          }),
          compact: true,
        },
      });

      const steps = wrapper.findAll('.pagination__step');
      expect(steps[0]!.classes()).not.toContain('is-disabled');
      expect(steps[1]!.classes()).not.toContain('is-disabled');
    });

    it('disabled 时步进器与翻页都禁用且点击无效', async () => {
      const config = createConfig({
        layouts: ['sizes', 'prev', 'next'],
        pageSize: 20,
      });

      const wrapper = mount(CkPagination, {
        props: { modelValue: config, compact: true, disabled: true },
      });

      const steps = wrapper.findAll('.pagination__step');
      expect(steps[0]!.classes()).toContain('is-disabled');
      expect(steps[1]!.classes()).toContain('is-disabled');

      await steps[1]!.trigger('click');
      expect(config.pageSize).toBe(20);

      const navs = wrapper.findAll('.pagination__nav');
      expect(navs[1]!.classes()).toContain('is-disabled');
      await navs[1]!.trigger('click');
      expect(config.current).toBe(1);
    });

    it('首页时上一页禁用，点击下一页写回页码', async () => {
      const config = createConfig({
        layouts: ['prev', 'next'],
        pageTotal: 100,
      });
      const onChange = vi.fn<(value: PaginationConfig) => void>();

      const wrapper = mount(CkPagination, {
        props: { modelValue: config, compact: true, onChange },
      });

      const navs = wrapper.findAll('.pagination__nav');
      expect(navs[0]!.classes()).toContain('is-disabled');
      expect(navs[1]!.classes()).not.toContain('is-disabled');

      await navs[1]!.trigger('click');
      await wrapper.vm.$nextTick();

      expect(config.current).toBe(2);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('页码单元按 pagerCount 折叠，居中时两侧都是省略号', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({
            layouts: ['pager'],
            pageTotal: 100,
            pageSize: 10,
            current: 5,
          }),
          compact: true,
        },
      });

      // 10 页、pagerCount=5：1 … 4 5 6 … 10
      expect(wrapper.findAll('.pagination__pager-button')).toHaveLength(5);
      expect(wrapper.findAll('.pagination__pager-item.is-more')).toHaveLength(
        2,
      );
      expect(wrapper.find('.pagination__pager-item.is-active').text()).toBe(
        '5',
      );
    });

    it('页数不超过 pagerCount 时全部铺开、没有省略号', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({
            layouts: ['pager'],
            pageTotal: 30,
            pageSize: 10,
          }),
          compact: true,
        },
      });

      expect(wrapper.findAll('.pagination__pager-button')).toHaveLength(3);
      expect(wrapper.findAll('.pagination__pager-item.is-more')).toHaveLength(
        0,
      );
    });

    it('点击页码写回 current，点当前页不派发 change', async () => {
      const config = createConfig({ layouts: ['pager'] });
      const onChange = vi.fn<(value: PaginationConfig) => void>();

      const wrapper = mount(CkPagination, {
        props: { modelValue: config, compact: true, onChange },
      });

      const buttons = wrapper.findAll('.pagination__pager-button');
      await buttons[0]!.trigger('click');
      expect(config.current).toBe(1);
      expect(onChange).not.toHaveBeenCalled();

      await buttons[1]!.trigger('click');
      await wrapper.vm.$nextTick();

      expect(config.current).toBe(2);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('jumper 跳页，超界按边界收敛', async () => {
      const config = createConfig({ layouts: ['jumper'], pageTotal: 100 });

      const wrapper = mount(CkPagination, {
        props: { modelValue: config, compact: true },
      });

      const input = wrapper.find('.pagination__jumper-input input');

      await input.setValue('3');
      await input.trigger('keyup.enter');
      expect(config.current).toBe(3);

      await input.setValue('999');
      await input.trigger('keyup.enter');
      expect(config.current).toBe(10);
    });

    it('`->` 渲染为撑开两侧的占位单元', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['total', '->', 'jumper'] }),
          compact: true,
        },
      });

      expect(wrapper.find('.pagination__spacer').exists()).toBe(true);
    });

    it('不把 Element Plus 专有属性写成无意义的 DOM 属性', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig(),
          compact: true,
          hideOnSinglePage: true,
        },
      });

      expect(wrapper.attributes('hidesonsinglepage')).toBeUndefined();
    });

    it('external class 合并到紧凑容器上', () => {
      const wrapper = mount(CkPagination, {
        props: { modelValue: createConfig(), compact: true },
        attrs: { class: 'my-pagination' },
      });

      expect(wrapper.classes()).toContain('my-pagination');
      expect(wrapper.classes()).toContain('pagination--compact');
    });
  });

  describe('追加加载（showLoadMore）', () => {
    it('非紧凑形态在布局末尾补上 slot 片段', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['sizes'], pageTotal: 100 }),
          showLoadMore: true,
          loadedCount: 30,
        },
      });

      expect(wrapper.find('.pagination__load-more').text()).toBe('加载更多');
      expect(wrapper.find('.pagination__loaded').text()).toBe('30 / 100');
      expect(wrapper.findComponent(ElPagination).props('layout')).toBe(
        'sizes, slot',
      );
    });

    it('已加载达到总数时文案变为「没有更多了」且禁用', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['sizes'], pageTotal: 30 }),
          showLoadMore: true,
          loadedCount: 30,
        },
      });

      const button = wrapper.find('.pagination__load-more');
      expect(button.text()).toBe('没有更多了');
      expect(button.classes()).toContain('is-disabled');
    });

    it('点击加载更多派发 loadMore', async () => {
      const onLoadMore = vi.fn<() => void>();

      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['sizes'], pageTotal: 100 }),
          showLoadMore: true,
          loadedCount: 10,
          onLoadMore,
        },
      });

      await wrapper.find('.pagination__load-more').trigger('click');
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('加载中时按钮呈现 loading 且不可点击', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['sizes'], pageTotal: 100 }),
          showLoadMore: true,
          loadedCount: 10,
          loading: true,
        },
      });

      const button = wrapper.find('.pagination__load-more');
      expect(button.classes()).toContain('is-loading');
      expect(button.classes()).toContain('is-disabled');
    });

    it('紧凑形态下按「步进器 → 加载更多 → 计数」排列', () => {
      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['sizes'], pageTotal: 100 }),
          compact: true,
          showLoadMore: true,
          loadedCount: 10,
        },
      });

      const html = wrapper.html();
      const sizesAt = html.indexOf('pagination__sizes');
      const loadMoreAt = html.indexOf('pagination__load-more');
      const loadedAt = html.indexOf('pagination__loaded');

      expect(sizesAt).toBeGreaterThan(-1);
      expect(loadMoreAt).toBeGreaterThan(sizesAt);
      expect(loadedAt).toBeGreaterThan(loadMoreAt);
      expect(wrapper.find('.el-pagination__sizes').exists()).toBe(false);
    });

    it('紧凑形态下点击加载更多同样派发 loadMore', async () => {
      const onLoadMore = vi.fn<() => void>();

      const wrapper = mount(CkPagination, {
        props: {
          modelValue: createConfig({ layouts: ['sizes'], pageTotal: 100 }),
          compact: true,
          showLoadMore: true,
          loadedCount: 10,
          onLoadMore,
        },
      });

      await wrapper.find('.pagination__load-more').trigger('click');
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });
  });
});
