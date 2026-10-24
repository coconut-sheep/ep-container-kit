import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { CkPageContainer, CkPageContent } from 'ep-container-kit';

const bodySlot = () => h('div', { class: 'body-slot' }, '内容');

describe('CkPageContent', () => {
  it('渲染标题与返回按钮，点击返回触发 backClick', async () => {
    const onBackClick = vi.fn<() => void>();
    const wrapper = mount(CkPageContent, {
      props: { title: '资产详情', showBack: true, onBackClick },
      slots: { default: bodySlot },
    });

    expect(wrapper.find('.page-content-header').exists()).toBe(true);
    expect(wrapper.find('.header-title-text').text()).toBe('资产详情');

    await wrapper.find('.header-back').trigger('click');

    expect(onBackClick).toHaveBeenCalledTimes(1);
  });

  it('无 title / showBack / header 插槽时不渲染头部', () => {
    const wrapper = mount(CkPageContent, {
      slots: { default: bodySlot },
    });

    expect(wrapper.find('.page-content-header').exists()).toBe(false);
    expect(wrapper.find('.page-content-body').exists()).toBe(true);
  });

  it('header 插槽可单独驱动头部渲染', () => {
    const wrapper = mount(CkPageContent, {
      slots: {
        default: bodySlot,
        header: () => h('span', { class: 'header-slot' }, '工具栏'),
      },
    });

    expect(wrapper.find('.page-content-header').exists()).toBe(true);
    expect(wrapper.find('.header-slot').exists()).toBe(true);
    // 没有 title / showBack，不渲染标题块
    expect(wrapper.find('.header-title').exists()).toBe(false);
  });

  it('fullHeight 默认为 true，内容区高度取 100%', () => {
    const wrapper = mount(CkPageContent, {
      props: { title: '标题' },
      slots: { default: bodySlot },
    });

    expect((wrapper.element as HTMLElement).style.height).toBe('100%');
  });

  it('fullHeight 为 false 时按 height 生效，数字补 px', () => {
    const wrapper = mount(CkPageContent, {
      props: { fullHeight: false, height: 320 },
      slots: { default: bodySlot },
    });

    expect((wrapper.element as HTMLElement).style.height).toBe('320px');
  });

  it('width 支持带单位的字符串', () => {
    const wrapper = mount(CkPageContent, {
      props: { width: '50%' },
      slots: { default: bodySlot },
    });

    expect((wrapper.element as HTMLElement).style.width).toBe('50%');
  });

  it('bodyClass 透传到内容区', () => {
    const wrapper = mount(CkPageContent, {
      props: { bodyClass: 'flex-column row-gap-10' },
      slots: { default: bodySlot },
    });

    const body = wrapper.find('.page-content-body');
    expect(body.classes()).toContain('flex-column');
    expect(body.classes()).toContain('row-gap-10');
  });

  it('没有默认插槽时不渲染内容区', () => {
    const wrapper = mount(CkPageContent, {
      props: { title: '标题' },
    });

    expect(wrapper.find('.page-content-body').exists()).toBe(false);
  });
});

describe('CkPageContainer', () => {
  it('渲染默认插槽内容', () => {
    const wrapper = mount(CkPageContainer, {
      slots: { default: () => h('div', { class: 'inner' }, '页面') },
    });

    expect(wrapper.classes()).toContain('page-container');
    expect(wrapper.find('.inner').text()).toBe('页面');
  });
});
