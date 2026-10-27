/**
 * 任意类型,即 `any`
 */
export type AnyValue = ReturnType<typeof JSON.parse>;

/**
 * 任意类型的对象，即 `Record<K, any>`
 * @template K 键类型，默认为 `string`
 * @example
 * ```ts
 * type type1 = AnyRecord<string>; // Record<string, any>
 * ```
 */
export type AnyRecord<K extends PropertyKey = string> = Record<K, AnyValue>;

/**
 * 任意类型的数组，即 `Array<T>`
 * @template T 数组元素类型，默认为 `any`
 */
export type AnyArray<T = AnyValue> = Array<T>;

/**
 * 任意类型的函数，即 `(...args: any[]) => any`
 * @template R 函数返回值类型，默认为 `any`
 * @example
 * ```ts
 * type type1 = AnyFunction<string>; // (...args: any[]) => string
 * type type2 = AnyFunction<void>; // (...args: any[]) => void
 * ```
 */
export type AnyFunction<R extends AnyValue | void = AnyValue> = (
  ...args: AnyValue[]
) => R;

/**
 * 用于将对象中函数签名形式的属性值（如Vue的emits、prop回调）转换为参数元组形式
 * @description 常用于将对外暴露的"函数签名事件类型"转换为`defineEmits`所需的"元组参数形式"
 * @template T 需要转换的对象类型，其属性值为函数签名
 * @example
 * ```ts
 * type Emits = { submit: () => void; validate: (prop: string, isValid: boolean) => void };
 * type type1 = EmitsToTuples<Emits>; // { submit: []; validate: [prop: string, isValid: boolean] }
 * ```
 */
export type EmitsToTuples<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => AnyValue ? A : never;
};

/**
 * 用于将对象中参数元组形式的属性值（如`defineEmits`的元组写法）转换为函数签名形式
 * @description `EmitsToTuples` 的逆操作，常用于将"元组参数事件类型"转换为对外暴露的
 * "函数签名事件类型"（如组件实例方法、`v-on` 监听器、prop 回调等场景）
 * @template T 需要转换的对象类型，其属性值为参数元组
 * @example
 * ```ts
 * type Emits = { submit: []; validate: [prop: string, isValid: boolean] };
 * type type1 = TuplesToEmits<Emits>; // { submit: () => void; validate: (prop: string, isValid: boolean) => void }
 * ```
 */
export type TuplesToEmits<T> = {
  [K in keyof T]: T[K] extends AnyArray ? (...args: T[K]) => void : never;
};

/**
 * 用于从一个对象中提取其所有属性值，将其转为联合属性
 * @example
 * ```ts
 * const obj1 = { Key1: 1, Key2: 2 } as const;
 * type type1 = ValueOfRecord<typeof obj1>; // 1 | 2
 *
 * const obj2 = {
 *  Key1: { prop1: 1, prop2: 2 },
 *  Key2: { prop1: 3, prop2: 4 }
 * } as const;
 * type type2 = ValueOfRecord<typeof obj2>; // { prop1: 1, prop2: 2 } | { prop1: 3, prop2: 4 }
 *
 * // 可以对values进一步提取属性值
 * type type2_1 = ValueOfRecord<typeof obj2>['prop1']; // 1 | 3
 * type type2_2 = ValueOfRecord<typeof obj2>['prop2']; // 2 | 4
 * ```
 */
export type ValueOfRecord<T> = T[keyof T];

/**
 * 用于从一个数组中提取其所有元素值，将其转为联合属性
 * @example
 * ```ts
 * const arr1 = [1, 2, 3] as const;
 * type type1 = ValueOfArray<typeof arr1>; // 1 | 2 | 3
 *
 * const arr2 = [
 *   { prop1: 1, prop2: 2 },
 *   { prop1: 3, prop2: 4 }
 * ] as const;
 * type type2 = ValueOfArray<typeof arr2>; // { prop1: 1, prop2: 2 } | { prop1: 3, prop2: 4 }
 *
 * // 可以对values进一步提取属性值
 * type type2_1 = ValueOfArray<typeof arr2>['prop1']; // 1 | 3
 * type type2_2 = ValueOfArray<typeof arr2>['prop2']; // 2 | 4
 * ```
 */
export type ValueOfArray<T extends AnyArray> = T[number];

/**
 * 用于将一个类型转换为数组类型，或保持其原始类型
 * @template T 要转换的类型
 * @example
 * ```ts
 * type type1 = Arrayable<number>; // number | number[]
 * type type2 = Arrayable<{ prop1: number }>; // { prop1: number } | { prop1: number }[]
 * ```
 */
export type Arrayable<T> = T | T[];

/**
 * 用于从一个对象中提取去所有函数类型的属性，将这些属性聚合成一个新的对象类型
 * @example
 * ```ts
 * const obj1 = {
 *   Key1: () => 1,
 *   Key2: () => 2
 * } as const;
 * type type1 = PickFunction<typeof obj1>; // { Key1: () => 1, Key2: () => 2 }
 * ```
 */
export type PickFunction<T extends AnyRecord> = {
  [K in keyof T as NonNullable<T[K]> extends AnyFunction ? K : never]: T[K];
};

/**
 * 用于从一个对象中提取去所有对象类型的属性，将这些属性聚合成一个新的对象类型，不包含数组类型的属性
 * @example
 * ```ts
 * const obj1 = {
 *   Key1: { prop1: 1, prop2: 2 },
 *   Key2: 1,
 *   Key3: [1, 2, 3]
 * } as const;
 * type type1 = PickRecord<typeof obj1>; // { Key1: { prop1: 1, prop2: 2 } }
 * ```
 */
export type PickRecord<T extends AnyRecord> = {
  [
    K in keyof T as NonNullable<T[K]> extends AnyRecord
      ? NonNullable<T[K]> extends Array<AnyValue>
        ? never
        : K
      : never
  ]: T[K];
};

/**
 * 用于从一个对象中提取去所有字符串类型的属性，将这些属性聚合成一个新的对象类型
 * @example
 * ```ts
 * const obj1 = {
 *   Key1: '123',
 *   Key2: 123,
 *   Key3: ['123', '456']
 * } as const;
 * type type1 = PickString<typeof obj1>; // { Key1: '123' }
 * ```
 */
export type PickString<T extends AnyRecord> = {
  [K in keyof T as NonNullable<T[K]> extends string ? K : never]: T[K];
};

/**
 * 用于将一个对象中指定的属性转成可选属性，但不移除该属性
 * @example
 * ```ts
 * type type1 = { prop1: number; prop2: string; prop3: boolean; };
 * type type2 = PickToPartial<typeof type1, 'prop1'>; // { prop1?: number; prop2: string; prop3: boolean; }
 * ```
 */
export type PickToPartial<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;

/**
 * 用于将一个对象中指定的属性之外的属性转成可选属性，但不移除该属性
 * @example
 * ```ts
 * type type1 = { prop1: number; prop2: string; prop3: boolean; };
 * type type2 = OmitToPartial<typeof type1, 'prop1'>; // { prop1: number; prop2?: string; prop3?: boolean; }
 * ```
 */
export type OmitToPartial<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

/**
 * 用于将一个对象中指定的属性转成必选属性，但不移除该属性
 * @example
 * ```ts
 * type type1 = { prop1?: number; prop2?: string; prop3?: boolean; };
 * type type2 = PickToRequired<typeof type1, 'prop1'>; // { prop1: number; prop2?: string; prop3?: boolean; }
 * ```
 */
export type PickToRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

/**
 * 将一个对象中指定的属性之外的属性转成必选，但不移除该属性
 * @example
 * ```ts
 * type type1 = { prop1?: number; prop2?: string; prop3?: boolean; };
 * type type2 = OmitToRequired<typeof type1, 'prop1'>; // { prop1?: number; prop2: string; prop3: boolean; }
 * ```
 */
export type OmitToRequired<T, K extends keyof T> = Required<Omit<T, K>> &
  Pick<T, K>;

/**
 * 将一个对象中所有属性转成可写，但不移除该属性
 * @example
 * ```ts
 * type type1 = { readonly prop1: number; readonly prop2: string; readonly prop3: boolean; };
 * type type2 = UnReadonly<typeof type1>; // { prop1: number; prop2: string; prop3: boolean; }
 * ```
 */
export type UnReadonly<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * 将一个对象中指定的属性转成readonly，但不移除该属性
 * @example
 * ```ts
 * type type1 = { prop1: number; prop2: string; prop3: boolean; };
 * type type2 = PickToReadonly<typeof type1, 'prop1'>; // { prop1: readonly number; prop2: string; prop3: boolean; }
 * ```
 */
export type PickToReadonly<T, K extends keyof T> = Readonly<Pick<T, K>> &
  Omit<T, K>;

/**
 * 将一个对象中指定的属性之外的属性转成readonly，但不移除该属性
 * @example
 * ```ts
 * type type1 = { prop1: number; prop2: string; prop3: boolean; };
 * type type2 = OmitToReadonly<typeof type1, 'prop1'>; // { prop1: number; prop2: readonly string; prop3: readonly boolean; }
 * ```
 */
export type OmitToReadonly<T, K extends keyof T> = Readonly<Omit<T, K>> &
  Pick<T, K>;

/**
 * 将一个对象中所有属性移除readonly，但不移除该属性
 * @example
 * ```ts
 * type type1 = { readonly prop1: number; readonly prop2: string; readonly prop3: boolean; };
 * type type2 = PickToUnReadonly<typeof type1, 'prop1'>; // { prop1: number; prop2: string; prop3: boolean; }
 * ```
 */
export type PickToUnReadonly<T, K extends keyof T> = UnReadonly<Pick<T, K>> &
  Pick<T, K>;

/**
 * 将一个对象中所有属性移除readonly，但不移除该属性
 * @example
 * ```ts
 * type type1 = { readonly prop1: number; readonly prop2: string; readonly prop3: boolean; };
 * type type2 = OmitToUnReadonly<typeof type1, 'prop1'>; // { prop1: number; prop2: string; prop3: boolean; }
 * ```
 */
export type OmitToUnReadonly<T, K extends keyof T> = UnReadonly<Omit<T, K>> &
  Pick<T, K>;
