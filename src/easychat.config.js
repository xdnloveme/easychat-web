import BasicLayout from '@/layouts/BasicLayout';
import MineInfoEdit from '@/views/MineInfoEdit';
import Setting from '@/views/Setting';
import AddPeople from '@/views/AddPeople';
import UserCard from '@/views/pages/UserCard';

import registerResult from '@/views/pages/RegisterResult';
import Login from '@/views/Login';
import registerActive from '@/views/pages/RegisterActive';
import NotFoundComponent from '@/views/pages/404/NotFoundComponent';
import Auth from '@/views/pages/Auth';

import EasyChat from '@/views/EasyChat';
import Mine from '@/views/Mine';
import Contacts from '@/views/Contacts';
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
      component: BasicLayout,
      children: [
        {
          path: '/',
          redirect: '/home/easychat',
        },
        {
          path: '/home',
          component: () => import('@/layouts/TabbarLayout'),
          redirect: '/home/easychat',
          name: 'home',
          children: [
            {
              path: 'easychat',
              name: 'easychat',
              component: EasyChat,
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
              component: Contacts,
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
              component: Square,
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
              component: Mine,
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
          component: MineInfoEdit,
          meta: {
            title: '个人信息编辑',
            requiresAuth: true,
          },
        },
        {
          path: '/mine/setting',
          name: 'Setting',
          component: Setting,
          meta: {
            title: '设置',
            requiresAuth: true,
          },
        },
        {
          path: '/contacts/addPeople',
          name: 'AddPeople',
          component: AddPeople,
          meta: {
            title: '添加好友',
            requiresAuth: true,
            // keepAlive: true,
          },
        },
        {
          path: '/userCard/:userInfo',
          name: 'UserCard',
          component: UserCard,
          meta: {
            title: '详细资料',
            requiresAuth: true,
          },
        },
        {
          path: '/addPeopleRequest',
          name: 'AddPeopleRequest',
          component: () => import('@/views/pages/AddPeopleRequest'),
          meta: {
            title: '好友请求',
            requiresAuth: true,
          },
        },
        {
          path: '/chat',
          name: 'Chat',
          component: () => import('@/views/Chat'),
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
          component: () => import('@/views/ChatSquare'),
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
          component: () => import('@/views/Register'),
        },
        {
          path: '/register/active',
          name: 'registerActive',
          component: registerActive,
          meta: {
            title: '激活',
          },
        },
        {
          path: '/test',
          name: 'test',
          component: () => import('@/views/Test'),
          meta: {
            title: '测试页面',
          },
        },
        {
          path: '/avatar',
          name: 'avatar',
          component: () => import('@/views/Avatar'),
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
      component: Login,
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
