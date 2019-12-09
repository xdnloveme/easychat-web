<template>
  <transition :duration="200" :name="animationName" @enter="handleEnter" @after-leave="handleAfterLeave">
    <div class="easychat-drawer-container" v-show="value">
      <EMask :visiable="value" @handleClose="$emit('input', false)"></EMask>
      <div
        :style="drawerStyle"
        :class="['easychat-drawer', isFullScreen ? 'easychat-drawer-fullscrenn' : '', computedSize]"
      >
        <div v-if="isShowHeader" slot="header" class="easychat-drawer-header">
          <slot name="header">
            <div class="header-default">
              <span @click="handleCancel" class="cancel">取消</span>
              <span @click="handleConfirm" class="confirm">确定</span>
            </div>
          </slot>
        </div>
        <div class="easychat-drawer-main" slot="default">
          <slot name="default"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import EMask from './EMask';

export default {
  name: 'Drawer',
  components: {
    EMask,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'bottom',
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    isShowHeader: {
      type: Boolean,
      default: true,
    },
    drawerStyle: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  computed: {
    animationName () {
      return `easychat-animate-${this.direction}`;
    },
    computedSize () {
      return `easychat-drawer-${this.direction}`;
    },
  },
  methods: {
    handleCancel () {
      this.$emit('input', false);
      this.$emit('cancel');
    },
    handleConfirm () {
      this.$emit('confirm');
    },
    handleAfterLeave () {
      this.$emit('hidden', this);
    },
    handleEnter () {
      this.$emit('shown', this);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.easychat-drawer-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1000;

  .easychat-drawer {
    position: absolute;
    min-height: 200px;
    background-color: #ffffff;
    z-index: 1002;
    width: 100%;
  }

  .easychat-drawer-bottom {
    min-height: 200px;
    bottom: 0;
    width: 100%;
  }

  .easychat-drawer-left {
    min-width: calc(50vw);
    left: 0;
    height: 100%;
  }

  .easychat-drawer-right {
    min-width: calc(50vw);
    right: 0;
    height: 100%;
  }

  .easychat-drawer-top {
    min-height: 200px;
    top: 0;
    width: 100%;
  }

  .easychat-drawer-fullscrenn {
    height: 100%;
    top: 0px;
    width: 100%;
    left: 0px;
  }

  .easychat-drawer-header {
    border-bottom: 1px solid $easychat-border-light;
    padding: 8px 16px;
    overflow: hidden;
    .cancel {
      color: $easychat-font;
      float: left;
    }

    .confirm {
      color: $easychat-primary-color;
      float: right;
    }
  }
}

.easychat-animate-bottom-enter-active {
  .easychat-drawer {
    animation: translateBottom 0.2s linear forwards;
  }
}

.easychat-animate-bottom-leave-to {
  .easychat-drawer {
    animation: translateBottom 0.2s linear reverse forwards;
  }
}

.easychat-animate-top-enter-active {
  .easychat-drawer {
    animation: translateTop 0.2s linear forwards;
  }
}

.easychat-animate-top-leave-to {
  .easychat-drawer {
    animation: translateTop 0.2s linear reverse forwards;
  }
}

.easychat-animate-left-enter-active {
  .easychat-drawer {
    animation: translateLeft 0.2s linear forwards;
  }
}

.easychat-animate-left-leave-to {
  .easychat-drawer {
    animation: translateLeft 0.2s linear reverse forwards;
  }
}

.easychat-animate-right-enter-active {
  .easychat-drawer {
    animation: translateRight 0.2s linear forwards;
  }
}

.easychat-animate-right-leave-to {
  .easychat-drawer {
    animation: translateRight 0.2s linear reverse forwards;
  }
}

@keyframes translateBottom {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes translateTop {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes translateLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}

@keyframes translateRight {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>
