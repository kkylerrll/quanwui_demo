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
  timeout: '500-1000', // 模擬 API 回應的延遲時間範圍為 500-1000ms
});

// 分頁 API 模擬函數
const getPaginatedData = (page) => {
  const total = mockTableData.length; // 總共幾筆資料
  const totalPages = Math.ceil(total / pageSize); // 總頁數

  // 計算當前頁的數據範圍
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 當前頁數據
  const pageData = mockTableData.slice(startIndex, endIndex);

  return {
    data: pageData, // 當前頁的數據
    total, // 總共幾筆資料
    per_page: pageSize, // 每頁幾筆
    current_page: page, // 當前頁碼
    last_page: totalPages, // 總頁數
  };
};

// 將 mockTableData 和 getPaginatedData 函數匯出
export { mockTableData, getPaginatedData };
