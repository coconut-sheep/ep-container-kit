import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { h } from 'vue';
import { CkPageContainer, CkPageContent } from 'ep-container-kit';

const global = { plugins: [ElementPlus] };

describe('CkPageContainer', () => {
  it('渲染为铺满父级的容器并承载默认插槽', () => {
    const wrapper = mount(CkPageContainer, {
      slots: { default: () => h('div', { class: 'inner' }, 'inner') },
      global,
    });

    expect(wrapper.find('.page-container').exists()).toBe(true);
    expect(wrapper.find('.inner').text()).toBe('inner');
  });

  it('透传宿主传入的 class', () => {
    const wrapper = mount(CkPageContainer, {
      attrs: { class: 'custom' },
      global,
    });

    expect(wrapper.classes()).toContain('custom');
  });
});

describe('CkPageContent 布局', () => {
  it('没有标题、返回按钮和 header 插槽时不渲染头部', () => {
    const wrapper = mount(CkPageContent, {
      slots: { default: () => h('div', 'body') },
      global,
    });

    expect(wrapper.find('.page-content--header').exists()).toBe(false);
    expect(wrapper.find('.page-content--body').exists()).toBe(true);
  });

  it('提供 title 时渲染头部标题', () => {
    const wrapper = mount(CkPageContent, {
      props: { title: '表单页' },
      slots: { default: () => h('div', 'body') },
      global,
    });

    expect(wrapper.find('.header-title-text').text()).toBe('表单页');
  });

  it('header 插槽可独立渲染头部', () => {
    const wrapper = mount(CkPageContent, {
      slots: {
        default: () => h('div', 'body'),
        header: () => h('span', { class: 'custom-header' }, 'header'),
      },
      global,
    });

    expect(wrapper.find('.page-content--header').exists()).toBe(true);
    expect(wrapper.find('.custom-header').exists()).toBe(true);
  });

  it('showBack 渲染返回按钮，点击抛出 backClick', async () => {
    const wrapper = mount(CkPageContent, {
      props: { showBack: true, title: '详情' },
      slots: { default: () => h('div', 'body') },
      global,
    });

    const back = wrapper.find('.header-back');
    expect(back.exists()).toBe(true);

    await back.trigger('click');
    expect(wrapper.emitted('backClick')).toHaveLength(1);

    // 键盘回车同样可触发
    await back.trigger('keydown.enter');
    expect(wrapper.emitted('backClick')).toHaveLength(2);
  });

  it('bodyClass 作用于内容区', () => {
    const wrapper = mount(CkPageContent, {
      props: { bodyClass: 'my-body' },
      slots: { default: () => h('div', 'body') },
      global,
    });

    expect(wrapper.find('.page-content--body').classes()).toContain('my-body');
  });

  it('没有默认插槽时不渲染内容区', () => {
    const wrapper = mount(CkPageContent, {
      props: { title: '空内容' },
      global,
    });

    expect(wrapper.find('.page-content--body').exists()).toBe(false);
  });
});

describe('CkPageContent 尺寸', () => {
  it('fullHeight 默认为 true，内容区高度固定 100%', () => {
    const wrapper = mount(CkPageContent, {
      slots: { default: () => h('div', 'body') },
      global,
    });

    const root = wrapper.find('.page-content').element as HTMLElement;
    expect(root.style.height).toBe('100%');
  });

  it('fullHeight 为 false 时按 height 计算，数字补 px', () => {
    const wrapper = mount(CkPageContent, {
      props: { fullHeight: false, height: 200 },
      slots: { default: () => h('div', 'body') },
      global,
    });

    const root = wrapper.find('.page-content').element as HTMLElement;
    expect(root.style.height).toBe('200px');
  });

  it('带单位的尺寸字符串原样透传', () => {
    const wrapper = mount(CkPageContent, {
      props: { fullHeight: false, height: '50vh', width: '100%' },
      slots: { default: () => h('div', 'body') },
      global,
    });

    const root = wrapper.find('.page-content').element as HTMLElement;
    expect(root.style.height).toBe('50vh');
    expect(root.style.width).toBe('100%');
  });

  it('非法尺寸值被忽略', () => {
    const wrapper = mount(CkPageContent, {
      props: { fullHeight: false, height: 'abc', width: -1 },
      slots: { default: () => h('div', 'body') },
      global,
    });

    const root = wrapper.find('.page-content').element as HTMLElement;
    expect(root.style.height).toBe('');
    expect(root.style.width).toBe('');
  });
});
