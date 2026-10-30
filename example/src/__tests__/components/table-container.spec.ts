import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ElementPlus, { ElTable, ElTableColumn } from 'element-plus';
import { defineComponent, h } from 'vue';
import {
  CkConfigProvider,
  CkTableColumnSchema,
  CkTableContainer,
  type TableColumnItem,
} from 'ep-container-kit';

const global = { plugins: [ElementPlus] };

/**
 * 把 `CkTableColumnSchema` 挂在 `el-table` 内部
 * @description 必须挂在表里：`el-table-column` 在 mounted 时会向 el-table 注册自己，
 * 脱离 el-table 会因为拿不到 owner 而报错
 */
const mountColumnSchema = (options: {
  schema: TableColumnItem[];
  columnProps?: Record<string, unknown>;
  slots?: Record<string, () => unknown>;
  tableContainer?: Record<string, unknown>;
}) => {
  const renderSchema = () =>
    h(
      CkTableColumnSchema,
      { schema: options.schema, columnProps: options.columnProps },
      options.slots,
    );
  const renderTable = () =>
    h(ElTable, { data: [{ name: 'a' }] }, renderSchema);

  return mount(
    defineComponent({
      setup() {
        return () =>
          options.tableContainer
            ? h(
                CkConfigProvider,
                { tableContainer: options.tableContainer },
                { default: renderTable },
              )
            : renderTable();
      },
    }),
    { global },
  );
};

/**
 * `ElTableColumn` 包装器的宽松视图
 * @description `findAllComponents` 对泛型 SFC 推断出的 props 键是 `never`，
 * 测试只关心取到的值，这里统一放宽一次，避免每个断言都写类型断言
 */
interface ColumnWrapper {
  /**
   * 读取列的全部 props
   */
  props: () => Record<string, unknown>;
  /**
   * 组件实例上的插槽
   */
  vm: { $slots: Record<string, unknown> };
}

/**
 * 取出全部列的包装器
 * @param wrapper 挂载结果
 */
const getColumns = (wrapper: ReturnType<typeof mount>) => {
  return wrapper.findAllComponents(ElTableColumn) as unknown as ColumnWrapper[];
};

/**
 * 取出第一列的包装器
 * @param wrapper 挂载结果
 */
const getColumn = (wrapper: ReturnType<typeof mount>) => {
  return getColumns(wrapper)[0] as ColumnWrapper;
};

/**
 * 取出渲染出来的每一列的 props
 * @param wrapper 挂载结果
 */
const getColumnProps = (wrapper: ReturnType<typeof mount>) => {
  return getColumns(wrapper).map((column) => {
    const props = column.props();

    return {
      label: props.label,
      prop: props.prop,
      align: props.align,
      showOverflowTooltip: props.showOverflowTooltip,
    };
  });
};

/**
 * 调用列的默认插槽，取出它渲染出的节点类型
 * @description 插槽函数会被 Vue 包一层 `withCtx`，不能用引用比较；
 * 这里让各来源的插槽渲染不同的标签，用标签名反推实际生效的是哪一个
 * @param column `ElTableColumn` 的包装器
 */
const getDefaultSlotType = (column: ColumnWrapper) => {
  const slot = column.vm.$slots.default as
    | ((props: Record<string, unknown>) => unknown)
    | undefined;

  const result = slot?.({ row: {}, column: {}, $index: 0 });
  const vnode = (Array.isArray(result) ? result[0] : result) as
    | { type?: unknown }
    | undefined;

  return vnode?.type;
};

describe('CkTableColumnSchema 渲染', () => {
  it('按 schema 渲染出对应数量的列', () => {
    const wrapper = mountColumnSchema({
      schema: [
        { prop: 'name', label: '名称' },
        { prop: 'ip', label: 'IP' },
      ],
    });

    expect(getColumnProps(wrapper)).toStrictEqual([
      { label: '名称', prop: 'name', align: undefined, showOverflowTooltip: undefined },
      { label: 'IP', prop: 'ip', align: undefined, showOverflowTooltip: undefined },
    ]);
  });

  it('hidden 的列不渲染', () => {
    const wrapper = mountColumnSchema({
      schema: [
        { prop: 'name', label: '名称', hidden: true },
        { prop: 'ip', label: 'IP' },
      ],
    });

    expect(getColumnProps(wrapper).map((column) => column.label)).toStrictEqual(
      ['IP'],
    );
  });

  it('Boolean 类型属性没有被隐式补成 false', () => {
    const wrapper = mountColumnSchema({
      schema: [{ prop: 'name', label: '名称' }],
    });

    // EP 的 showOverflowTooltip 是 Boolean 且无默认值；若组件把 EP props
    // 平铺到自己的 defineProps 上，缺席时会被 Vue 补成 false，这里断言它保持 undefined
    expect(getColumn(wrapper).props().showOverflowTooltip).toBeUndefined();
  });
});

describe('CkTableColumnSchema 共享属性', () => {
  it('columnProps 下发给所有列', () => {
    const wrapper = mountColumnSchema({
      schema: [
        { prop: 'name', label: '名称' },
        { prop: 'ip', label: 'IP' },
      ],
      columnProps: { align: 'center' },
    });

    expect(getColumnProps(wrapper).map((column) => column.align)).toStrictEqual([
      'center',
      'center',
    ]);
  });

  it('schema 项自身的属性优先于 columnProps', () => {
    const wrapper = mountColumnSchema({
      schema: [
        { prop: 'name', label: '名称' },
        { prop: 'ip', label: 'IP', align: 'right' },
      ],
      columnProps: { align: 'center' },
    });

    expect(getColumnProps(wrapper).map((column) => column.align)).toStrictEqual([
      'center',
      'right',
    ]);
  });

  it('CkConfigProvider 的 tableContainer 注入到列上', () => {
    const wrapper = mountColumnSchema({
      schema: [{ prop: 'name', label: '名称' }],
      tableContainer: { align: 'center' },
    });

    expect(getColumn(wrapper).props().align).toBe('center');
  });

  it('组件 columnProps 优先于注入值', () => {
    const wrapper = mountColumnSchema({
      schema: [{ prop: 'name', label: '名称' }],
      columnProps: { align: 'right' },
      tableContainer: { align: 'center' },
    });

    expect(getColumn(wrapper).props().align).toBe('right');
  });

  it('未提供注入值时使用 EP 自身的默认值', () => {
    const wrapper = mountColumnSchema({
      schema: [{ prop: 'name', label: '名称' }],
    });

    const props = getColumn(wrapper).props();

    expect(props.align).toBeUndefined();
    expect(props.resizable).toBe(true);
    expect(props.filterMultiple).toBe(true);
  });
});

describe('CkTableColumnSchema 插槽', () => {
  it('schema 项的 slots 透传给列', () => {
    const header = () => h('span', '自定义表头');
    const wrapper = mountColumnSchema({
      schema: [{ prop: 'name', label: '名称', slots: { header } }],
    });

    const column = getColumn(wrapper);

    expect(column.vm.$slots.header).toBeTypeOf('function');
  });

  it('模板默认插槽覆盖 schema 项的默认插槽', () => {
    const itemDefault = () => h('b');
    const templateDefault = () => h('i');
    const wrapper = mountColumnSchema({
      schema: [{ prop: 'name', label: '名称', slots: { default: itemDefault } }],
      slots: { default: templateDefault },
    });

    expect(getDefaultSlotType(getColumn(wrapper))).toBe('i');
  });

  it('slot_${prop} 定向插槽优先级最高', () => {
    const itemDefault = () => h('b');
    const templateDefault = () => h('i');
    const propSlot = () => h('u');
    const wrapper = mountColumnSchema({
      schema: [{ prop: 'name', label: '名称', slots: { default: itemDefault } }],
      slots: { default: templateDefault, slot_name: propSlot },
    });

    expect(getDefaultSlotType(getColumn(wrapper))).toBe('u');
  });
});

describe('CkTableContainer', () => {
  it('数字宽高转换为 px', () => {
    const wrapper = mount(CkTableContainer, {
      props: { width: 300, height: 200 },
      slots: { default: () => h('div', '内容') },
    });

    expect(wrapper.find('.table-container').attributes('style')).toContain(
      'width: 300px',
    );
    expect(wrapper.find('.table-container').attributes('style')).toContain(
      'height: 200px',
    );
  });

  it('带单位的尺寸字符串原样生效', () => {
    const wrapper = mount(CkTableContainer, {
      props: { width: '100%', height: '50vh' },
      slots: { default: () => h('div', '内容') },
    });

    expect(wrapper.find('.table-container').attributes('style')).toContain(
      'height: 50vh',
    );
  });

  it('未传尺寸时不生成行内样式', () => {
    const wrapper = mount(CkTableContainer, {
      slots: { default: () => h('div', '内容') },
    });

    expect(wrapper.find('.table-container').attributes('style')).toBeUndefined();
  });

  it('footer 插槽渲染到底部区域，并带 footerClass', () => {
    const wrapper = mount(CkTableContainer, {
      props: { footerClass: 'custom-footer' },
      slots: {
        default: () => h('div', '内容'),
        footer: () => h('div', '分页'),
      },
    });

    const footer = wrapper.find('.table-container--footer');

    expect(footer.classes()).toContain('custom-footer');
    expect(footer.text()).toBe('分页');
  });

  it('未提供 footer 插槽时不渲染底部区域', () => {
    const wrapper = mount(CkTableContainer, {
      slots: { default: () => h('div', '内容') },
    });

    expect(wrapper.find('.table-container--footer').exists()).toBe(false);
  });
});
