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

// createApp(App).mount('#app');
const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(component);
app.mount('#app');
