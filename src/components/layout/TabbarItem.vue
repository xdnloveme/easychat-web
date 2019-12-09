<template>
  <div
    @click="changeTab(tabbar)"
    :class="['easy-chat-tabbar-w-item', isSelect ? 'easy-chat-tabbar-w-i-selected' : '']"
  >
    <Badge :count="tabbar.badge">
      <img v-if="tabbar.icon" class="tabbar-item-icon" :src="isSelect ? tabbar.icon_select : tabbar.icon"
    /></Badge>
    <div class="tabbar-item-name">
      {{ tabbar.name }}
    </div>
  </div>
</template>

<script>
import Badge from '@/components/Badge';

export default {
  name: 'TabbarItem',
  components: {
    Badge,
  },
  props: {
    tabbar: Object,
    isSelect: Boolean,
  },
  methods: {
    changeTab (tabbar) {
      this.$emit('change', tabbar);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.easy-chat-tabbar-w-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex: 1;
  padding-top: 2px;

  .tabbar-item-icon {
    width: 30px;
    height: 30px;
    // margin-bottom: 2px;
    vertical-align: middle;
  }

  .tabbar-item-name {
    color: $easychat-font-light;
    font-size: 14px;
  }
}

.easy-chat-tabbar-w-i-selected {
  .tabbar-item-name {
    color: $easychat-primary-color;
  }
}
</style>
