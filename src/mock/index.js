import Mock from 'mockjs';
import userData from './userData'; // 引入用戶資料

// 定義 mockTableData
const mockTableData = userData.map((user, index) => ({
  ...user,
  wid: index + 1, // 按順序從 1 開始生成 wid
  checkbox: Mock.Random.boolean(),
  workName: Mock.Random.ctitle(5, 10),
  readCount: Mock.Random.integer(0, 200000),
  status: Mock.Random.boolean(),
  createTime: Mock.Random.date('yyyy-MM-dd HH:mm:ss'),
  onlineView: Mock.Random.boolean(),
}));

// 定義每頁顯示的筆數
const pageSize = 10;

// 設定模擬 API 的延遲時間 (單位是毫秒)，這裡設置為 500ms 延遲
Mock.setup({
  timeout: '500-1000',
});

// 分頁、排序、搜尋 API 模擬函數
const getPaginatedData = (page, workName, sortField, sortOrder) => {
  const filteredData = mockTableData.filter((item) =>
    workName ? item.workName.includes(workName) : true,
  );

  const sortedData = filteredData.sort((a, b) => {
    if (sortField) {
      if (sortOrder === 'asc') return a[sortField] > b[sortField] ? 1 : -1;
      if (sortOrder === 'desc') return a[sortField] < b[sortField] ? 1 : -1;
    }
    return 0;
  });

  const total = sortedData.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: sortedData.slice(startIndex, endIndex),
    total,
    per_page: pageSize,
    current_page: page,
    last_page: totalPages,
  };
};

// 將 mockTableData 和 getPaginatedData 函數匯出
export { mockTableData, getPaginatedData };
