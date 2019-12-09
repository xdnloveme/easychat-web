<template>
  <div class="home">
    <Tabbar-Container :current="currentComponent" />
    <Tabbar>
      <Tabbar-Item
        :isSelect="currentComponent === tabbarItem.component"
        @change="change(tabbarItem)"
        :key="'tabbar' + $key"
        v-for="(tabbarItem, $key) in tabbarInfo"
        :tabbar="tabbarItem"
      />
    </Tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import comment from '@/assets/icon/tabbar/comment.svg';
import comment_select from '@/assets/icon/tabbar/comment_fill.svg';
import mine from '@/assets/icon/tabbar/mine.svg';
import mine_select from '@/assets/icon/tabbar/mine_fill.svg';
import contacts from '@/assets/icon/tabbar/barrage.svg';
import contacts_select from '@/assets/icon/tabbar/barrage_fill.svg';
import square from '@/assets/icon/tabbar/square.svg';
import square_fill from '@/assets/icon/tabbar/square_fill.svg';

import Tabbar from '@/components/layout/Tabbar';
import TabbarContainer from '@/components/layout/TabbarContainer';
import TabbarItem from '@/components/layout/TabbarItem';
import EasyChat from './cores/easychat/EasyChat';
import Mine from './cores/mine/Mine';
import Contacts from './cores/contacts/Contacts';
import Square from './cores/square/Square';

const TABBAR_INFO = [
  {
    id: 'easychat',
    name: '简聊',
    router: '/home/easychat',
    icon: comment,
    icon_select: comment_select,
    component: EasyChat,
  },
  {
    id: 'contacts',
    name: '通讯录',
    router: '/home/contacts',
    icon: contacts,
    icon_select: contacts_select,
    component: Contacts,
  },
  {
    id: 'square',
    name: '广场',
    router: '/home/square',
    icon: square,
    icon_select: square_fill,
    component: Square,
  },
  {
    id: 'mine',
    name: '我的',
    router: '/home/mine',
    icon: mine,
    icon_select: mine_select,
    component: Mine,
  },
];

export default {
  name: 'home',
  components: {
    Tabbar,
    TabbarContainer,
    TabbarItem,
  },
  computed: {
    ...mapState({
      tabbar: state => state.tabbar,
    }),
  },
  data () {
    return {
      currentComponent: null,
      tabbarInfo: TABBAR_INFO,
    };
  },
  beforeRouteEnter (to, from, next) {
    if (!to.params.tabbarId) {
      next({
        path: '/home/easychat',
      });
    } else {
      next();
    }
  },
  // 由于tabbar模式是keep-alive的，所以需要调用activated生命周期
  activated () {
    const tabbarId = this.$route.params.tabbarId || this.tabbarInfo[0].id;
    this.setTabbar(tabbarId);
    this.unwatch = this.$watch('$route', value => {
      const { params } = value;
      const { tabbarId } = params;
      if (tabbarId) {
        this.setTabbar(tabbarId);
      }
    });
  },
  deactivated () {
    // 记得移除监听
    if (this.unwatch) {
      this.unwatch();
    }
  },
  methods: {
    change (tabbar) {
      if (tabbar.router === this.$route.path || tabbar.component === this.currentComponent) return;
      this.$router.replace(tabbar.router);
    },
    setTabbar (tabbarId) {
      const currentTabbar = this.tabbarInfo.find(item => item.id === tabbarId);
      this.currentComponent = currentTabbar.component;
    },
  },
};
</script>

<style scoped>
</style>

