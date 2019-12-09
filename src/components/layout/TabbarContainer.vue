<template>
  <div class="easy-chat-tabbar-container">
    <keep-alive>
      <slot></slot>
      <!-- <component class="tabbar-container-component" :is="current"></component> -->
    </keep-alive>
  </div>
</template>

<script>


export default {
  name: 'TabbarContainer',
  props: ['current'],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.easy-chat-tabbar-container {
  height: 100%;
  overflow: auto;
  padding-bottom: 62px;
}

</style>
