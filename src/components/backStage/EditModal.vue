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
            <v-form
              ref="form"
              v-slot="{ errors }"
              @submit.prevent="onSubmit"
            >
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
                    :errorMessages="errors.name"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <p>客戶電話</p>
                  <v-text-field
                    v-model="selectedUser.phone"
                    required
                    :errorMessages="errors.phone"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <p>電子信箱</p>
                  <v-text-field
                    v-model="selectedUser.email"
                    required
                    :errorMessages="errors.email"
                  ></v-text-field>
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
                  <v-text-field
                    v-model="address.street"
                    label="地址"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          variant="plain"
          @click="close"
        ></v-btn>

        <v-btn
          color="primary"
          text="Save"
          variant="tonal"
          type="button"
          @click="onSubmit"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import axios from 'axios';
import { useForm } from 'vee-validate';
// 引入 Vee Validate 全部驗證規則
// import AllRules from '@vee-validate/rules';
import * as yup from 'yup';
const props = defineProps({
  title: String,
  content: String,
  width: String,
  btns: Array,
  dialogId: String,
  modelValue: Boolean,
  userId: Number,
});

const tab = ref('one');
const emit = defineEmits(['update:modelValue']);
const users = ref([]);
const taiwanCity = ref([]);
const taiwanDistricts = ref([]);
const selectedUser = ref({
  name: '',
  phone: '',
  email: '',
  city: '',
  district: '',
});
const address = ref({ street: '' });
const workCategories = ref(['設計', '藝術', '科技', '文學']);
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

function close() {
  emit('update:modelValue', false);
}

// 更新鄉鎮市區選項
function updateDistricts() {
  const selectedCity = selectedUser.value.city;
  taiwanDistricts.value = taiwanAreas[selectedCity] || []; // 根據選擇的縣市更新鄉鎮市區
  if (taiwanDistricts.value.length > 0) {
    selectedUser.value.district = taiwanDistricts.value[0]; // 設置為第一個鄉鎮市區
  }
}
// 定義台灣手機號碼的正則表達式
const phoneRegEx = /^09\d{8}$/;
// 定義表單規則
const schema = yup.object({
  name: yup.string().required('名稱是必填的'),
  phone: yup
    .string()
    .required('電話是必填的')
    .matches(phoneRegEx, '請輸入有效的電話號碼'),
  email: yup
    .string()
    .email('請輸入有效的電子郵件')
    .required('電子郵件是必填的'),
});
// 表單驗證
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    phone: '',
    mail: '',
  },
});

const onSubmit = handleSubmit(() => {
  console.log('提交', selectedUser.value, address, workCategories);
  emit('update:modelValue', false);
});
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
