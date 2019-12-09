<template>
  <div class="pull-refresh-container">
    <slot>
      {{ text }}
    </slot>
  </div>
</template>

<script>

export default {
  name: 'PullRefresh',
  props: {
    text: {
      type: String,
      default: '下拉加载',
    },
    height: {
      type: Number,
      default: 50,
    },
  },
}
</script>

<style scoped lang="scss">
.pull-refresh-container {
  width: 100%;
  text-align: center;
}
</style>

