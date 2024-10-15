import { createApp } from 'vue';
import App from './App.vue';
import 'virtual:svg-icons-register';
import router from './router';
import '@/assets/style/all.scss';
import '@/assets/style/tailwind.scss';
import component from './components/index';
import vuetify from './plugins/vuetify.js';
import '@mdi/font/css/materialdesignicons.css';
import './mock/taiwanData';
import i18n from '@/locales/index';

// createApp(App).mount('#app');
const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(component);
app.use(i18n);
app.mount('#app');
