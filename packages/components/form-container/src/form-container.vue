<script setup lang="ts" generic="T extends AnyRecord = AnyRecord">
  import {
    computed,
    inject,
    provide,
    useAttrs,
    useTemplateRef,
    warn,
  } from 'vue';
  import { ElForm, type FormInstance, type FormItemProp } from 'element-plus';
  import {
    FORM_CONTAINER_PROVIDE_KEY_LIST,
    FORM_PROVIDER,
  } from '@ep-container-kit/constants';
  import type {
    AnyRecord,
    ConfigProviderProvide,
    FormContainerProvideConfig,
  } from '@ep-container-kit/types';
  import {
    filterNullishProps,
    getRefExpose,
    handleInjectValue,
    handleProvideValue,
    isArray,
    pickEntryProps,
  } from '@ep-container-kit/utils';
  import {
    COMPONENT_NAME,
    getComponentDefaultProps,
    type FormContainerEmits,
    type FormContainerProps,
  } from './form-container';
  import FormItemSchema from './form-item-schema.vue';

  defineOptions({
    name: COMPONENT_NAME,
    // 关闭自动继承：根节点上 `:model` 的写入顺序需要可控，见模板中的 v-bind 顺序
    inheritAttrs: false,
  });

  const sourceData = defineModel<T>({
    required: false,
    default: () => {
      return {} as T;
    },
  });

  const props = defineProps<FormContainerProps<T>>();

  const emits = defineEmits<FormContainerEmits>();

  const attrs = useAttrs();

  /**
   * 数据源只认 `v-model`
   * @description `:model` 已从 props 类型中剔除，这里兜住不经过类型检查的写法（JS 调用、动态绑定）。
   * 静默忽略会让调用方误判为「数据已传入但校验不通过」，因此给出显式提示。
   */
  if (attrs.model) {
    warn(
      `[${COMPONENT_NAME}] 数据源请通过 v-model 传入，:model 会被内部绑定覆盖并忽略。`,
    );
  }

  const defaultProps = getComponentDefaultProps();

  const _inject = inject<
    Partial<ConfigProviderProvide<FormContainerProvideConfig>>
  >(FORM_PROVIDER, {});

  const mergedProps = computed(() => {
    const definedProps = filterNullishProps(props);

    return {
      ...defaultProps,
      ...definedProps,
      ...handleInjectValue({
        injectValue: _inject,
        defaultValue: defaultProps,
        componentValue: definedProps,
        propList: FORM_CONTAINER_PROVIDE_KEY_LIST,
      }),
    };
  });

  /**
   * 将合并后的表单配置继续提供给下层组件
   */
  provide(
    FORM_PROVIDER,
    handleProvideValue(
      () => mergedProps.value,
      FORM_CONTAINER_PROVIDE_KEY_LIST,
    ),
  );

  /**
   * 传递给 el-form 的 props
   * @description 用「el-form 实际声明的 props」做白名单，而不是剔除已知的内部 key。
   * 容器的 props 里混着三类 el-form 不认识的东西：`schema`、`vertical` / `itemMinWidth` 等
   * 容器自有配置，以及 `v-model` 生成的 `modelValue`。只要漏掉一个，它就会作为
   * fallthrough attribute 落到 `<form>` 上，渲染成 `modelvalue="[object Object]"` 这类脏属性。
   * 白名单从根上避免了「新增内部配置忘记同步剔除列表」的问题。
   */
  const formContainerProps = computed(() => {
    return pickEntryProps(
      mergedProps.value as AnyRecord,
      Object.keys(ElForm.props ?? {}),
    );
  });

  const formContainerRef = useTemplateRef<FormInstance>('formContainerRef');
  const formContainerClass = computed(() => {
    const result: string[] = [];
    if (mergedProps.value.vertical) {
      result.push('form-container--vertical');
    } else {
      result.push('form-container--horizontal');
    }

    return result.join(' ');
  });
  const hasSchema = computed(() => {
    if (!mergedProps.value.schema) {
      return false;
    }

    return isArray(mergedProps.value.schema);
  });

  const handleFormSubmit = () => {
    emits('submit');
  };

  const handleFormValidate = (
    prop: FormItemProp,
    isValid: boolean,
    message: string,
  ) => {
    emits('validate', prop, isValid, message);
  };

  defineExpose(getRefExpose(formContainerRef));
</script>

<template>
  <el-form
    ref="formContainerRef"
    class="form-container"
    v-bind="{ ...$attrs, ...formContainerProps }"
    :class="formContainerClass"
    :model="sourceData"
    @submit.prevent="handleFormSubmit"
    @validate="handleFormValidate"
  >
    <slot>
      <FormItemSchema
        v-if="hasSchema"
        v-model="sourceData"
        :schema="mergedProps.schema!"
      >
        <template
          v-for="(slotFn, slotName) in $slots"
          :key="slotName"
          #[slotName]="scope"
        >
          <Component :is="slotFn" v-bind="scope" />
        </template>
      </FormItemSchema>
    </slot>
  </el-form>
</template>

<style scoped lang="scss">
  @use '@ep-container-kit/styles/mixins' as *;

  @include ck-border-box;

  .form-container {
    display: flex;
    row-gap: 16px;
    width: 100%;

    &.form-container--vertical {
      flex-direction: column;
      align-items: flex-start;
      flex-wrap: nowrap;
    }

    &.form-container--horizontal {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
</style>
