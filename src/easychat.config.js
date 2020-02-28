import registerResult from '@/views/pages/RegisterResult';
import NotFoundComponent from '@/views/pages/404/NotFoundComponent';
import Auth from '@/views/pages/Auth';

import EasyChat from '@/views/EasyChat';
import Mine from '@/views/Mine';
import Square from '@/views/Square';

import comment from '@/assets/icon/tabbar/comment.svg';
import comment_select from '@/assets/icon/tabbar/comment_fill.svg';
import mine from '@/assets/icon/tabbar/mine.svg';
import mine_select from '@/assets/icon/tabbar/mine_fill.svg';
import contacts from '@/assets/icon/tabbar/barrage.svg';
import contacts_select from '@/assets/icon/tabbar/barrage_fill.svg';
import square from '@/assets/icon/tabbar/square.svg';
import square_fill from '@/assets/icon/tabbar/square_fill.svg';

export default {
  routes: [
    {
      path: '/',
      component: () => import( '@/layouts/BasicLayout'),
      children: [
        {
          path: '/',
          redirect: '/home/easychat',
        },
        {
          path: '/home',
          component: () => import(/* webpackChunkName: "home.chunk" */'@/layouts/TabbarLayout'),
          redirect: '/home/easychat',
          name: 'home',
          children: [
            {
              path: 'easychat',
              name: 'easychat',
              component: () => import(/* webpackChunkName: "easychat.chunk" */'@/views/EasyChat'),
              meta: {
                requiresAuth: true,
                title: '简聊',
                icon: comment,
                icon_select: comment_select,
                hideBackBtn: true,
              },
            },
            {
              path: 'contacts',
              name: 'contacts',
              component: () => import(/* webpackChunkName: "contacts.chunk" */'@/views/Contacts'),
              meta: {
                requiresAuth: true,
                title: '通讯录',
                icon: contacts,
                icon_select: contacts_select,
                hideBackBtn: true,
              },
            },
            {
              path: 'square',
              name: 'square',
              component: () => import(/* webpackChunkName: "square.chunk" */'@/views/Square'),
              meta: {
                requiresAuth: true,
                title: '广场',
                icon: square,
                icon_select: square_fill,
                hideBackBtn: true,
              },
            },
            {
              path: 'mine',
              name: 'mine',
              component: () => import(/* webpackChunkName: "mine.chunk" */'@/views/Mine'),
              meta: {
                requiresAuth: true,
                title: '我的',
                icon: mine,
                icon_select: mine_select,
                hideBackBtn: true,
              },
            },
          ],
        },
        {
          path: '/mine/edit',
          name: 'MineInfoEdit',
          component: () => import(/* webpackChunkName: "mineInfo-edit.chunk" */ '@/views/MineInfoEdit/index.vue'),
          meta: {
            title: '个人信息编辑',
            requiresAuth: true,
          },
        },
        {
          path: '/mine/setting',
          name: 'Setting',
          component: () => import(/* webpackChunkName: "setting.chunk" */ '@/views/Setting/index.vue'),
          meta: {
            title: '设置',
            requiresAuth: true,
          },
        },
        {
          path: '/contacts/addPeople',
          name: 'AddPeople',
          component: () => import(/* webpackChunkName: "add-people.chunk" */'@/views/AddPeople'),
          meta: {
            title: '添加好友',
            requiresAuth: true,
            // keepAlive: true,
          },
        },
        {
          path: '/userCard/:userInfo',
          name: 'UserCard',
          component: () => import(/* webpackChunkName: "user-card.chunk" */'@/views/pages/UserCard'),
          meta: {
            title: '详细资料',
            requiresAuth: true,
          },
        },
        {
          path: '/addPeopleRequest',
          name: 'AddPeopleRequest',
          component: () => import(/* webpackChunkName: "add-people-request.chunk" */'@/views/pages/AddPeopleRequest'),
          meta: {
            title: '好友请求',
            requiresAuth: true,
          },
        },
        {
          path: '/chat',
          name: 'Chat',
          component: () => import(/* webpackChunkName: "chat.chunk" */'@/views/Chat'),
          meta: {
            title: function () {
              return '测试';
            },
            requiresAuth: true,
          },
        },
        {
          path: '/chat/square',
          name: 'chatSquare',
          component: () => import(/* webpackChunkName: "chat-square.chunk" */'@/views/ChatSquare'),
          meta: {
            title: '广场',
            requiresAuth: true,
          },
        },
        {
          path: '/register',
          name: 'register',
          meta: {
            title: '注册',
          },
          component: () => import(/* webpackChunkName: "register.chunk" */'@/views/Register'),
        },
        {
          path: '/register/active',
          name: 'registerActive',
          component: () => import(/* webpackChunkName: "register-active.chunk" */'@/views/pages/RegisterActive'),
          meta: {
            title: '激活',
          },
        },
        {
          path: '/test',
          name: 'test',
          component: () => import(/* webpackChunkName: "test.chunk" */'@/views/Test'),
          meta: {
            title: '测试页面',
          },
        },
        {
          path: '/avatar',
          name: 'avatar',
          component: () => import(/* webpackChunkName: "avatar.chunk" */'@/views/Avatar'),
          meta: {
            title: '头像选择',
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () =>  import(/* webpackChunkName: "login.chunk" */'@/views/Login'),
    },
    {
      path: '/register/result',
      name: 'registerResult',
      component: registerResult,
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
    },
    {
      path: '*',
      component: NotFoundComponent,
    },
  ],
};
