# ep-container-kit

基于 [Element Plus](https://element-plus.org/) 的 **Schema 驱动**容器组件库。

用一份数据描述整张表单，容器负责布局、取值、校验与全局配置下发。

> 完整文档、示例与开发指南见仓库根目录的 [README](https://github.com/)（monorepo 工作区）。

## 安装

```bash
# npm
npm install ep-container-kit @element-plus/icons-vue
# pnpm
pnpm add ep-container-kit @element-plus/icons-vue
# yarn
yarn add ep-container-kit @element-plus/icons-vue
```

对等依赖：`vue >= 3.4`、`element-plus >= 2.7`、`@element-plus/icons-vue >= 2.3`，需自行安装并引入 Element Plus 的样式。

> `@element-plus/icons-vue` 虽然是 Element Plus 自身的依赖，但 pnpm 不会把它提升到宿主的
> `node_modules` 顶层，不装会在加载本包时抛 `ERR_MODULE_NOT_FOUND`。

`dist/index.css` 不含全局重置：没有 `*` / `html` / `body` 规则，只声明组件类名与 `[data-v-xxx]`
属性选择器，作用范围限定在组件自身渲染出的元素上，不会改写宿主的内容。

组件盒模型已由库内部保证，宿主无需为组件额外声明 `border-box`；但建议项目里保留
`* { box-sizing: border-box }`（多数项目本来就有），否则布局工具类的百分比宽度叠加
`padding` 会溢出容器。

## 快速开始

```ts
// main.ts
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import EpContainerKit from 'ep-container-kit';
import 'ep-container-kit/dist/index.css';

import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus);
app.use(EpContainerKit);
app.mount('#app');
```

按需使用（产物为 ESM，未使用的组件会被 Tree Shaking 移除）：

```ts
import { CkFormContainer } from 'ep-container-kit';
import 'ep-container-kit/dist/index.css';
```

## 组件

| 组件               | 说明                                                |
| ------------------ | --------------------------------------------------- |
| `CkConfigProvider` | 全局配置提供器，通过 provide/inject 下发表单配置    |
| `CkFormContainer`  | 表单容器，`ElForm` 的轻量封装，支持 Schema 渲染     |
| `CkFormItem`       | 表单项，`ElFormItem` 的轻量封装，可脱离容器单独使用 |
| `CkFormItemSchema` | `CkFormItem` 的 Schema 批量渲染实现                 |
| `CkPageContainer`  | 页面容器，铺满父级并承担滚动                        |
| `CkPageContent`    | 页面内容区，标题栏 + 内容区两段式布局，支持返回按钮 |

### 表单

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { CkFormContainer, type FormContainerItem } from 'ep-container-kit';

  const formData = ref({ username: '', age: 18 });

  const schema: FormContainerItem<typeof formData.value>[] = [
    { prop: 'username', label: '用户名', type: 'input', col: 12 },
    { prop: 'age', label: '年龄', type: 'inputNumber', col: 12 },
  ];
</script>

<template>
  <CkFormContainer v-model:source="formData" :schema="schema" />
</template>
```

### 页面

```vue
<script setup lang="ts">
  import { CkPageContainer, CkPageContent } from 'ep-container-kit';
</script>

<template>
  <CkPageContainer>
    <CkPageContent title="资产列表" show-back>
      <template #header>
        <el-button type="primary">新建</el-button>
      </template>
      <!-- 内容 -->
    </CkPageContent>
  </CkPageContainer>
</template>
```

返回按钮图标默认使用 Element Plus 的 `ArrowLeft`，`#back-icon` 插槽可整体替换。

页面容器依赖父级存在确定高度（`height: 100%` 才有参照），样式只使用 Element Plus 主题变量，不含玻璃拟态效果。

## 产物

| 文件              | 说明                                   |
| ----------------- | -------------------------------------- |
| `dist/index.mjs`  | ESM 入口，`import` 使用                |
| `dist/index.cjs`  | CJS 入口，`require` 使用               |
| `dist/index.d.ts` | 类型声明（单文件，已内联全部内部类型） |
| `dist/index.css`  | 样式（含组件样式与布局工具类）         |

`vue`、`element-plus` 与 `@element-plus/icons-vue` 不打入产物，由使用方提供。

## 许可证

[MIT](./LICENSE)

本项目是基于 Element Plus 生态的第三方容器组件封装，与 Element Plus 官方团队无隶属或合作关系。
