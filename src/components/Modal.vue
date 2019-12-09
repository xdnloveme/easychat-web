<template>
  <transition
    :duration="300"
    name="easychat-scale"
    @enter="handleEnter"
    @after-leave="handleAfterLeave"
  >
    <div v-show="value" class="easychat-modal-container">
      <EMask :visiable="value" @handleClose="$emit('input', false)"></EMask>
      <div
        class="easychat-modal"
        :style="localOptions.style"
        :class="[
          'easychat-modal',
          localOptions.fullScreen ? 'easychat-modal-full' : 'easychat-modal-normal',
        ]"
      >
        <div v-if="$slots.customize" slot="customize">
          <slot name="customize"></slot>
        </div>
        <div v-if="$slots.header" slot="header" class="easychat-modal-header">
          <slot name="header"></slot>
        </div>
        <div v-if="$slots.body" slot="body" class="easychat-modal-body">
          <slot name="body"></slot>
        </div>
        <div v-if="$slots.footer" slot="footer" class="easychat-modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import EMask from './EMask';

const DEAFULT_OPTIONS = {
  // 是否全屏(全屏时候默认不渲染mask遮罩)
  fullScreen: false,
  // modal主体的样式
  style: {},
};

export default {
  name: 'Modal',
  components: {
    EMask,
  },
  props: {
    // v-model 绑定
    value: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default () {
        return DEAFULT_OPTIONS;
      },
    },
  },
  computed: {
    localOptions () {
      return Object.assign({}, DEAFULT_OPTIONS, this.options);
    },
  },
  methods: {
    handleAfterLeave () {
      this.$emit('handleAfterHidden', this);
    },
    handleEnter () {
      this.$emit('handleShow', this);
    },
  },
};
</script>

<style lang="scss">
.easychat-modal-container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .easychat-modal-normal {
    top: 200px;
    border-radius: 4px;
    width: 300px;
    margin: auto;
    text-align: center;
  }

  .easychat-modal-full {
    width: 100%;
    height: 100%;
  }

  .easychat-modal {
    background-color: #ffffff;
    position: relative;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .easychat-modal-header {
      padding: 1.3em 1.6em 0.5em;
    }

    .easychat-modal-body {
      padding: 0 1.6em 0.8em;
      min-height: 40px;
      font-size: 15px;
      line-height: 1.3;
      word-wrap: break-word;
      word-break: break-all;
      color: #999;
    }

    .easychat-modal-footer {
      position: relative;
      line-height: 48px;
      font-size: 18px;
      border-top: 1px solid #eee;
    }
  }
}
.easychat-scale-enter-active {
  .easychat-modal {
    animation: scaleModal 0.3s;
    animation-fill-mode: forwards;
  }
}

.easychat-scale-leave-to {
  .easychat-modal {
    animation: scaleModal 0.3s reverse;
    animation-fill-mode: forwards;
  }
}

@keyframes scaleModal {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes translateVertical {
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
