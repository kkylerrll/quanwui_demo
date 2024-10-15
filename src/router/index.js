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
          name: 'backDashbord',
          meta: {
            title: 'home',
            requiredKinds: [1],
          },
          component: () => import('@/components/backStage/Dashboard.vue'),
        },
        {
          path: 'worksList',
          name: 'memberWorksList',
          meta: {
            title: 'worksList',
            requiredKinds: [3],
            category: 'workGroup',
          },
          component: () => import('@/components/backStage/TableData.vue'),
        },
        {
          path: 'worksTemplate',
          name: 'memberWorksTemplate',
          meta: {
            title: 'worksTemplate',
            requiredKinds: [3],
            category: 'workGroup',
          },
          component: () => import('@/components/backStage/WorkTemplate.vue'),
        },
      ],
    },
  ],
});

export default router;
