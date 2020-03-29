<template>
  <header :style="style" class="nav">
    <div @click="goPre" class="nav-left">
      <img v-show="config.isShowBackBtn" class="icon-img" :src="require('@/assets/icon/back.png')" />
    </div>
    <div class="nav-main">
      <span class="nav-m-title">{{ current }}</span>
    </div>
    <div @click="rightOptions && rightOptions.operate()" class="nav-right">
      <Badge v-if="rightOptions && rightOptions.icon" :count="rightOptions.badge">
        <Icon :type="rightOptions.icon" />
      </Badge>
      {{ rightOptions && (rightOptions.text || null) }}
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import Icon from '@/components/Icon';
import Vue from 'vue';

export default {
  name: 'Navigation',
  computed: {
    ...mapGetters('nav', ['current']),
    ...mapState('nav', ['rightOptions', 'style', 'config']),
  },
  components: {
    Icon,
  },
  created () {
    this.init();
  },
  watch: {
    $route (to) {
      const { meta } = to;
      this.$store.dispatch('nav/setNavInfo', meta);
    },
  },
  methods: {
    ...mapActions('nav', { initNav: 'init' }),
    init () {
      const { meta } = this.$route;
      this.initNav(meta);
    },
    goPre () {
      this.$store.commit('nav/SET_CONFIG', {
        isGobackOn: true,
      });
      this.$router.back();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.nav {
  height: $easychat-nav-height;
  background-color: $easychat-background-nav;
  background-image: linear-gradient(to right, #3f4246, $easychat-background-nav);
  color: #ffffff;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  z-index: 999;

  .nav-left {
    padding-left: 10px;
    text-align: left;
  }

  .nav-right {
    padding-right: 10px;
    text-align: right;
  }

  .nav-left,
  .nav-right {
    width: 25%;
    max-width: 25%;

    .icon-img {
      height: 32px;
      width: 32px;
      vertical-align: middle;
    }
  }

  .nav-main {
    flex: 1;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .nav-m-title {
      color: #ffffff;
      font-size: 1.22em;
      font-weight: 400;
    }
  }
}
</style>
