import Mock from 'mockjs';
import { defineFakeRoute } from 'vite-plugin-fake-server/client';

const data = Mock.mock({
  'users|150': [
    {
      id: '@guid',
      username: '@first',
      email: '@email',
      avatar: '@image("200x200")',
      role: '@pick(["admin", "user", "dealer"])',
    },
  ],
}).users;

export default defineFakeRoute([
  {
    url: '/mock/getUserInfo',
    timeout: 1000,
    method: 'GET',
    response: () => {
      return {
        status: 'success',
        code: 200,
        data: Mock.mock({
          'users|10-20': [
            {
              id: '@guid',
              username: '@first',
              email: '@email',
              avatar: '@image("200x200")',
              role: '@pick(["admin", "user", "dealer"])',
            },
          ],
        }),
      };
    },
  },
  {
    url: '/mock/getUserList',
    timeout: 1000,
    method: 'GET',
    response: ({ query }) => {
      const page = parseInt(query.page, 10) || 1;
      const perPage = parseInt(query.per_page, 10) || 10;
      const start = (page - 1) * perPage;
      const end = page * perPage;
      const paginatedData = data.slice(start, end);

      return {
        status: 'success',
        code: 200,
        data: {
          total: data.length,
          page,
          per_page: perPage,
          total_pages: Math.ceil(data.length / perPage),
          users: paginatedData,
        },
      };
    },
  },
]);
