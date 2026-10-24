<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="app">
    <header class="app__nav">
      <span class="app__brand">ep-container-kit</span>
      <nav class="app__links">
        <RouterLink class="app__link" to="/form">表单容器</RouterLink>
        <RouterLink class="app__link" to="/page">页面容器</RouterLink>
      </nav>
    </header>

    <!--
      App.vue 只负责「导航 + 内容区高度」。
      内容区必须是确定的 flex 高度，CkPageContainer 的 height:100% 才有参照。
    -->
    <main class="app__main">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
  // example 的全局重置：组件库本身不带 reset，由宿主负责
  html,
  body {
    height: 100%;
    margin: 0;
  }

  #app {
    height: 100%;
  }
</style>

<style scoped lang="scss">
  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: var(--font-sans, system-ui, sans-serif);

    &__nav {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      column-gap: 24px;
      height: 52px;
      padding: 0 24px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    &__brand {
      font-size: 15px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    &__links {
      display: flex;
      column-gap: 16px;
    }

    &__link {
      font-size: 14px;
      color: var(--el-text-color-regular);
      text-decoration: none;

      &:hover {
        color: var(--el-color-primary);
      }

      &.router-link-active {
        color: var(--el-color-primary);
        font-weight: 500;
      }
    }

    &__main {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
  }
</style>
