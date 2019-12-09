import Vue from 'vue';
import Toast from '@/components/packages/toast/index.js';
import Dialog from '@/components/packages/dialog/index.js';
import Axios from '@/api/config.js';
import NextTransitAfter from '@/utils/next-transit-after';
import service from '@/service';

Vue.config.productionTip = false

Vue.prototype.$global = {};

Vue.prototype.$nextTransitAfter = NextTransitAfter; // 过渡动画after完成的钩子
Vue.prototype.$confirm = Dialog.confirm; // 确认框
Vue.prototype.$toast = Toast; // 冒泡信息框

Vue.prototype.$axios = Axios;

// 所有业务模块
Vue.prototype.$service = service;

