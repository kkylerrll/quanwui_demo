<template>
  <div class="aside-menu flex flex-col justify-between">
    <ul>
      <li></li>
    </ul>
    <div class="logoutBtn flex justify-center items-center" @click="logout">
      <svgIcon name="logout" class="icon" />
      <span class="text">登出</span>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';

.aside-menu {
  max-width: 250px;
  width: 100%;
  border-radius: 0 50px 0 0;
  background-color: $text-white-color;
}
</style>
