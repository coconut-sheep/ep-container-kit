import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { h, reactive } from 'vue';
import {
  CkConfigProvider,
  CkFormContainer,
  type FormContainerItem,
} from 'ep-container-kit';

const global = { plugins: [ElementPlus] };

const schema: FormContainerItem[] = [
  { prop: 'username', label: '用户名', type: 'input' },
];

/**
 * 挂载 `CkConfigProvider` + `CkFormContainer` 的组合，
 * 用于验证配置经 provide/inject 下发到表单容器的完整链路
 */
const mountWithProvider = (
  form: Record<string, unknown>,
  containerProps: Record<string, unknown> = {},
) => {
  const state = reactive({ username: '' });

  const wrapper = mount(CkConfigProvider, {
    props: { form },
    slots: {
      default: () => {
        return h(CkFormContainer, {
          modelValue: state,
          schema,
          ...containerProps,
        });
      },
    },
    global,
  });

  const elForm = wrapper.findComponent({ name: 'ElForm' });

  return { wrapper, state, elForm };
};

describe('CkConfigProvider 下发配置', () => {
  it('form 中的配置项被注入到 CkFormContainer 并传给 el-form', () => {
    const { elForm } = mountWithProvider({
      labelWidth: '120px',
      labelPosition: 'left',
    });

    expect(elForm.props('labelWidth')).toBe('120px');
    expect(elForm.props('labelPosition')).toBe('left');
  });

  it('容器自身显式传参优先于注入值', () => {
    const { elForm } = mountWithProvider(
      { labelWidth: '120px', labelPosition: 'left' },
      { labelWidth: '90px' },
    );

    expect(elForm.props('labelWidth')).toBe('90px');
    // 未显式传参的项仍来自注入
    expect(elForm.props('labelPosition')).toBe('left');
  });

  it('注入 vertical 后容器切换为垂直布局', () => {
    const { wrapper } = mountWithProvider({ vertical: true });

    expect(wrapper.find('.form-container').classes()).toContain(
      'form-container--vertical',
    );
  });

  it('未提供 form 时使用默认配置，不报错', () => {
    const { elForm, wrapper } = mountWithProvider({});

    // el-form 自身的默认值
    expect(elForm.props('labelPosition')).toBe('right');
    expect(wrapper.find('.form-container').classes()).toContain(
      'form-container--horizontal',
    );
  });

  it('form 之外的配置透传给 el-config-provider', () => {
    const wrapper = mount(CkConfigProvider, {
      props: { form: {}, size: 'small', zIndex: 3000 },
      slots: { default: () => h('div', 'content') },
      global,
    });

    const elConfigProvider = wrapper.findComponent({
      name: 'ElConfigProvider',
    });

    expect(elConfigProvider.props('size')).toBe('small');
    expect(elConfigProvider.props('zIndex')).toBe(3000);
    // form 是库内私有配置，不能透传给 Element Plus
    expect(elConfigProvider.props('form')).toBeUndefined();
  });

  it('默认插槽内容原样渲染', () => {
    const wrapper = mount(CkConfigProvider, {
      props: { form: {} },
      slots: { default: () => h('span', { class: 'inner' }, 'inner') },
      global,
    });

    expect(wrapper.find('.inner').text()).toBe('inner');
  });
});
