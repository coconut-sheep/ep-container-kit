import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';

const resolvePath = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url));

/**
 * 组件库构建配置（库模式）
 * @description
 * - JS：同时产出 ESM（`dist/index.mjs`）与 CJS（`dist/index.cjs`）
 * - 类型：由 vite-plugin-dts 汇总为单文件 `dist/index.d.ts`，
 *   避免产物中残留 `@ep-container-kit/*` 这类仅在 monorepo 内可见的裸包名
 * - 样式：抽取为独立的 `dist/index.css`，与 element-plus 一致，由使用方显式引入
 * - `vue` / `element-plus` 走 external，不打进产物，交由使用方提供
 */
export default defineConfig({
  root: resolvePath('.'),
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath: resolvePath('../../tsconfig.json'),
      include: ['../**/*.ts', '../**/*.vue', '../../env.d.ts'],
      entryRoot: resolvePath('..'),
      outDirs: ['dist'],
      bundleTypes: true,
    }),
  ],
  build: {
    target: 'es2020',
    outDir: resolvePath('./dist'),
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolvePath('./index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        /^element-plus\//,
        /^@vue\//,
        /^@element-plus\//,
      ],
      output: {
        exports: 'named',
        assetFileNames: (assetInfo) => {
          const names = assetInfo.names ?? [];
          if (names.some((name) => name.endsWith('.css'))) {
            return 'index.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
