<template>
  <svg class="svgIcon" aria-hidden="true">
    <use :xlink:href="`#${props.name}`" />
  </svg>
</template>
<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#4D4D4D',
  },
  size: {
    type: String,
    default: '30px',
  },
  hoverColor: {
    type: String,
  },
});
</script>
<style>
.svgIcon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>
