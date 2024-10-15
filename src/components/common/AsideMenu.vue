<template>
  <div class="aside-menu flex flex-col justify-between">
    <ul>
      <li
        v-for="(item, index) in filteredRouter"
        :key="item.title"
      >
        <div v-if="item.children && item.children.length > 0">
          <svgIcon :name="item.meta.category" />
          <p>{{ $t(`asidemenu.${item.meta.category}`) }}</p>
          <svgIcon
            name="down"
            :class="[item.show ? 'rotate' : '', 'icon', 'dropDown']"
          ></svgIcon>
        </div>
        <div v-else>
          <svgIcon :name="item.meta.title" />
          <p>{{ $t(`asidemenu.${item.meta.title}`) }}</p>
        </div>
      </li>
    </ul>
    <div
      class="logoutBtn flex justify-center items-center p-3"
      @click="logout"
    >
      <svgIcon
        name="logout"
        class="logoutIcon w-[22px] h-[22px]"
      />
      <span class="text">{{ $t('asideMenu.logout') }}</span>
    </div>
  </div>
</template>

<script setup>
// import router from '@/router/index';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const routes = router.options.routes[0].children;

const filteredRouter = computed(() => {
  return routes.map((route) => {
    return {
      ...route,
      show: false,
      children: route.meta.category ? route.meta.category : [],
    };
  });
});
console.log(filteredRouter.value);
</script>

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
