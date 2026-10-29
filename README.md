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
| `CkPagination`     | 分页器，两套基本单元由 `compact` 切换，数据由 `v-model` 提供                                |

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

## 分页

`CkPagination` 封装 Element Plus 的分页器，把「页码 / 每页条数 / 总条数 / 布局」收敛成一个对象，由 `v-model` 进出，列表页只需要关心一处状态。

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import type { PaginationConfig } from 'ep-container-kit';
  import { CkPagination, getDefaultPaginationConfig } from 'ep-container-kit';

  const list = ref([]);
  // 从工具函数取一份初始配置，避免各处手写字段
  const pagination = ref<PaginationConfig>({
    ...getDefaultPaginationConfig(),
    pageTotal: 0,
  });

  const handleChange = async (config: PaginationConfig) => {
    // config 此时已是最新值，直接用它请求即可
    const res = await fetchList({ current: config.current });
    list.value = res.rows;
    pagination.value.pageTotal = res.total;
  };
</script>

<template>
  <el-table :data="list" />
  <CkPagination v-model="pagination" @change="handleChange" />
</template>
```

### 数据契约

`v-model` 的值为 `PaginationConfig`：

| 字段        | 类型                 | 说明                                                         |
| ----------- | -------------------- | ------------------------------------------------------------ |
| `current`   | `number`             | 当前页码，从 1 开始                                          |
| `pageSize`  | `number`             | 每页条数                                                     |
| `pageSizes` | `number[]`           | 每页条数的可选项，重复项自动去重                             |
| `pageTotal` | `number`             | 数据总条数                                                   |
| `layouts`   | `PaginationLayout[]` | 布局片段，重复项自动去重；支持 `->` 占位与 `slot` 自定义内容 |

### 属性

| 属性           | 类型      | 默认值  | 说明                                                          |
| -------------- | --------- | ------- | ------------------------------------------------------------- |
| `compact`      | `boolean` | `false` | 是否启用紧凑形态；只切换渲染单元，入参不变                    |
| `disabled`     | `boolean` | `false` | 是否禁用分页器                                                |
| `background`   | `boolean` | `true`  | 页码按钮是否带背景色                                          |
| `pagerCount`   | `number`  | `5`     | 页码按钮数量，超过则折叠为省略号，取值 5–21（偶数向上取奇数） |
| `showLoadMore` | `boolean` | `false` | 是否显示「加载更多」与「已加载 / 总数」                       |
| `loadedCount`  | `number`  | `0`     | 已加载条数，配合 `showLoadMore` 判断是否还有更多              |
| `loading`      | `boolean` | `false` | 加载中状态，「加载更多」按钮呈现 loading 且不可点击           |

事件：`change`（参数为最新 `PaginationConfig`）、`loadMore`（点击「加载更多」）。

### 两套基本单元

组件内部有两套「基本单元」：一套是 Element Plus 分页器自带的片段，一套是组件内的等义实现。`compact` 只决定**由哪一套来渲染**——两套消费完全相同的入参，同一份 `PaginationConfig`、同一份 `layouts`，片段名、顺序与含义一一对应：

| 片段     | 非紧凑（Element Plus 单元）  | 紧凑（自研单元）             |
| -------- | ---------------------------- | ---------------------------- |
| `total`  | `Total 100`                  | 同左，跟随 Element Plus 语言 |
| `sizes`  | 每页条数下拉框               | `− 10 条/页 +` 步进器        |
| `prev`   | 上一页图标按钮               | 同左                         |
| `pager`  | 页码 + 折叠省略号            | 同样的折叠规则，尺寸更小     |
| `next`   | 下一页图标按钮               | 同左                         |
| `jumper` | 前往 N 页                    | 同左，输入框更窄             |
| `slot`   | 加载更多 / 已加载 / `#extra` | 同左                         |
| `->`     | 撑开两侧                     | 同左                         |

所以「换形态」不涉及任何参数改写，加一个 `compact` 就够了：

```vue
<!-- 列表页底部：完整分页条 -->
<CkPagination v-model="pagination" @change="fetchList" />

<!-- 下拉面板：同一份配置，只差 compact；面板里没有翻页的位置，所以布局只留条数 -->
<CkPagination
  v-model="pagination"
  compact
  show-load-more
  :loaded-count="list.length"
  :loading="loading"
  @load-more="fetchNextPage"
  @change="resetAndFetch"
/>

<script setup lang="ts">
  const pagination = ref<PaginationConfig>({
    ...getDefaultPaginationConfig(),
    layouts: ['sizes'], // 面板里不需要页码
  });
</script>
```

`layouts` 是唯一的布局声明，两套单元都按它的顺序排布；需要内嵌内容时组件会自动补 `slot` 片段（已经写了的不重复追加），宿主不必自己拼字符串。

步进器按 `pageSizes` 的**数值顺序**移动（与下拉框的展示顺序无关），当前值不在候选列表里时也能正常增减——不存在「两端同时禁用、调不回去」的情况。

`#extra` 插槽可以往同一行里再塞自定义内容（按钮、筛选器），位置在加载更多之后：

```vue
<CkPagination
  v-model="pagination"
  compact
  :layouts="['sizes', 'prev', 'pager', 'next']"
>
  <template #extra>
    <el-button link @click="refresh">刷新</el-button>
  </template>
</CkPagination>
```

### 行为约定

- **就地写回，不派发 `update:modelValue`**：组件直接改 `v-model` 传入对象的 `current` / `pageSize`，与 `CkFormContainer` 的数据写回方式一致。父级持有的是同一个对象引用，因此 `v-model` 照常生效；需要监听变化请用 `@change` 或 `watch` 该对象本身。
- **条数变更回到第一页**：`pageSize` 改变后原页码大概率越界，统一重置 `current = 1`。下拉选择与步进器共用这一条路径。
- **`change` 在 `nextTick` 中派发**：确保回调里读到的配置已是最新值。
- **`loadMore` 只表达意图**：组件不取数，是否还有更多由 `loadedCount < pageTotal` 决定。
- **非紧凑形态直接透传属性**：`size`、`hideOnSinglePage`、`small`、`popperClass` 等未声明的属性会落到分页器根元素上，与直接写 `el-pagination` 等价。紧凑形态是自研单元，不识别这些属性，只接管 `class` 与 `style`。

布局默认右对齐、`min-height: 50px`（紧凑形态为居中、高度贴合内容）。这两项走 CSS 变量，覆盖时不必与组件样式争抢特异性：

| 变量                         | 默认值                          | 说明             |
| ---------------------------- | ------------------------------- | ---------------- |
| `--ck-pagination-justify`    | `flex-end`（紧凑形态 `center`） | 分页条的水平对齐 |
| `--ck-pagination-min-height` | `50px`（紧凑形态 `auto`）       | 分页条最小高度   |

```vue
<CkPagination
  v-model="pagination"
  style="--ck-pagination-justify: flex-start"
/>
```

---

## 全局配置：表单项

`CkConfigProvider` 向整棵组件树注入表单项的全局配置，子组件无需逐个透传即可统一生效。

```vue
<template>
  <CkConfigProvider
    :form-container="{
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
  buildComponentName,
  FORM_CONTAINER_PROVIDER,
  FORM_CONTAINER_PROVIDE_KEYS,
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
  FormContainerEmitsTuple, // 事件名 → 参数元组
  FormItemBase,
  FormItemProps,
  FormItemSchemaProps,
  ConfigProviderProps,
  ConfigProviderProvide,
  FormContainerProvideConfig,
  BaseDefaultPropsSource, // 默认值源：对象/数组成员必须是工厂函数
  BaseDefaultPropsHolder, // 占位源：只能写 undefined，交给 withDefaults
  PropsDefaultValue, // getPropsDefaultValue 的返回值：真实默认值 + 布尔占位
  AnyRecord,
  AnyValue,
  Arrayable,
  ValueOfRecord,
  EmitsToTuples, // 函数签名 → 参数元组
  TuplesToEmits, // 参数元组 → 函数签名
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

### 事件类型：元组 ↔ 函数签名

Vue 的 `defineEmits` 支持两种声明形态：**参数元组**（`{ submit: [] }`）与**函数签名**（`{ submit(): void }`）。本库统一用元组声明事件，两个方向各有一个工具类型可以互转：

```ts
import type { EmitsToTuples, TuplesToEmits } from 'ep-container-kit';

// 函数签名 → 参数元组：元组形态可直接交给 defineEmits
type Emits = {
  submit: () => void;
  validate: (prop: string, ok: boolean) => void;
};
type EmitsTuple = EmitsToTuples<Emits>; // { submit: []; validate: [prop: string, ok: boolean] }

// 参数元组 → 函数签名：用于标注监听器、组件实例方法等
type Listeners = TuplesToEmits<EmitsTuple>; // { submit: () => void; validate: (prop: string, ok: boolean) => void }
```

`FormContainerEmits` 正是这样推导出来的——`TuplesToEmits<FormContainerEmitsTuple>`。监听器用同一个工具标注，参数顺序与 emit 声明天然一致：

```ts
import type { FormContainerEmitsTuple, TuplesToEmits } from 'ep-container-kit';

type ValidateListener = TuplesToEmits<FormContainerEmitsTuple>['validate'];

const handleValidate: ValidateListener = (prop, isValid, message) => {
  // prop / isValid / message 均由元组声明推导，顺序写错会直接报错
};
```

两者都是同态映射，成员的 `?` 可选性与 JSDoc 注释会被原样保留；只需关注「元组 ↔ 函数」这一层转换，不必维护两份事件声明。

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
│   │   ├── pagination/        # CkPagination
│   │   └── index.ts
│   ├── constants/             # @ep-container-kit/constants（事件名、组件名前缀）
│   ├── types/                 # @ep-container-kit/types（公共类型）
│   ├── utils/                 # @ep-container-kit/utils（运行时工具）
│   ├── styles/                # @ep-container-kit/styles（布局工具类、动画）
│   └── ep-container-kit/      # ep-container-kit（唯一发布包，库模式构建）
│       ├── index.ts
│       ├── vite.config.ts
│       └── dist/
├── example/                   # @ep-container-kit/example（演示与调试，不发布）
│   └── src/views/             # FormDemo.vue / PageDemo.vue / PaginationDemo.vue
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

`types` 不依赖任何具体组件：provide 契约（`FormContainerProvideConfig`、`FORM_CONTAINER_PROVIDER`、`FORM_CONTAINER_PROVIDE_KEYS`）按域放在所属组件内，见 `components/form-container/src/provide.ts`。

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

**Q：为什么组件的默认值要写成工厂函数？`BaseDefaultPropsSource` 是什么？**

`withDefaults` 第二个参数的类型是 Vue 的 `InferDefaults<T>`：原始类型（`string` / `number` / `boolean` 等）允许直接写裸值，**对象与数组必须写成工厂函数**。这不是风格偏好——裸对象默认值会被所有组件实例共享，实例 A 改了它，实例 B 也会看到；工厂函数才能保证每个实例各拿一份新对象。

`BaseDefaultPropsSource<T>` 是这条规则的类型表达：按成员逐个判断，对象/数组要求工厂、原始值要求裸值，写错在编译期就会报错。占位表另有 `BaseDefaultPropsHolder<T>`，它只允许 `undefined`——占位表不承担提供默认值的职责，写死值会直接编译报错。

两个常量因此都是「源形态」，区别只在交给谁：

| 常量                             | 类型                        | 交给谁                                             | 求值时机               |
| -------------------------------- | --------------------------- | -------------------------------------------------- | ---------------------- |
| `COMPONENT_DEFAULT_PROPS_HOLDER` | `BaseDefaultPropsHolder<T>` | `withDefaults` 第二参数                            | Vue 对每个实例调用工厂 |
| `COMPONENT_DEFAULT_PROPS`        | `BaseDefaultPropsSource<T>` | 组件 `setup` 顶层调 `buildPropsDefaultValues(...)` | 每个实例各求值一次     |

**`COMPONENT_DEFAULT_PROPS` 不能在模块顶层求值**。写成 `export const COMPONENT_DEFAULT_PROPS = buildPropsDefaultValues({ ... })` 时工厂只跑一次，结果成为跨实例共享的单例，宿主或兄弟实例改动其中的对象/数组就会互相污染。正确写法是把它保留为源，在 `setup` 顶层求值：

```ts
// src/xxx.ts
export const COMPONENT_DEFAULT_PROPS: BaseDefaultPropsSource<XxxProps> = {
  rules: () => [], // 工厂原样保留，此处不求值
};

// src/xxx.vue
const defaultProps = buildPropsDefaultValues<XxxProps>(COMPONENT_DEFAULT_PROPS);
```

**Q：`COMPONENT_DEFAULT_PROPS_HOLDER` 是干什么用的？**

Vue 对 Boolean prop 的隐式缺省只在「没传入 **且** 没有声明 `default`」时补 `false`。于是「调用方没传」和「调用方传了 `false`」在组件里长得一模一样，都会以 `false` 的身份进入 `filterNullishProps` 之后的合并对象，把本应生效的默认值或上层注入值盖掉。

`COMPONENT_DEFAULT_PROPS_HOLDER` 就是给这类 prop 显式写 `default: undefined`：没传入时保持 `undefined`，被 `filterNullishProps` 过滤掉，合并时自然让位；传 `false` 时才真正覆盖。这两份值由 `getPropsDefaultValue(ElXxx.props)` 一次拆出——`defaultProps` 收真实默认值，`holderProps` 收无默认值的 Boolean 的 `undefined` 占位。

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
