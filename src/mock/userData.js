import Mock from 'mockjs';

const generateUserData = () => ({
  id: Mock.mock('@increment'), // 自增 ID
  name: Mock.mock('@cname()'), // 隨機中文名字
  phone: Mock.mock(/^09\d{8}$/), // 隨機手機號碼
});

// 生成 100 筆用戶資料
const users = Array.from({ length: 100 }, generateUserData);
export default users;
