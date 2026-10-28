import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { ElForm, ElPagination } from 'element-plus';
import { getPropsDefaultValue } from 'ep-container-kit';

describe('getPropsDefaultValue', () => {
  it('把声明了默认值的 props 收进 defaultProps', () => {
    const { defaultProps } = getPropsDefaultValue({
      a: { default: 1 },
      // 无 default 的非 Boolean 属性不会被收集
      b: { type: String },
      // 非对象入参不会抛错，也不产生默认值
      c: null,
      d: { default: 'x' },
    });

    expect(defaultProps).toStrictEqual({ a: 1, d: 'x' });
  });

  it('把无默认值的 Boolean props 收进 holderProps，值为 undefined', () => {
    const { defaultProps, holderProps } = getPropsDefaultValue({
      // 简写形态
      shorthand: Boolean,
      // 对象形态
      object: { type: Boolean },
      // 联合类型里含 Boolean，同样需要占位
      mixed: { type: [Boolean, String] },
      // 有默认值的 Boolean 归 defaultProps，不需要占位
      withDefault: { type: Boolean, default: false },
      // `default: undefined` 等价于未声明默认值
      withUndefinedDefault: { type: Boolean, default: undefined },
      // 非 Boolean 且无默认值：缺席时本就是 undefined，无需占位
      text: { type: String },
    });

    expect(Object.keys(holderProps).sort()).toStrictEqual([
      'mixed',
      'object',
      'shorthand',
      'withUndefinedDefault',
    ]);
    expect(Object.values(holderProps).every((item) => item === undefined)).toBe(
      true,
    );
    expect(defaultProps).toStrictEqual({ withDefault: false });
  });

  it('可从 Element Plus 组件的 props 定义中拆分出两份默认值', () => {
    const form = getPropsDefaultValue(ElForm.props);

    // 声明了 default 的属性照常取到
    expect(form.defaultProps.labelPosition).toBe('right');
    expect(form.defaultProps.labelWidth).toBe('');
    // model / rules 没有声明 default，也不属于 Boolean，两边都不出现
    expect('model' in form.defaultProps).toBe(false);
    expect('model' in form.holderProps).toBe(false);
    // `inline: Boolean` 这类简写声明只进 holderProps
    expect('inline' in form.holderProps).toBe(true);
    expect('inline' in form.defaultProps).toBe(false);

    const pagination = getPropsDefaultValue(ElPagination.props);

    expect(pagination.defaultProps.pagerCount).toBe(7);
    // `background: Boolean` 没有默认值，只能作为占位取出，
    // 否则 Vue 的 Boolean 缺省会把它补成 false，盖掉组件显式声明的 `background: true`
    expect('background' in pagination.holderProps).toBe(true);
    expect('background' in pagination.defaultProps).toBe(false);
  });
});

describe('holderProps 的作用', () => {
  it('声明 default: undefined 后，缺席的 Boolean prop 保持 undefined 而不是 false', () => {
    const Base = defineComponent({
      props: {
        // 没有任何默认值的 Boolean prop
        plain: Boolean,
        // 显式声明 default: undefined 的同一个 prop
        held: { type: Boolean, default: undefined },
      },
      setup: () => () => null,
    });

    const wrapper = mount(Base);

    // Vue 对 Boolean 的隐式缺省只在「未传入且未声明 default」时生效
    expect(wrapper.props('plain')).toBe(false);
    expect(wrapper.props('held')).toBeUndefined();
    // 传入 true 时两者都照常生效
    const passed = mount(Base, { props: { plain: true, held: true } });

    expect(passed.props('plain')).toBe(true);
    expect(passed.props('held')).toBe(true);
  });
});
