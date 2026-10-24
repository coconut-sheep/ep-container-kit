import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';

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
