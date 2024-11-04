<template>
  <div class="dashboard">
    <div class="primary">
      <section class="weclome-container">
        <p class="weclome-text">
          歡迎回來
          <span>{{ userName }}</span>
        </p>
        <ul class="weclome-list">
          <li class="list-item generate-sheet-box">
            <div class="list-header">
              <svgIcon name="tableGroup" />
              <p>生成張數</p>
            </div>
            <div class="action">
              <p class="sheet-text">{{ generateSheet }}</p>
              <svgIcon name="right" />
            </div>
          </li>
          <li class="list-item membership-plan-box">
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
            <p>{{ item.level_name }}</p>
            <div class="money-box">
              <svgIcon name="money" />
              <p>{{ item.amount }}</p>
              <span v-if="item.amount !== 0">/月</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="usage-container"></section>
    </div>
    <div class="second"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
const userName = ref<String>('林經理');
const generateSheet = ref<Number>(59);
const memberLevel = ref<Number>(0);
const levelText = computed<String>(() => {
  switch (memberLevel.value) {
    case 0:
      return '免費方案';
    case 1:
      return '基礎方案';
    case 2:
      return '進階方案';
    case 4:
      return '專業方案';
    default:
      return '免費方案';
  }
});
const planData = ref([
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
</script>

<style lang="scss" scoped>
@import '@/assets/style/all.scss';
.dashboard {
  display: flex;
  text-align: start;
  padding: 0 30px;
  flex: 1;
}
.weclome-container {
  padding: 25px 30px 20px;
  border-radius: 10px;
  background-image: url(@/assets/images/backstageImg.png);
  background-repeat: no-repeat;

  .weclome-text {
    font-size: 22px;
    margin-bottom: 23px;
  }
  .weclome-list {
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
  display: flex;
}
.level-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>
