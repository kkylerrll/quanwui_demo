import Headers from './common/header.vue';
import AsideMenu from './common/AsideMenu.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import Button from '@/components/common/Button.vue';

// 初始化
const component = {
  install(app) {
    // 定義全局組件
    app.component('Headers', Headers);
    app.component('AsideMenu', AsideMenu);
    app.component('SvgIcon', SvgIcon);
    app.component('CommonButton', Button);
  },
};

export default component;
