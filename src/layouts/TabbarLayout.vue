<template>
  <div class="home">
    <Tabbar-Container>
      <router-view />
    </Tabbar-Container>
    <Tabbar>
      <Tabbar-Item
        :isSelect="isCurrent(tabbarItem)"
        @change="change"
        :key="'tabbar' + $key"
        v-for="(tabbarItem, $key) in localTabbar"
        :tabbar="tabbarItem"
      />
    </Tabbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Tabbar from '@/components/layout/Tabbar';
import TabbarContainer from '@/components/layout/TabbarContainer';
import TabbarItem from '@/components/layout/TabbarItem';
import routes from '@/router';

import comment from '@/assets/icon/tabbar/comment.svg';
import comment_select from '@/assets/icon/tabbar/comment_fill.svg';
import mine from '@/assets/icon/tabbar/mine.svg';
import mine_select from '@/assets/icon/tabbar/mine_fill.svg';
import contacts from '@/assets/icon/tabbar/barrage.svg';
import contacts_select from '@/assets/icon/tabbar/barrage_fill.svg';
import square from '@/assets/icon/tabbar/square.svg';
import square_fill from '@/assets/icon/tabbar/square_fill.svg';

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
    ...mapGetters({
      tabbarCount: 'badge/tabbarCount',
    }),
    localTabbar () {
      const matched = this.$route.matched;
      const { path } = matched[matched.length - 2];
      if (this.tabbar && this.tabbar[path]) {
        return this.tabbar[path].map((item, index) => {
          const key = `tabbar${index}`;
          return {
            ...item,
            key,
            badge: this.tabbarCount[key] || null,
          };
        });
      }
      return [];
    },
  },
  methods: {
    change (tabbar) {
      this.$router.replace(tabbar.router);
    },
    isCurrent (tabbar) {
      return tabbar.router === this.$route.path;
    },
  },
};
</script>


<style lang="scss" scoped>
</style>
