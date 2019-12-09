import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './vendor';
import RouteTransition from '@/components/layout/RouteTransition';

Vue.component('RouteTransition', RouteTransition);

Vue.config.productionTip = false;

store.dispatch('init');

// 路由守卫设置
const history = window.sessionStorage;
history.clear();
let historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);

router.beforeEach((to, from, next) => {
  const toIndex = history.getItem(to.path);
  const fromIndex = history.getItem(from.path);

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('UPDATE_DIRECTION', {
        direction: store.state.nav.isGobackOn ? 'reverse' : 'forward',
      });
    } else {
      store.commit('UPDATE_DIRECTION', { direction: 'reverse' });
    }
  } else {
    ++historyCount;
    history.setItem('count', historyCount);
    to.path !== '/' && history.setItem(to.path, historyCount);
    store.commit('UPDATE_DIRECTION', {
      direction: store.state.nav.isGobackOn ? 'reverse' : 'forward',
    });
  }

  if (store.state.token) {
    if (store.state.isLogin) {
      to.path === '/login' ? next('/home/easychat') : next();
    } else {
      to.path === '/auth' ? next() : next({ path: '/auth', query: { redirect_url: to.fullPath } });
    }
  } else {
    if (to.meta.requiresAuth) {
      to.path === '/login' ? next() : next('/login');
    } else {
      next();
    }
  }
});

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
