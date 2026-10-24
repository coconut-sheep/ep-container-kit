import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['src/**/__tests__/**/*.spec.ts'],
      server: {
        deps: {
          // element-plus 默认被 vitest 外部化交给 Node ESM 加载，而它内部
          // `import AsyncValidator from 'async-validator'` 会拿到 CJS 的
          // `{ default: fn }` 对象而非构造函数，导致 `new AsyncValidator()`
          // 抛 TypeError，表现就是 el-form.validate() 永远 resolve 成 true。
          // 内联后交由 Vite 转换，互操作正确。
          inline: ['element-plus', 'async-validator'],
        },
      },
    },
  }),
);
