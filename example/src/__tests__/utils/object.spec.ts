import { describe, expect, it } from 'vitest';
import {
  defineProp,
  filterNullishProps,
  hasProp,
  omitEntryProps,
  pickEntryProps,
} from 'ep-container-kit';

describe('pickEntryProps', () => {
  it('只保留指定的键，且返回新对象', () => {
    const source = { a: 1, b: 2, c: 3 };
    const picked = pickEntryProps(source, ['a', 'c']);

    expect(picked).toEqual({ a: 1, c: 3 });
    expect(picked).not.toBe(source);
    // 原对象不受影响
    expect(source).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('键不存在时该属性为 undefined（保留键位）', () => {
    const source = { a: 1 } as Record<string, number>;
    const picked = pickEntryProps(source, ['a', 'missing']);

    expect(Object.keys(picked)).toEqual(['a', 'missing']);
    expect(picked.missing).toBeUndefined();
  });
});

describe('omitEntryProps', () => {
  it('剔除指定的键，且不修改原对象', () => {
    const source = { a: 1, b: 2, c: 3 };
    const omitted = omitEntryProps(source, ['b']);

    expect(omitted).toEqual({ a: 1, c: 3 });
    expect(source).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('空列表时等价于浅拷贝', () => {
    const source = { a: 1 };
    const omitted = omitEntryProps(source, []);

    expect(omitted).toEqual(source);
    expect(omitted).not.toBe(source);
  });
});

describe('defineProp', () => {
  it('值已定义时生成单个属性', () => {
    expect(defineProp('a', 1)).toEqual({ a: 1 });
    expect(defineProp('a', false)).toEqual({ a: false });
    expect(defineProp('a', '')).toEqual({ a: '' });
  });

  it('值为 undefined 时默认返回空对象，保留「字段缺失」语义', () => {
    expect(defineProp('a', undefined)).toEqual({});
    // null 不属于 undefined，会被保留
    expect(defineProp('a', null)).toEqual({ a: null });
  });

  it('useUndefined 为 true 时显式保留 undefined', () => {
    const result = defineProp('a', undefined, true);

    expect(Object.keys(result)).toEqual(['a']);
    expect(result.a).toBeUndefined();
  });
});

describe('filterNullishProps', () => {
  it('过滤 null 与 undefined，保留其它假值', () => {
    const source = {
      a: 1,
      b: null,
      c: undefined,
      d: 0,
      e: '',
      f: false,
      g: NaN,
    };

    const result = filterNullishProps(source);

    // 0 / '' / false / NaN 都是「已提供」，不能被过滤
    expect(Object.keys(result).sort()).toEqual(['a', 'd', 'e', 'f', 'g']);
    expect(result.a).toBe(1);
    expect(result.d).toBe(0);
    expect(result.e).toBe('');
    expect(result.f).toBe(false);
    expect(Number.isNaN(result.g)).toBe(true);
    expect(source.b).toBeNull();
  });
});

describe('hasProp', () => {
  it('可判定自有属性', () => {
    expect(hasProp({ a: 1 }, 'a')).toBe(true);
    expect(hasProp({ a: 1 }, 'b')).toBe(false);
  });

  it('不认继承属性', () => {
    const inherited = Object.create({ a: 1 }) as Record<string, number>;

    expect(inherited.a).toBe(1);
    expect(hasProp(inherited, 'a')).toBe(false);
  });

  it('可判定 Symbol 键', () => {
    const key = Symbol('k');

    expect(hasProp({ [key]: 1 }, key)).toBe(true);
  });
});
