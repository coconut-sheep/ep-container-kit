import type { AnyRecord, AnyValue } from '@ep-container-kit/types';

/**
 * 是否为一个合法的JS Object类型
 * @param value 要校验的值
 */
export const isObject = <T extends PropertyKey = string>(
  value: AnyValue,
): value is AnyRecord<T> => {
  // 1. 首要排除 null 和 undefined
  if (value === null || typeof value !== 'object') {
    return false;
  }

  // 2. 检查内部标签，排除数组、日期、正则等内置对象
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  // 3. 原型链校验
  const proto = Object.getPrototypeOf(value);

  // 情况A: Object.create(null) 创建的对象（无原型）
  if (proto === null) {
    return true;
  }

  // 情况B: 普通对象（原型指向 Object.prototype）
  return proto === Object.prototype;
};

/**
 * 是否为一个合法的JS Array类型
 * @param value 要校验的值
 */
export const isArray = (value: AnyValue): value is AnyValue[] => {
  return Array.isArray(value);
};

/**
 * 是否为一个合法的JS String类型
 * @param value 要校验的值
 */
export const isString = (value: AnyValue): value is string => {
  if (typeof value !== 'string') {
    return false;
  }
  return Object.prototype.toString.call(value) === '[object String]';
};

/**
 * 是否为一个合法的JS Number类型，排除 NaN 和 Infinity
 * @param value 要校验的值
 */
export const isNumber = (value: AnyValue): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * 是否为 undefined
 * @param value 要校验的值
 */
export const isUndefined = (value: AnyValue): value is undefined => {
  return value === undefined;
};

/**
 * 判断是否为布尔值
 * @param value 要校验的值
 */
export const isBoolean = (value: AnyValue): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * 判断是否为 BigInt
 * @param value 要校验的值
 */
export const isBigInt = (value: AnyValue): value is bigint => {
  return typeof value === 'bigint';
};

/**
 * 判断是否为 null
 * 注意：null 在 JS 中是独立的基本类型，typeof null === 'object' 是历史遗留 Bug
 * @param value 要校验的值
 */
export const isNull = (value: AnyValue): value is null => {
  return value === null;
};

/**
 * 稳健的 instanceof 判断
 * @param value 要校验的值
 * @param target 要校验的类构造函数
 */
export function isInstanceOf<
  T extends abstract new (...args: AnyValue) => AnyValue,
>(value: AnyValue, target: T): value is InstanceType<T> {
  return value instanceof target;
}

/**
 * 是否为一个合法的JS Function类型
 * @param value 要校验的值
 */
export const isFunction = (
  value: AnyValue,
): value is (...args: AnyValue[]) => AnyValue => {
  return typeof value === 'function';
};

/**
 * 校验字符串是否为合法的尺寸值，如 `35px`、`100%`、`100vh`、`12.5rem`
 * @param value 要校验的字符串
 */
export const isSizeValue = (value: string): value is string => {
  // 数字 + 单位（px/em/rem/vw/vh/vmin/vmax/%)，允许小数与正负号
  return /^[-+]?(\d+(\.\d+)?|\.\d+)(px|em|rem|vw|vh|vmin|vmax|%)$/i.test(value);
};

/**
 * 处理组件 `string | number` 类型的prop（常用于宽度、高度、间距等尺寸类属性）
 * @description
 * - 当值为有效数字（排除NaN、Infinity）时，与提供的单位参数拼接后返回，如 `f(35, 'px')` → `'35px'`
 * - 当值为有效的尺寸字符串（如 `35px`、`100%`、`100vh`）时，直接返回该字符串
 * - 其余情况（空字符串、字符串非数字但缺少单位等）返回空字符串
 * @param value 尺寸值，可以是数字或字符串
 * @param unit 当`value`为数字时拼接的单位，如 `'px'`、`'%'`，默认为 `'px'`
 * @example
 * ```ts
 * toSizeValue(35);        // '35px'
 * toSizeValue(35, '%');   // '35%'
 * toSizeValue('100%');    // '100%'
 * toSizeValue('100vh');   // '100vh'
 * toSizeValue('35');      // ''
 * toSizeValue(undefined); // ''
 * ```
 */
export const toSizeValue = (value: AnyValue, unit: string = 'px'): string => {
  // 针对非0的不合法值的处理
  if (!value && value !== 0) {
    return '';
  }

  // 尝试将值转换为数字
  const _value = Number(value);

  // 有效数字：直接拼接单位
  if (isNumber(_value)) {
    // 检查是否为负数
    if (_value < 0) {
      return '';
    }

    return `${_value}${unit}`;
  }

  // 有效尺寸字符串：直接返回
  if (isString(value) && isSizeValue(value)) {
    return value;
  }

  // 其余情况返回空字符串
  return '';
};

/**
 * 安全解析JSON字符串，返回指定类型的值或默认值
 * @param text 要转化的JSON字符串
 * @param defaultValue 转化失败的默认值
 * @param cb 回调函数
 * @param cb.successCallback 成功时的回调函数
 * @param cb.successFormater 成功时的格式化函数，可用于格式化返回值
 * @param cb.failureCallback 报错时的回调函数
 */
export const jsonParse = <T extends AnyValue = AnyValue>(
  text: string,
  defaultValue: T,
  cb: {
    successCallback?: (value: T) => void;
    successFormater?: (value: T) => T;
    failureCallback?: (error: AnyValue, value: T) => void;
  } = {},
): T => {
  const { successCallback, successFormater, failureCallback } = cb;
  let result: T;
  try {
    result = JSON.parse(text) as T;
    successCallback?.(result);
    if (successFormater) {
      result = successFormater(result);
    }
  } catch (error) {
    result = defaultValue;
    failureCallback?.(error, result);
  }

  return result;
};
