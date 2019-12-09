<template>
  <transition
    @before-enter="enter"
    @after-leave="leave"
    :name="'easy-chat-route-' + (direction === 'forward' ? 'in' : 'out')"
  >
    <slot></slot>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { exceAfter } from '@/utils/next-transit-after';

export default {
  name: 'RouteTransition',
  computed: {
    ...mapState({
      navStyle: state => state.nav.style,
      direction: state => state.direction,
      isRenderTabbar: state => state.isRenderTabbar,
      tabbar: state => state.tabbar,
    }),
  },
  methods: {
    ...mapMutations({
      changeAnimateState: 'ANIMATION_STATE',
    }),
    enter () {
      this.changeAnimateState(true);
    },
    leave: function (el, done) {
      exceAfter();
      this.changeAnimateState(false);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
