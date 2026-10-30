<script setup lang="ts">
  import {
    COMPONENT_DEFAULT_PROPS,
    COMPONENT_DEFAULT_PROPS_HOLDER,
    COMPONENT_NAME,
    type TableColumnSchemaProps,
  } from './table-column-schema.ts';
  import {
    buildPropsDefaultValues,
    buildProviderInject,
    filterNullishProps,
    handleInjectValue,
    omitEntryProps,
  } from '@ep-container-kit/utils';
  import { computed, h, inject, useAttrs, useSlots } from 'vue';
  import {
    TABLE_CONTAINER_PROVIDE_KEYS,
    TABLE_CONTAINER_PROVIDER,
    type TableContainerProvideConfig,
  } from './provide.ts';
  import type { TableColumnItem, TableColumnSlots } from './table-column.ts';
  import { ElTableColumn } from 'element-plus';

  defineOptions({
    name: COMPONENT_NAME,
    inheritAttrs: false,
  });

  const props = withDefaults(
    defineProps<TableColumnSchemaProps>(),
    COMPONENT_DEFAULT_PROPS_HOLDER,
  );
  const attrs = useAttrs();
  const slots = useSlots();

  const _inject = buildProviderInject<TableContainerProvideConfig>(
    inject,
    TABLE_CONTAINER_PROVIDER,
  );

  const defaultProps = buildPropsDefaultValues<TableColumnSchemaProps>(
    COMPONENT_DEFAULT_PROPS,
  );
  const definedProps = computed(() => {
    return filterNullishProps(props);
  });
  const mergedProps = computed<TableColumnSchemaProps>(() => {
    return {
      ...defaultProps,
      ...definedProps.value,
    };
  });

  /**
   * 所有列共享的属性，优先级为 组件值 > 注入值 > 默认值
   * @description 结果只包含 `TABLE_CONTAINER_PROVIDE_KEYS` 中的键，
   * 渲染每列时与列自身属性合并
   */
  const columnProps = computed<TableContainerProvideConfig>(() => {
    return handleInjectValue<TableContainerProvideConfig>({
      injectValue: _inject,
      defaultValue: defaultProps.columnProps || {},
      componentValue: definedProps.value.columnProps || {},
      propList: TABLE_CONTAINER_PROVIDE_KEYS,
    });
  });

  /**
   * 合并单个列的插槽
   * @description 默认插槽的来源与优先级（低 → 高，高优先级覆盖低优先级）：
   * 1. 配置插槽：`item.slots.default`
   * 2. 模板通用插槽：`slots.default`（`useSlots` 传入的默认插槽）
   * 3. 模板定向插槽：`slot_${prop}`（仅当 `prop` 值有效时生效，优先级最高）
   * @param item 单个列的配置
   */
  const handleTableColumnSlots = (item: TableColumnItem) => {
    const defaultSlots: TableColumnSlots = {};
    const itemSlots: TableColumnSlots = item.slots || {};

    if (itemSlots.default) {
      defaultSlots.default = itemSlots.default;
    }

    if (slots.default) {
      defaultSlots.default = slots.default;
    }

    const slotName = `slot_${item.prop}`;
    if (item.prop && slots[slotName]) {
      defaultSlots.default = slots[slotName];
    }

    return {
      ...omitEntryProps(itemSlots, ['default']),
      ...omitEntryProps(slots, ['default']),
      ...defaultSlots,
    };
  };

  const renderContent = () => {
    return (mergedProps.value.schema || [])
      .filter((item) => {
        return !item.hidden;
      })
      .map((item, index) => {
        return h(
          ElTableColumn,
          {
            // 列顺序即渲染顺序，缺 key 时 Vue 按索引复用，schema 增删列会错位
            key: item.prop || item.label || index,
            ...attrs,
            ...columnProps.value,
            // hidden 只用于本组件过滤，不作为属性传给 ElTableColumn
            ...omitEntryProps(item, ['slots', 'hidden']),
          },
          handleTableColumnSlots(item),
        );
      });
  };
</script>

<template>
  <component :is="renderContent" />
</template>

<style scoped lang="scss"></style>
