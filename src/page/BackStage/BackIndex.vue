<template>
  <div class="backIndex">
    <Headers />
    <div class="back-container flex">
      <AsideMenu></AsideMenu>
      <router-view />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss">
// @import '@/assets/style/all.scss';;

.backIndex {
  background-color: #f7f7f7;
  overflow: hidden;
}
.back-container {
  height: calc(100dvh - var(--header-height));
}
</style>
