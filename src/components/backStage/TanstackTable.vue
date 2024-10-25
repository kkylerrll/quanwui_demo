<template>
  <div class="tableBox flex flex-1 flex-col">
    <FilterComponent
      :table="table"
      :column="table.getAllColumns()"
    ></FilterComponent>

    <div class="table-container">
      <Table class="w-full">
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="headerRow"
            :rowIndex="1"
          >
            <TableHead>
              <input
                id="select-all"
                type="checkbox"
                :checked="allSelected"
                aria-label="Select all rows"
                @change="toggleAll"
              />
            </TableHead>
            <!-- 自動排序 -->
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              scope="col"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <sortBtn :header="header"></sortBtn>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(row, index) in tableRows"
            :key="row.id"
            :rowIndex="index"
          >
            <TableCell>
              <input
                :id="'checkbox-' + row.id"
                name="rowCheckbox"
                type="checkbox"
                :checked="row.original.selected"
                aria-label="Select row"
                @change="(e) => updateSelection(row.id, e.target.checked)"
              />
            </TableCell>
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
            >
              <template v-if="cell.column.columnDef.accessorKey === 'actions'">
                <!-- 分享按鈕 -->
                <button
                  class="shareBtn p-2"
                  @click="handleShare"
                >
                  <svgIcon
                    name="share"
                    class="w-[22px] h-[22px]"
                  />
                </button>
                <!-- 編輯按鈕 -->
                <button
                  class="editBtn p-2"
                  @click="handleEdit(row.id)"
                >
                  <svgIcon
                    name="edit"
                    class="w-[22px] h-[22px]"
                  />
                </button>
              </template>
              <template v-else>
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </template>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Pagination
        v-model:currentPage="currentPage"
        :total="totalRecords"
        :pageSize="totalPage"
        @page-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, h, computed, onMounted } from 'vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import Pagination from '../ui/Pagination/Pagination.vue';
import {
  useVueTable,
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel, // 分頁
  getSortedRowModel, // 排序
  getFilteredRowModel, // 搜尋
  getFacetedMinMaxValues,
  getExpandedRowModel, // 展開
  // ColumnFiltersState,
} from '@tanstack/vue-table';
import { getAllOrder } from '@/mock/index'; // 引入假資料獲取函數
import sortBtn from '../ui/table/sortBtn.vue';
import { useRoute, useRouter } from 'vue-router';
import debounce from 'lodash.debounce'; // 引入防抖函數
import FilterComponent from './FilterComponent.vue';

// 防抖函數，延遲 300 毫秒後再呼叫 tableData
const debouncedTableData = debounce(() => {
  tableData();
}, 400);
// 儲存表格資料
const data = ref([]);
// 定義表格的欄位
const columns = ref([
  {
    accessorKey: 'workName',
    header: '作品名稱',
    enableSorting: false, // 不可排序
    enableGlobalFilter: true, // 可搜尋
  },
  {
    accessorKey: 'customer',
    header: '客戶',
    cell: (info) => {
      const name = info.row.original.name;
      const phone = info.row.original.phone;
      return h('div', [
        h('div', name), // 名稱
        h('div', phone), // 電話
      ]);
    },
    enableSorting: false,
    enableGlobalFilter: true, // 可搜尋
  },
  {
    accessorKey: 'readCount',
    header: '閱讀次數',
    // enableGlobalFilter: true, // 可搜尋
    enableColumnFilter: true, // 啟用列過濾
  },
  {
    accessorKey: 'status',
    header: '狀態',
    cell: (info) => (info.getValue() === '0' ? '公開' : '不公開'),
    // enableGlobalFilter: false, // 不可搜尋
    enableColumnFilter: true, // 啟用列過濾
  },
  {
    accessorKey: 'createTime',
    header: '創建時間',
    cell: (info) => info.getValue(),
    enableGlobalFilter: true, // 可搜尋
    enableColumnFilter: true, // 啟用列過濾
  },
  {
    accessorKey: 'onlineView',
    header: '線上帶看',
    enableSorting: false,
    enableGlobalFilter: true, // 可搜尋
  },
  {
    accessorKey: 'actions',
    header: '操作',
    enableSorting: false,
  },
]);
const filter = ref(''); // 搜尋
const filterStatus = ref(''); // 狀態列篩選
const filterReadCountMin = ref(1); // 閱讀次數列篩選
const filterReadCountMax = ref(200000); // 閱讀次數列篩選
const sorting = ref([]); // 排序總資料
const sortOrder = ref(null); // 排序 升序 or 降序
const sortField = ref(null); // 排序 排序欄位
const pageSize = ref(1); // 每頁顯示的資料數量
const currentPage = ref(1); // 當前頁碼
const totalRecords = ref(0); // 資料的總數量
const route = useRoute();
const router = useRouter();
const allSelected = ref(false); // 追蹤是否全選的狀態
const totalPage = ref(1); // 所有的頁數

// const columnFilters = ref(() => {
//   const filters = [];
//   if (filterStatus.value)
//     filters.push({ id: 'status', value: filterStatus.value });
//   if (filterReadCountMin.value)
//     filters.push({ id: 'readCount', value: filterReadCountMin.value });
//   if (filterReadCountMax.value)
//     filters.push({ id: 'readCount', value: filterReadCountMax.value });
//   return filters;
// }); // 列過濾

// 獲取列過濾資料
const columnFilters = ref([]);

const tableData = async () => {
  const response = getAllOrder(
    currentPage.value,
    filter.value,
    sortField.value,
    sortOrder.value,
    filterStatus.value,
    filterReadCountMin.value,
    filterReadCountMax.value,
  );
  data.value = response.data;
  totalRecords.value = response.total;
  pageSize.value = response.per_page;
  totalPage.value = response.last_page;
  console.log('當前頁碼:', currentPage.value); // 確認當前頁碼
  console.log('獲取的資料:', data.value); // 確認當前頁的資料
  console.log('獲取的所有資料:', totalRecords.value); // 確認所有的資料
  console.log('所有頁碼', totalPage.value);
};

// 當前頁碼變化時，更新路由
watch(currentPage, (newPage) => {
  router.replace({ name: 'memberWorksList', params: { page: newPage } }); // 更新路由
});
// 監控所有行的選擇狀態
watch(data, (newData) => {
  allSelected.value = newData.every((item) => item.selected);
});

onMounted(() => {
  const pageParam = parseInt(route.params.page) || 1; // 默認為第 1 頁
  currentPage.value = pageParam; // 設置當前頁碼
  tableData();
});

const table = useVueTable({
  data: computed(() => data.value),
  columns: columns.value,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getExpandedRowModel: getExpandedRowModel(),
  state: {
    get globalFilter() {
      return filter.value;
    },
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting.value)
        : updaterOrValue;
    const currentSort = sorting.value[0];
    sortField.value = currentSort?.id || null; // 獲取當前排序欄位
    sortOrder.value = currentSort?.desc ? 'desc' : 'asc'; // 獲取當前排序方向
    tableData();
  },
  onGlobalFilterChange: (updaterOrValue) => {
    filter.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(filter.value)
        : updaterOrValue;
    debouncedTableData();
    console.log(filter.value);
  },
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnFilters.value)
        : updaterOrValue;

    const columnFilterValues = columnFilters.value.map(
      (filter) => filter.value,
    );

    // 取出 status 的 value 值
    filterStatus.value = columnFilters.value.find(
      (filter) => filter.id === 'status',
    )?.value;

    // 獲取所有與 readCount 相關的過濾器
    // const readCountFilters = columnFilters.value.filter(
    //   (filter) => filter.id === 'readCount',
    // );

    // // 提取 min 和 max 值並轉換為數字
    // filterReadCountMin.value =
    //   readCountFilters.length > 0 && readCountFilters[0].value[0] !== ''
    //     ? readCountFilters[0].value[0]
    //     : 1; // 第一筆資料作為最小值

    // filterReadCountMax.value =
    //   readCountFilters.length > 0 && readCountFilters[0].value[1] !== ''
    //     ? readCountFilters[0].value[1]
    //     : 200000; // 第二筆資料作為最大值

    tableData();
    console.log('columnFilterValues', columnFilterValues);
    console.log('filterReadCountMin', filterReadCountMin.value);
    console.log('filterReadCountMax', filterReadCountMax.value);
    console.log('filterStatus', filterStatus.value);
    // console.log('readCountFilters', readCountFilters.length);
    // console.log('readCountFilters min', readCountFilters[0].value[0]);
    // console.log('readCountFilters max', readCountFilters[0].value[1]);
    console.log('columnFilters', columnFilters.value);
  },
});
console.log('columns', columns.value);
console.log('table columns:', table.getAllColumns()); // 檢查所有的列
const tableRows = computed(() => {
  return table.getRowModel().rows;
});

// 切換全選
function toggleAll() {
  const newValue = !allSelected.value;
  data.value.forEach((item) => {
    item.selected = newValue; // 更新每一行的 selected 屬性
  });
  allSelected.value = newValue;
}

// 分頁變更事件處理
function onPageChange(newPage) {
  currentPage.value = newPage; // 更新當前頁碼
  tableData(); // 重新獲取分頁資料
}

const editModalVisible = ref(false);
const selectedUserId = ref();
const handleEdit = (rowId) => {
  editModalVisible.value = !editModalVisible.value;
  const selectedUser = data.value.find((user) => user.id === rowId); // 根據行ID獲取用戶資料
  if (selectedUser) {
    selectedUserId.value = selectedUser.id;
  }
};

const handleShare = () => {
  console.log('分享功能尚未實現');
};

// function handleFilterStatus(status) {
//   filterStatus.value = status; // 更新狀態
//   tableData();
//   console.log('filterStatus', filterStatus.value);
//   console.log('columnFilters', columnFilters.value);
// }
</script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';

.tableBox {
  margin: 0 30px 20px;
  border-radius: 10px;
}
.table-container {
  background-color: $text-white-color;
}
.shareBtn {
  border: 1px solid #eb9717;
  border-radius: 5px;
}
.editBtn {
  border: 1px solid $primary-color;
  border-radius: 5px;
  margin-left: 10px;
}
.headerRow {
  background-color: #f6f6f6;
}
.searchInput {
  border: 1px solid $danger-color;
  border-radius: 50px;
  padding: 8px 15px;
}
</style>
