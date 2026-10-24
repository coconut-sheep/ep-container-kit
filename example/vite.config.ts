import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'components.d.ts',
    }),
  ],
  resolve: {
    // 防御性去重：monorepo 里组件库源码与 example 分别从各自的 node_modules
    // 解析依赖，一旦出现多份 vue / element-plus，元素注入用的 formContextKey
    // 这类 Symbol 会不相等（表现为 el-form 收不到子表单项、provide/inject 失效）
    dedupe: ['vue', 'element-plus'],
    alias: {
      // demo 应用自身的别名（仅 example 内部使用）
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 直接指向组件库源码入口（而不是包目录）：若指向目录，Vite 会按
      // packages/ep-container-kit/package.json 的 module 字段解析到已构建的
      // dist/index.mjs，导致改源码不热更新。与 tsconfig.json 的 paths 保持一致。
      'ep-container-kit': fileURLToPath(
        new URL('../packages/ep-container-kit/index.ts', import.meta.url),
      ),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
