<template>
  <div
    v-if="header.column.getCanSort()"
    class="sort-btn flex flex-col"
  >
    <button @click="setSort('asc')">
      <svgIcon
        name="sortUp"
        :class="{ active: isAsc }"
      />
    </button>
    <button @click="setSort('desc')">
      <svgIcon
        name="sortDown"
        :class="{ active: isDesc }"
      />
    </button>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  header: Object,
});
const isAsc = ref(false);
const isDesc = ref(false);
const setSort = (direction) => {
  if (direction === 'asc') {
    isAsc.value = true;
    isDesc.value = false;
  } else if (direction === 'desc') {
    isAsc.value = false;
    isDesc.value = true;
  }
};
// 監聽 header 的排序狀態變化，更新按鈕的狀態
watch(
  () => props.header.column.getIsSorted(),
  (newSort) => {
    console.log('newSort', newSort);
    isAsc.value = newSort === 'asc';
    isDesc.value = newSort === 'desc';
  },
);
</script>
<style lang="scss" scoped>
@import '@/assets/style/all.scss';
.svgIcon {
  width: 11px;
  height: 11px;
  fill: $danger-color;
}
.active {
  fill: $primary-color;
}
</style>
