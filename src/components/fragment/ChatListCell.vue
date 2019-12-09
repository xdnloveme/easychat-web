<template>
  <a @click="goto" href="javascript:;" class="easychat-list-cell-c-warpper">
    <div class="easychat-list-cell-c">
      <div :class="['easychat-list-cell-c-main']">
        <slot name="main">
          <img v-if="options.leftIcon" class="easychat-list-left-img" :src="options.leftIcon"/>
          <div class="cell-c-m-body">
            <span class="cell-c-m-b-name">{{options.name}}</span>
          </div>
        </slot>
        <div :class="['cell-c-m-right']">
          <slot name="right" :right="right">
            <span v-if="options.desc && options.desc.length !== 0" class="cell-c-m-right-desc">{{options.desc}}</span>
            <img v-if="options.rightIcon" class="easychat-list-right-img" :src="rightIcon.url"/>
            <img v-if="!options.hideRightArrow" class="cell-arrow-right" :src="rightArrow"/>
          </slot>
        </div>
      </div>      
    </div>
  </a>
</template>

<script>
import rightArrow from '@/assets/icon/right.png';

export default {
  name: 'ChatListCell',
  props: {
    options: {
      type: Object,
      required: false,
      default () {
        return {
          // 左边图标
          leftIcon: null,
          // 名称
          name: null,
          // 右边描述
          desc: null,
          // 是否隐藏右箭头
          hideRightArrow: false,
          // 右边图标
          rightIcon: null,
        };
      },
    },
    right: {
      required: false,
    },
  },
  computed: {
    rightIcon () {
      if (this.options.rightIcon && Object.is(this.options.rightIcon)) {
        return {
          style: this.options.rightIcon.style,
          url: this.options.rightIcon.url,
        };
      }
      return {
        url: this.options.rightIcon,
      };
    },
  },
  data () {
    return {
      rightArrow,
    }
  },
  methods: {
    goto () {
      if (this.$props.options.to) {
        this.$router.push({
          path: this.$props.options.to,
        })
      }
      this.$emit('click', this.options);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.easychat-list-cell-c {
  padding-left: 16px;
}

.easychat-list-right-img {
  height: 64px;
  width: 64px;
  margin-right: 10px;
}

.easychat-list-cell-c-main {
  display: flex;
  border-bottom: 1px solid #eee;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 10px;
  justify-content: space-between;
  align-items: center;
}

.easychat-list-cell-c-warpper:last-child .easychat-list-cell-c-main {
  border-bottom: none;
}

.cell-arrow-right {
  height: 18px;
  width: 18px;
}

.easychat-list-cell-c-warpper {
  display: block;
  text-decoration: none;
  color: initial;
  background-color: #ffffff;
}

.easychat-list-cell-c-warpper:active {
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  background-color: #eeeeee;
}

.cell-c-m-body {
  flex: 1;
}

.cell-c-m-right {
  display: flex;
  align-items: center;
}

.cell-c-m-b-name {
  font-weight: 400;
}

.cell-c-m-right-desc {
  font-size: .88em;
  color: rgba(0, 0, 0, 0.5);
  margin-right: 6px;
}

.easychat-list-left-img {
  margin-right: 16px;
  height: 24px;
}
</style>
