<template>
  <form @submit.prevent="onSubmit">
    <v-text-field
      v-model="name.value.value"
      label="Name"
      :errorMessages="name.errorMessage.value"
    ></v-text-field>
    <v-text-field
      v-model="phone.value.value"
      label="Phone"
      :errorMessages="phone.errorMessage.value"
    ></v-text-field>
    <v-text-field
      v-model="email.value.value"
      label="E-mail"
      :errorMessages="email.errorMessage.value"
    ></v-text-field>

    <v-text-field
      v-model="password.value.value"
      label="Password"
      type="password"
      :errorMessages="password.errorMessage.value"
    ></v-text-field>
    <v-btn
      color="primary"
      type="submit"
    >
      Submit
    </v-btn>
  </form>
</template>
<script setup>
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

// 定義驗證規則
const validationSchema = yup.object().shape({
  name: yup.string().required('名稱是必填的'),
  phone: yup
    .string()
    .required('電話是必填的')
    .matches(/^09\d{8}$/, '請輸入有效的電話號碼'),
  email: yup
    .string()
    .email('請輸入有效的電子郵件')
    .required('電子郵件是必填的'),
  password: yup
    .string()
    .min(8, '請輸入至少 8 位數的密碼')
    .required('請輸入密碼'),
});

// 使用 useForm 進行表單管理
const { handleSubmit } = useForm({
  validationSchema,
});

// 使用 useField 進行欄位驗證
const email = useField('email', validationSchema);
const password = useField('password', validationSchema);
const name = useField('name', validationSchema);
const phone = useField('phone', validationSchema);

// 提交表單的函式
const onSubmit = handleSubmit(async (values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>
