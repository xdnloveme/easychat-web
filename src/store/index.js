import Vue from 'vue';
import Vuex from 'vuex';

import router from '@/router';
import nav from './modules/nav';
import square from './modules/square';
import chat from './modules/chat';
import contacts from './modules/contacts';
import badge from './modules/badge';
import loginService from '@/service/login';
import userService from '@/service/user';
import TabbarLayout from '@/layouts/TabbarLayout';
import { authToken } from '@/api/data';
import { createChatServer, clearChatServer } from '@/socket/chatRoom';

Vue.use(Vuex);

const types = {
  INIT: 'INIT', // 项目初始化
  INIT_TABBAR: 'INIT_TABBAR', // 因为Tabbar条目的设置可能异步，所以单独剥离出来
  UPDATE_DIRECTION: 'UPDATE_DIRECTION', // 更新路由过渡动效
  LOGIN_SUCCESS: 'LOGIN_SUCCESS', // 登陆成功
  LOGOUT_CLEAR: 'LOGOUT_CLEAR', // 登出后的清理步骤
  PUBLICINFO_MODIFY: 'PUBLICINFO_MODIFY', // 个人公开信息的修改
  ANIMATION_STATE: 'ANIMATION_STATE', // 路由跳转的过渡动效是否在过渡期间
  DYNAMIC_KEEPALIVE_ROUTES: 'DYNAMIC_KEEPALIVE_ROUTES', // 初始化需要缓存的路由数组
  SOCKET_SERVER_CREATE: 'SOCKET_SERVER_CREATE', // 创建socket服务器
  SOCKET_SET_SERVER_ID: 'SOCKET_SET_SERVER_ID', // 设置socket服务器连接后的socketId值
  SOCKET_SERVER_CLEAR: 'SOCKET_SERVER_CLEAR', // 断开并清除socket服务器
};

// 获取tabbar路由，递归写法
const getTabbarRoutes = async routes => {
  let tabbarRoutes = {};
  for (let i = 0; i < routes.length; i++) {
    const { component, path, children = [] } = routes[i];
    if (component === TabbarLayout) {
      tabbarRoutes[path] = children;
    } else if (typeof component === 'function') {
      const modules = await component();
      if (modules.default === TabbarLayout) {
        tabbarRoutes[path] = children;
      }
    }

    if (children && children.length > 0) {
      const tabbarRoutesChildren = await getTabbarRoutes(children);
      tabbarRoutes = {
        ...tabbarRoutes,
        ...tabbarRoutesChildren,
      };
    }
  }
  return tabbarRoutes;
};

const findKeepAliveRoutes = routes => {
  let keepAliveRoutes = [];
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].meta) {
      const { keepAlive } = routes[i].meta;
      if (keepAlive) {
        keepAliveRoutes.push(routes[i]);
      }
    }

    if (routes[i].children && routes[i].children.length > 0) {
      keepAliveRoutes = keepAliveRoutes.concat(findKeepAliveRoutes(routes[i].children));
    }
  }
  return keepAliveRoutes;
};

export default new Vuex.Store({
  modules: {
    nav,
    square,
    chat,
    contacts,
    badge,
  },
  state: {
    direction: '',
    tabbar: {},
    keepAliveRoutes: '', // 缓存的路由组件名称（以,符号隔开）
    token: null,
    isLogin: false,
    isDuringAnimation: false,
    publicInfo: {},
    chatServer: null,
    chatServerId: null,
  },
  getters: {
    direction () {
      return this.state.direction;
    },
    isRenderTabbar () {
      return this.state.isRenderTabbar;
    },
  },
  actions: {
    // 初始化
    async init ({ commit }) {
      const token = window.localStorage.getItem('EASYCHAT-TOKEN');
      commit(types.INIT, { token, tabbarRoutes });

      const { options } = router;
      const { routes } = options;
      const tabbarRoutes = await getTabbarRoutes(routes);
      commit(types.INIT_TABBAR, { tabbarRoutes });
    },
    async login (context, { username, password }) {
      const loginResult = await loginService.loginService({
        username,
        password,
      });

      if (!loginResult.state) {
        return loginResult;
      }

      const token = loginResult.data['token'];
      const publicInfo = loginResult.data['publicInfo'];
      // 成功登陆
      context.commit(types.LOGIN_SUCCESS, { publicInfo, token });
      return loginResult;
    },
    // token校验
    async authToken (context) {
      const token = context.state['token'] || null;
      if (!token) {
        return { state: false, data: null };
      }

      const response = await authToken();
      if (response.code !== 0) {
        context.commit(types.LOGOUT_CLEAR);
        return { state: false, data: response };
      }

      const { publicInfo } = response.data;
      context.commit(types.LOGIN_SUCCESS, { token, publicInfo });

      return { state: true, data: response };
    },
    async logout (context) {
      const logoutResult = await loginService.logoutService();
      if (logoutResult.state) {
        context.commit(types.LOGOUT_CLEAR);
      }

      return logoutResult;
    },
    /**
     * 修改个人公开信息接口
     * @param {*} context 上下文
     * @param {*} modifyAttribute publicInfo（公开信息）的某个属性值，比如你要改变nickname，传入{ nickname: 'modifyValue' }
     */
    async modifyPublicInfo ({ commit, state }, modifyAttribute) {
      const newPublicInfo = {
        ...state.publicInfo,
        ...modifyAttribute,
      };
      const response = await userService.setModifyPublicInfo(newPublicInfo);
      const { publicInfo } = response.data;
      commit('PUBLICINFO_MODIFY', publicInfo);
      return { state: true, data: response };
    },
  },
  mutations: {
    // 初始化项目初始属性
    [types.INIT] (state, { token }) {
      state.token = token || null;
    },
    [types.INIT_TABBAR] (state, { tabbarRoutes = {} }) {
      const tabbar = {};
      Object.keys(tabbarRoutes).map(key => {
        tabbar[key] = tabbarRoutes[key].map(({ meta, path }) => {
          if (key.indexOf('/') === -1) {
            key = `/${key}`;
          }
          if (path.indexOf('/') === -1) {
            path = `/${path}`;
          }
          return {
            ...meta,
            name: meta.title,
            router: `${key}${path}`,
          };
        });
      });
      state.tabbar = tabbar;
    },
    // 更新过渡动效
    [types.UPDATE_DIRECTION] (state, { direction }) {
      state.direction = direction;
    },
    // 登录成功
    [types.LOGIN_SUCCESS] (state, { publicInfo, token }) {
      state.token = token;
      state.isLogin = true;
      this.commit(types.PUBLICINFO_MODIFY, publicInfo);
      // 创建聊天socket服务器（客户端对象）
      this.commit(types.SOCKET_SERVER_CREATE);
      // 初始化通讯录
      this.dispatch('contacts/init');
      window.localStorage.setItem('EASYCHAT-TOKEN', token);
    },
    [types.PUBLICINFO_MODIFY] (state, publicInfo) {
      state.publicInfo = {
        ...state.publicInfo,
        ...publicInfo,
      };
    },
    [types.SOCKET_SERVER_CREATE] (state) {
      state.chatServer = createChatServer();
      // chat模块初始化
      this.dispatch('chat/init', state.chatServer);
      // square广场模块初始化
      this.dispatch('square/init', state.chatServer);
    },
    [types.SOCKET_SET_SERVER_ID] (state, id) {
      state.chatServerId = id;
    },
    [types.SOCKET_SERVER_CLEAR] (state) {
      console.log('clear socket server ...');
      if (state.chatServer) {
        state.chatServer.disconnect();
      }
      clearChatServer();
      state.chatServer = null;
      state.chatServerId = null;
    },
    // 动态添加需要缓存的路由
    [types.DYNAMIC_KEEPALIVE_ROUTES] (state) {
      const filterKeepAlive = findKeepAliveRoutes(router.options.routes);
      // 记得把需要keepAlive缓存起来的路由组件映射到全局的state状态中去，每次登陆的时候去设定需要缓存的内容
      state.keepAliveRoutes = filterKeepAlive
        .map(eachRoute => {
          // 如果是懒加载的异步组件，获取不到name属性，在route节点中自行添加name属性保证一致
          if (typeof eachRoute.component === 'function') {
            if (!eachRoute.name) {
              throw new Error('请指定懒加载路由的name和组件component的name一致');
            }
            return eachRoute.name;
          }
          return eachRoute.component.name;
        })
        .join(',');
    },
    // 登出后的清理动作
    [types.LOGOUT_CLEAR] (state) {
      state.token = null;
      window.localStorage.removeItem('EASYCHAT-TOKEN');
      this.commit('SOCKET_SERVER_CLEAR');
      this.commit('chat/CHAT_CLEAR');

      // 每次登出的时候，一定要把keepAlive里面的值清空，清空登录后用户各个页面的缓存。
      // 目的是防止下一次登录时候缓存上一个用户的信息
      state.keepAliveRoutes = '';

      // 这个异步更新，为了在最后一步再次设置动态缓存路由
      Vue.prototype.$nextTick(() => {
        this.commit('DYNAMIC_KEEPALIVE_ROUTES');
      });
    },
    // 过渡动效变化(是否在动画中)
    [types.ANIMATION_STATE] (state, isDuringAnimate) {
      state.isDuringAnimation = isDuringAnimate;
    },
  },
});
