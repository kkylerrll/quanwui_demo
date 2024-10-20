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

// 隨機生成用戶數量，範圍在 100 到 150 之間
const userCount = Mock.Random.integer(100, 150);
const users = Array.from({ length: userCount }, generateUserData);

export default users;
