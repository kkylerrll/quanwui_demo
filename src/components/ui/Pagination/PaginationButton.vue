<template>
  <button
    :disabled="disabled"
    class="pagination-button"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

// 使用 emit 來發出 click 事件
const emit = defineEmits(['click']);

// 定義點擊事件處理函數
const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style lang="scss" scoped>
.pagination-button {
  padding: 8px;
  border: 1px solid #a7a7a7;
  border-radius: 50px;
  color: #a7a7a7;
}
.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
