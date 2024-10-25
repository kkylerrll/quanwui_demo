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
      <!-- <label for="minValue">最小值:</label>
      <input
        id="minValue"
        v-model.number="minValue"
        type="number"
        placeholder="輸入最小值"
        class="rounded-md px-2 py-1 border border-gray-700"
        @update:modelValue="
          (value) => column[2].setFilterValue((old) => [value, old?.[1]])
        "
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
        class="rounded-md px-2 py-1 border border-gray-700"
        @update:modelValue="
          (value) => column[2].setFilterValue((old) => [old?.[0], value])
        "
      /> -->
      <DebouncedInput
        type="number"
        :modelValue="filterReadCount?.[0] ?? ''"
        class="rounded-md px-2 py-1 border border-gray-700 w-1/2"
        @update:model-value="
          (value) => column[2].setFilterValue((old) => [value, old?.[1]])
        "
      />
      <DebouncedInput
        type="number"
        :modelValue="filterReadCount?.[1] ?? ''"
        class="rounded-md px-2 py-1 border border-gray-700 w-1/2"
        @update:model-value="
          (value) => column[2].setFilterValue((old) => [old?.[0], value])
        "
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
import { ref, computed } from 'vue';
import DebouncedInput from './DebouncedInput.vue';
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
// const minValue = ref(null);
// const maxValue = ref(null);
const filterReadCount = computed(() => props.column[2].getFilterValue());

function handleSearch() {
  const filters = []; // 用來存儲所有過濾器

  // 狀態過濾
  if (filterStatus.value) {
    console.log('ok');
    filters.push({ id: 'status', value: filterStatus.value });
  }

  // // 閱讀次數篩選
  // const rangeValues = [];
  // if (minValue.value !== null) {
  //   console.log('minValue', minValue.value);
  //   rangeValues.push(minValue.value);
  // }

  // if (maxValue.value !== null) {
  //   console.log('maxValue', maxValue.value);
  //   rangeValues.push(maxValue.value);
  // }

  // if (rangeValues.length > 0) {
  //   filters.push({ id: 'readCount', value: rangeValues });
  // }
  // nextTick(() => {
  if (filterReadCount.value) {
    filters.push({ id: 'readCount', value: filterReadCount.value });
    console.log('有抓到資料', filterReadCount.value);
  }
  // });
  // 設定所有過濾器
  props.table.setColumnFilters(filters);
  console.log('Current filters:', filters); // 打印當前過濾器狀態
  // console.log('rangeValues', rangeValues);
  console.log('filterReadCount', filterReadCount.value);
  // console.log('filterReadCount min', filterReadCount.value[0]);
  // console.log('filterReadCount max', filterReadCount.value[1]);
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
