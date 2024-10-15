import { createI18n } from 'vue-i18n';
import tw from './tw.js';

// 設定語言檔案與預設語言
const i18n = createI18n({
  locale: 'tw', // 預設語言
  fallbackLocale: 'en', // 當找不到語言時的替代語言
  messages: {
    tw, // 繁體中文
  },
});

export default i18n;
