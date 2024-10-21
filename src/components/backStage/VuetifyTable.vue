<template>
  <div>
    <v-text-field
      v-model="search"
      label="Search"
      prependInnerIcon="mdi-magnify"
      variant="outlined"
      hideDetails
      singleLine
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="currentItems"
      :search="search"
    >
      <!-- 自定義 customer 欄位顯示 -->
      <template #item.customer="{ item }">
        <span>
          {{ item.name }}
          <br />
          {{ item.phone }}
        </span>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getPaginatedData } from '@/mock/index'; // 引入假資料獲取函數

const itemsPerPage = ref('10'); // 每頁顯示的資料數
const page = ref('1'); // 當前的頁碼
const total = ref([]); // 所有資料數據
const lastPage = ref(0); // 總頁數
const currentItems = ref([]); // 表格內容，當前頁數資料
const search = ref('');

// 表格 headers
const headers = [
  {
    aling: 'start',
    key: 'workName',
    title: '作品名稱',
    sortable: false,
  },
  {
    key: 'customer',
    title: '客戶',
    sortable: false,
  },
  {
    key: 'readCount',
    title: '閱讀次數',
  },
  {
    key: 'status',
    title: '狀態',
  },
  {
    key: 'createTime',
    title: '創建時間',
  },
  {
    key: 'onlineView',
    title: '線上帶看',
    sortable: false,
  },
];

// 獲取數據
const fetchData = () => {
  const { data, total: totalItems, last_page } = getPaginatedData(page.value);
  currentItems.value = data.map((item) => ({
    ...item,
    // customer: `${item.name}<br>${item.phone}`,
  }));
  total.value = totalItems;
  lastPage.value = last_page;
  // 用 console.log 查看資料
  console.log('當前頁面資料:', currentItems.value);
  console.log('總共資料量:', total.value);
  console.log('總頁數:', lastPage.value);
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';

.v-data-table-header__content {
  justify-content: center;
}
</style>
