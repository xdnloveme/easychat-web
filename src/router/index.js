import Vue from 'vue'
import Router from 'vue-router'
import config from '@/easychat.config.js';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: config.routes,
})
