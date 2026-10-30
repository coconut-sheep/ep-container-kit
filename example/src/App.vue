<script setup lang="ts">
  import { computed } from 'vue';
  import { RouterView, useRoute } from 'vue-router';
  import {
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElIcon,
    ElMenu,
    ElMenuItem,
    ElSubMenu,
  } from 'element-plus';
  import { demoMenuGroups } from '@/router/menu';

  const route = useRoute();

  /** 当前激活的菜单项，直接取路由路径（菜单 index 就是路径） */
  const activeMenu = computed(() => route.path);

  /** 面包屑：分组 → 组件 */
  const breadcrumbs = computed(() => {
    const { group, title } = route.meta;
    return [group, title].filter((item): item is string => {
      return typeof item === 'string' && item.length > 0;
    });
  });
</script>

<template>
  <div class="layout">
    <aside class="layout__aside">
      <div class="layout__brand">
        <span class="layout__brand-name">ep-container-kit</span>
        <span class="layout__brand-desc">Element Plus 容器化组件</span>
      </div>

      <ElMenu class="layout__menu" :default-active="activeMenu" router>
        <ElSubMenu
          v-for="group in demoMenuGroups"
          :key="group.index"
          :index="group.index"
        >
          <template #title>
            <ElIcon><component :is="group.icon" /></ElIcon>
            <span>{{ group.title }}</span>
          </template>

          <ElMenuItem
            v-for="item in group.items"
            :key="item.path"
            :index="item.path"
          >
            <span class="layout__item-title">{{ item.title }}</span>
            <span class="layout__item-name">{{ item.name }}</span>
          </ElMenuItem>
        </ElSubMenu>
      </ElMenu>
    </aside>

    <div class="layout__main">
      <header class="layout__header">
        <ElBreadcrumb separator="/">
          <ElBreadcrumbItem v-for="crumb in breadcrumbs" :key="crumb">
            {{ crumb }}
          </ElBreadcrumbItem>
        </ElBreadcrumb>

        <span class="layout__version">v0.1.0</span>
      </header>

      <!--
        内容区必须是确定的 flex 高度，CkPageContainer 的 height:100% 才有参照
      -->
      <main class="layout__body">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .layout {
    display: flex;
    height: 100%;
    font-family: var(--font-sans, system-ui, sans-serif);

    &__aside {
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      width: 240px;
      overflow: hidden;
      background: var(--el-bg-color);
      border-right: 1px solid var(--el-border-color-lighter);
    }

    &__brand {
      display: flex;
      flex-direction: column;
      row-gap: 2px;
      flex-shrink: 0;
      padding: 16px 20px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    &__brand-name {
      font-size: 15px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    &__brand-desc {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    &__menu {
      flex: 1;
      min-height: 0;
      overflow: auto;
      // 侧栏本身已有右边框，菜单不再重复画一条
      border-right: none;
      // 文档类站点条目多，压缩条高比 EP 默认的 56px 更合适
      --el-menu-item-height: 42px;
      --el-menu-sub-item-height: 38px;
    }

    &__item-title {
      flex: none;
    }

    &__item-name {
      margin-left: 8px;
      font-family: var(--el-font-family-mono, monospace);
      font-size: 11px;
      color: var(--el-text-color-placeholder);
    }

    &__main {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
      height: 100%;
    }

    &__header {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 16px;
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    &__version {
      font-family: var(--el-font-family-mono, monospace);
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }

    &__body {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
  }
</style>
