import Mock from 'mockjs';
import userData from './userData'; // 引入用戶資料

// 定義 mockTableData
const mockTableData = userData.map((user, index) => ({
  ...user,
  wid: index + 1, // 按順序從 1 開始生成 wid
  checkbox: Mock.Random.boolean(),
  workName: Mock.Random.ctitle(5, 10),
  readCount: Mock.Random.integer(0, 200000),
  // status: Mock.Random.boolean().toString(),
  status: Mock.Random.pick(['0', '1']),
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
const getAllOrder = (
  page,
  searchTerm,
  sortField,
  sortOrder,
  status,
  minValue,
  maxValue,
) => {
  let filteredData = mockTableData.filter((item) => {
    // 檢查所有欄位是否符合搜尋條件
    const matchesSearch = Object.keys(item).some((key) =>
      String(item[key])
        .toLowerCase()
        .includes(String(searchTerm).toLowerCase()),
    );

    // 檢查狀態欄位是否符合條件 (如果有提供 status)
    const matchesStatus = status ? item.status === status : true;
    // 檢查數值欄位是否在 minValue 和 maxValue 的範圍內
    const matchesValueRange =
      minValue !== undefined && maxValue !== undefined
        ? item.readCount >= minValue && item.readCount <= maxValue
        : true;
    return matchesSearch && matchesStatus && matchesValueRange;
  });

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

// 將 mockTableData 和 getAllOrder 函數匯出
export { mockTableData, getAllOrder };
