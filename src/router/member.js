/*
 * 會員路由
 * path跟title可以重複 name是唯一值
 * path用減號 name及title用駝峰
 */
export default [
  {
    path: '/member-info',
    meta: { title: 'member', requiredKinds: [3] },
    component: () => import('@/pages/member/index'),
    children: [
      {
        path: '',
        name: 'memberDashboard',
        meta: {
          title: 'memberDashboard',
          requiredKinds: [3],
          category: 'dashboard',
        },
        component: () => import('@/pages/dealer/Dashboard/Dashboard'),
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
];
