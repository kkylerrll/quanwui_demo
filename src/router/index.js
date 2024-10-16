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
          path: 'tanStackTable',
          name: 'memberWorksList',
          meta: {
            title: 'tanStackTable',
            requiredKinds: [3],
            category: 'tableGroup',
          },
          component: () => import('@/components/backStage/TanstackTable.vue'),
        },
        {
          path: 'vuetifyTable',
          name: 'memberWorksTemplate',
          meta: {
            title: 'vuetifyTable',
            requiredKinds: [3],
            category: 'tableGroup',
          },
          component: () => import('@/components/backStage/VuetifyTable.vue'),
        },
      ],
    },
  ],
});

export default router;
