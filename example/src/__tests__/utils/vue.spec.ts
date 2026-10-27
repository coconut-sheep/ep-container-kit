import { describe, expect, it } from 'vitest';
import { computed } from 'vue';
import {
  buildPropsDefaultValues,
  getRefExpose,
  getRefExposeManuel,
} from 'ep-container-kit';

describe('buildPropsDefaultValues', () => {
  it('工厂函数会被立即求值成裸值，原始值原样保留', () => {
    const result = buildPropsDefaultValues<{
      list: string[];
      count: number;
      nested: { a: number };
    }>({
      list: () => {
        return ['a'];
      },
      count: 1,
      nested: () => {
        return { a: 2 };
      },
    });

    expect(result).toEqual({ list: ['a'], count: 1, nested: { a: 2 } });
  });

  it('每次调用都重新求值，实例之间不共享对象', () => {
    const source = {
      list: () => {
        return ['a'];
      },
    };

    const first = buildPropsDefaultValues<{ list: string[] }>(source);
    const second = buildPropsDefaultValues<{ list: string[] }>(source);

    expect(first.list).toEqual(second.list);
    expect(first.list).not.toBe(second.list);
  });

  it('值为 undefined 时不生成该属性', () => {
    const result = buildPropsDefaultValues<{
      a?: string;
      b: number;
    }>({ a: undefined, b: 1 });

    expect(result).toEqual({ b: 1 });
    expect('a' in result).toBe(false);
  });
});

describe('getRefExpose', () => {
  const createInstance = () => {
    return {
      count: 0,
      label: 'form',
      increase(step: number) {
        this.count += step;
        return this.count;
      },
    };
  };

  it('转发非函数属性', () => {
    const exposed = getRefExpose({ value: createInstance() });

    expect(exposed.label).toBe('form');
    expect(exposed.count).toBe(0);
  });

  it('转发方法时自动绑定实例的 this', () => {
    const instance = createInstance();
    const exposed = getRefExpose({ value: instance });

    expect(exposed.increase(2)).toBe(2);
    // this 绑定到真实实例，状态写回成功
    expect(instance.count).toBe(2);
  });

  it('实例为空时返回 undefined，不抛异常', () => {
    const exposed = getRefExpose({ value: null });

    expect(exposed.anything).toBeUndefined();
  });

  it('has 拦截器反映实例的真实自有属性', () => {
    const exposed = getRefExpose({ value: createInstance() });

    expect('count' in exposed).toBe(true);
    expect('missing' in exposed).toBe(false);

    // 实例为空时一切属性都不存在
    const empty = getRefExpose({ value: undefined });
    expect('count' in empty).toBe(false);
  });
});

describe('getRefExposeManuel', () => {
  it('按给定方法名列表生成转发函数', () => {
    const ref = {
      value: {
        add(a: number, b: number) {
          return a + b;
        },
      },
    };

    const manual = getRefExposeManuel(ref, ['add']);

    expect(typeof manual.add).toBe('function');
    expect(manual.add!(1, 2)).toBe(3);
  });

  it('ref 尚无实例时返回 undefined', () => {
    const ref: { value?: { add: (a: number) => number } } = {};

    const manual = getRefExposeManuel(ref, ['add']);

    expect(manual.add!(1)).toBeUndefined();
  });

  it('不包含的方法不会被暴露', () => {
    const ref = {
      value: {
        add: (a: number) => {
          return a;
        },
        remove: () => {
          return true;
        },
      },
    };

    const manual = getRefExposeManuel(ref, ['add']);

    expect(Object.keys(manual)).toEqual(['add']);
  });
});

describe('computed 与工具函数协作', () => {
  it('computed 包裹的默认值在取值时才触发工厂', () => {
    let called = 0;
    const lazy = computed(() => {
      called += 1;
      return buildPropsDefaultValues<{ list: string[] }>({
        list: () => {
          return ['a'];
        },
      });
    });

    expect(called).toBe(0);
    expect(lazy.value.list).toEqual(['a']);
    expect(called).toBe(1);
  });
});
