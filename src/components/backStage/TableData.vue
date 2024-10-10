<template>
  <div class="tableBox flex flex-1">
    <Table>
      <TableHeader>
        <TableRow
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
          <TableHead
            v-for="column in columns"
            :key="column.accessorKey"
          >
            {{ column.header }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(row, index) in table.getRowModel().rows"
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
              <button
                class="shareBtn p-2"
                @click="handleAction(row.id, 'edit')"
              >
                <svgIcon
                  name="share"
                  class="w-[22px] h-[22px]"
                />
              </button>
              <button
                class="editBtn p-2"
                @click="handleAction(row.id, 'delete')"
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
  </div>
</template>

<script setup>
import { ref, watch, h } from 'vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
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
      const name = info.row.original.customer.name;
      const phone = info.row.original.customer.phone;
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

const table = useVueTable({
  data: data.value,
  columns: columns.value,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getRowCanExpand: () => true,
  getExpandedRowModel: getExpandedRowModel(),
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
}
.headerRow {
  background-color: #f6f6f6;
}
</style>
