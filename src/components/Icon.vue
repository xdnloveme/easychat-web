<template>
  <span class="icon-img-wrapper">
    <img :style="iconStyle" class="icon-img" :class="[computedSize]" :src="iconSrc" />
  </span>
</template>

<script>
import addpeople from '@/assets/icon/addpeople_fill.svg';
import more from '@/assets/icon/more.svg';
import warn from '@/assets/icon/warn.svg';
import question from '@/assets/icon/question.svg';
import error from '@/assets/icon/error.svg';

const ICON_MAP = {
  'addpeople': addpeople,
  'more': more,
  'warn': warn,
  'question': question,
  'error': error,
}

export default {
  name: 'Icon',
  props: {
    type: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'normal',
    },
    height: {
      type: [Number, String],
    },
    width: {
      type: [Number, String],
    },
  },
  computed: {
    iconStyle () {
      if (!this.height && !this.width) {
        return {};
      }
      return {
        height: typeof this.height === 'number' ? `${this.height}px` : this.height,
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
      };
    },
    iconSrc () {
      return ICON_MAP[this.type] || '';
    },
    computedSize () {
      switch (this.size) {
        case 'normal':
          return '';
        case 'large':
          return 'icon-large-size';
        case 'small':
          return 'icon-small-size';
        default:
          return '';
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.icon-img-wrapper {
  line-height: 1;
  vertical-align: text-top;
  .icon-img {
    height: 32px;
    width: 32px;
    vertical-align: middle;
  }

  .icon-small-size {
    height: 20px;
    width: 20px;
  }

  .icon-large-size {
    height: 60px;
    width: 60px;
  }
}
</style>
