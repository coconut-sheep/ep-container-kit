<div align="center">

# ep-container-kit

**基于 Element Plus 的中后台容器组件套件**

[![npm version](https://img.shields.io/npm/v/ep-container-kit.svg)](https://www.npmjs.com/package/ep-container-kit)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![vue](https://img.shields.io/badge/vue-3.4%2B-42b883.svg)](https://vuejs.org)
[![element-plus](https://img.shields.io/badge/element--plus-2.7%2B-409eff.svg)](https://element-plus.org)
[![typescript](https://img.shields.io/badge/types-TypeScript-3178c6.svg)](https://www.typescriptlang.org)

Schema 驱动的 **Form / Table / Tree / Detail** 四大类容器组件，让中后台页面少写一半模板代码。

*A schema-driven container component kit built on Element Plus.*

</div>

---

## 简介

`ep-container-kit` 不是又一套基础 UI 库，而是架在 Element Plus 之上的**容器层封装**。

Element Plus 提供的是一块块"砖"：`el-form`、`el-table`、`el-tree`、`el-descriptions`。但在真实的中后台项目里，我们反复要做的其实是把这些砖按业务规范拼成一个"房间"——表单要有统一的标签宽度和按钮区，表格要有高度自适应、工具栏和分页，树要有过滤框和滚动处理，详情页要有键值对布局和字典翻译。每个项目都在重复拼一遍，每个项目拼出来的还不一样。

`ep-container-kit` 把这件事收敛成一套**容器组件 + Schema 配置**：

- 容器组件负责**布局与通用行为**（高度、分页、滚动、插槽位置、交互规范）；
- Schema 负责**描述字段**（渲染什么组件、显示什么标签、如何校验、如何联动）；
- 原生组件的能力**全部透传**，不阉割、不黑盒。

一条核心原则贯穿始终：**只做加法，不做替代。** 你依然直接使用 `el-input`、`el-table`、`el-tree`，`ep-container-kit` 负责把它们组织好。

---

## 为什么需要它

| 直接使用 Element Plus 的常见问题 | `ep-container-kit` 的处理方式 |
| --- | --- |
| 每个页面重复写 `label-width`、按钮区、校验触发时机 | 由 `FormContainer` 统一接管，Schema 只描述字段 |
| 表格高度算不准，滚动条出现在错误的位置 | `TableContainer` 只负责高度计算与布局，`el-table` 由你通过插槽传入 |
| `el-table-column` 写几十行，改一个字段要改多处 | `TableColumn` 支持单条 Schema 配置，列定义数据化 |
| 详情页键值对布局靠手写 `el-row`/`el-col` | `DetailContainer` 提供网格布局配置，`DetailItem` 负责单条键值对 |
| 字典/枚举值到处写 `map` 手动翻译 | 全局注入字典解析方法，`DetailItem` 自动翻译，支持局部覆盖 |
| 树数据一次全量加载，节点多了卡死 | `TreeContainer` / `TreeSelect` 支持**非叶子节点级分页加载** |
| 分页组件放进下拉弹层后层级、定位异常 | `PaginationContainer` 已适配在 `ElTreeSelect` 等 popper 容器内的渲染 |
| 全量引入样式，包里塞了一堆用不到的 CSS | 样式产物**按模块拆分**，可以只引入用到的模块 |

---

## 特性

- **容器化封装**：布局职责收敛到容器组件，内容渲染交给插槽和原生组件。
- **Schema 配置驱动**：表单、表格列、详情项均可用一份配置描述，配合泛型获得完整类型提示。
- **原生能力全透传**：所有组件的 `props` / `events` / `slots` 批量透传，Element Plus 能写的这里都能写。
- **三级字典解析优先级**：单个组件传入 > 全局注入 > 内置默认值，兼顾全局统一与局部灵活。
- **树节点级分页加载**：在非叶子节点上按页加载子节点，避免一次性拉取整棵树。
- **弹层内可用的分页**：分页组件可在 `ElTreeSelect`、`ElSelect` 等 popper 场景下正常渲染与交互。
- **样式按模块输出**：`form` / `table` / `tree` / `detail` 各自独立，支持按需引入。
- **源码复制友好**：内部引用统一走 `@ep-container-kit` 别名，复制到任意目录、改任意名字都不会断链。

---

## 组件总览

组件按业务场景分为四类，共 11 个：

### Form · 表单

| 组件 | 说明 |
| --- | --- |
| `FormContainer` | `ElForm` 的轻量封装，支持直接传入 Schema 配置生成整表单 |
| `FormItem` | `ElFormItem` 的轻量封装，支持单条 SchemaItem 配置 |
| `FormItemSchema` | `FormItem` 的 Schema 实现与类型定义 |

### Table · 表格

| 组件 | 说明 |
| --- | --- |
| `TableContainer` | 表格容器，提供分页插槽与默认内容槽，统一处理内部 `ElTable` 的高度 |
| `TableColumn` | `ElTableColumn` 的轻量封装，支持单条 SchemaItem 配置 |
| `TableColumnSchema` | `TableColumn` 的 Schema 实现与类型定义 |
| `PaginationContainer` | 分页组件的轻量封装，支持在 Select / TreeSelect 的 popper 中使用 |

### Tree · 树

| 组件 | 说明 |
| --- | --- |
| `TreeContainer` | 树容器，内置过滤输入框与内容插槽，统一处理树的滚动 |
| `TreeSelect` | 在 `ElTreeSelect` 基础上整合 `PaginationContainer`，支持树的分页查询 |

### Detail · 详情

| 组件 | 说明 |
| --- | --- |
| `DetailContainer` | 键值对容器，提供标题与内容插槽，支持 Schema 配置与子元素布局 |
| `DetailItem` | 单个键值对，支持枚举/字典翻译、文本省略、标题与内容插槽 |
| `DetailItemSchema` | `DetailItem` 的 Schema 实现与类型定义 |

---

## 快速开始

### 环境要求

| 依赖 | 版本 |
| --- | --- |
| Vue | >= 3.4 |
| Element Plus | >= 2.7 |
| Node.js | >= 18（推荐 20+） |
| 构建工具 | Vite 4+ / Webpack 5+ |

### 安装

```bash
# npm
npm install ep-container-kit

# pnpm
pnpm add ep-container-kit

# yarn
yarn add ep-container-kit
```

### 全量引入

```ts
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import EpContainerKit from 'ep-container-kit'
import 'ep-container-kit/dist/style.css'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(EpContainerKit)
app.mount('#app')
```

### 按需引入

组件与样式均支持按需引入，只引入用到的模块：

```ts
import { FormContainer, FormItem, TableContainer, PaginationContainer } from 'ep-container-kit'
import 'ep-container-kit/dist/form.css'
import 'ep-container-kit/dist/table.css'
```

配合 `unplugin-vue-components` 使用时，样式引入以构建产物中的模块化 CSS 为准。若只使用表格相关能力，就只引入 `table.css`；只使用详情页，就只引入 `detail.css`。

### 样式模块划分

样式产物按模块拆分，互不牵连：

| 模块 | 样式文件 | 覆盖的组件 |
| --- | --- | --- |
| Form | `ep-container-kit/dist/form.css` | `FormContainer`、`FormItem` |
| Table | `ep-container-kit/dist/table.css` | `TableContainer`、`TableColumn`、`PaginationContainer` |
| Tree | `ep-container-kit/dist/tree.css` | `TreeContainer`、`TreeSelect` |
| Detail | `ep-container-kit/dist/detail.css` | `DetailContainer`、`DetailItem` |

---

## 源码复制集成

如果你希望直接把源码放进项目里改，而不是通过包管理器安装，请按下面三步操作。**组件库内部所有引用都基于 `@ep-container-kit` 别名，因此复制到任何目录、改成任何名字都不会断链。**

### 第一步：复制目录

把仓库的 `packages` 目录整体复制到你的项目中，位置随意，文件夹名也随意改。例如放在 `package`：

```text
your-project/
├── src/
│   ├── libs/
│   │   └── ep-container-kit/     <-- 整个 packages 目录复制到这里
│   │       ├── components/
│   │       ├── utils/
│   │       ├── styles/
│   │       └── index.ts
│   ├── App.vue
│   └── main.ts
```

注意是**整体复制**，不要只挑选其中几个文件夹拆开放，否则内部相对层级会错乱。

### 第二步：配置别名

在你的 `vite.config.ts` 里新增一条专属别名，指向复制进来的目录。**不要动你原有的 `@` 别名**，两者互不影响。

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),                      // 你原有的配置，保持不变
      '@ep-container-kit': path.resolve(__dirname, 'example/libs/ep-container-kit'), // 新增
    },
  },
})
```

### 第三步：配置 TypeScript 路径

在 `tsconfig.json` 中补上对应的路径映射，这样才能获得类型提示和跳转：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["example/*"],
      "@ep-container-kit/*": ["example/libs/ep-container-kit/*"]
    }
  }
}
```

配置完成后，重启一下编辑器的 TypeScript 服务，智能提示即刻生效。

### 使用

```ts
import EpContainerKit, { FormContainer } from '@ep-container-kit'
import '@ep-container-kit/styles/form.scss'
```

> **升级提示**：如果你之后把文件夹改了名字（比如从 `ep-container-kit` 改成别的），只需同步改一下 `vite.config.ts` 和 `tsconfig.json` 里的别名指向，源码内部不需要任何改动。

---

## 核心概念：Schema 驱动

四大类组件共享一套 Schema 设计思路：**用数据描述界面**。Schema 中的每个字段负责表达"这一项是什么、怎么显示、怎么交互"，而布局和通用行为交给容器。

一个 Form 的 Schema 长这样：

```ts
import type { FormItemSchema } from 'ep-container-kit'

const schema: FormItemSchema<UserForm>[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'input',
    componentProps: { placeholder: '请输入用户名', clearable: true },
    rules: [{ required: true, message: '用户名不能为空' }],
  },
  {
    field: 'role',
    label: '角色',
    component: 'select',
    options: roleOptions,
    show: (form) => form.type !== 'internal',   // 动态显隐
  },
]
```

设计上遵循两条边界：

1. **Schema 只收录高频变化的配置**，其余原生属性通过 `componentProps` 原样透传，避免 Schema 无限膨胀。
2. **动态逻辑用函数表达**，而不是拼字符串表达式，写起来就是普通的 TypeScript，能享受类型检查。

---

## 模块用法

### Form

`FormContainer` 接收整份 Schema 并渲染表单，`FormItem` 可以脱离容器单独使用。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FormContainer } from 'ep-container-kit'
import type { FormItemSchema } from 'ep-container-kit'

const formData = ref({ username: '', role: '' })

const schema: FormItemSchema[] = [
  { field: 'username', label: '用户名', component: 'input' },
  { field: 'role', label: '角色', component: 'select', options: roleOptions },
]

const submit = async () => {
  // 表单校验与提交逻辑
}
</script>

<template>
  <FormContainer
    v-model="formData"
    :schema="schema"
    label-width="100px"
    @submit="submit"
  >
    <!-- 插槽用于放置自定义按钮区等容器之外的扩展内容 -->
    <template #actions>
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="formData = { username: '', role: '' }">重置</el-button>
    </template>
  </FormContainer>
</template>
```

单独使用 `FormItem`：

```vue
<FormItem v-model="formData.username" :schema="schema[0]" />
```

表单内控件需要的具名插槽（`prefix`、`suffix` 等）会被批量透传，直接写在 `FormItem` 上即可生效。

### Table

`TableContainer` 只负责布局：高度计算、工具栏与分页插槽的位置。**它不直接渲染 `el-table`**，具体用原生表格还是虚拟表格，由你通过默认插槽决定。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TableContainer, TableColumn, PaginationContainer } from 'ep-container-kit'

const list = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
</script>

<template>
  <TableContainer
    :loading="loading"
    :total="total"
    v-model:page="page"
    v-model:page-size="pageSize"
    @page-change="fetchList"
  >
    <template #toolbar>
      <el-button type="primary" @click="openCreate">新建</el-button>
    </template>

    <!-- 默认插槽：表格由使用者决定，虚拟表格同样适用 -->
    <template #default="{ height }">
      <el-table :data="list" :height="height" v-loading="loading">
        <TableColumn prop="name" label="名称" />
        <TableColumn prop="status" label="状态" :schema="statusColumnSchema" />
        <TableColumn prop="createdAt" label="创建时间" sortable />
      </el-table>
    </template>

    <template #pagination>
      <PaginationContainer v-model:page="page" v-model:page-size="pageSize" :total="total" />
    </template>
  </TableContainer>
</template>
```

想换成虚拟表格，只需把默认插槽里的 `el-table` 换成 `el-table-v2`，容器侧不用改任何东西。

### Tree

`TreeContainer` 内置过滤输入框和滚动处理；`TreeSelect` 在其基础上整合分页，支持**按非叶子节点分页加载子节点**，避免一次性加载整棵树。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TreeContainer } from 'ep-container-kit'

const treeData = ref([])
const props = { label: 'name', children: 'children' }

// 展开非叶子节点时触发，按页加载该节点的子节点
const loadNode = async (node, resolve) => {
  const { list, total } = await fetchChildren({ parentId: node.data.id, page: 1 })
  resolve(list)
  // 剩余节点按分页继续加载
}
</script>

<template>
  <TreeContainer
    :data="treeData"
    :props="props"
    :load="loadNode"
    filterable
    lazy
    show-checkbox
  />
</template>
```

作为选择器使用：

```vue
<TreeSelect
  v-model="selectedId"
  :data="treeData"
  :load="loadNode"
  :props="props"
  clearable
  filterable
/>
```

分页组件在 `TreeSelect` 的 popper 内可以正常渲染和交互，不会出现层级或定位错乱。

### Detail

`DetailContainer` 负责键值对的整体布局，`DetailItem` 负责单条数据的展示。

```vue
<script setup lang="ts">
import { DetailContainer } from 'ep-container-kit'
import type { DetailItemSchema } from 'ep-container-kit'

const data = ref({ name: '张三', status: 1, createdAt: '2026-10-18' })

const schema: DetailItemSchema[] = [
  { field: 'name', label: '姓名' },
  { field: 'status', label: '状态', dict: 'user_status' },     // 字典翻译
  { field: 'createdAt', label: '创建时间', ellipsis: true },
]
</script>

<template>
  <DetailContainer
    :schema="schema"
    :data="data"
    title="基本信息"
    :column="3"
    layout="grid"
  />
</template>
```

单独使用 `DetailItem`：

```vue
<DetailItem label="状态" :value="1" dict="user_status" />
```

`DetailItem` 会自动把字典值翻译成对应的显示文案，并对长文本做省略处理。需要完全自定义渲染时，用插槽接管：

```vue
<DetailItem label="状态" :value="data.status">
  <template #content="{ value, dictItem }">
    <el-tag :type="dictItem?.type">{{ dictItem?.label }}</el-tag>
  </template>
</DetailItem>
```

---

## 全局配置：字典与枚举

`DetailItem` 这类组件需要把字典值（如 `1`）翻译成可读文案（如"启用"）。翻译逻辑支持**三级优先级**：

```text
单个组件传入的解析方法  >  全局注入的解析方法  >  组件内置默认行为
```

### 方式一：应用启动时注入

```ts
// main.ts
import { createApp } from 'vue'
import EpContainerKit from 'ep-container-kit'

const app = createApp(App)

app.use(EpContainerKit, {
  dict: {
    // 根据字典类型与值返回展示对象
    getDictItem: (dictType, value) => {
      return dictMap[dictType]?.find((item) => item.value === value)
    },
  },
})
```

### 方式二：使用配置组件

```vue
<script setup lang="ts">
import { ContainerKitConfig } from 'ep-container-kit'

const getDictItem = (dictType: string, value: unknown) => {
  return dictMap[dictType]?.find((item) => item.value === value)
}
</script>

<template>
  <ContainerKitConfig :dict-formatter="getDictItem">
    <router-view />
  </ContainerKitConfig>
</template>
```

### 方式三：单个组件局部覆盖

```vue
<DetailItem
  label="状态"
  :value="data.status"
  :dict-formatter="(value) => customMap[value] ?? '-'"
/>
```

局部传入的解析方法优先级最高，适合个别字段需要特殊处理的场景。全局未配置时，组件会退回到默认行为（直接展示原始值），不会报错。

---

## 工具函数

组件库内部的公共工具函数同样对外导出，可以与组件一起使用：

```ts
import { formatDate, deepClone } from 'ep-container-kit'
```

工具函数全部为无副作用的纯函数，通过 ESM 导出，未使用的部分会被 Tree Shaking 移除。相关类型也已一并导出：

```ts
import type { DateFormatOptions } from 'ep-container-kit'
```

---

## 类型支持

组件完全使用 TypeScript 编写，`props`、事件与插槽均有类型定义：

```ts
import type {
  FormItemSchema,
  TableColumnSchema,
  DetailItemSchema,
  FormContainerProps,
} from 'ep-container-kit'
```

Schema 类型支持泛型，传入业务数据类型后，`field` 字段会被约束为该类型的键：

```ts
interface UserForm {
  username: string
  role: string
}

// field 只能填 username 或 role，写错会直接报错
const schema: FormItemSchema<UserForm>[] = [
  { field: 'username', label: '用户名', component: 'input' },
]
```

---

## 项目结构

```text
ep-container-kit/
├── packages/
│   ├── components/
│   │   ├── form/
│   │   │   ├── FormContainer/
│   │   │   ├── FormItem/
│   │   │   └── FormItemSchema/
│   │   ├── table/
│   │   │   ├── TableContainer/
│   │   │   ├── TableColumn/
│   │   │   ├── TableColumnSchema/
│   │   │   └── PaginationContainer/
│   │   ├── tree/
│   │   │   ├── TreeContainer/
│   │   │   └── TreeSelect/
│   │   └── detail/
│   │       ├── DetailContainer/
│   │       ├── DetailItem/
│   │       └── DetailItemSchema/
│   ├── styles/          # 全局样式与 CSS 变量
│   ├── utils/           # 纯函数工具
│   └── index.ts         # 库总入口
├── examples/            # 本地开发调试
├── docs/                # 文档站点
└── vite.config.ts
```

---

## 常见问题

**Q：样式没生效怎么办？**

确认已引入样式文件。全量引入用 `ep-container-kit/dist/style.css`，按需引入则引入对应模块，如 `ep-container-kit/dist/table.css`。同时确认 Element Plus 自身的样式也已经引入。

**Q：为什么传进去的 `class` 和事件看起来挂到了外层容器上？**

本库所有组件都关闭了属性自动继承，并手动把属性透传给内部的 Element Plus 组件，因此 `class`、`style`、事件、原生属性都会直接作用到真正的 `el-*` 节点上，行为和直接使用 Element Plus 一致。

**Q：`TableContainer` 为什么不自带表格？**

因为表格的技术选型差异很大。把表格交给使用者通过插槽传入，你可以在原生 `el-table` 和 `el-table-v2`（虚拟滚动）之间自由切换，容器层不需要跟着改。

**Q：树的分页是怎么工作的？**

分页发生在**非叶子节点**层面：展开某个节点时，按页加载它的直接子节点。这样既能避免一次性拉取整棵树，又不会切断父子层级关系。

**Q：想同时用两套别名（旧的和新的）可以吗？**

可以。在 `vite.config.ts` 中把两个别名都指向同一个目录即可，旧代码不用动，新代码逐步迁移。

```ts
resolve: {
  alias: {
    '@ep-container-kit': path.resolve(__dirname, 'example/libs/ep-container-kit'),
    '@your-old-alias': path.resolve(__dirname, 'example/libs/ep-container-kit'),
  },
}
```

**Q：和 Element Plus 版本升级冲突吗？**

本库只依赖 Element Plus 公开的组件与类型导出，不做内部实现侵入。升级 Element Plus 小版本通常无需改动，大版本升级请留意 `Breaking Changes`。

---

## 贡献

欢迎提交 Issue 与 Pull Request。

```bash
# 安装依赖
pnpm install

# 启动本地调试
pnpm dev

# 构建产物
pnpm build

# 启动文档站点
pnpm docs:dev
```

提交 PR 前请确认：本地调试通过、类型检查无报错、涉及行为变更的部分已同步更新文档。

---

## 许可证

[MIT](./LICENSE)

---

## 声明

本项目是基于 Element Plus 生态的第三方容器组件封装，与 Element Plus 官方团队**无任何隶属或合作关系**。项目名称中的 `ep` 为社区通用缩写，不构成对任何商标的使用主张。

Element Plus 版权归其作者及贡献者所有，遵循 [MIT License](https://github.com/element-plus/element-plus/blob/dev/LICENSE)。

