<template>
  <div class="aside-menu flex flex-col justify-between">
    <ul>
      <li
        v-for="(group, groupIndex) in groupedRoutes"
        :key="group.category || group.routes[0].meta.title"
      >
        <!-- 如果有 category，顯示群組，並允許展開/收起子路由 -->
        <div
          v-if="group.category"
          :class="['category']"
          @click="toggleSubList(groupIndex)"
        >
          <svgIcon
            :name="group.category"
            class="w-[22px] h-[22px]"
          />
          <p>{{ $t(`asideMenu.${group.category}`) }}</p>
        </div>

        <!-- 如果沒有 category，僅顯示單一路由 -->
        <div
          v-else
          :class="['category', { active: group.routes[0].checked }]"
          @click="toggleSingleRoute(groupIndex)"
        >
          <svgIcon
            :name="group.routes[0].meta.title"
            class="w-[22px] h-[22px]"
          />
          <p>{{ $t(`asideMenu.${group.routes[0].meta.title}`) }}</p>
        </div>

        <!-- 顯示該群組下的子路由 -->
        <ul v-if="group.show && group.routes.length > 0">
          <li
            v-for="(subItem, subIndex) in group.routes"
            :key="subItem.meta.title"
            class="subList text-left"
            @click="toggleSubRoute(groupIndex, subIndex)"
          >
            <p>{{ $t(`asideMenu.${subItem.meta.title}`) }}</p>
          </li>
        </ul>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const routes = router.options.routes[0].children;
const groupedRoutes = ref([]);

// 將路由依據 category 進行分組
const groupRoutesByCategory = (routes) => {
  const grouped = {};

  routes.forEach((route) => {
    const category = route.meta?.category; // 若無 category，則設為 undefined
    if (!category) {
      // 如果沒有 category，則直接根據 meta.title 分組
      grouped[route.meta.title] = {
        category: undefined, // 沒有 category 時為 undefined
        routes: [route],
        show: false,
      };
    } else {
      // 有 category 的情況下進行分組
      if (!grouped[category]) {
        grouped[category] = {
          category: category,
          routes: [],
          show: false,
        };
      }
      grouped[category].routes.push(route);
    }
  });

  return Object.values(grouped); // 回傳分組後的路由陣列
};

onMounted(() => {
  groupedRoutes.value = groupRoutesByCategory(routes);
});

// 展開或收起有子路由的群組
const toggleSubList = (groupIndex) => {
  groupedRoutes.value.forEach((group, i) => {
    group.show = i === groupIndex ? !group.show : false;
  });
};

// 單一路由的點擊事件
const toggleSingleRoute = (groupIndex) => {
  groupedRoutes.value.forEach((group, i) => {
    group.routes.forEach((route) => {
      route.checked = false;
    });
  });
  groupedRoutes.value[groupIndex].routes[0].checked = true;
  // 可選擇在此處導航到該路由
  router.push({ name: groupedRoutes.value[groupIndex].routes[0].name });
};

// 子路由的點擊事件
const toggleSubRoute = (groupIndex, subIndex) => {
  groupedRoutes.value.forEach((group, i) => {
    group.show = i === groupIndex;
    group.routes.forEach((route) => {
      route.checked = false;
    });
  });
  groupedRoutes.value[groupIndex].routes[subIndex].checked = true;
  // 可選擇在此處導航到該子路由
  router.push({ name: groupedRoutes.value[groupIndex].routes[subIndex].name });
};
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
  cursor: pointer;
}

.subList {
  padding: 14px 64px;
  cursor: pointer;
}
</style>
