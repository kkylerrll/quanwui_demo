<template>
  <div class="flex justify-end gap-2.5">
    <!-- 全域過濾 -->
    <input
      v-model="filter"
      type="text"
      placeholder="Search"
      class="searchInput"
      @input="props.table.setGlobalFilter(String($event.target.value))"
    />
    <!-- 狀態過濾 -->
    <div>
      <label for="status">狀態:</label>
      <select
        id="status"
        v-model="filterStatus"
        class="statusSelection rounded-md px-2 py-3 border border-gray-700 text-center"
      >
        <option value="">全部</option>
        <option value="0">公開</option>
        <option value="1">不公開</option>
      </select>
    </div>
    <!-- 閱讀次數過濾 -->
    <div class="flex items-center">
      <label for="minValue">最小值:</label>
      <input
        id="minValue"
        v-model.number="minValue"
        type="text"
        placeholder="輸入最小值"
        class="rounded-md px-2 py-1 border border-gray-700"
      />

      <label
        for="maxValue"
        class="mt-2"
      >
        最大值:
      </label>
      <input
        id="maxValue"
        v-model.number="maxValue"
        type="text"
        placeholder="輸入最大值"
        class="rounded-md px-2 py-1 border border-gray-700"
      />
    </div>
    <button
      class="rounded-[50px] bg-gray-700 px-2 py-1 text-white"
      @click="handleSearch"
    >
      搜尋
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import DebouncedInput from './DebouncedInput.vue';
const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
});
const filter = ref('');
const filterStatus = ref('');
const minValue = ref('');
const maxValue = ref('');

// const emit = defineEmits(['update:filterStatus']);
// function updateFilterStatus() {
//   console.log(filterStatus.value);
//   props.table.setColumnFilters();
//   emit('update:filterStatus', filterStatus.value);
// }
// function handleSearch() {
//   if (filterStatus.value) {
//     console.log('ok');
//     props.table.setColumnFilters([{ id: 'status', value: filterStatus.value }]);
//   }
//   if (minValue.value) {
//     console.log('minValue', minValue.value.toString());
//     props.table.setColumnFilters([
//       { id: 'readCount', value: { min: minValue.value.toString() } },
//     ]);
//   }
//   if (maxValue.value) {
//     console.log('maxValue', maxValue.value.toString());
//     props.table.setColumnFilters([
//       { id: 'readCount', value: { max: maxValue.value.toString() } },
//     ]);
//   }
// }

function handleSearch() {
  const filters = []; // 用來存儲所有過濾器

  // 狀態過濾
  if (filterStatus.value) {
    console.log('ok');
    filters.push({ id: 'status', value: filterStatus.value });
  }

  // 閱讀次數篩選
  if (minValue.value !== null) {
    // 確保最小值存在
    console.log('minValue', minValue.value.toString());
    filters.push({ id: 'readCount', value: minValue.value.toString() });
  }

  if (maxValue.value !== null) {
    // 確保最大值存在
    console.log('maxValue', maxValue.value.toString());
    filters.push({ id: 'readCount', value: maxValue.value.toString() });
  }

  // 設定所有過濾器
  props.table.setColumnFilters(filters);
  console.log('Current filters:', filters); // 打印當前過濾器狀態
}
</script>

<style lang="scss">
@import '@/assets/style/all.scss';

.searchInput {
  border: 1px solid $danger-color;
  border-radius: 50px;
  padding: 8px 15px;
}
</style>
