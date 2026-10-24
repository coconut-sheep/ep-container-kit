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
  ],
});

export default router;
