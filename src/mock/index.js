// mockTableData.js
import Mock from 'mockjs';
import userData from './userData'; // 引入用戶資料

// 定義 mockTableData
const mockTableData = userData.map((user) => ({
  ...user,
  checkbox: Mock.Random.boolean(), // 隨機生成 checkbox 狀態
  workName: Mock.Random.ctitle(5, 10), // 隨機作品名稱 (5 到 10 個中文字符)
  readCount: Mock.Random.integer(0, 200000), // 隨機閱讀次數
  status: Mock.Random.boolean(), // 隨機狀態 (true/false)
  createTime: Mock.Random.date('yyyy-MM-dd HH:mm:ss'), // 隨機創建時間，格式化為 yyyy-MM-dd HH:mm:ss
  onlineView: Mock.Random.boolean(), // 隨機線上帶看狀態 (true/false)
}));

export default mockTableData;
