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
 * @description 对象/数组类型要求工厂函数（默认值对象不能跨实例共享），原始类型直接使用裸值
 * @description 先 `NonNullable` 再整体加方括号判断，是为了**阻止条件类型分布**：
 * 直接写 `T extends AnyRecord | AnyArray` 时，`FormItemRule | FormItemRule[] | undefined`
 * 这类联合会被拆成多个成员分别判断，结果成为 `AnyFunction<A> | AnyFunction<B>` 的**函数联合**，
 * 任何单个工厂都匹配不上；整体判断后得到 `AnyFunction<T>`，工厂返回 `undefined` 也合法
 * @description `unknown` 先行短路，是为了兜住 props 类型里**由索引签名兜底**的成员：
 * `TableColumnProps` 继承自 EP 泛型 SFC 的 props，后者被 `__VLS_PROPS_FALLBACK` 影响，
 * `Partial<...>` 会把 `Record<string, unknown>` 这条索引签名一起带出来；随后映射类型
 * `[K in keyof T]` 同样保留索引签名，于是值类型变成这里的 `InferPropDefault<unknown>`。
 * 若不短路，`NonNullable<unknown>` 即 `{}`，会命中 `AnyRecord` 分支得到 `AnyFunction<unknown>`，
 * 让索引签名只接受函数，任何原始类型默认值（如 `hidden: false`）都报 TS2322。
 * 短路后索引签名维持 `unknown`，与 EP 侧这条兜底签名的语义一致
 * 词序对齐 Vue 内置的 `InferDefault` / `InferDefaults`
 * @template T 单个 prop 的属性类型
 */
type InferPropDefault<T> = [unknown] extends [T]
  ? T
  : [NonNullable<T>] extends [AnyRecord | AnyArray]
    ? AnyFunction<T>
    : T;

/**
 * 基础的默认属性源类型
 * @description 以「属性名 → 默认值」的「源形态」声明默认值：对象/数组属性必须给工厂函数，
 * 原始类型属性直接给裸值。交给 `buildPropsDefaultValues` 求值成裸值形态
 * @description 这份类型只描述「源」，本身不含任何求值行为，求值时机由消费方决定，
 * 且必须保证「每个组件实例各求值一次」：调用点要落在实例作用域（组件 `setup` 顶层），
 * 若写成模块级常量，工厂会在模块加载时被求值成跨实例共享的单例，
 * 宿主或兄弟实例改动其中的对象/数组就会互相污染
 * @description 工厂的返回值允许含 `undefined`，因此不能直接交给 `withDefaults`
 * （其 `InferDefaults` 要求非原始类型的默认值返回 `T & {}`）；占位表请用 {@link BaseDefaultPropsHolder}
 * @template T 组件的 props 类型
 */
export type BaseDefaultPropsSource<T extends AnyRecord> = {
  [K in keyof T]: InferPropDefault<T[K]>;
};

/**
 * 基础的默认属性占位源类型
 * @description 用于组件的 `COMPONENT_DEFAULT_PROPS_HOLDER`，即 `withDefaults` 的第二个参数。
 * 占位表只承担一件事：把「Boolean 且无默认值」的 props 显式声明成 `default: undefined`，
 * 阻止 Vue 在缺席时补 `false`；因此值只允许 `undefined`，写别的值会直接编译报错
 * @description 属性全部可选：占位只针对「Boolean 且无默认值」的 props，
 * 必填 prop 本来就不需要占位，因此不要求写全
 * @template T 组件的 props 类型
 */
export type BaseDefaultPropsHolder<T extends AnyRecord> = {
  [K in keyof T]?: undefined;
};
