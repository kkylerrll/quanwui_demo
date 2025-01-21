<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex justify-center items-center">
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
          type="number"
          placeholder="輸入最小值"
          class="rounded-md px-2 py-1 border border-gray-700 w-24"
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
          type="number"
          placeholder="輸入最大值"
          class="rounded-md px-2 py-1 border border-gray-700 w-24"
        />
      </div>
    </div>
    <div class="flex justify-center items-center">
      <!-- 日期篩選 -->
      <div>
        <label for="startDate">開始日期:</label>
        <input
          id="startDate"
          v-model="startDate"
          type="date"
        />

        <label for="endDate">結束日期:</label>
        <input
          id="endDate"
          v-model="endDate"
          type="date"
        />
      </div>
      <button
        class="rounded-[50px] bg-gray-700 px-2 py-1 text-white"
        @click="handleSearch"
      >
        搜尋
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// import DebouncedInput from './DebouncedInput.vue';
const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
  column: {
    type: Object,
    required: true,
  },
});
const filter = ref('');
const filterStatus = ref('');
const minValue = ref(null);
const maxValue = ref(null);
const startDate = ref('');
const endDate = ref('');
const filterReadCount = computed(() => props.column[2].getFilterValue());
const filterCreateTime = computed(() => props.column[4].getFilterValue());
function handleSearch() {
  const filters = []; // 用來存儲所有過濾器

  // 狀態過濾
  if (filterStatus.value) {
    filters.push({ id: 'status', value: filterStatus.value });
  }
  if (minValue.value !== null || maxValue.value !== null) {
    props.column[2].setFilterValue([minValue.value, maxValue.value]);
  }
  if (startDate.value !== '' || endDate.value !== '') {
    props.column[4].setFilterValue([startDate.value, endDate.value]);
  }

  // 閱讀次數篩選
  if (filterReadCount.value) {
    filters.push({ id: 'readCount', value: filterReadCount.value });
  }

  if (filterCreateTime.value) {
    filters.push({ id: 'createTime', value: filterCreateTime.value });
    console.log('有日期', filterCreateTime.value);
  }
  // 設定所有過濾器
  props.table.setColumnFilters(filters);
  console.log('Current filters:', filters);
  console.log('filterCreateTime', filterCreateTime.value);
}
</script>

<style lang="scss">
// @import '@/assets/style/all.scss';;

.searchInput {
  border: 1px solid #ff7635;
  border-radius: 50px;
  padding: 8px 15px;
}
</style>
