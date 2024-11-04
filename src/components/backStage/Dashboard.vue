<template>
  <div class="dashboard">
    <div class="primary">
      <section class="welcome-container">
        <p class="welcome-text">
          {{ $t('dashboard.welcome') }}
          <span>{{ userName }}</span>
        </p>
        <ul class="welcome-list">
          <li class="list-item generate">
            <div class="list-header">
              <svgIcon name="tableGroup" />
              <p>{{ $t('dashboard.generateSheets') }}</p>
            </div>
            <div class="action">
              <p class="sheet-text">{{ generateSheet }}</p>
              <svgIcon name="right" />
            </div>
          </li>
          <li class="list-item membership">
            <div class="list-header">
              <svgIcon name="person" />
              <p>{{ levelText }}</p>
            </div>
          </li>
        </ul>
      </section>
      <section class="upgradePlan-container">
        <ul class="upgradePlan-box">
          <li
            v-for="item in planData"
            :key="item.id"
            class="level-card"
          >
            <div class="detail-box">
              <p class="level-name">
                {{ item.level_name }}
              </p>
              <div
                class="money-box"
                :class="{ 'free-money': item.amount == 0 }"
              >
                <svgIcon name="money" />
                <p class="money-text">
                  {{ item.amount }}
                </p>
                <span
                  v-if="item.amount !== 0"
                  class="month-text"
                >
                  {{ $t('dashboard.month') }}
                </span>
              </div>
              <div class="sheet-box">
                <p>{{ item.sheet }}</p>
                <p class="sheet-unit">{{ $t('dashboard.sheets') }}</p>
              </div>
            </div>
            <div
              class="btn-box"
              :class="{ 'using-btn': memberLevel == item.id }"
            >
              <p v-if="memberLevel == item.id">
                {{ $t('dashboard.using') }}
              </p>
              <CommonButton
                v-else
                label="升級"
                type="primary"
                outline
              />
            </div>
          </li>
        </ul>
      </section>
      <section class="usage-container">
        <BarChart
          :data="usageData"
          :categories="['total']"
          index="name"
          :rounded-corners="4"
        />
      </section>
    </div>
    <div class="second"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { BarChart } from '@/components/ui/chart-bar';
const userName = ref<String>('林經理');
const generateSheet = ref<Number>(59);
const memberLevel = ref<Number>(1);
const levelText = computed<String>(() => {
  switch (memberLevel.value) {
    case 1:
      return '免費方案';
    case 2:
      return '基礎方案';
    case 3:
      return '進階方案';
    case 4:
      return '專業方案';
    default:
      return '免費方案';
  }
});
const planData = reactive([
  {
    id: 1,
    level_name: '免費方案',
    amount: 0,
    sheet: 50,
  },
  {
    id: 2,
    level_name: '基礎方案',
    amount: 599,
    sheet: 1000,
  },
  {
    id: 3,
    level_name: '進階方案',
    amount: 799,
    sheet: 2000,
  },
  {
    id: 4,
    level_name: '專業方案',
    amount: 2000,
    sheet: 6000,
  },
]);
const usageData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
];
</script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';
.dashboard {
  display: flex;
  text-align: start;
  padding: 0 30px;
  flex: 1;
}
.primary {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}
.welcome-container {
  padding: 25px 30px 20px;
  border-radius: 10px;
  background-image: url(@/assets/images/backstageImg.png);
  background-repeat: no-repeat;

  .welcome-text {
    font-size: 22px;
    margin-bottom: 23px;
  }
  .welcome-list {
    display: flex;
    gap: 20px;
  }
  .list-item {
    min-width: 120px;
    max-width: 180px;
    width: 100%;
    padding: 20px;
    border-radius: 10px;
    background: #ffffff80;
    box-shadow: 2px 2px 4px 0px #0000001a;
  }
  .list-header {
    font-size: 16px;
    margin-bottom: 8px;
    .svgIcon {
      width: 30px;
      height: 30px;
      margin-bottom: 20px;
      fill: $orange-color;
    }
  }
  .action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .svgIcon {
      width: 16px;
      height: 16px;
    }
    .sheet-text {
      font-size: 26px;
      color: $orange-color;
    }
  }
}
.upgradePlan-box {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.level-card {
  background: #ffffff;
  box-shadow: 4px 4px 2px 0px #0000000d;
  border-radius: 10px;
  min-width: 225px;
  width: 100%;
}
.level-name {
  padding: 20px 0;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}
.money-box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  color: $orange-color;
  padding: 12px 0;
  .month-text {
    font-size: 20px;
    font-weight: 400;
    color: #bfbfbf;
  }
}
.free-money {
  color: #4d4d4d;
}
.sheet-box {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  padding: 20px 0;
  .sheet-unit {
    font-size: 16px;
    font-weight: 400;
    color: #bfbfbf;
  }
}
.btn-box {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}
.using-btn {
  padding-top: 10px;
}
</style>
