<template>
  <div class="easy-chat-wrapper">
    <Navigation></Navigation>
    <RouteTransition>
      <keep-alive :include="keepAliveRoutes">
        <router-view
          :style="viewStyle"
          :class="['easy-chat-router-view', 'show-nav', isRenderTabbar ? 'view-space' : '']"
        />
      </keep-alive>
    </RouteTransition>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import Navigation from '@/components/layout/Navigation';


export default {
  name: 'BasicLayout',
  components: {
    Navigation,
  },
  data () {
    return {
      transitionName: '',
    };
  },
  computed: {
    ...mapState({
      keepAliveRoutes: state => state.keepAliveRoutes,
      navStyle: state => state.nav.style,
      isShowNav: state => state.nav.config.isShow,
      direction: state => state.direction,
      isRenderTabbar: state => state.isRenderTabbar,
    }),
    viewStyle () {
      // 匹配nav导航栏的背景色，如果小于1就把padding去掉。
      const backgroundHex = this.navStyle.backgroundColor.match(/rgba\(([^\(]+?)\)/)[1];
      const opacityData = backgroundHex ? backgroundHex.split(',')[backgroundHex.split(',').length - 1] : 1;
      if (opacityData < 1) {
        return {
          paddingTop: '0px',
        };
      }
      return {};
    },
  },
  created () {
    this.initGlobalVariable();
  },
  methods: {
    ...mapMutations({
      changeAnimateState: 'ANIMATION_STATE',
    }),
    initGlobalVariable () {
      const global = Vue.prototype.$global;
      Vue.prototype.$global = {
        ...global,
        SCREEN_WIDTH: window.screen.width,
        SCREEN_HEIGHT: window.screen.height,
      };

      window.addEventListener('resize', this.handleResize);
      // remember remove
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', this.handleResize);
      });
    },
    handleResize () {
      Vue.prototype.$global = {
        ...global,
        SCREEN_WIDTH: window.screen.width,
        SCREEN_HEIGHT: window.screen.height,
      };
    },
  },
};
</script>


<style>
body,
html {
  margin: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
}

*,
div,
input {
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  font-size: 16px;
  height: 100%;
}

.easy-chat-wrapper {
  position: relative;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;  
}

.easy-chat-router-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  width: 100%;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.easy-chat-route-out-enter-active,
.easy-chat-route-out-leave-active,
.easy-chat-route-in-enter-active,
.easy-chat-route-in-leave-active {
  will-change: transform;
  transition-duration: 250ms;
  transition-property: transform, opacity;
  width: 100%;
  top: 0px;
  bottom: 0;
  position: absolute;
  overflow: hidden;
  backface-visibility: hidden;
  perspective: 1000;
}

.easy-chat-route-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.easy-chat-route-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.easy-chat-route-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.easy-chat-route-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.view-space {
  margin-bottom: 62px;
}

.hide-nav {
  padding-top: unset;
}
.show-nav {
  padding-top: 60px;
}
</style>
