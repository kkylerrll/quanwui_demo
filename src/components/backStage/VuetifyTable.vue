<template>
  <div class="flex-1">
    <div class="flex gap-2">
      <v-text-field
        v-model="search"
        placeholder="請輸入作品名稱"
        variant="outlined"
        :append-inner-icon="searchIcon"
        rounded="xl"
        width="200"
        hide-details
        single-line
        @update:model-value="handleFilter"
      ></v-text-field>
      <v-select
        v-model="filterStatus"
        :items="statusOptions"
        label="狀態"
        item-title="text"
        item-value="value"
      ></v-select>
      <div class="w-[260px] flex items-center gap-2.5">
        <span>日期</span>
        <v-menu
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="formattedDates"
              readonly
              outlined
              dense
              color="#a5bb94"
              v-bind="props"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filterDate"
            color="#72916E"
            no-title
            :multiple="'range'"
            scrollable
            locale="zh-tw"
          ></v-date-picker>
        </v-menu>
      </div>
      <div class="flex items-center w-[200px]">
        <v-text-field
          v-model="filterReadCountMin"
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="filterReadCountMax"
          type="number"
        ></v-text-field>
      </div>
      <v-btn @click="handleColumnFilter">搜尋</v-btn>
    </div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="currentItems"
      :search="search"
      :sort-asc-icon="SvgIconAsc"
      :sort-desc-icon="SvgIconDesc"
      item-value="workName"
      show-select
      @update:sort-by="handleSorting"
    >
      <!-- 自定義 customer 欄位顯示 -->
      <template #item.customer="{ item }">
        <span>
          {{ item.name }}
          <br />
          {{ item.phone }}
        </span>
      </template>
      <!-- 自定義 status 欄位顯示 -->
      <template #item.status="{ item }">
        <span>
          {{ item.status === '0' ? '公開' : '不公開' }}
        </span>
      </template>
      <template #bottom>
        <div class="flex justify-center">
          <v-pagination
            v-model="currentPage"
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
    <pre>{{ sorting }}</pre>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, h, computed } from 'vue';
import { getAllOrder } from '@/mock/index'; // 引入假資料獲取函數
import { useRoute, useRouter } from 'vue-router';
import svgIcon from '@/components/common/SvgIcon.vue';

const router = useRouter();
const route = useRoute();
// const itemsPerPage = ref('10'); // 每頁顯示的資料數
const currentPage = ref(1); // 當前的頁碼
const pageInput = ref(currentPage.value); // 用於跳轉的頁碼輸入框
const totalRecords = ref(0); // 資料的總數量
const lastPage = ref(0); // 總頁數
const currentItems = ref([]); // 表格內容，當前頁數資料
const search = ref('');
const selected = ref([]); // 已選項目
const filter = ref(''); // 搜尋
const filterStatus = ref(''); // 狀態列篩選
const filterReadCountMin = ref(1); // 閱讀次數列篩選
const filterReadCountMax = ref(200000); // 閱讀次數列篩選
const filterStartDate = ref(''); // 閱讀次數列篩選
const filterEndDate = ref(''); // 閱讀次數列篩選
const sorting = ref([]); // 排序總資料
const sortOrder = ref(null); // 排序 升序 or 降序
const sortField = ref(null); // 排序 排序欄位
const filterDate = ref([]);
// 使用 computed 來格式化顯示的日期
const formattedDates = computed(() => {
  if (filterDate.value.length === 0) return '';
  const startDate = filterDate.value[0].toLocaleDateString('zh-TW'); // 格式化開始日期
  const endDate =
    filterDate.value[filterDate.value.length - 1]?.toLocaleDateString('zh-TW'); // 格式化結束日期
  return `${startDate} - ${endDate}`; // 返回格式化的日期範圍
});

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

const statusOptions = [
  { text: '全部', value: '' },
  { text: '公開', value: '0' },
  { text: '不公開', value: '1' },
];

const SvgIconAsc = () => h(svgIcon, { name: 'sortUp', class: 'sortIcon' });
const SvgIconDesc = () => h(svgIcon, { name: 'sortDown', class: 'sortIcon' });
const paginationNext = () => h(svgIcon, { name: 'right' });
const paginationPrev = () => h(svgIcon, { name: 'left' });
const searchIcon = () => h(svgIcon, { name: 'search', class: 'searchIcon' });

onMounted(() => {
  const newPage = Number(route.params.page) || 1;
  currentPage.value = newPage;
  fetchData();
});

// 當前頁碼變化時，更新路由
watch(currentPage, (newPage) => {
  router.replace({ name: 'memberWorksTemplate', params: { page: newPage } });
});
watch(filterDate, (newVal) => {
  // if (Array.isArray(newVal) && newVal.length > 0) {
  //   filterStartDate.value = newVal[0];
  //   filterEndDate.value = newVal[newVal.length - 1];
  // } else {
  //   filterStartDate.value = '';
  //   filterEndDate.value = '';
  // }
  filterStartDate.value = newVal[0];
  filterEndDate.value = newVal[newVal.length - 1];
});

// 當頁碼變化時更新路由並重新獲取數據
const onPageChange = (newPage) => {
  currentPage.value = newPage;
  pageInput.value = newPage;
  fetchData(); // 獲取對應頁碼的數據
};

// 獲取數據
const fetchData = async () => {
  const response = getAllOrder(
    currentPage.value,
    filter.value,
    sortField.value,
    sortOrder.value,
    filterStatus.value,
    filterReadCountMin.value,
    filterReadCountMax.value,
    filterStartDate.value,
    filterEndDate.value,
  );
  currentItems.value = response.data.map((item) => ({
    ...item,
  }));
  totalRecords.value = response.total;
  lastPage.value = response.last_page;
  // 用 console.log 查看資料
  console.log('當前頁面資料:', currentItems.value);
  console.log('總共資料量:', totalRecords.value);
  console.log('總頁數:', lastPage.value);
};
// 跳轉至特定頁面
const goToPage = () => {
  if (pageInput.value >= 1 && pageInput.value <= lastPage.value) {
    currentPage.value = pageInput.value; // 更新當前頁碼
    fetchData(); // 獲取該頁面的數據
  }
};
const handleSorting = (newVal) => {
  sorting.value = newVal;
  sortField.value = newVal[0]?.key;
  sortOrder.value = newVal[0]?.order;
  fetchData();
};
const handleFilter = (newVal) => {
  filter.value = newVal;
  fetchData();
};

const handleColumnFilter = () => {
  console.log('filterStatus', filterStatus.value);
  fetchData();
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
