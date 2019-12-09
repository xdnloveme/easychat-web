<template>
  <div class="badge-wrapper">
    <slot></slot>
    <sup v-if="count" :class="['badge-count', count > 10 ? 'badge-multiple-count' : '']">{{
      format(count)
    }}</sup>
  </div>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    count: {
      type: [Number, String],
      default: null,
    },
  },
  methods: {
    format (count) {
      if (count > 99) {
        return '99+';
      } else if (count < 0) {
        return 0;
      } else {
        return count;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.badge-wrapper {
  position: relative;
  display: inline-block;
  line-height: 1;
  margin: 0px;
  padding: 0px;

  .badge-count {
    position: absolute;
    right: -8px;
    top: -8px;
    z-index: 10;
    background-color: #f5222d;
    color: #ffffff;
    // width: 20px;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 8px;
    font-size: 12px;
  }

  .badge-multiple-count {
    padding-left: 6px;
    padding-right: 6px;
  }
}
</style>
