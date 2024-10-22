<template>
  <div class="flex-1">
    <v-text-field
      v-model="search"
      placeholder="請輸入作品名稱"
      variant="outlined"
      :append-inner-icon="searceIcon"
      rounded="xl"
      width="250"
      hide-details
      single-line
    ></v-text-field>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="currentItems"
      :search="search"
      :sort-asc-icon="SvgIconAsc"
      :sort-desc-icon="SvgIconDesc"
      item-value="workName"
      show-select
    >
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
            :prev-icon="paginationPrev"
            :next-icon="paginationNext"
            active-color="#015C61"
            color="#A7A7A7"
            border="sm"
            @update:model-value="onPageChange"
          ></v-pagination>
          <div class="flex items-center">
            <p>跳轉至:</p>
            <v-text-field
              v-model.number="pageInput"
              type="number"
              min="1"
              :max="lastPage"
              hide-details
              @change="goToPage"
            ></v-text-field>
            <p>頁</p>
          </div>
        </div>
      </template>
    </v-data-table>
    <pre>{{ selected }}</pre>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, h } from 'vue';
import { getPaginatedData } from '@/mock/index'; // 引入假資料獲取函數
import { useRoute, useRouter } from 'vue-router';
import svgIcon from '@/components/common/SvgIcon.vue';

const router = useRouter();
const route = useRoute();
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

const SvgIconAsc = () => h(svgIcon, { name: 'sortUp', class: 'sortIcon' });
const SvgIconDesc = () => h(svgIcon, { name: 'sortDown', class: 'sortIcon' });
const paginationNext = () => h(svgIcon, { name: 'right' });
const paginationPrev = () => h(svgIcon, { name: 'left' });
const searceIcon = () => h(svgIcon, { name: 'search', class: 'searchIcon' });

onMounted(() => {
  const newPage = Number(route.params.page) || 1;
  page.value = newPage;
  fetchData();
});

// 當前頁碼變化時，更新路由
watch(page, (newPage) => {
  router.replace({ name: 'memberWorksTemplate', params: { page: newPage } }); // 更新路由
});

// 當頁碼變化時更新路由並重新獲取數據
const onPageChange = (newPage) => {
  page.value = newPage;
  pageInput.value = newPage;
  fetchData(); // 獲取對應頁碼的數據
};

// 獲取數據
const fetchData = () => {
  const { data, total: totalItems, last_page } = getPaginatedData(page.value);
  currentItems.value = data.map((item) => ({
    ...item,
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
</script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';

.v-data-table-header__content {
  justify-content: center;
}

:deep(.searchIcon) {
  background: $primary-color;
  padding: 7px;
  width: 30px;
  height: 30px;
  border-radius: 50px;
}
:deep(.sortIcon) {
  fill: $primary-color;
}
</style>
