import { createRouter, createWebHistory } from 'vue-router';
import BackIndex from '@/page/BackStage/BackIndex.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'backIndex',
      component: BackIndex,
      children: [
        {
          path: '',
          name: 'backstageTable',
          meta: {
            title: 'backstageTable',
            requiredKinds: [1],
          },
          component: () => import('@/components/backStage/TableData.vue'),
        },
      ],
    },
  ],
});

export default router;
