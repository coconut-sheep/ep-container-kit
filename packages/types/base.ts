import type { AnyFunction, AnyRecord } from '@ep-container-kit/types/tools.ts';
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
