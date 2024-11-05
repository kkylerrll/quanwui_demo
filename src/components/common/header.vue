<template>
  <div
    ref="headerWrap"
    class="header_box flex items-center justify-between"
  >
    <div class="logo_box">
      <img
        src="@/assets/logo_banner.png"
        alt=""
      />
    </div>
    <div class="actions flex justify-center items-center gap-2.5">
      <div class="notice">
        <svgIcon
          name="notice"
          class="w-[20px] h-[22px]"
        />
      </div>
      <div class="navbar flex justify-center items-center gap-2.5">
        <img
          src="@/assets/images/big.png"
          alt=""
        />
        <p>林經理</p>
        <svgIcon name="down" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
const headerWrap = ref(null);

const handleHeaderHeight = () => {
  nextTick(() => {
    if (headerWrap.value) {
      const height = headerWrap.value.clientHeight; // 獲取 DOM 高度
      document.documentElement.style.setProperty(
        '--header-height',
        `${height}px`,
      ); // 設置 CSS 變量
    }
  });
};

onMounted(() => {
  // handleHeaderHeight();
  // window.addEventListener('load', handleHeaderHeight);
  setTimeout(() => {
    handleHeaderHeight();
  }, 0);
});
</script>

<style lang="scss" scoped>
// @import '@/assets/style/all.scss';;

.header_box {
  padding: 20px 30px 25px;
}
</style>
