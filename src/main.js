import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/style/all.scss';
import '@/assets/style/tailwind.scss';

// createApp(App).mount('#app');
const app = createApp(App);
app.use(router);
app.mount('#app');
