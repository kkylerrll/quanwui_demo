<template>
  <div class="aside-menu flex flex-col justify-between">
    <ul>
      <li></li>
    </ul>
    <div
      class="logoutBtn flex justify-center items-center p-3"
      @click="logout"
    >
      <svgIcon
        name="logout"
        class="logoutIcon w-[22px] h-[22px]"
      />
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

.logoutBtn {
  background-color: $secondary-color;
}

.text {
  font-size: $fz2;
}
</style>
