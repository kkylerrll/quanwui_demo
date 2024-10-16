<template>
  <div class="tableBox flex flex-1 flex-col">
    <Table>
      <TableHeader>
        <TableRow class="headerRow" :rowIndex="1">
          <TableHead>
            <input
              id="select-all"
              type="checkbox"
              :checked="allSelected"
              aria-label="Select all rows"
              @change="toggleAll"
            />
          </TableHead>
          <TableHead v-for="column in columns" :key="column.accessorKey">
            {{ column.header }}
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
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <template v-if="cell.column.columnDef.accessorKey === 'actions'">
              <!-- 分享按鈕 -->
              <button class="shareBtn p-2" @click="handleShare">
                <svgIcon name="share" class="w-[22px] h-[22px]" />
              </button>
              <!-- 編輯按鈕 -->
              <button class="editBtn p-2" @click="handleEdit(row.id)">
                <svgIcon name="edit" class="w-[22px] h-[22px]" />
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
      :total="data.length"
      :pageSize="pageSize"
      @page-change="onPageChange"
    />
  </div>
  <EditModal
    v-model="editModalVisible"
    title="基本設定"
    :userId="selectedUserId"
  ></EditModal>
</template>

<script setup>
import { ref, watch, h, computed } from 'vue';
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
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
} from '@tanstack/vue-table';
import mockData from '@/mock/index';
import EditModal from './EditModal.vue';

// 假資料中需包含 selected 屬性
const data = ref(
  mockData.map((item) => ({
    ...item,
    selected: false, // 新增 selected 屬性
  })),
);

// 定義表格的欄位
const columns = ref([
  {
    accessorKey: 'workName',
    header: '作品名稱',
    cell: (info) => info.getValue(),
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
  },
  {
    accessorKey: 'readCount',
    header: '閱讀次數',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: '狀態',
    cell: (info) => (info.getValue() ? '公開' : '不公開'),
  },
  {
    accessorKey: 'createTime',
    header: '創建時間',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'onlineView',
    header: '線上帶看',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'actions',
    header: '操作',
    cell: (info) => info.getValue(),
  },
]);

const pageSize = ref(10); // 每頁顯示的資料數量
const currentPage = ref(1); // 當前頁碼

const table = useVueTable({
  data: computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return data.value.slice(start, end); // 取得當前頁面的資料
  }),
  columns: columns.value,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getRowCanExpand: () => true,
  getExpandedRowModel: getExpandedRowModel(),
});
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

// 分頁變更事件處理
function onPageChange(newPage) {
  currentPage.value = newPage; // 更新當前頁碼
}

const editModalVisible = ref(false);
const selectedUserId = ref();
const handleEdit = (rowId) => {
  editModalVisible.value = !editModalVisible.value;
  const selectedUser = data.value[rowId]; // 根據行索引獲取用戶資料
  if (selectedUser) {
    selectedUserId.value = selectedUser.id;
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';

.tableBox {
  margin: 0 30px 20px;
  background-color: $text-white-color;
  border-radius: 10px;
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
</style>
