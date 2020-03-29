import Vue from 'vue';
import easychatUi from 'easychat-ui';
import Axios from '@/api/config.js';
import NextTransitAfter from '@/utils/next-transit-after';
import service from '@/service';
import './registerServiceWorker';

Vue.use(easychatUi);
Vue.config.productionTip = false

Vue.prototype.$global = {};

Vue.prototype.$nextTransitAfter = NextTransitAfter; // 过渡动画after完成的钩子

Vue.prototype.$axios = Axios;

// 所有业务模块api
Vue.prototype.$service = service;
