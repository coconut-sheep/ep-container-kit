import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { ElForm } from 'element-plus';
import {
  CkConfigProvider,
  CkFormContainer,
  CkFormItem,
  type FormContainerInstance,
} from 'ep-container-kit';

type DemoForm = {
  username: string;
  age: number;
};

describe('CkFormContainer', () => {
  it('按 schema 渲染表单项，并把源数据绑定到控件上', async () => {
    const wrapper = mount(CkFormContainer, {
      props: {
        source: { username: 'alice', age: 18 } as DemoForm,
        schema: [
          { prop: 'username', label: '用户名', type: 'input' },
          { prop: 'age', label: '年龄', type: 'inputNumber' },
        ],
      },
    });

    await nextTick();

    expect(wrapper.findAll('.el-form-item')).toHaveLength(2);
    expect(wrapper.find('input').element.value).toBe('alice');
  });

  it('通过 defineExpose 透出 el-form 的实例方法', async () => {
    const wrapper = mount(CkFormContainer, {
      props: { source: {} as DemoForm },
    });

    await nextTick();

    const instance = wrapper.vm as unknown as FormContainerInstance;
    expect(typeof instance.validate).toBe('function');
    expect(typeof instance.resetFields).toBe('function');
  });

  it('校验不通过时 validate 会 reject', async () => {
    const wrapper = mount(CkFormContainer, {
      props: {
        source: { username: '', age: 18 } as DemoForm,
        schema: [
          {
            prop: 'username',
            label: '用户名',
            type: 'input',
            rules: [{ required: true, message: '请输入用户名' }],
          },
        ],
      },
    });

    await nextTick();

    const instance = wrapper.vm as unknown as FormContainerInstance;
    await expect(instance.validate()).rejects.toBeTruthy();
  });

  it('校验通过时 validate 会 resolve 为 true', async () => {
    const wrapper = mount(CkFormContainer, {
      props: {
        source: { username: 'alice', age: 18 } as DemoForm,
        schema: [
          {
            prop: 'username',
            label: '用户名',
            type: 'input',
            rules: [{ required: true, message: '请输入用户名' }],
          },
        ],
      },
    });

    await nextTick();

    const instance = wrapper.vm as unknown as FormContainerInstance;
    await expect(instance.validate()).resolves.toBe(true);
  });

  it('slot_${prop} 可覆盖该字段的默认控件', async () => {
    const wrapper = mount(CkFormContainer, {
      props: {
        source: { username: 'alice', age: 18 } as DemoForm,
        schema: [{ prop: 'username', label: '用户名', type: 'input' }],
      },
      slots: {
        slot_username: () => h('span', { class: 'custom-control' }, '自定义控件'),
      },
    });

    await nextTick();

    expect(wrapper.find('.custom-control').exists()).toBe(true);
    expect(wrapper.find('input').exists()).toBe(false);
  });

  it('CkConfigProvider 下发的 labelWidth 会传到 el-form', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            CkConfigProvider,
            { form: { labelWidth: '120px' } },
            {
              default: () =>
                h(CkFormContainer, {
                  source: { username: 'alice', age: 18 } as DemoForm,
                  schema: [{ prop: 'username', label: '用户名', type: 'input' }],
                }),
            },
          );
      },
    });

    const wrapper = mount(Host);
    await nextTick();

    expect(wrapper.findComponent(ElForm).props('labelWidth')).toBe('120px');
  });

  it('组件自身 labelWidth 优先于 CkConfigProvider 下发的值', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            CkConfigProvider,
            { form: { labelWidth: '120px' } },
            {
              default: () =>
                h(CkFormContainer, {
                  labelWidth: '80px',
                  source: { username: 'alice', age: 18 } as DemoForm,
                  schema: [{ prop: 'username', label: '用户名', type: 'input' }],
                }),
            },
          );
      },
    });

    const wrapper = mount(Host);
    await nextTick();

    expect(wrapper.findComponent(ElForm).props('labelWidth')).toBe('80px');
  });
});

describe('CkFormItem', () => {
  it('可脱离 CkFormContainer 单独渲染', async () => {
    const wrapper = mount(CkFormItem, {
      props: {
        prop: 'username',
        label: '用户名',
        type: 'input',
        modelValue: 'alice',
      },
    });

    await nextTick();

    expect(wrapper.find('.el-form-item__label').text()).toBe('用户名');
    expect(wrapper.find('input').element.value).toBe('alice');
  });
});
