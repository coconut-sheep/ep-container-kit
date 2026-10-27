import { withInstall } from '@ep-container-kit/utils';
import PageContainerVue from './src/page-container.vue';
import PageContentVue from './src/page-content.vue';

/** 页面容器组件，提供铺满父级的滚动容器 */
export const CkPageContainer = withInstall(PageContainerVue);

/** 页面内容组件，提供标题栏 / 返回按钮 / 内容区布局 */
export const CkPageContent = withInstall(PageContentVue);

export type {
  PageContentProps,
  PageContentEmits,
  PageContentEmitsTuple,
} from './src/page-content';

export default CkPageContainer;
