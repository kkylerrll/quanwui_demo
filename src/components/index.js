import Headers from './common/header.vue';
import AsideMenu from './backStage/AsideMenu.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';

// 初始化
const component = {
  install(app) {
    // 定義全局組件
    app.component('Headers', Headers);
    app.component('AsideMenu', AsideMenu);
    app.component('SvgIcon', SvgIcon);
  },
};

// 暴露組件
export default component;
