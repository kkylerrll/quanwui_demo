<template>
  <div class="flex-1">
    <v-text-field
      v-model="search"
      label="Search"
      prependInnerIcon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
    ></v-text-field>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="currentItems"
      :search="search"
      show-select
    >
      <template #column.sort-desc>
        <!-- 自定義降序圖標 -->
        <svgIcon name="sortDown" />
      </template>

      <template #column.sort-asc>
        <!-- 自定義升序圖標 -->
        <svgIcon name="sortUp" />
      </template>
      <!-- 自定義 customer 欄位顯示 -->
      <template #item.customer="{ item }">
        <span>
          {{ item.name }}
          <br />
          {{ item.phone }}
        </span>
      </template>
      <template #bottom>
        <div class="flex justify-center">
          <v-pagination
            v-model="page"
            :length="lastPage"
            rounded="circle"
            :total-visible="6"
            @update:model-value="fetchData"
          ></v-pagination>
          <div class="flex items-center">
            <p>跳轉至:</p>
            <v-text-field
              v-model.number="pageInput"
              type="number"
              min="1"
              :max="lastPage"
              class="ml-2 text-center"
              hide-details
              @change="goToPage"
            ></v-text-field>
            <p>頁</p>
          </div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getPaginatedData } from '@/mock/index'; // 引入假資料獲取函數

// const itemsPerPage = ref('10'); // 每頁顯示的資料數
const page = ref(1); // 當前的頁碼
const pageInput = ref(page.value); // 用於跳轉的頁碼輸入框
const total = ref([]); // 所有資料數據
const lastPage = ref(0); // 總頁數
const currentItems = ref([]); // 表格內容，當前頁數資料
const search = ref('');
const selected = ref([]); // 已選項目

// 表格 headers
const headers = [
  {
    align: 'center',
    key: 'workName',
    title: '作品名稱',
    sortable: false,
  },
  {
    align: 'center',
    key: 'customer',
    title: '客戶',
    sortable: false,
  },
  {
    align: 'center',
    key: 'readCount',
    title: '閱讀次數',
  },
  {
    align: 'center',
    key: 'status',
    title: '狀態',
  },
  {
    align: 'center',
    key: 'createTime',
    title: '創建時間',
  },
  {
    align: 'center',
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
// 跳轉至特定頁面
const goToPage = () => {
  if (pageInput.value >= 1 && pageInput.value <= lastPage.value) {
    page.value = pageInput.value; // 更新當前頁碼
    fetchData(); // 獲取該頁面的數據
  }
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
