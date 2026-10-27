import { describe, expect, it, vi } from 'vitest';
import {
  isArray,
  isBigInt,
  isBoolean,
  isFunction,
  isInstanceOf,
  isNull,
  isNumber,
  isObject,
  isSizeValue,
  isString,
  isUndefined,
  jsonParse,
  toSizeValue,
} from 'ep-container-kit';

describe('isObject', () => {
  it('识别普通对象与无原型对象', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    // Object.create(null) 没有原型链，仍是合法对象
    expect(isObject(Object.create(null))).toBe(true);
  });

  it('排除数组、日期、正则、Map 等内置对象', () => {
    expect(isObject([])).toBe(false);
    expect(isObject(new Date())).toBe(false);
    expect(isObject(/a/)).toBe(false);
    expect(isObject(new Map())).toBe(false);
  });

  it('排除 null 与非对象字面量', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject('{}')).toBe(false);
  });

  it('排除自定义类的实例（原型不是 Object.prototype）', () => {
    class Custom {}
    expect(isObject(new Custom())).toBe(false);
  });
});

describe('基础类型判定', () => {
  it('isArray', () => {
    expect(isArray([])).toBe(true);
    expect(isArray(Array.from({ length: 3 }))).toBe(true);
    expect(isArray({ length: 0 })).toBe(false);
  });

  it('isString 只认原始字符串', () => {
    expect(isString('')).toBe(true);
    expect(isString('a')).toBe(true);
    expect(isString(new String('a'))).toBe(false);
  });

  it('isNumber 排除 NaN 与 Infinity', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-1.5)).toBe(true);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber('1')).toBe(false);
  });

  it('isBoolean / isBigInt / isNull / isUndefined / isFunction', () => {
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(0)).toBe(false);

    expect(isBigInt(BigInt(1))).toBe(true);
    expect(isBigInt(1)).toBe(false);

    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);

    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);

    expect(isFunction(() => 1)).toBe(true);
    expect(isFunction(class {})).toBe(true);
    expect(isFunction({})).toBe(false);
  });

  it('isInstanceOf 支持内置与自定义构造函数', () => {
    class Custom {}
    expect(isInstanceOf(new Custom(), Custom)).toBe(true);
    expect(isInstanceOf(new Map(), Map)).toBe(true);
    expect(isInstanceOf({}, Custom)).toBe(false);
  });
});

describe('isSizeValue', () => {
  it('接受合法尺寸值', () => {
    expect(isSizeValue('35px')).toBe(true);
    expect(isSizeValue('12.5rem')).toBe(true);
    expect(isSizeValue('100%')).toBe(true);
    expect(isSizeValue('100vh')).toBe(true);
    // 允许正负号
    expect(isSizeValue('-5px')).toBe(true);
  });

  it('拒绝无单位或缺少数值的字符串', () => {
    expect(isSizeValue('35')).toBe(false);
    expect(isSizeValue('px')).toBe(false);
    expect(isSizeValue('')).toBe(false);
    expect(isSizeValue('35px ')).toBe(false);
  });
});

describe('toSizeValue', () => {
  it('数字拼接单位，默认 px', () => {
    expect(toSizeValue(35)).toBe('35px');
    expect(toSizeValue(35, '%')).toBe('35%');
  });

  it('0 是有效数字，需要拼上单位', () => {
    expect(toSizeValue(0)).toBe('0px');
  });

  it('合法尺寸字符串原样返回', () => {
    expect(toSizeValue('100%')).toBe('100%');
    expect(toSizeValue('100vh')).toBe('100vh');
    expect(toSizeValue('12.5rem')).toBe('12.5rem');
  });

  it('非法值统一返回空串', () => {
    expect(toSizeValue(undefined)).toBe('');
    expect(toSizeValue(null)).toBe('');
    expect(toSizeValue('')).toBe('');
    // 无单位的数字字符串会被当成数字，但仍按数字处理
    expect(toSizeValue('35')).toBe('35px');
    // 负数不合法
    expect(toSizeValue(-1)).toBe('');
    // 非数字且无单位
    expect(toSizeValue('abc')).toBe('');
  });
});

describe('jsonParse', () => {
  it('解析成功时返回解析结果', () => {
    const successCallback = vi.fn<(...args: unknown[]) => void>();
    const result = jsonParse<Record<string, number>>(
      '{"a":1}',
      {},
      { successCallback },
    );

    expect(result).toEqual({ a: 1 });
    expect(successCallback).toHaveBeenCalledWith({ a: 1 });
  });

  it('解析失败时返回默认值并触发失败回调', () => {
    const failureCallback = vi.fn<(...args: unknown[]) => void>();
    const fallback = { fallback: true };
    const result = jsonParse('not-json', fallback, { failureCallback });

    expect(result).toBe(fallback);
    expect(failureCallback).toHaveBeenCalledTimes(1);
    // 第二个入参是兜底值
    expect(failureCallback.mock.calls[0]?.[1]).toBe(fallback);
  });

  it('successFormater 可以改写返回值', () => {
    const result = jsonParse<number[]>('[1,2,3]', [], {
      successFormater: (value) => {
        return value.map((item) => {
          return item * 2;
        });
      },
    });

    expect(result).toEqual([2, 4, 6]);
  });
});
