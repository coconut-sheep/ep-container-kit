import { describe, expect, it, vi } from 'vitest';
import type { App, Component } from 'vue';
import { ElForm, ElPagination } from 'element-plus';
import {
  getPropsDefaultValue,
  installComponents,
  withInstall,
} from 'ep-container-kit';

const createFakeApp = () => {
  return {
    component: vi.fn<(...args: unknown[]) => void>(),
    use: vi.fn<(...args: unknown[]) => void>(),
  };
};

describe('withInstall', () => {
  it('为组件附加 install 方法，按组件 name 注册', () => {
    const Base: Component = { name: 'CkDemo', render: () => null };
    const installed = withInstall(Base);
    const app = createFakeApp();

    expect(typeof installed.install).toBe('function');

    installed.install!(app as unknown as App);
    expect(app.component).toHaveBeenCalledWith('CkDemo', Base);
  });

  it('支持显式指定注册名', () => {
    const Base: Component = { name: 'CkDemo', render: () => null };
    const installed = withInstall(Base, 'CkRenamed');
    const app = createFakeApp();

    installed.install!(app as unknown as App);
    expect(app.component).toHaveBeenCalledWith('CkRenamed', Base);
  });

  it('组件没有 name 且未指定注册名时不注册', () => {
    const Base: Component = { render: () => null };
    const installed = withInstall(Base);
    const app = createFakeApp();

    installed.install!(app as unknown as App);
    expect(app.component).not.toHaveBeenCalled();
  });

  it('返回的仍是原组件本身（原地增强）', () => {
    const Base: Component = { name: 'CkDemo', render: () => null };

    expect(withInstall(Base)).toBe(Base);
  });
});

describe('installComponents', () => {
  it('逐个通过 app.use 安装', () => {
    const first = withInstall({ name: 'CkA', render: () => null });
    const second = withInstall({ name: 'CkB', render: () => null });
    const app = createFakeApp();

    installComponents(app as unknown as App, [first, second]);

    expect(app.use).toHaveBeenCalledTimes(2);
    expect(app.use).toHaveBeenNthCalledWith(1, first);
    expect(app.use).toHaveBeenNthCalledWith(2, second);
  });

  it('空列表时不安装任何组件', () => {
    const app = createFakeApp();

    installComponents(app as unknown as App, []);

    expect(app.use).not.toHaveBeenCalled();
  });
});

describe('getPropsDefaultValue', () => {
  it('只收集声明了 default 的属性', () => {
    const result = getPropsDefaultValue({
      a: { default: 1 },
      // 无 default 的属性不会被收集
      b: { type: String },
      // 非对象入参会被跳过
      c: null,
      d: { default: 'x' },
    });

    expect(result).toEqual({ a: 1, d: 'x' });
  });

  it('default 为 undefined 时保留键位（空对象与非空对象的差别）', () => {
    const result = getPropsDefaultValue({ a: { default: undefined } });

    expect(Object.keys(result)).toEqual(['a']);
    expect(result.a).toBeUndefined();
  });

  it('useUndefined 为 true 时补齐所有属性', () => {
    const result = getPropsDefaultValue(
      { a: { default: 1 }, b: { type: String }, c: null },
      true,
    );

    expect(Object.keys(result).sort()).toEqual(['a', 'b', 'c']);
    expect(result.a).toBe(1);
    expect(result.b).toBeUndefined();
    expect(result.c).toBeUndefined();
  });

  it('可直接读取Element Plus组件的默认值', () => {
    const formDefaults = getPropsDefaultValue(ElForm.props);

    expect(formDefaults.labelPosition).toBe('right');
    expect(formDefaults.labelWidth).toBe('');
    // model / rules 没有声明 default，不应出现在结果里
    expect('model' in formDefaults).toBe(false);

    const paginationDefaults = getPropsDefaultValue(ElPagination.props);

    // Element Plus 用 `background: Boolean` 这种简写声明布尔 props，
    // 它没有自己的 default 键，因此这里取不到值；
    // 这也是库内 `COMPONENT_DEFAULT_PROPS_SOURCE` 需要显式写 `background: true` 的原因
    expect('background' in paginationDefaults).toBe(false);
    // 声明了 default 的属性照常能取到
    expect(paginationDefaults.pagerCount).toBe(7);
  });
});
