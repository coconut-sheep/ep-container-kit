import { describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { reactive } from 'vue';
import { CkFormContainer, type FormContainerItem } from 'ep-container-kit';

const global = { plugins: [ElementPlus] };

const mountContainer = (
  options: {
    schema?: FormContainerItem[];
    state?: Record<string, unknown>;
    props?: Record<string, unknown>;
  } = {},
) => {
  const state = reactive(options.state ?? { username: '', role: 'dev' });
  const wrapper = mount(CkFormContainer, {
    props: {
      modelValue: state,
      schema: options.schema,
      ...options.props,
    },
    global,
  });

  return { wrapper, state };
};

describe('CkFormContainer 渲染', () => {
  it('挂载为 el-form，并渲染 schema 中的表单项', () => {
    const { wrapper } = mountContainer({
      schema: [
        { prop: 'username', label: '用户名', type: 'input' },
        { prop: 'role', label: '角色', type: 'input' },
      ],
    });

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.findAll('.el-form-item')).toHaveLength(2);

    const labels = wrapper.findAll('.el-form-item__label').map((node) => {
      return node.text();
    });
    expect(labels).toEqual(['用户名', '角色']);
  });

  it('为每个表单项生成 type 对应的组件', () => {
    const { wrapper } = mountContainer({
      state: { username: '', enabled: false },
      schema: [
        { prop: 'username', label: '用户名', type: 'input' },
        { prop: 'enabled', label: '启用', type: 'switch' },
      ],
    });

    expect(wrapper.find('.el-input').exists()).toBe(true);
    expect(wrapper.find('.el-switch').exists()).toBe(true);
  });

  it('vertical 决定容器的布局 class', () => {
    const { wrapper: horizontal } = mountContainer();
    expect(horizontal.find('.form-container').classes()).toContain(
      'form-container--horizontal',
    );

    const { wrapper: vertical } = mountContainer({ props: { vertical: true } });
    expect(vertical.find('.form-container').classes()).toContain(
      'form-container--vertical',
    );
  });

  it('隐藏表单项：visible=false 保留 DOM，hidden=true 不渲染', () => {
    const { wrapper } = mountContainer({
      schema: [
        { prop: 'username', label: '用户名', type: 'input', visible: false },
        { prop: 'role', label: '角色', type: 'input', hidden: true },
      ],
    });

    const items = wrapper.findAll('.el-form-item');
    expect(items).toHaveLength(1);
    expect((items[0]!.element as HTMLElement).style.display).toBe('none');
  });
});

describe('CkFormContainer 数据流', () => {
  it('v-model：输入内容写回源数据', async () => {
    const { wrapper, state } = mountContainer({
      schema: [{ prop: 'username', label: '用户名', type: 'input' }],
    });

    await wrapper.find('input').setValue('alice');

    expect(state.username).toBe('alice');
  });

  it('源数据变化时反映到输入框', async () => {
    const { wrapper, state } = mountContainer({
      schema: [{ prop: 'username', label: '用户名', type: 'input' }],
    });

    state.username = 'bob';
    await flushPromises();

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
      'bob',
    );
  });

  it('schema 中的非法 prop 会告警且不写回源数据', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { wrapper, state } = mountContainer({
      schema: [{ prop: 'notExist', label: '不存在', type: 'input' }],
    });

    await wrapper.find('input').setValue('x');

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('notExist'),
    );
    expect('notExist' in state).toBe(false);

    warnSpy.mockRestore();
  });

  it('内部配置不会作为属性落到 form 上', () => {
    const { wrapper } = mountContainer({
      schema: [{ prop: 'username', label: '用户名', type: 'input' }],
      props: { vertical: true, itemMinWidth: 200 },
    });

    const form = wrapper.find('form');
    expect(form.attributes()).not.toHaveProperty('modelvalue');
    expect(form.attributes()).not.toHaveProperty('vertical');
    expect(form.attributes()).not.toHaveProperty('itemminwidth');
  });

  it('通过 :model 传数据源时给出显式告警', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mount(CkFormContainer, {
      props: { modelValue: { username: '' } },
      attrs: { model: { username: 'ignored' } },
      global,
    });

    expect(warnSpy.mock.calls[0]?.[0]).toContain(
      ':model 会被内部绑定覆盖并忽略',
    );

    warnSpy.mockRestore();
  });
});

describe('CkFormContainer 事件', () => {
  it('表单提交时抛出 submit', async () => {
    const { wrapper } = mountContainer();

    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('submit')).toHaveLength(1);
  });

  it('透传 el-form 的 validate 事件参数', () => {
    const { wrapper } = mountContainer({
      schema: [{ prop: 'username', label: '用户名', type: 'input' }],
    });

    const elForm = wrapper.findComponent({ name: 'ElForm' });
    elForm.vm.$emit('validate', 'username', true, '');

    expect(wrapper.emitted('validate')).toEqual([['username', true, '']]);
  });

  it('真实校验失败时抛出 validate 并携带错误信息', async () => {
    // async-validator 会把校验失败打到控制台，这里静音避免污染测试输出
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { wrapper } = mountContainer({
      schema: [
        {
          prop: 'username',
          label: '用户名',
          type: 'input',
          rules: [{ required: true, message: '请输入用户名' }],
        },
      ],
      state: { username: '' },
    });

    const form = wrapper.findComponent({ name: 'ElForm' });
    await form.vm.validate().catch(() => {
      // 校验不通过时 validate 会 reject，这里只关心事件是否抛出
    });

    const emitted = wrapper.emitted('validate');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]?.[1]).toBe(false);
    expect(emitted?.[0]?.[2]).toBe('请输入用户名');

    warnSpy.mockRestore();
  });
});

describe('CkFormContainer 实例暴露', () => {
  it('暴露 el-form 的方法（validate / resetFields 等）', () => {
    const { wrapper } = mountContainer({
      schema: [{ prop: 'username', label: '用户名', type: 'input' }],
    });

    const vm = wrapper.vm as unknown as Record<string, unknown>;

    expect(typeof vm.validate).toBe('function');
    expect(typeof vm.resetFields).toBe('function');
    expect('validate' in vm).toBe(true);
  });
});
