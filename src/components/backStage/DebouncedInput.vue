<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';

// 定義 props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  debounce: {
    type: Number,
    default: 500,
  },
});

// 定義 emits
const emit = defineEmits(['update:modelValue']);

const timeout = ref(null);

// 使用 computed 屬性來管理本地值
const localValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
    timeout.value = setTimeout(
      () => emit('update:modelValue', newValue),
      props.debounce,
    );
  },
});

// 清除 timeout 當組件卸載時
onBeforeUnmount(() => clearTimeout(timeout.value));
</script>

<template>
  <input
    v-model="localValue"
    v-bind="$attrs"
  />
</template>
