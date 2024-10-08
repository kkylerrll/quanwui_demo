import {createRouter, createWebHistory} from 'vue-router';
import BackIndex from '@/page/BackStage/BackIndex.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'backIndex',
      compoent: BackIndex,
    }
  ]
})

export default router;