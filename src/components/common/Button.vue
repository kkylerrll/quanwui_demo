<template>
  <button
    :class="['btn', btnClass, outline ? 'outline' : '']"
    @click="handleClick"
    @touchend.prevent="handleClick"
  >
    <svgIcon
      v-if="icon"
      :name="icon"
    />
    <p>{{ label }}</p>
  </button>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  outline: {
    type: Boolean,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
});
const emit = defineEmits('click');
const btnClass = computed(() => {
  return {
    'btn-primary': props.type === 'primary',
    'btn-secondary': props.type === 'secondary',
    'btn-success': props.type === 'success',
    'btn-danger': props.type === 'danger',
  };
});
const handleClick = () => {
  emit('click');
};
</script>
<style lang="scss" scoped>
@import '@/assets/style/all.scss';
</style>
