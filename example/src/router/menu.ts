import { markRaw, type Component } from 'vue';
import {
  Document,
  Files,
  Grid,
  MoreFilled,
  Setting,
} from '@element-plus/icons-vue';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 菜单叶子节点，与路由一一对应
 */
export interface DemoMenuItem {
  /** 路由路径，同时作为 `el-menu-item` 的 index */
  path: string;
  /** 中文名称，用于菜单与面包屑 */
  title: string;
  /** 组件名，按库内实际的 kebab 命名展示，保持 form > form-container 这样的层级 */
  name: string;
  /** 视图组件，统一懒加载 */
  component: NonNullable<RouteRecordRaw['component']>;
}

/**
 * 菜单分组，对应组件的一个域
 */
export interface DemoMenuGroup {
  /** 分组标识，同时作为 `el-sub-menu` 的 index */
  index: string;
  title: string;
  icon: Component;
  items: DemoMenuItem[];
}

/**
 * 示例站点的菜单树
 * @description 路由表由它派生（见 `router/index.ts`），菜单与路由不会各写一份而漂移
 */
export const demoMenuGroups: DemoMenuGroup[] = [
  {
    index: 'form',
    title: '表单',
    icon: markRaw(Document),
    items: [
      {
        path: '/form/form-container',
        title: '表单容器',
        name: 'form-container',
        component: () => import('@/views/form/FormContainerView.vue'),
      },
      {
        path: '/form/form-item',
        title: '表单项',
        name: 'form-item',
        component: () => import('@/views/form/FormItemView.vue'),
      },
      {
        path: '/form/form-item-schema',
        title: 'Schema 表单项',
        name: 'form-item-schema',
        component: () => import('@/views/form/FormItemSchemaView.vue'),
      },
    ],
  },
  {
    index: 'page',
    title: '页面',
    icon: markRaw(Files),
    items: [
      {
        path: '/page/page-container',
        title: '页面容器',
        name: 'page-container',
        component: () => import('@/views/page/PageContainerView.vue'),
      },
      {
        path: '/page/page-content',
        title: '页面内容',
        name: 'page-content',
        component: () => import('@/views/page/PageContentView.vue'),
      },
    ],
  },
  {
    index: 'pagination',
    title: '分页',
    icon: markRaw(MoreFilled),
    items: [
      {
        path: '/pagination/pagination',
        title: '分页器',
        name: 'pagination',
        component: () => import('@/views/pagination/PaginationView.vue'),
      },
    ],
  },
  {
    index: 'table',
    title: '表格',
    icon: markRaw(Grid),
    items: [
      {
        path: '/table/table-container',
        title: '表格容器',
        name: 'table-container',
        component: () => import('@/views/table/TableContainerView.vue'),
      },
      {
        path: '/table/table-column-schema',
        title: '列 Schema',
        name: 'table-column-schema',
        component: () => import('@/views/table/TableColumnSchemaView.vue'),
      },
    ],
  },
  {
    index: 'config',
    title: '全局配置',
    icon: markRaw(Setting),
    items: [
      {
        path: '/config/config-provider',
        title: '配置提供器',
        name: 'config-provider',
        component: () => import('@/views/config/ConfigProviderView.vue'),
      },
    ],
  },
];

/** 首页默认落到第一个菜单项 */
export const defaultMenuPath = demoMenuGroups[0]?.items[0]?.path ?? '/';
