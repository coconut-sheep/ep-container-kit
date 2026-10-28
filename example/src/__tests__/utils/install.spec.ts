import { describe, expect, it, vi } from 'vitest';
import type { App, Component } from 'vue';
import { installComponents, withInstall } from 'ep-container-kit';

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
