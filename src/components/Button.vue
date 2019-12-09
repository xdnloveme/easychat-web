<template>
  <a @click="$emit('click')" :class="['easychat-btn', type, size, borderStyle]" href="javascript:;">
    <span :style="textStyle">
      <slot></slot>
    </span>
  </a>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: 'normal',
    },
    hasBorder: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: '',
    },
  },
  computed: {
    borderStyle () {
      if (this.hasBorder) {
        return 'easychat-btn-border';
      }
      return '';
    },
    textStyle () {
      return {
        color: this.textColor,
      }
    },
  },
};
</script>

<style scoped lang="scss">
.easychat-btn {
  // background-color: $easychat-primary-color;
  color: #ffffff;
  text-align: center;
  border-radius: 4px;
  display: block;
  line-height: 42px;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.normal {
  line-height: 34px;
}

.large {
  line-height: 42px;
}

.small {
  line-height: 26px;
}

.primary {
  background-color: $easychat-primary-color;
}

.danger {
  background-color: $easychat-danger-color;
  color: #ffffff;
}

.default {
  color: $easychat-font-dark;
}

.easychat-btn-border {
  border: 1px solid $easychat-border-dark;
}
</style>
