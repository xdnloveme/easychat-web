<template>
  <div class="divider-warpper">
    <span class="divider-line"></span>
    <slot>
      <span class="divider-dot"></span>
    </slot>
    <span class="divider-line"></span>
  </div>
</template>

<script>
export default {
  name: 'Divider',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.divider-warpper {
  margin-top: 24px;
  width: 250px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;

  .divider-dot {
    margin: 0 10px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: $easychat-border;
  }

  .divider-line {
    flex: 1;
    display: inline-block;
    height: 1px;
    background-color: $easychat-border;
  }
}
</style>
