import type { AnyArray, AnyFunction, AnyRecord } from './tools';
import type { Component } from 'vue';

/**
 * 基础的插槽类型
 */
export type BaseSlots = Partial<Record<string, AnyFunction>>;

/**
 * 基础的事件类型
 */
export type BaseEvents = Partial<Record<string, AnyFunction>>;

/**
 * 基础的属性类型
 */
export type BaseProps = Partial<AnyRecord>;

/**
 * 基础的组件类型
 */
export type BaseComponent = Component | string | null;

/**
 * 推断单个 prop 的默认值形态
 * @description 对象/数组类型要求工厂函数（避免默认值对象被多实例共享），
 * 原始类型直接使用裸值。注意：条件类型必须经由这里的裸类型参数 `T` 才能对
 * `X | undefined` 这类联合分布，否则可选属性的联合会被整体测试而落入裸值分支。
 * 词序对齐 Vue 内置的 `InferDefault` / `InferDefaults`
 * @template T 单个 prop 的属性类型
 */
type InferPropDefault<T> = T extends AnyRecord | AnyArray
  ? AnyFunction<T>
  : T;

/**
 * 基础的默认属性源类型
 * @description 以「属性名 → 默认值」的「源形态」声明默认值：对象/数组属性必须给工厂函数，
 * 原始类型属性直接给裸值。可直接交给 `withDefaults`（满足其 `InferDefaults` 要求），
 * 也可交由 `buildPropsDefaultValues` 求值成裸值形态
 * @template T 组件的 props 类型
 */
export type BaseDefaultPropsSource<T extends AnyRecord> = {
  [K in keyof T]: InferPropDefault<T[K]>;
};
