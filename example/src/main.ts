import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';

// 重置先于组件库样式注入，避免覆盖 EP 的组件级样式
import './reset.scss';
import 'element-plus/dist/index.css';

import EpContainerKit from 'ep-container-kit';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(EpContainerKit);

app.mount('#app');
