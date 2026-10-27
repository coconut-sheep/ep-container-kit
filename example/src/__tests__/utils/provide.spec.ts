import { describe, expect, it } from 'vitest';
import { computed, ref } from 'vue';
import { handleInjectValue, handleProvideValue } from 'ep-container-kit';

type DemoConfig = {
  vertical?: boolean;
  labelWidth?: string;
  labelPosition?: 'left' | 'right' | 'top';
};

describe('handleProvideValue', () => {
  it('把每个配置项包装成 computed，取值即得到原值', () => {
    const source = ref<DemoConfig>({ labelWidth: '120px', vertical: true });
    const provided = handleProvideValue(() => {
      return source.value;
    }, ['labelWidth', 'vertical']);

    expect(provided.labelWidth.value).toBe('120px');
    expect(provided.vertical.value).toBe(true);
  });

  it('保持响应式：数据源整体替换后 computed 跟随更新', () => {
    const source = ref<DemoConfig>({ labelWidth: '120px' });
    const provided = handleProvideValue(() => {
      return source.value;
    }, ['labelWidth']);

    expect(provided.labelWidth.value).toBe('120px');

    // getValue 是惰性函数，替换数据源后仍能拿到最新值
    source.value = { labelWidth: '90px' };
    expect(provided.labelWidth.value).toBe('90px');
  });

  it('未提供的配置项得到 undefined，而不是报错', () => {
    const provided = handleProvideValue<DemoConfig, keyof DemoConfig>(() => {
      return {};
    }, ['labelWidth', 'labelPosition']);

    expect(provided.labelWidth!.value).toBeUndefined();
    expect(provided.labelPosition!.value).toBeUndefined();
  });

  it('只包含 propList 中的键', () => {
    const provided = handleProvideValue<DemoConfig, keyof DemoConfig>(() => {
      return { labelWidth: '120px', vertical: true };
    }, ['vertical']);

    expect(Object.keys(provided)).toEqual(['vertical']);
  });
});

describe('handleInjectValue 优先级：组件值 > 注入值 > 默认值', () => {
  it('组件显式提供时使用组件值', () => {
    const result = handleInjectValue<DemoConfig>({
      injectValue: { labelWidth: computed(() => '120px') },
      defaultValue: { labelWidth: '100px' },
      componentValue: { labelWidth: '80px', vertical: true },
      propList: ['labelWidth', 'vertical'],
    });

    expect(result.labelWidth).toBe('80px');
    expect(result.vertical).toBe(true);
  });

  it('组件未提供时使用注入值', () => {
    const result = handleInjectValue<DemoConfig>({
      injectValue: {
        labelWidth: computed(() => '120px'),
        labelPosition: computed(() => 'top'),
      },
      defaultValue: { labelWidth: '100px', labelPosition: 'left' },
      componentValue: {},
      propList: ['labelWidth', 'labelPosition'],
    });

    expect(result.labelWidth).toBe('120px');
    expect(result.labelPosition).toBe('top');
  });

  it('注入值为 undefined 时回落默认值', () => {
    const result = handleInjectValue<DemoConfig>({
      injectValue: { labelWidth: computed(() => undefined) },
      defaultValue: { labelWidth: '100px' },
      componentValue: {},
      propList: ['labelWidth'],
    });

    expect(result.labelWidth).toBe('100px');
  });

  it('完全没有注入时回落默认值', () => {
    const result = handleInjectValue<DemoConfig>({
      injectValue: {},
      defaultValue: { labelWidth: '100px', vertical: false },
      componentValue: {},
      propList: ['labelWidth', 'vertical'],
    });

    expect(result.labelWidth).toBe('100px');
    expect(result.vertical).toBe(false);
  });

  it('组件值为 null/undefined 视为未提供', () => {
    const result = handleInjectValue<DemoConfig>({
      injectValue: { labelWidth: computed(() => '120px') },
      defaultValue: { labelWidth: '100px', labelPosition: 'left' },
      // null 与 undefined 都不算「显式提供」
      componentValue: { labelWidth: null as unknown as undefined },
      propList: ['labelWidth', 'labelPosition'],
    });

    expect(result.labelWidth).toBe('120px');
    expect(result.labelPosition).toBe('left');
  });

  it('组件的假值（false / 0 / 空串）必须优先于注入值', () => {
    const result = handleInjectValue<DemoConfig>({
      injectValue: {
        vertical: computed(() => true),
        labelWidth: computed(() => '120px'),
      },
      defaultValue: { vertical: true, labelWidth: '100px' },
      componentValue: { vertical: false, labelWidth: '' },
      propList: ['vertical', 'labelWidth'],
    });

    // false 与 '' 都是显式提供的有效值，不能被注入值覆盖
    expect(result.vertical).toBe(false);
    expect(result.labelWidth).toBe('');
  });

  it('未列入 propList 的配置项不会出现在结果中', () => {
    const result = handleInjectValue<DemoConfig>({
      injectValue: { labelWidth: computed(() => '120px') },
      defaultValue: { labelWidth: '100px', vertical: true },
      componentValue: {},
      propList: ['labelWidth'],
    });

    expect(Object.keys(result)).toEqual(['labelWidth']);
  });
});
