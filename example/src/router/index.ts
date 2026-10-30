import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { defaultMenuPath, demoMenuGroups } from './menu';

/**
 * 路由表由菜单树派生
 * @description 一条菜单项对应一条平铺路由，路径即菜单 index，
 * 这样 `el-menu` 的 router 模式与面包屑都只依赖同一份数据
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: defaultMenuPath,
  },
  ...demoMenuGroups.flatMap((group) => {
    return group.items.map((item) => {
      return {
        path: item.path,
        name: item.path.replace(/^\//, '').replace(/\//g, '-'),
        component: item.component,
        meta: { title: item.title, group: group.title },
      } as RouteRecordRaw;
    });
  }),
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
