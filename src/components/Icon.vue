<template>
  <span class="icon-img-wrapper">
    <template v-if="isSp">
      <i class="icon-img" :class="computedSize"></i>
    </template>
    <template v-else>
      <img :style="iconStyle" class="icon-img" :class="[computedSize]" :src="iconSrc" />
    </template>
  </span>
</template>

<script>
import addpeople from '@/assets/icon/addpeople_fill.svg';
import more from '@/assets/icon/more.svg';
import warn from '@/assets/icon/warn.svg';
import question from '@/assets/icon/question.svg';
import error from '@/assets/icon/error.svg';
import emoji from '@/assets/icon/emoji.svg';
import add from '@/assets/icon/add.svg';
import warning from '@/assets/icon/warning.svg';

const ICON_MAP = {
  addpeople: addpeople,
  more: more,
  warn: warn,
  question: question,
  error: error,
  add,
  emoji,
  warning,
};

const ICON_SP_MAP = {
  'loading-spining': 'loading-spining',
};

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
      if (ICON_MAP[this.type]) {
        return ICON_MAP[this.type];
      }

      if (ICON_SP_MAP[this.type]) {
        return ICON_SP_MAP[this.type];
      }

      return '';
    },
    isSp () {
      if (ICON_SP_MAP[this.type]) {
        return true;
      }
      return false;
    },
    computedSize () {
      let spClass = '';
      if (this.isSp) {
        spClass = ICON_SP_MAP[this.type];
      }
      const range = ['large', 'mini', 'small'];
      if (this.size === 'normal' || !this.size || !range.some(name => name === this.size)) {
        return spClass;
      }
      return `icon-${this.size}-size ${spClass}`;
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
    display: inline-block;
  }

  .icon-small-size {
    height: 20px;
    width: 20px;
  }

  .icon-large-size {
    height: 60px;
    width: 60px;
  }

  .icon-mini-size {
    width: 16px;
    height: 16px;
  }
}

.loading-spining {
  -webkit-animation: loadingSpining 1s steps(12, end) infinite;
  animation: loadingSpining 1s steps(12, end) infinite;
  background: transparent
    url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=')
    no-repeat;
  background-size: 100%;
}

@keyframes loadingSpining {
  from {
    transform: rotate(-360deg);
  }
  to {
    transform: rotate(0);
  }
}
</style>
