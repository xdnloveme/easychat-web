<template>
  <div id="app">
    <div class="easy-chat-main_view">
      <RouteTransition>
        <router-view />
      </RouteTransition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'App',
  data () {
    return {};
  },
  created () {
    this.initKeepAliveRoutes();
  },
  methods: {
    ...mapMutations({
      initKeepAliveRoutes: 'DYNAMIC_KEEPALIVE_ROUTES',
    }),
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
  -webkit-overflow-scrolling: touch;
}

*,
div,
input {
  box-sizing: border-box;
}

input {
  -webkit-appearance: none;
  border-radius: 0;
}

.easy-chat-main_view {
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
/* 
.easy-chat-main_view::-webkit-scrollbar {
  display: none;
} */
</style>
