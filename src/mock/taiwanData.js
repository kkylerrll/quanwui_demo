import Mock from 'mockjs';
import userData from './userData'; // 引入用戶資料

// 定義台灣縣市和鄉鎮市區的資料結構
const taiwanAreas = {
  台北市: ['中正區', '大同區', '中山區', '松山區', '大安區'],
  新北市: ['板橋區', '三峽區', '淡水區', '新莊區', '樹林區'],
  桃園市: ['桃園區', '中壢區', '平鎮區', '八德區', '龍潭區'],
  台中市: ['中區', '東區', '南區', '北區', '西區'],
  台南市: ['中西區', '東區', '南區', '北區', '安平區'],
  高雄市: ['前金區', '苓雅區', '鹽埕區', '左營區', '鼓山區'],
  宜蘭縣: ['宜蘭市', '羅東鎮', '冬山鄉', '五結鄉', '蘇澳鎮'],
  新竹縣: ['新埔鎮', '關西鎮', '竹北市', '湖口鄉', '寶山鄉'],
  苗栗縣: ['苗栗市', '頭份市', '三義鄉', '公館鄉', '西湖鄉'],
  南投縣: ['南投市', '草屯鎮', '埔里鎮', '竹山鎮', '魚池鄉'],
  雲林縣: ['斗六市', '西螺鎮', '古坑鄉', '林內鄉', '虎尾鎮'],
  嘉義縣: ['太保市', '朴子市', '大林鎮', '梅山鄉', '中埔鄉'],
  屏東縣: ['屏東市', '三地門鄉', '瑪家鄉', '獅子鄉', '萬丹鄉'],
  台東縣: ['台東市', '關山鎮', '卑南鄉', '東河鄉', '達仁鄉'],
  花蓮縣: ['花蓮市', '吉安鄉', '壽豐鄉', '鳳林鎮', '光復鄉'],
  澎湖縣: ['馬公市', '西嶼鄉', '望安鄉', '七美鄉', '白沙鄉'],
  金門縣: ['金城鎮', '金湖鎮', '金沙鎮', '烈嶼鄉'],
  連江縣: ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'],
};

// 隨機選擇縣市
function getRandomCity() {
  return Mock.Random.pick(Object.keys(taiwanAreas));
}

// 隨機選擇鄉鎮市區
function getRandomDistrict(city) {
  return Mock.Random.pick(taiwanAreas[city]);
}

// 定義台灣用戶資料
const taiwanUsersData = userData.map((user) => {
  const city = getRandomCity(); // 隨機選擇一個縣市
  const district = getRandomDistrict(city); // 根據選擇的縣市取得對應的鄉鎮市區
  return {
    ...user,
    city,
    district,
  };
});

// 新的 Mock 介面
Mock.mock('/api/taiwan-users', 'get', () => {
  return {
    status: 200,
    data: {
      taiwanUsers: taiwanUsersData,
      taiwanAreas: taiwanAreas,
    },
  };
});

export { taiwanUsersData, taiwanAreas };
