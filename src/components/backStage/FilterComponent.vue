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
        v-model.number="columnFilterValue"
        :min="props.column.getFacetedMinMaxValues ? [0] : ''"
        :max="props.column.getFacetedMinMaxValues ? [1] : ''"
        type="number"
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
        type="number"
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
const minValue = ref(props.column.getFacetedMinMaxValues ? [0] : '');
const maxValue = ref(props.column.getFacetedMinMaxValues ? [1] : '');
console.log('column', props.column);

// const emit = defineEmits(['update:filterStatus']);
// function updateFilterStatus() {
//   console.log(filterStatus.value);
//   props.table.setColumnFilters();
//   emit('update:filterStatus', filterStatus.value);
// }
const columnFilterValue = computed(() => props.column.getFilterValue());

function handleSearch() {
  if (filterStatus.value) {
    console.log('ok');
    props.table.setColumnFilters([{ id: 'status', value: filterStatus.value }]);
  }
  if (minValue.value) {
    console.log('min', minValue.value);
  }
  console.log('columnFilterValue', columnFilterValue);
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
