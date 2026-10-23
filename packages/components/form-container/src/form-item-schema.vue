<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import type { AnyRecord, AnyValue, BaseSlots } from '@ep-container-kit/types';
  import {
    COMPONENT_NAME,
    COMPONENT_DEFAULT_PROPS,
    type FormItemSchemaProps,
  } from '@ep-container-kit/components/form-container/src/form-item-schema.ts';
  import { computed, h, ref, useSlots, watch, type WritableComputedRef } from 'vue';
  import { hasProp, omitEntryProps } from '@ep-container-kit/utils';
  import FormItem from '@ep-container-kit/components/form-container/src/form-item.vue';
  import { handleFormItemProp } from '@ep-container-kit/components/form-container/src/utils.ts';

  defineOptions({
    name: COMPONENT_NAME,
    inheritAttrs: false,
  });

  const sourceData = defineModel<T>('source', {
    required: false,
    default: () => {
      return {} as T;
    },
  });

  const props = withDefaults(
    defineProps<FormItemSchemaProps<T>>(),
    COMPONENT_DEFAULT_PROPS,
  );

  const slots = useSlots();

  // 非法prop（空prop / sourceData中不存在的prop）集中告警，仅在schema prop集合变化时触发一次
  watch(
    () => {
      const invalidProps = new Set<string>();
      for (const item of props.schema) {
        const prop = String(handleFormItemProp(item, 'prop', '') ?? '');
        // 空 prop 或 sourceData 中不存在的 prop 都视为非法，去重收集
        if (!prop || !hasProp(sourceData.value, prop)) {
          invalidProps.add(prop);
        }
      }
      return [...invalidProps]; // 去重后的非法 prop 列表（含 ''）
    },
    (list) => {
      for (const prop of list) {
        // 先判断空 prop
        if (!prop) {
          console.warn(`FormItemSchema: 存在空prop, 该字段无法编辑`);
          continue;
        }
        // 再处理不存在的 prop
        console.warn(`FormItemSchema: 不存在的prop: ${prop}, 该字段无法编辑`);
      }
    },
    { immediate: true },
  );

  // 按字段 key 缓存 computed，避免每次渲染重复创建；失效字段每次新建独立 ref，避免多个不合法 prop 复用同一 ref
  const modelCache = new Map<string, WritableComputedRef<AnyValue>>();

  /**
   * 创建字段的 v-model 模型
   * @description prop有效且存在于源数据时，返回绑定源数据的stabled computed（跨渲染稳定复用）；
   * prop为空或源数据不存在时，v-model不生效（约定），返回独立临时ref作编辑占位，不写回源数据。
   */
  const _createPropModel = (key: keyof T | string | undefined) => {
    const cacheKey = String(key);

    // prop为空：无稳定身份可绑定，v-model不生效
    if (!key) {
      return ref(undefined);
    }

    // 源数据不存在该字段：目标字段无响应式挂了，v-model不生效（不写回源数据）
    if (!hasProp(sourceData.value, key)) {
      return ref(undefined);
    }

    let model = modelCache.get(cacheKey);
    if (!model) {
      model = computed({
        get() {
          return (sourceData.value as AnyRecord)[cacheKey];
        },
        set(newVal) {
          (sourceData.value as AnyRecord)[cacheKey] = newVal;
        },
      });
      modelCache.set(cacheKey, model);
    }
    return model;
  };

  const renderContent = () => {
    const validKeys = new Set<string>();

    const nodeList = props.schema.map((item, index) => {
      const _propKey = handleFormItemProp(item, 'prop', '') as string;

      // v-model处理
      const modelRef = _createPropModel(_propKey);
      // 等待 modelCache 缓存完成，再判断是否有效 prop
      if (_propKey && modelCache.has(_propKey)) {
        validKeys.add(_propKey);
      }

      // 默认插槽处理，支持按索引命名的插槽
      const defaultSlots: BaseSlots = {};
      const defaultSlotName = `slot_${_propKey}`;
      if (_propKey) {
        if (slots[defaultSlotName]) {
          defaultSlots['default'] = slots[defaultSlotName];
        }
      }

      return h(
        FormItem,
        {
          key: _propKey || index,
          ...item,
          modelValue: modelRef.value,
          'onUpdate:modelValue': (val: AnyValue) => {
            modelRef.value = val;
          },
        },
        {
          ...omitEntryProps(slots, ['default', defaultSlotName]),
          ...defaultSlots,
        },
      );
    });

    // 移除modelCache中无效的key
    for (const cacheKey of modelCache.keys()) {
      if (!validKeys.has(cacheKey)) {
        modelCache.delete(cacheKey);
      }
    }

    return nodeList;
  };
</script>

<template>
  <Component :is="renderContent" />
</template>

<style scoped></style>
