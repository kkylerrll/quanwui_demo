import Mock from 'mockjs';

// 定義隨機生成的資料格式
const mockTableData = Mock.mock({
  'data|200-500': [
    {
      id: '@id()', // 隨機 ID
      checkbox: '@boolean()',
      workName: '@ctitle(5, 10)', // 隨機作品名稱 (5 到 10 個中文字符)
      customer: {
        name: '@cname()', // 隨機中文名字
        phone: /^09[0-9]{8}$/, // 隨機手機號碼 (台灣格式)
      },
      readCount: '@integer(0, 200000)', // 隨機閱讀次數
      status: '@boolean()', // 隨機狀態 (true/false)
      createTime: '@date("yyyy-MM-dd HH:mm:ss")', // 隨機創建時間，格式化為 yyyy-MM-dd HH:mm:ss
      onlineView: '@boolean()', // 隨機線上帶看狀態 (true/false)
      'actions|1-5': [
        {
          name: '@pick(["重新命名", "刪除", "寄送", "編輯", "3D升級"])',
          action: '@word()',
        },
      ],
    },
  ],
}).data;

// 為生成日期進行限制，僅生成在 2023～2024 範圍內的日期
function generateRandomDate() {
  const startDate = new Date(2023, 0, 1); // 設定最早的日期為 2023-01-01
  const endDate = new Date(2024, 11, 31); // 設定最晚的日期為 2024-12-31
  const randomDate = new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime()),
  );
  return `${randomDate.getFullYear()}-${String(randomDate.getMonth() + 1).padStart(2, '0')}-${String(randomDate.getDate()).padStart(2, '0')} ${String(randomDate.getHours()).padStart(2, '0')}:${String(randomDate.getMinutes()).padStart(2, '0')}:${String(randomDate.getSeconds()).padStart(2, '0')}`;
}

// 替換 mockTableData 的所有 createTime 為符合條件的日期
mockTableData.forEach((item) => {
  item.createTime = generateRandomDate();
});

export default mockTableData;
