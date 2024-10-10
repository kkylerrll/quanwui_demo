<template>
  <v-dialog
    :modelValue="modelValue"
    :maxWidth="width"
    persistent
  >
    <v-card>
      <v-card-title>
        <span>{{ title }}</span>
        <svgIcon
          name="close"
          @click="close"
        />
      </v-card-title>
      <v-tabs v-model="tab">
        <v-tab value="one">基本資料</v-tab>
        <v-tab value="two">客戶資訊</v-tab>
      </v-tabs>
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">One</v-tabs-window-item>

          <v-tabs-window-item value="two">
            <v-form>
              <v-row dense>
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <p>客戶名稱</p>
                  <v-text-field
                    v-model="selectedUser.name"
                    required
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <p>客戶電話</p>
                  <v-text-field v-model="selectedUser.phone"></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <p>作品分類</p>
                  <v-select
                    :items="['設計', '18-29', '30-54', '54+']"
                    label="作品分類"
                    required
                    menuIcon="mdi-chevron-down"
                  ></v-select>
                </v-col>

                <v-col
                  cols="12"
                  md="3"
                  sm="6"
                >
                  <v-select
                    v-model="selectedUser.city"
                    :items="taiwanCity"
                    @change="updateDistricts"
                  ></v-select>
                </v-col>

                <v-col
                  cols="12"
                  md="3"
                  sm="6"
                >
                  <v-select
                    v-model="selectedUser.district"
                    :items="taiwanDistricts"
                  ></v-select>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                >
                  <v-text-field label="地址"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-for="btn in btns"
          :key="btn.label"
          :theme="btn.theme"
          @click="btnAction(btn)"
        >
          {{ btn.label }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  isShow: Boolean,
  title: String,
  content: String,
  width: String,
  btns: Array,
  dialogId: String,
  modelValue: Boolean,
  userId: Number,
});

const isShow = ref(props.isShow);
const tab = ref('one');
const emit = defineEmits(['update:modelValue']);

function btnAction(btn) {
  if (btn.action) {
    btn.action();
  }
  if (btn.close) {
    close();
  }
}

function close() {
  isShow.value = false;
  emit('update:modelValue', false);
}

const users = ref([]);
const taiwanCity = ref([]);
const taiwanDistricts = ref([]);
const selectedUser = ref(null);
let taiwanAreas = {};

onMounted(async () => {
  try {
    const response = await axios.get('/api/taiwan-users', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    users.value = response.data.data; // 獲取模擬的資料
    const { taiwanUsers, taiwanAreas: areas } = response.data.data;
    users.value = taiwanUsers;
    taiwanAreas = areas;
    taiwanCity.value = Object.keys(taiwanAreas);
  } catch (error) {
    console.error(error);
  }
});

// 更新鄉鎮市區選項
function updateDistricts() {
  const selectedCity = selectedUser.value.city;
  taiwanDistricts.value = taiwanAreas[selectedCity] || []; // 根據選擇的縣市更新鄉鎮市區
  if (taiwanDistricts.value.length > 0) {
    selectedUser.value.district = taiwanDistricts.value[0]; // 設置為第一個鄉鎮市區
  }
}

watch(
  () => props.userId,
  (newValue) => {
    if (newValue) {
      selectedUser.value =
        users.value.find((user) => user.id === newValue) || null;
      updateDistricts();
    } else {
      selectedUser.value = null; // 若沒有 userId，則清空選擇的用戶
    }
  },
);

// 監聽 selectedUser.city 的變化
watch(
  () => selectedUser.value?.city,
  (newCity) => {
    if (newCity) {
      updateDistricts(); // 當選擇的城市改變時，更新鄉鎮市區
    } else {
      taiwanDistricts.value = []; // 若沒有選擇城市，清空鄉鎮市區
    }
  },
);
</script>

<style lang="scss" scoped>
// @import '@/assets/style/all.scss';
.v-dialog {
  .v-overlay__content {
    .v-card {
      border-radius: 20px;
    }
  }
}
.v-card-title {
  display: flex;
  justify-content: space-between;
  padding: 20px 24px;
}
</style>
