<template>
  <div class="easy-chat-tabbar_wrapper">
    <slot></slot>
  </div>
</template>

<script>


export default {
  name: 'Tabbar',
  props: {
    tabbarList: {
      type: Array,
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.easy-chat-tabbar_wrapper {
  position: absolute;
  bottom: 0;
  height: 60px;
  width: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 999;
  box-shadow:0px 5px 2px 5px rgba(200,200,200,0.75);
}
</style>
