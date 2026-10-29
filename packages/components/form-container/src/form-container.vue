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
  import type { AnyRecord } from '@ep-container-kit/types';
  import {
    FORM_CONTAINER_PROVIDE_KEYS,
    FORM_CONTAINER_PROVIDER,
    type FormContainerProvideConfig,
  } from './provide';
  import {
    buildPropsDefaultValues,
    buildProviderInject,
    filterNullishProps,
    getRefExpose,
    handleInjectValue,
    handleProvideValue,
    isArray,
    pickEntryProps,
  } from '@ep-container-kit/utils';
  import {
    COMPONENT_DEFAULT_PROPS,
    COMPONENT_DEFAULT_PROPS_HOLDER,
    COMPONENT_NAME,
    type FormContainerEmitsTuple,
    type FormContainerProps,
  } from './form-container';
  import FormItemSchema from './form-item-schema.vue';

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

  const props = withDefaults(
    defineProps<FormContainerProps<T>>(),
    COMPONENT_DEFAULT_PROPS_HOLDER,
  );
  const emits = defineEmits<FormContainerEmitsTuple>();
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

  const _inject = buildProviderInject<FormContainerProvideConfig>(
    inject,
    FORM_CONTAINER_PROVIDER,
  );

  const defaultProps = buildPropsDefaultValues<FormContainerProps>(
    COMPONENT_DEFAULT_PROPS,
  );
  const mergedProps = computed<FormContainerProps>(() => {
    const definedProps = filterNullishProps(props);

    return {
      ...defaultProps,
      ...definedProps,
      ...handleInjectValue({
        injectValue: _inject,
        defaultValue: defaultProps,
        componentValue: definedProps,
        propList: FORM_CONTAINER_PROVIDE_KEYS,
      }),
    };
  });

  /**
   * 将合并后的表单配置继续提供给下层组件
   */
  provide(
    FORM_CONTAINER_PROVIDER,
    handleProvideValue(() => mergedProps.value, FORM_CONTAINER_PROVIDE_KEYS),
  );

  /**
   * 传递给 el-form 的 props
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
