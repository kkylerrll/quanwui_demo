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
          <v-tabs-window-item value="one">
            <FirstForm @close="close" />
          </v-tabs-window-item>
          <v-tabs-window-item value="two">
            <v-form
              id="check-form"
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
                    v-model="formValues.name"
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
                    v-model="formValues.phone"
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
                    v-model="formValues.email"
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
                    v-model="formValues.city"
                    :items="taiwanCity"
                    :errorMessages="errors.city"
                    @change="updateDistricts"
                  ></v-select>
                </v-col>

                <v-col
                  cols="12"
                  md="3"
                  sm="6"
                >
                  <v-select
                    v-model="formValues.district"
                    :items="taiwanDistricts"
                    :errorMessages="errors.district"
                  ></v-select>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                >
                  <v-text-field
                    v-model="formValues.street"
                    label="地址"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-spacer></v-spacer>
              <v-btn
                text="Close"
                variant="plain"
                @click="close"
              ></v-btn>

              <v-btn
                form="check-form"
                color="primary"
                text="Save"
                variant="tonal"
                type="submit"
              ></v-btn>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions></v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import axios from 'axios';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import FirstForm from './FirstForm.vue';

const props = defineProps({
  title: String,
  width: String,
  modelValue: Boolean,
  userId: Number,
});

const emit = defineEmits(['update:modelValue']);
const tab = ref('one');
const taiwanCity = ref([]);
const taiwanDistricts = ref([]);
const users = ref([]);
const selectedUser = ref({});
let taiwanAreas = {};

const formValues = ref({});

// 定義 Yup 驗證規則
const schema = yup.object().shape({
  name: yup.string().required('名稱是必填的'),
  phone: yup
    .string()
    .required('電話是必填的')
    .matches(/^09\d{8}$/, '請輸入有效的電話號碼'),
  email: yup
    .string()
    .email('請輸入有效的電子郵件')
    .required('電子郵件是必填的'),
  city: yup.string().nullable(),
  district: yup.string().nullable(),
  street: yup.string().nullable(),
});

// 使用 vee-validate 進行表單管理
const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  // initialValues: formValues.value,
});

onMounted(async () => {
  try {
    const response = await axios.get('/api/taiwan-users');
    const { taiwanUsers, taiwanAreas: areas } = response.data.data;
    users.value = taiwanUsers;
    taiwanAreas = areas;
    taiwanCity.value = Object.keys(taiwanAreas);
  } catch (error) {
    console.error(error);
  }
});

// 監聽 userId 變化
watch(
  () => props.userId,
  (newValue) => {
    if (newValue) {
      selectedUser.value =
        users.value.find((user) => user.id === newValue) || null;
      formValues.value = { ...selectedUser.value };
      updateDistricts();
    } else {
      selectedUser.value = null;
      resetForm();
    }
  },
);

watch(
  () => selectedUser.value,
  (newUser) => {
    if (newUser) {
      formValues.value = { ...newUser };
    } else {
      resetForm(); // 清空表單
    }
  },
);

function updateDistricts() {
  const selectedCity = formValues.value.city;
  taiwanDistricts.value = taiwanAreas[selectedCity] || [];
}

function close() {
  emit('update:modelValue', false);
}

// 處理提交表單
function onSubmit() {
  console.error(errors.value);
  console.log(formValues.value);
  handleSubmit((values) => {
    console.log('提交的表單資料:', values);
    emit('update:modelValue', false);
  })();
}
</script>

<style lang="scss" scoped>
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
