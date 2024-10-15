<template>
  <div class="aside-menu flex flex-col justify-between">
    <ul>
      <li v-for="(item, index) in filteredRouter" :key="item.title">
        <div
          v-if="item.children && item.children.length > 0"
          :class="['category']"
          @click="toggleSubList(index)"
        >
          <svgIcon :name="item.meta.title" class="w-[22px] h-[22px]" />
          <p>{{ $t(`asideMenu.${item.meta.title}`) }}</p>
        </div>
        <div
          v-else
          :class="['category', { active: item.checked }]"
          @click="toggleSubRoute(index, 0)"
        >
          <svgIcon :name="item.meta.title" class="w-[22px] h-[22px]" />
          <p>{{ $t(`asideMenu.${item.meta.title}`) }}</p>
        </div>
        <ul v-if="item.show && item.children && item.children.length > 0">
          <li
            v-for="(subItem, subIndex) in item.children"
            :key="subItem.title"
            class="subList text-left"
            @click="toggleSubRoute(index, subIndex)"
          >
            <p>{{ $t(`asideMenu.${subItem.meta.title}`) }}</p>
          </li>
        </ul>
      </li>
    </ul>
    <div class="logoutBtn flex justify-center items-center p-3" @click="logout">
      <svgIcon name="logout" class="logoutIcon w-[22px] h-[22px]" />
      <span class="text">{{ $t('asideMenu.logout') }}</span>
    </div>
  </div>
</template>

<script setup>
// import router from '@/router/index';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const routes = router.options.routes[0].children;
const filteredRouter = ref(routes);

onMounted();

const toggleSubList = (index) => {
  filteredRouter.value.forEach((routes, i) => {
    routes.show = i === index ? !routes.show : false;
  });
};

const toggleSubRoute = (index, subIndex) => {
  filteredRouter.value.forEach((routes, i) => {
    routes.show = i === index ? true : false;
    if (routes.children && routes.children.length > 0) {
      routes.children.forEach((item) => {
        item.checked = false;
      });
    }
  });
  filteredRouter[index].children[subIndex].checked = true;
};

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

.category {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 30px;
}

.subList {
  padding: 14px 64px;
}
</style>
