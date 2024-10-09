<template>
  <div class="backIndex">
    <Headers />
    <div class="back-container">
      <AsideMenu></AsideMenu>
      <router-view />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss">
@import '@/assets/style/all.scss';

.backIndex {
  background-color: $background-color;
}
</style>
