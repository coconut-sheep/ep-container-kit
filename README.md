# ep-container-kit

基于 [Element Plus](https://element-plus.org/) 的 **Schema 驱动**容器组件库。

用一份数据描述整张表单，容器负责布局、取值、校验与全局配置下发。

> **当前状态**：`v0.1.0`，已实现表单域（Form）相关的 4 个组件并具备完整发布链路。
> 表格（Table）、分页（Pagination）、树（Tree）、详情（Detail）仍在规划中，见 [后续规划](#后续规划)。

---

## 简介

`ep-container-kit` 不是又一个 Element Plus 封装集合，而是**在 ElForm 之上补一层「数据描述界面」的能力**：

- 一份 `schema` 数组即可渲染整张表单，字段的 `prop` 与数据源自动双向绑定
- 布局（垂直/水平、`col` 占列、表单项宽度）由容器统一接管
- 标签宽度、对齐方式等规范通过 `CkConfigProvider` 一次下发，全局生效
- 原生属性不塞进 schema，统一走 `props` / `slots` / `events` 透传，schema 不会无限膨胀

---

## 特性

- **Schema 驱动**：`type` + `prop` + `props` 描述表单项，支持 17 种内置控件与 `custom` / `render` 两种逃生通道
- **三级配置优先级**：`组件显式传入 > CkConfigProvider 注入 > 组件默认值`
- **属性透传明确**：`CkFormItem` / `CkFormItemSchema` 关闭属性自动继承并手动透传到 `el-form-item`；`CkFormContainer` 同样关闭自动继承，按 `$attrs` → `el-form` 声明过的 props → `v-model` 的顺序显式绑定，保证误传的 `:model` 盖不掉数据源
- **类型完整**：`FormContainerItem<T>` 是 20 个成员的判别联合，`prop` 受业务数据类型约束
- **页面骨架**：`CkPageContainer` + `CkPageContent` 提供「滚动容器 + 标题栏 + 内容区」的标准页面布局，`show-back` 内置返回箭头
- **样式无侵入**：页面容器只用纯色底 + 细边框，不依赖 `backdrop-filter` 玻璃拟态与宿主自定义变量，颜色全部可被 Element Plus 主题变量覆盖；产物不含任何全局选择器（无 `*` / `html` / `body` 规则），不改宿主的 `box-sizing`、字体与滚动行为
- **标准库产物**：ESM + CJS + 单文件 d.ts + 独立 CSS，`vue` / `element-plus` / `@element-plus/icons-vue` 走 peer

---

## 组件总览

| 组件               | 说明                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `CkConfigProvider` | 全局配置提供器，通过 provide/inject 向子组件下发表单全局配置；本身也是 `el-config-provider` |
| `CkFormContainer`  | 表单容器，`ElForm` 的轻量封装，支持直接传入 schema 渲染整表单                               |
| `CkFormItem`       | 表单项，`ElFormItem` 的轻量封装，可脱离容器单独使用                                         |
| `CkFormItemSchema` | `CkFormItem` 的 Schema 批量渲染实现                                                         |
| `CkPageContainer`  | 页面容器，铺满父级并承担滚动，作为页面根节点                                                |
| `CkPageContent`    | 页面内容区，提供「标题栏 + 内容区」两段式布局，支持 `show-back` 返回按钮                    |

---

## 快速开始

### 环境要求

| 依赖                      | 版本                           |
| ------------------------- | ------------------------------ |
| Vue                       | `>= 3.4`                       |
| Element Plus              | `>= 2.7`                       |
| `@element-plus/icons-vue` | `>= 2.3`                       |
| Node.js                   | `>= 22.18`（仅开发本仓库需要） |

`@element-plus/icons-vue` 是 Element Plus 自身的依赖，但 pnpm 不会把它提升到宿主
`node_modules` 顶层，因此需要显式安装——否则加载 `ep-container-kit` 时会抛
`ERR_MODULE_NOT_FOUND`。

### 安装

```bash
pnpm add ep-container-kit @element-plus/icons-vue
# npm install ep-container-kit
# yarn add ep-container-kit
```

### 全量引入

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

### 按需引入

产物为 ESM，未使用的组件会被 Tree Shaking 移除：

```ts
import { CkFormContainer, CkFormItem } from 'ep-container-kit';
import 'ep-container-kit/dist/index.css';
```

### 按单组件注册

注册名取自组件自身的 `name`（统一带 `Ck` 前缀）：

```ts
import { createApp } from 'vue';
import { CkFormContainer } from 'ep-container-kit';

const app = createApp(App);
app.use(CkFormContainer); // 等价于 app.component('CkFormContainer', CkFormContainer)
```

### 样式产物

| 文件             | 内容                                                                            |
| ---------------- | ------------------------------------------------------------------------------- |
| `dist/index.css` | 组件样式 + 布局工具类（`column-*`、`flex-*`、`gap-*`、`margin-*` 等）+ 过渡动画 |

目前是表单 + 页面两个模块，样式仍为单文件。后续 Table / Tree / Detail 落地后会按模块拆分（`table.css` / `tree.css` / `detail.css`）。

> `col` 属性依赖 `index.css` 中的 `column-N` 工具类，请务必引入样式，否则占列布局不生效。

#### 不做全局重置

`dist/index.css` **不含任何全局选择器**（没有 `*`、`html`、`body` 规则），它只声明组件类名与 `[data-v-xxx]` 属性选择器，作用范围限定在组件自身渲染出的元素上。这与 Element Plus 一致——后者同样不做全局重置，118 处 `box-sizing: border-box` 全部写在组件类上，`*` 选择器 0 处。

这样做的原因：`* { box-sizing: border-box }` 会静默改变宿主既有布局。宿主里写了 `width: 100px; padding: 10px` 期待占 120px 的元素，引入组件库后会变成 100px；而且 `*` 的特异性为 0，一旦宿主也有同名规则，胜负完全取决于样式加载顺序，会变成极难定位的问题。`*` 还会命中第三方组件（地图、富文本编辑器、其他 UI 库）。

组件的盒模型由 `ck-border-box` mixin 统一提供，每个组件只需一行：

```scss
<style scoped lang="scss">
  @use '@ep-container-kit/styles/mixins' as *;

  @include ck-border-box;

  .page-content {
    height: 100%;
    padding: 18px;
  }
</style>
```

它编译成三条属性选择器，而不是通配符：

```css
[data-v-a06c0e8a],
[data-v-a06c0e8a]::before,
[data-v-a06c0e8a]::after {
  box-sizing: border-box;
}
```

Vue 的 scoped 编译器会把裸 `*` 替换成 `[data-v-xxx]`，因此它只命中当前组件模板渲染出的元素。宿主通过插槽传入的内容带的是宿主的 scopeId，子组件内部元素带的是子组件自己的 scopeId，两者都不匹配，不会被改写。

**宿主侧仍建议自行声明 `border-box`**，它只影响布局工具类：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

缺少它时组件自身不受影响（已由 mixin 保证），但 `width-50` 这类百分比工具类叠加 `padding` 后会在 `content-box` 下溢出容器。

> 组件库自身严格遵守这条边界：`box-sizing` 只出现在组件 scoped 样式里；宿主专属的全局样式（`html` / `body` 尺寸与滚动行为、字体栈、`user-select`、`#app` 背景等）一概不提供，统一交由宿主决定。

---

## 核心概念：Schema 驱动

```ts
import type { FormContainerItem } from 'ep-container-kit';

type UserForm = {
  username: string;
  age: number;
  enabled: boolean;
};

const schema: FormContainerItem<UserForm>[] = [
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    col: 12,
    props: { placeholder: '请输入用户名' },
    rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  },
  {
    prop: 'age',
    label: '年龄',
    type: 'inputNumber',
    col: 12,
    props: { min: 0, max: 150 },
  },
  { prop: 'enabled', label: '是否启用', type: 'switch' },
];
```

设计上遵循两条边界：

1. **Schema 只收录高频变化的配置**，其余原生属性通过 `props` 原样透传给默认插槽中的控件，避免 schema 无限膨胀。
2. **动态显隐用布尔表达**：`hidden` 等价于 `v-if`（彻底移除），`visible` 等价于 `v-show`（仅隐藏样式）；需要更复杂的自定义渲染时用 `itemRender` 接管。

### 内置控件类型

| `type`         | 对应组件         | `type`              | 对应组件          |
| -------------- | ---------------- | ------------------- | ----------------- |
| `input`        | `ElInput`        | `radioGroup`        | `ElRadioGroup`    |
| `inputNumber`  | `ElInputNumber`  | `checkbox`          | `ElCheckbox`      |
| `inputTags`    | `ElInputTag`     | `checkboxGroup`     | `ElCheckboxGroup` |
| `autoComplete` | `ElAutocomplete` | `datePicker`        | `ElDatePicker`    |
| `select`       | `ElSelect`       | `timeSelect`        | `ElTimeSelect`    |
| `treeSelect`   | `ElTreeSelect`   | `timePicker`        | `ElTimePicker`    |
| `radio`        | `ElRadio`        | `switch`            | `ElSwitch`        |
| `slider`       | `ElSlider`       | `colorPicker`       | `ElColorPicker`   |
| `cascader`     | `ElCascader`     | `custom` / `render` | 自定义            |

`type` 写错时，该成员会坍缩到 `FormItemAny`，其 `type` 字段类型为 `never`，编译期即可发现。

---

## Form 用法

### 容器 + Schema

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import {
    CkFormContainer,
    type FormContainerInstance,
  } from 'ep-container-kit';
  import { ElButton } from 'element-plus';

  const formData = ref({ username: '', age: 18 });
  const formRef = ref<FormContainerInstance>();

  const schema: FormContainerItem<typeof formData.value>[] = [
    { prop: 'username', label: '用户名', type: 'input' },
    { prop: 'age', label: '年龄', type: 'inputNumber' },
  ];

  const submit = async () => {
    await formRef.value?.validate();
    // 校验通过，formData 已是最新值
  };
</script>

<template>
  <CkFormContainer ref="formRef" v-model="formData" :schema="schema" vertical>
    <ElButton type="primary" @click="submit">提交</ElButton>
  </CkFormContainer>
</template>
```

### 数据源与校验

`v-model` 是唯一的数据入口。容器把它原样作为内部 `ElForm` 的 `model`，Element Plus 正是靠这个值定位字段、取到 `el-form-item` 的 `prop` 并执行 `rules`——所以**不需要、也不应该再传 `:model`**：

- `:model` 已从 props 类型中移除，传了会被忽略（运行时给出一条 `warn`），因为数据源已经由 `v-model` 提供，容器会在内部把 `v-model` 的值绑定到 `el-form` 上。
- 写回是**就地修改**：编辑字段时容器直接改写 `v-model` 传入对象的对应属性，父级持有的同一个对象会实时更新；也因此不会派发 `update:modelValue`。需要监听变化请 `watch` 数据对象，或用 `computed` 派生，不要依赖 `@update:model-value`。

### 单独使用表单项

`CkFormItem` 的 `v-model` 直接绑定单个值，无需 schema：

```vue
<CkFormItem v-model="formData.username" label="用户名" type="input" />
```

具名插槽（`prefix`、`suffix` 等）会被批量透传，直接写在 `CkFormItem` 上即可生效。模板中名为 `slot_${prop}` 的插槽优先级最高，可用来覆盖某个字段的默认控件（插槽内自行读写数据源）：

```vue
<CkFormContainer v-model="formData" :schema="schema">
  <template #slot_username>
    <el-input v-model="formData.username" placeholder="自定义控件" />
  </template>
</CkFormContainer>
```

### 实例方法

`CkFormContainer` 通过 `defineExpose` 透出内部 `ElForm` 实例的完整方法（`validate`、`validateField`、`resetFields`、`clearValidate`、`scrollToField` 等），类型为 `FormContainerInstance`（即 `FormInstance`）。

---

## 页面容器

`CkPageContainer` + `CkPageContent` 是一组页面骨架组件：前者负责铺满父级并承担滚动，后者负责「标题栏 + 内容区」的两段式布局。

```vue
<template>
  <CkPageContainer>
    <!-- 列表页：标题在左，工具栏通过 #header 插槽放在右侧 -->
    <CkPageContent v-if="!current" title="资产列表">
      <template #header>
        <el-input
          v-model="keyword"
          placeholder="按名称搜索"
          style="width: 220px"
        />
      </template>
      <el-table :data="list" @row-click="handleView" />
    </CkPageContent>

    <!-- 详情页：show-back 渲染内置返回箭头，点击后回到列表 -->
    <CkPageContent
      v-else
      :title="`资产详情 - ${current.name}`"
      show-back
      body-class="flex-column row-gap-10"
      @back-click="handleBack"
    >
      <asset-detail :asset="current" />
    </CkPageContent>
  </CkPageContainer>
</template>
```

### CkPageContent 属性

| 属性         | 类型               | 默认值  | 说明                                                       |
| ------------ | ------------------ | ------- | ---------------------------------------------------------- |
| `showBack`   | `boolean`          | `false` | 是否显示返回按钮                                           |
| `title`      | `string`           | `''`    | 标题文案；与 `header` 插槽并存时标题在左、插槽内容在右     |
| `bodyClass`  | `string`           | `''`    | 内容区的额外 class，用于叠加工具类（如 `flex-column`）     |
| `fullHeight` | `boolean`          | `true`  | 内容区是否撑满父元素高度；为 `true` 时忽略 `height`        |
| `width`      | `string \| number` | `''`    | 内容区宽度，数字按 `px` 处理，也可传 `'100%'`              |
| `height`     | `string \| number` | `''`    | 内容区高度，数字按 `px` 处理；仅在 `fullHeight=false` 生效 |

事件：`backClick` —— 点击返回按钮（或聚焦后按回车）时触发。

### 插槽

| 插槽        | 说明                                                             |
| ----------- | ---------------------------------------------------------------- |
| `default`   | 内容区；不传则不渲染内容区 DOM                                   |
| `header`    | 标题栏右侧区域，可单独驱动头部渲染（不传 `title`/`showBack` 时） |
| `back-icon` | 返回按钮图标，默认渲染 Element Plus 的 `ArrowLeft`               |

`back-icon` 存在时**完全接管**图标区域，可用于换成其他图标集或自定义 SVG：

```vue
<CkPageContent title="详情" show-back>
  <template #back-icon>
    <ElIcon><Back /></ElIcon>
  </template>
</CkPageContent>
```

### 布局约定

页面容器依赖于父级存在**确定高度**，`height: 100%` 才有参照：

```scss
.app-main {
  flex: 1;
  min-height: 0; // flex 子项默认 min-height:auto，不置 0 会撑破容器
  overflow: auto;
}
```

`CkPageContainer` 自身 `overflow: auto`，`CkPageContent` 的内容区 `flex: 1` 且自适应滚动，嵌套使用时无需再手写高度。

### 关于玻璃拟态

这两个组件**不包含**半透明蒙层、`backdrop-filter` 背景模糊、大范围柔光阴影等玻璃拟态样式，也**不读取宿主自定义变量**（如 `--glass-filter`）。底色与描边全部走 Element Plus 主题变量：

| 用途     | 变量                        |
| -------- | --------------------------- |
| 页面底色 | `--el-bg-color-page`        |
| 标题栏底 | `--el-bg-color`             |
| 描边     | `--el-border-color-lighter` |
| 文字     | `--el-text-color-primary`   |
| 返回高亮 | `--el-color-primary`        |

需要玻璃效果时，由宿主在外部覆盖（例如 `:deep(.page-content-header)` 加 `backdrop-filter`），组件库不预设视觉风格。

---

## 全局配置：表单项

`CkConfigProvider` 向整棵组件树注入表单项的全局配置，子组件无需逐个透传即可统一生效。

```vue
<template>
  <CkConfigProvider
    :form="{
      labelWidth: '100px',
      labelPosition: 'right',
      itemMinWidth: '200px',
      itemMaxWidth: '400px',
    }"
  >
    <router-view />
  </CkConfigProvider>
</template>
```

优先级：**组件显式传入 > `CkConfigProvider` 注入 > 组件默认值**。在 `CkFormContainer` / `CkFormItem` 上显式传对应 prop 即可覆盖全局配置。

| 配置项          | 说明                                                      |
| --------------- | --------------------------------------------------------- |
| `vertical`      | 是否垂直布局（仅影响 `CkFormContainer` 的直接子元素排列） |
| `labelWidth`    | 标签宽度                                                  |
| `labelPosition` | 标签对齐方式（`left` / `right` / `top`）                  |
| `itemMinWidth`  | 表单项最小宽度                                            |
| `itemMaxWidth`  | 表单项最大宽度                                            |

`CkConfigProvider` 本身就是一个 `el-config-provider`，其余属性（`size`、`locale`、`zIndex` 等）会原样透传。

---

## 工具函数与类型

组件库内部的公共工具同样对外导出，全部为无副作用纯函数：

```ts
import {
  withInstall,
  toSizeValue,
  isObject,
  isArray,
  isNull,
  isUndefined,
  pickEntryProps,
  omitEntryProps,
  filterNullishProps,
  defineProp,
  hasProp,
  jsonParse,
  getPropsDefaultValue,
  getRefExpose,
  handleProvideValue,
  handleInjectValue,
  isSizeValue,
  isNumber,
  isString,
  isBoolean,
  isBigInt,
  isFunction,
  isInstanceOf,
} from 'ep-container-kit';
```

常量与 InjectionKey：

```ts
import {
  CONTAINER_PREFIX, // 'Ck'
  getComponentName,
  FORM_PROVIDER,
  FORM_CONTAINER_PROVIDE_KEY_LIST,
  CHANGE_EVENT,
  UPDATE_MODEL_EVENT,
  INPUT_EVENT,
  CONFIRM_EVENT,
  SUCCESS_EVENT,
} from 'ep-container-kit';
```

类型：

```ts
import type {
  FormContainerItem, // 20 个成员的判别联合
  FormContainerProps,
  FormContainerInstance,
  FormContainerEmits,
  FormItemBase,
  FormItemProps,
  FormItemSchemaProps,
  ConfigProviderProps,
  ConfigProviderProvide,
  FormContainerProvideConfig,
  AnyRecord,
  AnyValue,
  Arrayable,
  ValueOfRecord,
  EmitsToTuples,
} from 'ep-container-kit';
```

Schema 类型支持泛型，`prop` 会被约束为业务数据类型的键：

```ts
type UserForm = { username: string; role: string };

const schema: FormContainerItem<UserForm>[] = [
  { prop: 'username', label: '用户名', type: 'input' },
  // { prop: 'name', ... }  // 编译期报错：'name' 不在 UserForm 中
];
```

---

## 目录结构

本仓库是 pnpm workspace monorepo，内部包全部 `private`，**只有 `packages/ep-container-kit` 会被发布**。

```text
ep-container-kit/
├── packages/
│   ├── components/            # @ep-container-kit/components（组件实现）
│   │   ├── config-provider/
│   │   ├── form-container/
│   │   ├── page-container/    # CkPageContainer + CkPageContent
│   │   └── index.ts
│   ├── constants/             # @ep-container-kit/constants（常量、InjectionKey）
│   ├── types/                 # @ep-container-kit/types（公共类型）
│   ├── utils/                 # @ep-container-kit/utils（运行时工具）
│   ├── styles/                # @ep-container-kit/styles（布局工具类、动画）
│   └── ep-container-kit/      # ep-container-kit（唯一发布包，库模式构建）
│       ├── index.ts
│       ├── vite.config.ts
│       └── dist/
├── example/                   # @ep-container-kit/example（演示与调试，不发布）
│   └── src/views/             # FormDemo.vue / PageDemo.vue
├── tsconfig.json
├── tsconfig.node.json
└── pnpm-workspace.yaml
```

### 路径约定

与 Element Plus 一致：

- **包内引用用相对路径**，且省略 `.ts` 扩展名（`.vue` 保留）：`import { isObject } from './types'`
- **跨包引用用包名**：`import { withInstall } from '@ep-container-kit/utils'`
- 解析分两层：pnpm workspace 软链（`node_modules/@ep-container-kit/*`）为主，`tsconfig.json` 的 `paths` 仅为 `pnpm install` 之前的编辑器兜底
- 不再需要 `vite.config.ts` 里的 `resolve.alias`——包名即真相，改目录/改名不会断链

包依赖是单向 DAG，无循环：

```text
types ← constants ← utils ← components ← ep-container-kit
```

---

## 本地开发

```bash
pnpm install

pnpm dev         # 启动 example（http://localhost:5173）
pnpm type-check  # vue-tsc + tsc 双项目类型检查
pnpm lint        # oxlint + eslint --fix
pnpm format      # prettier
pnpm test:unit   # vitest（example/src/**/__tests__）
pnpm build       # 构建组件库到 packages/ep-container-kit/dist
```

`example/vite.config.ts` 把 `ep-container-kit` 别名指向源码，所以改组件源码无需先 build 即可热更新。

> **测试环境注意**：`example/vitest.config.ts` 里对 `element-plus` 与 `async-validator` 配置了
> `server.deps.inline`。二者默认会被 vitest 外部化交给 Node 加载，而 element-plus 内部
> `import AsyncValidator from 'async-validator'` 会拿到 CJS 的 `{ default: fn }` 对象而非构造函数，
> `new AsyncValidator()` 抛错后被吞掉，表现为 `form.validate()` 永远 resolve 成 `true`、
> 校验失败用例静默通过。新增测试依赖时若遇到类似"断言不生效"，优先检查这里。

### 构建产物

```text
packages/ep-container-kit/dist/
├── index.mjs   # ESM
├── index.cjs   # CJS
├── index.d.ts  # 单文件类型声明（已内联全部内部类型，无 @ep-container-kit/* 泄漏）
└── index.css   # 组件样式 + 工具类
```

### 发布

```bash
pnpm build
cd packages/ep-container-kit
npm publish        # publishConfig.access = public
```

`prepublishOnly` 已挂 `pnpm build`，即使跳过手动 build，发布前也会自动构建一次。

`files` 仅包含 `dist`、`README.md`、`LICENSE`。`vue`、`element-plus`、`@element-plus/icons-vue` 为 peerDependencies，不会被打入产物。

---

## 后续规划

| 模块       | 组件                                                                    | 状态      |
| ---------- | ----------------------------------------------------------------------- | --------- |
| Form       | `CkConfigProvider`、`CkFormContainer`、`CkFormItem`、`CkFormItemSchema` | ✅ 已实现 |
| Page       | `CkPageContainer`、`CkPageContent`                                      | ✅ 已实现 |
| Table      | `CkTableContainer`、`CkTableColumn`、`CkTableColumnSchema`              | 🚧 规划中 |
| Pagination | `CkPaginationContainer`                                                 | 🚧 规划中 |
| Tree       | `CkTreeContainer`、`CkTreeSelect`                                       | 🚧 规划中 |
| Detail     | `CkDetailContainer`、`CkDetailItem`、`CkDetailItemSchema`               | 🚧 规划中 |

样式模块拆分（`table.css` / `tree.css` / `detail.css`）随对应组件一并落地。

---

## 常见问题

**Q：样式没生效怎么办？**

确认已引入 `ep-container-kit/dist/index.css`，同时确认 Element Plus 自身的样式也已引入。`col` 占列依赖 `index.css` 里的 `column-N` 工具类。

**Q：`defineProps` 为什么是运行时声明而不是类型声明？**

`FormItemProps` 是 20 个成员的判别联合，`defineProps<T>()` 要求 `@vue/compiler-sfc` 在构建期把它翻译成运行时 props，解析该联合会无限递归（`RangeError: Maximum call stack size exceeded`）。因此 `CkFormItem` / `CkFormItemSchema` 显式声明运行时 props，再断言回类型，对外暴露的 Schema 类型不受影响。

**Q：为什么 `class` 和事件落在了内层 `el-form-item` 上？**

`CkFormItem` / `CkFormItemSchema` 关闭了属性自动继承（根节点是动态 component，没有天然的透传目标），改为把 `class`、`style`、事件、原生属性手动合并到内部 `el-form-item` 的 props 上，行为与直接写 Element Plus 一致。`CkFormContainer` 也关闭了自动继承：它的 `$attrs` 里可能混着 `:model` 这类与内部绑定重名的属性，自动继承的合并顺序由 Vue 运行时决定、`$attrs` 会覆盖显式绑定，所以改为手动按 `$attrs` → `el-form` 白名单 props → `:model="v-model 的值"` 的顺序绑定，数据源始终以 `v-model` 为准。

**Q：`CkFormContainer` 的默认插槽会覆盖 schema 渲染吗？**

会。`<slot>` 的内容优先于 schema：传了默认插槽就完全由你接管渲染，`schema` 只在没有默认插槽时生效。

**Q：和 Element Plus 版本升级冲突吗？**

本库只使用 Element Plus 公开的组件与类型导出，不侵入内部实现。小版本升级通常无需改动，大版本请留意其 Breaking Changes。

---

## 贡献

提交 PR 前请确认：`pnpm type-check`、`pnpm lint`、`pnpm test:unit`、`pnpm build` 全部通过。

---

## 许可证

[MIT](./LICENSE)

---

## 声明

本项目是基于 Element Plus 生态的第三方容器组件封装，与 Element Plus 官方团队**无任何隶属或合作关系**。项目名称中的 `ep` 为社区通用缩写，不构成对任何商标的使用主张。

Element Plus 版权归其作者及贡献者所有，遵循 [MIT License](https://github.com/element-plus/element-plus/blob/dev/LICENSE)。
