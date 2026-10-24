import { describe, expect, it, vi } from 'vitest';
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
        modelValue: { username: 'alice', age: 18 } as DemoForm,
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
      props: { modelValue: {} as DemoForm },
    });

    await nextTick();

    const instance = wrapper.vm as unknown as FormContainerInstance;
    expect(typeof instance.validate).toBe('function');
    expect(typeof instance.resetFields).toBe('function');
  });

  it('校验不通过时 validate 会 reject', async () => {
    const wrapper = mount(CkFormContainer, {
      props: {
        modelValue: { username: '', age: 18 } as DemoForm,
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
        modelValue: { username: 'alice', age: 18 } as DemoForm,
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
        modelValue: { username: 'alice', age: 18 } as DemoForm,
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

  it('不把内部配置与 v-model 泄漏成 DOM 属性', async () => {
    const wrapper = mount(CkFormContainer, {
      props: {
        modelValue: { username: 'alice' } as DemoForm,
        vertical: true,
        itemMinWidth: 200,
        itemMaxWidth: 480,
        schema: [{ prop: 'username', label: '用户名', type: 'input' }],
      },
    });

    await nextTick();

    const attrNames = Object.keys(wrapper.find('form').element.attributes);
    // 这些 key 只有容器自己认识，落到 <form> 上就是脏属性
    expect(attrNames).not.toContain('modelvalue');
    expect(attrNames).not.toContain('source');
    expect(attrNames).not.toContain('schema');
    expect(attrNames).not.toContain('vertical');
    expect(attrNames).not.toContain('itemminwidth');
    expect(attrNames).not.toContain('itemmaxwidth');
  });

  it('编辑时就地写回数据源', async () => {
    const source: DemoForm = { username: 'alice', age: 18 };
    const onUpdate = vi.fn<(value: unknown) => void>();
    const wrapper = mount(CkFormContainer, {
      props: {
        modelValue: source,
        'onUpdate:modelValue': onUpdate,
        schema: [{ prop: 'username', label: '用户名', type: 'input' }],
      },
    });

    await nextTick();
    await wrapper.find('input').setValue('bob');

    // 写回方式是就地修改同一个对象，因此父级拿到的是最新值……
    expect(source.username).toBe('bob');
    // ……但不会派发 update 事件。需要监听变化时请 watch 数据对象本身。
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it(':model 不作为数据源，且给出提示', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(CkFormContainer, {
      props: {
        modelValue: { username: 'alice' } as DemoForm,
        schema: [{ prop: 'username', label: '用户名', type: 'input' }],
      },
      attrs: { model: { username: 'ignored' } },
    });

    await nextTick();

    expect(wrapper.find('input').element.value).toBe('alice');
    expect(warnSpy.mock.calls.flat().join(' ')).toContain(':model');

    warnSpy.mockRestore();
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
                  modelValue: { username: 'alice', age: 18 } as DemoForm,
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
                  modelValue: { username: 'alice', age: 18 } as DemoForm,
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
