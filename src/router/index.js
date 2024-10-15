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
          component: () => import('@/components/backStage/Dashbord.vue'),
        },
        {
          path: 'workslist',
          name: 'backstageTable',
          meta: {
            title: 'workslist',
            requiredKinds: [1],
            category: 'workGroup',
          },
          component: () => import('@/components/backStage/TableData.vue'),
        },
        // {
        //   path: 'workstemplate',
        //   name: 'backstageTemplate',
        //   meta: {
        //     title: 'backstageTemplate',
        //     requiredKinds: [1],
        //     category: 'workGroup',
        //   },
        //   component: () => import('@/components/backStage/workTemplate.vue'),
        // },
      ],
    },
  ],
});

export default router;
