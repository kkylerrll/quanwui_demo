<template>
  <div class="tableBox flex flex-1 flex-col">
    <div class="flex justify-end">
      <input
        v-model="filter"
        type="text"
        placeholder="請輸入作品名稱"
        class="searchInput"
      />
    </div>
    <div class="table-container">
      <Table>
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
            <!-- 手動定義排序 -->
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              scope="col"
            >
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <sortBtn :header="header"></sortBtn>
            </TableHead>
            <!-- 自動排序 -->
            <!-- <TableHead
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
          </TableHead> -->
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
        :pageSize="pageSize"
        @page-change="onPageChange"
      />
    </div>
  </div>
  <EditModal
    v-model="editModalVisible"
    title="基本設定"
    :userId="selectedUserId"
  ></EditModal>
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
} from '@tanstack/vue-table';
import EditModal from './EditModal.vue';
import { getPaginatedData } from '@/mock/index'; // 引入假資料獲取函數
import sortBtn from '../ui/table/sortBtn.vue';
import { useRoute, useRouter } from 'vue-router';

// 儲存表格資料
const data = ref([]);

// 定義表格的欄位
const columns = ref([
  {
    accessorKey: 'workName',
    header: '作品名稱',
    enableSorting: false, // 不可排序
    // enableGlobalFilter: true, // 可搜尋
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
    // enableGlobalFilter: true, // 不可搜尋
  },
  {
    accessorKey: 'readCount',
    header: '閱讀次數',
    // enableGlobalFilter: false, // 不可搜尋
  },
  {
    accessorKey: 'status',
    header: '狀態',
    cell: (info) => (info.getValue() ? '公開' : '不公開'),
    // enableGlobalFilter: false, // 不可搜尋
  },
  {
    accessorKey: 'createTime',
    header: '創建時間',
    cell: (info) => info.getValue(),
    // enableGlobalFilter: false, // 不可搜尋
  },
  {
    accessorKey: 'onlineView',
    header: '線上帶看',
    enableSorting: false,
    // enableGlobalFilter: false, // 不可搜尋
  },
  {
    accessorKey: 'actions',
    header: '操作',
    enableSorting: false,
    // enableGlobalFilter: false, // 不可搜尋
  },
]);
const filter = ref(''); // 搜尋
const pageSize = ref(10); // 每頁顯示的資料數量
const currentPage = ref(1); // 當前頁碼
const totalRecords = ref(0); // 總記錄數
const route = useRoute();
const router = useRouter();

// 獲取資料
const tableData = () => {
  const { data: paginatedData, total } = getPaginatedData(currentPage.value); // 獲取分頁資料
  data.value = paginatedData;
  totalRecords.value = total; // 更新總記錄數
  console.log('當前頁碼:', currentPage.value); // 確認當前頁碼
  console.log('獲取的資料:', paginatedData); // 確認當前頁的資料
  console.log('獲取的所有資料:', totalRecords.value); // 確認所有的資料
  console.log('total:', total); // 確認所有的資料
};

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
  state: {
    get globalFilter() {
      return filter.value;
    },
  },
});
console.log('columns', columns.value);
console.log('table columns:', table.getAllColumns()); // 檢查所有的列
const tableRows = computed(() => {
  return table.getRowModel().rows;
});

// 追蹤是否全選的狀態
const allSelected = ref(false);

// 監控所有行的選擇狀態
watch(data, (newData) => {
  allSelected.value = newData.every((item) => item.selected);
});

// 切換全選
function toggleAll() {
  const newValue = !allSelected.value;
  data.value.forEach((item) => {
    item.selected = newValue; // 更新每一行的 selected 屬性
  });
  allSelected.value = newValue;
}
// 當前頁碼變化時，更新路由
watch(currentPage, (newPage) => {
  router.replace({ name: 'memberWorksList', params: { page: newPage } }); // 更新路由
});
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
