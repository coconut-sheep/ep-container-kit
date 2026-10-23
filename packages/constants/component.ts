/**
 * 组件库统一前缀
 * @description 用于组件 `name`、导出变量名、全局注册名的统一命名，仿 element-plus 的 `El` 前缀
 */
export const CONTAINER_PREFIX = 'Ck' as const;

/**
 * 根据组件名生成带统一前缀的完整组件名
 * @param name 组件名（不含前缀）
 * @example
 * ```ts
 * getComponentName('FormContainer'); // 'CkFormContainer'
 * ```
 */
export const getComponentName = (name: string) => {
  return `${CONTAINER_PREFIX}${name}`;
};
