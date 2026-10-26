import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/form',
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('@/views/FormDemo.vue'),
      meta: { title: '表单容器' },
    },
    {
      path: '/page',
      name: 'page',
      component: () => import('@/views/PageDemo.vue'),
      meta: { title: '页面容器' },
    },
    {
      path: '/pagination',
      name: 'pagination',
      component: () => import('@/views/PaginationDemo.vue'),
      meta: { title: '分页' },
    },
  ],
});

export default router;
