<template>
  <transition name="fade" mode="out-in">
    <div v-show="isShow" class="toast-mask">
      <div
        @click="hideDestroy"
        :class="['toast', showIcon ? '' : 'toast-no-icon', !message || message.length === 0 ? 'toast-no-msg' : '']"
      >
        <template v-if="showIcon">
          <img :class="['toast-img', styles.cssstyle ? cssAnalyze(styles) : '']" :src="iconSource" />
        </template>
        <p v-if="message && message.length > 0" class="toast-msg">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  data () {
    // 数据放在组件内
    return {
      showIcon: false,
      message: '',
      isShow: false,
      duration: 2000,
      isAlive: false,
      iconSource: null,
      styles: {},
    };
  },
  created () {},
  beforeDestroy () {
    if (this.timer) {
      this.clearTimer();
    }
  },
  methods: {
    show () {
      if (this.isShow) return;
      this.isShow = true;
    },
    toast () {
      if (this.isShow) return;
      this.startTimer();
      this.isShow = true;
    },
    hide () {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.isShow = false;
    },
    hideDestroy () {
      if (this.isShow) {
        this.hide();
        !this.isAlive && this.destroy();
      }
    },
    startTimer () {
      if (this.duration < 0) return;
      this.timer = setTimeout(() => {
        this.hideDestroy();
      }, this.duration);
    },
    clearTimer () {
      if (!this.timer) return;
      clearTimeout(this.timer);
    },
    cssAnalyze (styles) {
      let str = '';
      for (let i in styles.cssstyle) {
        str += styles.cssstyle[i] + ' ';
      }
      return str;
    },
    destroy () {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toast-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: 1001;
}

.toast {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 12px;
  background-color: rgba(17, 17, 17, 0.7);
  color: #ffffff;
  width: 6.8em;
  height: 6.8em;
  margin: auto;
  text-align: center;
}

.toast-msg {
  margin: 0;
  font-size: 0.875em;
}

.toast-img {
  margin-top: 1.4em;
  width: auto;
  height: 36px;
  margin-bottom: 0.6em;
}

.toast-no-msg .toast-img {
  margin-top: 0.6em;
  vertical-align: middle;
}

.toast-no-icon,
.toast-no-msg {
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  bottom: auto;
  right: auto;
  border-radius: 4px;
  padding: 8px 16px;
  transform: translate(-50%, -50%);
}

.fade-enter-active {
  animation: fade-in 0.33s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.66, 0.66);
  }

  50% {
    opacity: 0.88;
  }

  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}

/* .toast-no-icon .toast-msg{
  line-height: 3.4em;
} */
</style>
