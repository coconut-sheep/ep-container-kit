<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import type {
    AnyRecord,
    AnyValue,
    BaseSlots,
  } from '@ep-container-kit/types/index.ts';
  import {
    COMPONENT_NAME,
    type FormItemSchemaProps,
  } from '@ep-container-kit/components/form-container/src/form-item-schema.ts';
  import {
    computed,
    h,
    ref,
    useSlots,
    watch,
    type WritableComputedRef,
  } from 'vue';
  import { omitEntryProps } from '@ep-container-kit/utils';
  import FormItem from '@ep-container-kit/components/form-container/src/form-item.vue';

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

  const props = withDefaults(defineProps<FormItemSchemaProps<T>>(), {
    schema: () => {
      return [];
    },
  });

  const slots = useSlots();

  // 按字段 key 缓存 computed，避免每次渲染重复创建；失效字段每次新建独立 ref，避免多个不合法 prop 复用同一 ref
  const modelCache = new Map<string, WritableComputedRef<AnyValue>>();

  const _createPropModel = (key: keyof T | string | undefined) => {
    if (!key) {
      return ref(undefined);
    }

    if (!Object.hasOwn(sourceData.value, key)) {
      return ref(undefined);
    }

    const cacheKey = String(key);
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

  // schema 变化时清理缓存中已不在 schema 内的字段模型，避免无界增长
  watch(
    () => props.schema,
    (list) => {
      const activeKeys = new Set<string>();
      for (const item of list) {
        if (item.prop) {
          activeKeys.add(String(item.prop));
        }
      }
      for (const cacheKey of modelCache.keys()) {
        if (!activeKeys.has(cacheKey)) {
          modelCache.delete(cacheKey);
        }
      }
    },
  );

  const renderContent = () => {
    return props.schema.map((item, index) => {
      // v-model处理
      const modelRef = _createPropModel(item.prop);

      // 默认插槽处理，支持按索引命名的插槽
      const defaultSlots: BaseSlots = {};
      const defaultSlotName = `slot_${item.prop}`;
      if (item.prop) {
        if (slots[defaultSlotName]) {
          defaultSlots['default'] = slots[defaultSlotName];
        }
      }

      return h(
        FormItem,
        {
          key: item.prop || index,
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
  };
</script>

<template>
  <Component :is="renderContent" />
</template>

<style scoped></style>
