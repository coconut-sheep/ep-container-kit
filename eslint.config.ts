import { globalIgnores } from 'eslint/config';
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import pluginOxlint from 'eslint-plugin-oxlint';
import skipFormatting from 'eslint-config-prettier/flat';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/auto-imports.d.ts',
    '**/components.d.ts',
  ]),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['example/src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    name: 'vue/html-attribute-order',
    files: ['**/*.vue'],
    rules: {
      // 统一 HTML 标签内属性的书写顺序，分批/分组强制
      'vue/attributes-order': [
        'error',
        {
          alphabetical: false,
          order: [
            'DEFINITION', // is / v-is
            'LIST_RENDERING', // v-for
            'CONDITIONALS', // v-if / v-else-if / v-else / v-show
            'RENDER_MODIFIERS', // v-once / v-pre / v-memo
            'GLOBAL', // id
            ['UNIQUE', 'SLOT'], // ref / key / slot / v-slot
            'TWO_WAY_BINDING', // v-model
            'OTHER_DIRECTIVES', // 其它 v-xxx 指令
            'OTHER_ATTR', // class / style / 普通属性
            'EVENTS', // v-on / @click 等
            'CONTENT', // v-text / v-html
          ],
        },
      ],
    },
  },

  skipFormatting,
);
