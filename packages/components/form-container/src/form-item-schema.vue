<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import type { AnyRecord, AnyValue, BaseSlots } from '@ep-container-kit/types';
  import {
    COMPONENT_NAME,
    COMPONENT_DEFAULT_PROPS,
    type FormItemSchemaProps,
  } from './form-item-schema';
  import {
    computed,
    h,
    ref,
    useSlots,
    watch,
    type Component,
    type PropType,
    type WritableComputedRef,
  } from 'vue';
  import { hasProp, omitEntryProps } from '@ep-container-kit/utils';
  import FormItem from './form-item.vue';
  import { handleFormItemProp } from './utils';

  /**
   * FormItem 使用运行时 props 声明，其 props 已被收窄为具体对象；
   * 而这里传入的是 20 个成员的判别联合，直接 `h(FormItem, ...)` 无法匹配重载。
   * 统一按「动态组件」处理，props 交由运行时 props 校验。
   */
  const DynamicFormItem = FormItem as unknown as Component;

  defineOptions({
    name: COMPONENT_NAME,
    inheritAttrs: false,
  });

  const sourceData = defineModel<T>({
    required: false,
    default: () => {
      return {} as T;
    },
  });

  /**
   * 运行时 props 声明
   * @description `FormItemSchemaProps<T>['schema']` 是 `FormContainerItem<T>[]`，
   * 即 20 个成员的判别联合。若直接写 `defineProps<FormItemSchemaProps<T>>()`，
   * @vue/compiler-sfc 在构建期解析该联合时会无限递归。
   * 这里用 `PropType` 只保留编译期类型、运行时仍声明为 Array，
   * 同时 default 复用 `COMPONENT_DEFAULT_PROPS`，避免两处默认值漂移。
   */
  const props = defineProps({
    schema: {
      type: Array as PropType<FormItemSchemaProps<T>['schema']>,
      default: COMPONENT_DEFAULT_PROPS.schema,
    },
  });

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
        DynamicFormItem,
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
