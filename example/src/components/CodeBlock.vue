<script setup lang="ts">
  import { computed } from 'vue';
  import { ElButton, ElMessage } from 'element-plus';
  import { CopyDocument } from '@element-plus/icons-vue';
  import hljs from 'highlight.js/lib/core';
  import css from 'highlight.js/lib/languages/css';
  import javascript from 'highlight.js/lib/languages/javascript';
  import scss from 'highlight.js/lib/languages/scss';
  import typescript from 'highlight.js/lib/languages/typescript';
  import xml from 'highlight.js/lib/languages/xml';
  import 'highlight.js/styles/github.css';

  /**
   * 只注册演示用得到的语言，避免把 highlight.js 全量语言包打进产物
   */
  const LANGUAGES = {
    css,
    javascript,
    scss,
    typescript,
    xml,
  } as const;

  type LanguageName = keyof typeof LANGUAGES;

  for (const [name, language] of Object.entries(LANGUAGES)) {
    hljs.registerLanguage(name, language);
  }

  const props = defineProps<{
    /** 需要高亮展示的源码 */
    code: string;
  }>();

  /** SFC 顶层块的起始行，例如 `<script setup lang="ts">` */
  const BLOCK_START = /^<(template|script|style)(\s[^>]*)?>/;

  interface CodeSegment {
    language: LanguageName;
    code: string;
  }

  /**
   * 根据顶层标签与其属性决定该块用哪套语法
   * @description `<script>` 默认按 javascript，声明 `lang="ts"` 时按 typescript；
   * `<style>` 默认按 css，声明 `lang="scss"` 时按 scss；其余（含 `<template>`）交给 xml
   */
  const resolveBlockLanguage = (tag: string, attrs: string): LanguageName => {
    if (tag === 'script') {
      return /lang=["'](ts|tsx)["']/.test(attrs) ? 'typescript' : 'javascript';
    }

    if (tag === 'style') {
      return /lang=["']scss["']/.test(attrs) ? 'scss' : 'css';
    }

    return 'xml';
  };

  /**
   * 按 SFC 顶层块切分源码
   * @description 顶层块一定从行首开始，因此按行扫描即可，不需要引入编译器；
   * 拆块的意义在于给 `<script>` 与 `<style>` 各自匹配语法，整段按 xml 处理会让脚本内容全成纯文本
   * @param source 完整的 SFC 源码
   * @returns 按出现顺序排列的代码块，块内保留原始缩进
   */
  const splitSfc = (source: string): CodeSegment[] => {
    const segments: CodeSegment[] = [];
    let buffer: string[] = [];
    let current: { tag: string; language: LanguageName } | null = null;

    const flush = (language: LanguageName) => {
      if (!buffer.length) {
        return;
      }
      segments.push({ language, code: buffer.join('\n') });
      buffer = [];
    };

    for (const line of source.split('\n')) {
      const matched = BLOCK_START.exec(line);

      if (!current && matched) {
        flush('xml');
        const tag = matched[1] ?? '';
        current = {
          tag,
          language: resolveBlockLanguage(tag, matched[2] ?? ''),
        };
        buffer.push(line);
        continue;
      }

      buffer.push(line);

      // 只认列首的闭合标签：模板里嵌套的 `<template #slot>` 会缩进，
      // 用 trim 比较会把它当成顶层块的结束，导致后续内容全部退回纯 xml
      if (current && line.startsWith(`</${current.tag}>`)) {
        flush(current.language);
        current = null;
      }
    }

    flush(current?.language ?? 'xml');

    return segments;
  };

  /**
   * 转义为纯文本，语法未知或高亮异常时的兜底
   */
  const escapeHtml = (code: string) => {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const highlightSegment = ({ language, code }: CodeSegment) => {
    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    } catch {
      return escapeHtml(code);
    }
  };

  const highlightedCode = computed(() => {
    return splitSfc(props.code).map(highlightSegment).join('\n');
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      ElMessage.success('源码已复制');
    } catch {
      ElMessage.warning('当前环境不允许写剪贴板，请手动选择代码');
    }
  };
</script>

<template>
  <div class="code-block">
    <div class="code-block__toolbar">
      <span class="code-block__lang">vue</span>
      <ElButton
        class="code-block__copy"
        link
        type="primary"
        :icon="CopyDocument"
        @click="handleCopy"
      >
        复制
      </ElButton>
    </div>
    <pre
      class="code-block__pre"
    ><code class="hljs" v-html="highlightedCode" /></pre>
  </div>
</template>

<style scoped lang="scss">
  .code-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    background: var(--el-fill-color-light);

    &__toolbar {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      padding: 0 12px;
      border-bottom: 1px solid var(--el-border-color-lighter);
      background: var(--el-fill-color-lighter);
    }

    &__lang {
      font-family: var(--el-font-family-mono, monospace);
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    &__copy {
      height: 24px;
      font-size: 12px;
    }

    &__pre {
      flex: 1;
      max-height: 420px;
      margin: 0;
      overflow: auto;
      padding: 12px;
      font-family: var(--el-font-family-mono, monospace);
      font-size: 12px;
      line-height: 1.7;
      tab-size: 2;
    }

    // highlight.js 主题自带的背景与会换行策略一并收编，外观统一由外层容器控制
    :deep(.hljs) {
      display: block;
      padding: 0;
      overflow: visible;
      background: transparent;
    }
  }
</style>
