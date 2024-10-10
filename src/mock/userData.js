import Mock from 'mockjs';
const emailDomains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'example.com',
  'tw.com',
];

const generateUserData = () => {
  const randomDomain = Mock.Random.pick(emailDomains);
  return {
    id: Mock.mock('@increment'), // 自增 ID
    name: Mock.mock('@cname()'), // 隨機中文名字
    phone: Mock.mock(/^09\d{8}$/), // 隨機手機號碼
    email: `${Mock.mock('@first')}.${Mock.mock('@last')}@${randomDomain}`, // 隨機mail
  };
};

// 生成 100 筆用戶資料
const users = Array.from({ length: 100 }, generateUserData);
export default users;
