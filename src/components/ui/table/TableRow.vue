<template>
  <tr :class="[rowClass, computedClass]">
    <slot></slot>
  </tr>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  rowClass: {
    type: String,
    default: '',
  },
  rowIndex: {
    type: Number,
  },
});

// 根據行索引決定行的顏色
const computedClass = computed(() => {
  return props.rowIndex % 2 === 0 ? 'evenRow' : 'oddRow';
});
</script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';

.evenRow {
  background-color: $secondary-color; /* 偶數行綠色 */
}
.oddRow {
  background-color: white; /* 奇數行白色 */
}
</style>
