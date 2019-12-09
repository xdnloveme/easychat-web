<template>
  <div class="easychat-empty-wrapper">
    <img :src="empty" /><br />
    <p class="tips">{{ tips }}</p>
    <p class="operate-tips">
      你可以尝试 <router-link :to="operateTo">{{ operateTips }}</router-link> {{ afterTips }}
    </p>
  </div>
</template>

<script>
import empty from '@/assets/icon/page/empty.svg';

export default {
  name: 'Empty',
  props: {
    tips: {
      type: String,
      default: '空白页提示操作',
    },
    operateTips: {
      type: String,
      default: '推荐操作',
    },
    operateTo: {
      type: String,
      default: '/',
    },
    afterTips: {
      type: String,
      default: '结果',
    },
  },
  data () {
    return {
      empty,
    };
  },
};
</script>

<style scoped lang="scss">
.easychat-empty-wrapper {
  padding-top: 120px;
  padding-left: 15%;
  padding-right: 15%;
  text-align: center;
  .tips {
    color: $easychat-font-darker;
    font-size: 1em;
  }

  .operate-tips {
    color: $easychat-font;
    font-size: 0.9em;
    a {
      color: $easychat-primary-color;
      text-decoration: underline;
    }
  }
}
</style>

